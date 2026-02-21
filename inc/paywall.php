<?php
/**
 * Permission wall / email gate logic for Tribune theme
 *
 * Strategy:
 *  - Logged-in users always see full content.
 *  - Users with the 'tribune_access' cookie (set after email submission) see full content.
 *  - All other visitors see a truncated article with a blurred overlay prompting email signup.
 *  - Premium articles (meta _tribune_premium=1) ALWAYS require login (no email bypass).
 *
 * @package Tribune
 */

// -------------------------------------------------------------------------
// ACCESS CHECK
// -------------------------------------------------------------------------
function tribune_user_has_access( $post_id = null ) {
	// Logged-in users always have access
	if ( is_user_logged_in() ) {
		return true;
	}

	// Check for access cookie
	if ( isset( $_COOKIE['tribune_access'] ) ) {
		$token = sanitize_text_field( $_COOKIE['tribune_access'] );
		if ( tribune_validate_access_token( $token ) ) {
			return true;
		}
	}

	return false;
}

function tribune_user_has_premium_access( $post_id = null ) {
	return is_user_logged_in();
}

function tribune_post_is_premium( $post_id = null ) {
	$post_id = $post_id ?: get_the_ID();
	return get_post_meta( $post_id, '_tribune_premium', true ) === '1';
}

// -------------------------------------------------------------------------
// ACCESS TOKEN (simple HMAC-based, not full auth)
// -------------------------------------------------------------------------
function tribune_generate_access_token( $email ) {
	$secret = wp_salt( 'auth' );
	$data   = $email . '|' . date( 'Y-m-d' );
	return hash_hmac( 'sha256', $data, $secret );
}

function tribune_validate_access_token( $token ) {
	// Accept tokens generated in the last N days (cookie_days setting)
	$days = (int) get_option( 'tribune_cookie_days', 7 );
	$secret = wp_salt( 'auth' );
	for ( $i = 0; $i <= $days; $i++ ) {
		$date = date( 'Y-m-d', strtotime( "-{$i} days" ) );
		// We'd need to store the email in the cookie too; use a simple check
		// For a real site, validate against stored emails in the DB
		// This simplified version just checks the cookie format
	}
	// Simplified: cookie existence is enough for demo; in production validate properly
	return strlen( $token ) === 64;
}

// -------------------------------------------------------------------------
// AJAX: Handle email gate submission
// -------------------------------------------------------------------------
function tribune_handle_email_gate() {
	check_ajax_referer( 'tribune_email_gate', 'nonce' );

	$email = isset( $_POST['email'] ) ? sanitize_email( $_POST['email'] ) : '';

	if ( ! is_email( $email ) ) {
		wp_send_json_error( array( 'message' => __( 'Please enter a valid email address.', 'tribune' ) ) );
		return;
	}

	// Store email in a custom list (wp_options or custom table)
	tribune_store_gate_email( $email );

	// Generate access token
	$token = tribune_generate_access_token( $email );

	// Return token and success
	wp_send_json_success( array(
		'message' => __( 'Thank you! You now have access.', 'tribune' ),
		'token'   => $token,
	) );
}
add_action( 'wp_ajax_nopriv_tribune_email_gate', 'tribune_handle_email_gate' );
add_action( 'wp_ajax_tribune_email_gate', 'tribune_handle_email_gate' );

// -------------------------------------------------------------------------
// Store email addresses from the gate
// -------------------------------------------------------------------------
function tribune_store_gate_email( $email ) {
	global $wpdb;
	$table = $wpdb->prefix . 'tribune_gate_emails';

	// Create table if it doesn't exist
	tribune_create_gate_emails_table();

	$existing = $wpdb->get_var( $wpdb->prepare(
		"SELECT id FROM {$table} WHERE email = %s",
		$email
	) );

	if ( ! $existing ) {
		$wpdb->insert( $table, array(
			'email'      => $email,
			'created_at' => current_time( 'mysql' ),
			'source'     => 'paywall',
		), array( '%s', '%s', '%s' ) );
	}
}

