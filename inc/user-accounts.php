<?php
/**
 * User account functionality for Tribune theme
 *
 * - Custom login/register page templates via shortcodes
 * - Front-end login and registration forms
 * - Profile page
 * - Redirect wp-login.php to custom login page (optional)
 *
 * @package Tribune
 */

// -------------------------------------------------------------------------
// SHORTCODES
// -------------------------------------------------------------------------

// [tribune_login_form]
function tribune_login_form_shortcode( $atts ) {
	$atts = shortcode_atts( array(
		'redirect' => '',
	), $atts );

	if ( is_user_logged_in() ) {
		ob_start();
		$user = wp_get_current_user();
		?>
		<div class="account-box">
			<p><?php printf( __( 'Welcome back, <strong>%s</strong>.', 'tribune' ), esc_html( $user->display_name ) ); ?></p>
			<p>
				<a href="<?php echo esc_url( tribune_account_url() ); ?>" class="btn btn--outline"><?php _e( 'My Account', 'tribune' ); ?></a>
				&nbsp;
				<a href="<?php echo esc_url( wp_logout_url( home_url() ) ); ?>" class="btn btn--ghost"><?php _e( 'Sign Out', 'tribune' ); ?></a>
			</p>
		</div>
		<?php
		return ob_get_clean();
	}

	ob_start();
	?>
	<div class="auth-form">
		<h2 class="auth-form__title"><?php _e( 'Sign In', 'tribune' ); ?></h2>
		<?php
		// Show errors
		if ( isset( $_GET['login'] ) && $_GET['login'] === 'failed' ) {
			echo '<div class="auth-form__error">' . __( 'Invalid email or password. Please try again.', 'tribune' ) . '</div>';
		}
		if ( isset( $_GET['registered'] ) && $_GET['registered'] === '1' ) {
			echo '<div class="auth-form__success">' . __( 'Account created! Please sign in.', 'tribune' ) . '</div>';
		}
		?>
		<form method="post" action="<?php echo esc_url( site_url( 'wp-login.php', 'login_post' ) ); ?>" class="auth-form__form">
			<div class="form-group">
				<label for="user_login"><?php _e( 'Email or Username', 'tribune' ); ?></label>
				<input type="text" name="log" id="user_login" class="form-control" required autocomplete="username">
			</div>
			<div class="form-group">
				<label for="user_pass"><?php _e( 'Password', 'tribune' ); ?></label>
				<input type="password" name="pwd" id="user_pass" class="form-control" required autocomplete="current-password">
			</div>
			<div class="form-group form-group--inline">
				<label class="checkbox-label">
					<input type="checkbox" name="rememberme" value="forever">
					<?php _e( 'Remember me', 'tribune' ); ?>
				</label>
				<a href="<?php echo esc_url( wp_lostpassword_url() ); ?>" class="auth-form__link"><?php _e( 'Forgot password?', 'tribune' ); ?></a>
			</div>
			<input type="hidden" name="redirect_to" value="<?php echo esc_url( $atts['redirect'] ?: home_url() ); ?>">
			<?php wp_nonce_field( 'tribune-login', 'tribune_login_nonce' ); ?>
			<button type="submit" name="wp-submit" class="btn btn--primary btn--full"><?php _e( 'Sign In', 'tribune' ); ?></button>
		</form>
		<p class="auth-form__switch">
			<?php _e( "Don't have an account?", 'tribune' ); ?>
			<a href="<?php echo esc_url( tribune_register_url() ); ?>"><?php _e( 'Create one', 'tribune' ); ?></a>
		</p>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'tribune_login_form', 'tribune_login_form_shortcode' );

// [tribune_register_form]
function tribune_register_form_shortcode( $atts ) {
	if ( is_user_logged_in() ) {
		return '<p>' . __( 'You are already signed in.', 'tribune' ) . '</p>';
	}

	if ( ! get_option( 'users_can_register' ) ) {
		return '<p>' . __( 'Registration is currently disabled.', 'tribune' ) . '</p>';
	}

	// Handle form submission
	$errors = array();
	$success = false;

	if ( isset( $_POST['tribune_register_submit'] ) &&
		wp_verify_nonce( $_POST['tribune_register_nonce'], 'tribune-register' ) ) {

		$first_name = sanitize_text_field( $_POST['first_name'] ?? '' );
		$last_name  = sanitize_text_field( $_POST['last_name'] ?? '' );
		$email      = sanitize_email( $_POST['email'] ?? '' );
		$password   = $_POST['password'] ?? '';
		$password2  = $_POST['password2'] ?? '';
		$username   = sanitize_user( $_POST['username'] ?? '' );

		if ( empty( $first_name ) ) $errors[] = __( 'First name is required.', 'tribune' );
		if ( empty( $email ) || ! is_email( $email ) ) $errors[] = __( 'A valid email address is required.', 'tribune' );
		if ( empty( $username ) ) $username = sanitize_user( explode( '@', $email )[0] );
		if ( empty( $password ) || strlen( $password ) < 8 ) $errors[] = __( 'Password must be at least 8 characters.', 'tribune' );
		if ( $password !== $password2 ) $errors[] = __( 'Passwords do not match.', 'tribune' );
		if ( email_exists( $email ) ) $errors[] = __( 'An account with this email already exists.', 'tribune' );
		if ( username_exists( $username ) ) $username = $username . rand( 10, 99 );

		if ( empty( $errors ) ) {
			$user_id = wp_create_user( $username, $password, $email );
			if ( is_wp_error( $user_id ) ) {
				$errors[] = $user_id->get_error_message();
			} else {
				wp_update_user( array(
					'ID'           => $user_id,
					'first_name'   => $first_name,
					'last_name'    => $last_name,
					'display_name' => trim( $first_name . ' ' . $last_name ),
					'role'         => 'subscriber',
				) );

				// Auto login
				wp_set_auth_cookie( $user_id, false );
				wp_redirect( home_url() );
				exit;
			}
		}
	}

	ob_start();
	?>
	<div class="auth-form">
		<h2 class="auth-form__title"><?php _e( 'Create an Account', 'tribune' ); ?></h2>
		<?php if ( ! empty( $errors ) ) : ?>
			<div class="auth-form__error">
				<ul>
					<?php foreach ( $errors as $error ) echo '<li>' . esc_html( $error ) . '</li>'; ?>
				</ul>
			</div>
		<?php endif; ?>
		<form method="post" class="auth-form__form">
			<div class="form-row">
				<div class="form-group">
					<label for="first_name"><?php _e( 'First Name', 'tribune' ); ?></label>
					<input type="text" name="first_name" id="first_name" class="form-control"
						value="<?php echo esc_attr( $_POST['first_name'] ?? '' ); ?>" required autocomplete="given-name">
				</div>
				<div class="form-group">
					<label for="last_name"><?php _e( 'Last Name', 'tribune' ); ?></label>
					<input type="text" name="last_name" id="last_name" class="form-control"
						value="<?php echo esc_attr( $_POST['last_name'] ?? '' ); ?>" autocomplete="family-name">
				</div>
			</div>
			<div class="form-group">
				<label for="email"><?php _e( 'Email Address', 'tribune' ); ?></label>
				<input type="email" name="email" id="email" class="form-control"
					value="<?php echo esc_attr( sanitize_email( $_POST['email'] ?? '' ) ); ?>" required autocomplete="email">
			</div>
			<div class="form-group">
				<label for="password"><?php _e( 'Password', 'tribune' ); ?></label>
				<input type="password" name="password" id="password" class="form-control" required
					minlength="8" autocomplete="new-password">
				<small><?php _e( 'At least 8 characters.', 'tribune' ); ?></small>
			</div>
			<div class="form-group">
				<label for="password2"><?php _e( 'Confirm Password', 'tribune' ); ?></label>
				<input type="password" name="password2" id="password2" class="form-control" required autocomplete="new-password">
			</div>
			<?php wp_nonce_field( 'tribune-register', 'tribune_register_nonce' ); ?>
			<button type="submit" name="tribune_register_submit" class="btn btn--primary btn--full"><?php _e( 'Create Account', 'tribune' ); ?></button>
		</form>
		<p class="auth-form__switch">
			<?php _e( 'Already have an account?', 'tribune' ); ?>
			<a href="<?php echo esc_url( tribune_login_url() ); ?>"><?php _e( 'Sign in', 'tribune' ); ?></a>
		</p>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'tribune_register_form', 'tribune_register_form_shortcode' );