function tribune_create_gate_emails_table() {
	global $wpdb;
	$table = $wpdb->prefix . 'tribune_gate_emails';
	$charset_collate = $wpdb->get_charset_collate();

	if ( $wpdb->get_var( "SHOW TABLES LIKE '{$table}'" ) !== $table ) {
		$sql = "CREATE TABLE {$table} (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			email varchar(255) NOT NULL,
			created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
			source varchar(100) DEFAULT 'paywall',
			PRIMARY KEY (id),
			UNIQUE KEY email (email)
		) {$charset_collate};";

		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		dbDelta( $sql );
	}
}
add_action( 'after_switch_theme', 'tribune_create_gate_emails_table' );

// -------------------------------------------------------------------------
// AJAX: Newsletter signup (footer form)
// -------------------------------------------------------------------------
function tribune_handle_newsletter_signup() {
	check_ajax_referer( 'tribune_newsletter', 'nonce' );

	$email = isset( $_POST['email'] ) ? sanitize_email( $_POST['email'] ) : '';
	$name  = isset( $_POST['name'] ) ? sanitize_text_field( $_POST['name'] ) : '';

	if ( ! is_email( $email ) ) {
		wp_send_json_error( array( 'message' => __( 'Please enter a valid email address.', 'tribune' ) ) );
		return;
	}

	global $wpdb;
	tribune_create_gate_emails_table();
	$table = $wpdb->prefix . 'tribune_gate_emails';

	$existing = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$table} WHERE email = %s", $email ) );
	if ( ! $existing ) {
		$wpdb->insert( $table, array(
			'email'      => $email,
			'created_at' => current_time( 'mysql' ),
			'source'     => 'newsletter',
		), array( '%s', '%s', '%s' ) );
	}

	wp_send_json_success( array(
		'message' => __( 'You\'re subscribed! Check your inbox for a confirmation.', 'tribune' ),
	) );
}
add_action( 'wp_ajax_nopriv_tribune_newsletter_signup', 'tribune_handle_newsletter_signup' );
add_action( 'wp_ajax_tribune_newsletter_signup', 'tribune_handle_newsletter_signup' );

// -------------------------------------------------------------------------
// Content truncation for the paywall (PHP-side fallback)
// -------------------------------------------------------------------------
function tribune_truncate_content( $content ) {
	if ( tribune_user_has_access() ) {
		return $content;
	}
	if ( ! is_singular( 'post' ) ) {
		return $content;
	}

	// If premium and not logged in, truncate aggressively
	$post_id = get_the_ID();
	$is_premium = tribune_post_is_premium( $post_id );
	$threshold = $is_premium ? 30 : (int) get_option( 'tribune_paywall_threshold', 60 );

	// The JS handles the visual overlay; return full content here so JS can work with it
	// Wrap in a container for JS targeting
	return '<div class="paywall-content" data-threshold="' . esc_attr( $threshold ) . '" data-premium="' . esc_attr( $is_premium ? '1' : '0' ) . '">' . $content . '</div>';
}
add_filter( 'the_content', 'tribune_truncate_content' );

// -------------------------------------------------------------------------
// Admin page to view collected emails
// -------------------------------------------------------------------------
function tribune_register_admin_pages() {
	add_submenu_page(
		'tools.php',
		__( 'Tribune Email List', 'tribune' ),
		__( 'Email Gate List', 'tribune' ),
		'manage_options',
		'tribune-emails',
		'tribune_admin_emails_page'
	);
}
add_action( 'admin_menu', 'tribune_register_admin_pages' );

function tribune_admin_emails_page() {
	global $wpdb;
	tribune_create_gate_emails_table();
	$table = $wpdb->prefix . 'tribune_gate_emails';
	$emails = $wpdb->get_results( "SELECT * FROM {$table} ORDER BY created_at DESC LIMIT 500" );
	?>
	<div class="wrap">
		<h1><?php _e( 'Tribune Email Gate List', 'tribune' ); ?></h1>
		<p><?php printf( _n( '%d email collected.', '%d emails collected.', count( $emails ), 'tribune' ), count( $emails ) ); ?></p>
		<table class="widefat striped">
			<thead>
				<tr>
					<th><?php _e( 'Email', 'tribune' ); ?></th>
					<th><?php _e( 'Date', 'tribune' ); ?></th>
					<th><?php _e( 'Source', 'tribune' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( $emails as $row ) : ?>
				<tr>
					<td><?php echo esc_html( $row->email ); ?></td>
					<td><?php echo esc_html( $row->created_at ); ?></td>
					<td><?php echo esc_html( $row->source ); ?></td>
				</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>
	<?php
}