// [tribune_account]
function tribune_account_shortcode() {
	if ( ! is_user_logged_in() ) {
		return '<p>' . sprintf(
			__( 'Please <a href="%s">sign in</a> to view your account.', 'tribune' ),
			esc_url( tribune_login_url() )
		) . '</p>';
	}

	$user = wp_get_current_user();
	ob_start();
	?>
	<div class="account-profile">
		<div class="account-profile__avatar">
			<?php echo get_avatar( $user->ID, 80, '', '', array( 'class' => 'account-profile__img' ) ); ?>
		</div>
		<div class="account-profile__info">
			<h2><?php echo esc_html( $user->display_name ); ?></h2>
			<p class="account-profile__email"><?php echo esc_html( $user->user_email ); ?></p>
			<p>
				<a href="<?php echo esc_url( wp_logout_url( home_url() ) ); ?>" class="btn btn--ghost btn--sm"><?php _e( 'Sign Out', 'tribune' ); ?></a>
			</p>
		</div>
	</div>
	<?php
	return ob_get_clean();
}
add_shortcode( 'tribune_account', 'tribune_account_shortcode' );

// -------------------------------------------------------------------------
// URL HELPERS
// -------------------------------------------------------------------------
function tribune_login_url( $redirect = '' ) {
	$page_id = get_option( 'tribune_login_page', 0 );
	if ( $page_id && get_post_status( $page_id ) === 'publish' ) {
		$url = get_permalink( $page_id );
		return $redirect ? add_query_arg( 'redirect_to', urlencode( $redirect ), $url ) : $url;
	}
	return wp_login_url( $redirect );
}

function tribune_register_url() {
	$page_id = get_option( 'tribune_register_page', 0 );
	if ( $page_id && get_post_status( $page_id ) === 'publish' ) {
		return get_permalink( $page_id );
	}
	return wp_registration_url();
}

function tribune_account_url() {
	$page_id = get_option( 'tribune_account_page', 0 );
	if ( $page_id && get_post_status( $page_id ) === 'publish' ) {
		return get_permalink( $page_id );
	}
	return admin_url( 'profile.php' );
}

// -------------------------------------------------------------------------
// Redirect wp-login.php to custom login page (if configured)
// -------------------------------------------------------------------------
function tribune_redirect_login_page() {
	$page_id = get_option( 'tribune_login_page', 0 );
	if ( ! $page_id ) return;

	$login_page = get_permalink( $page_id );
	$page_viewed = basename( $_SERVER['REQUEST_URI'] );

	if ( $page_viewed === 'wp-login.php' && $_SERVER['REQUEST_METHOD'] === 'GET' ) {
		$redirect = isset( $_GET['redirect_to'] ) ? $_GET['redirect_to'] : '';
		wp_redirect( $redirect ? add_query_arg( 'redirect_to', urlencode( $redirect ), $login_page ) : $login_page );
		exit;
	}
}
add_action( 'init', 'tribune_redirect_login_page' );

// -------------------------------------------------------------------------
// Failed login redirect to custom login page
// -------------------------------------------------------------------------
function tribune_login_failed_redirect() {
	$page_id = get_option( 'tribune_login_page', 0 );
	if ( ! $page_id ) return;
	wp_redirect( add_query_arg( 'login', 'failed', get_permalink( $page_id ) ) );
	exit;
}
add_action( 'wp_login_failed', 'tribune_login_failed_redirect' );
