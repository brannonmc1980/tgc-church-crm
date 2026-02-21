<?php
/**
 * Tribune functions and definitions
 *
 * @package Tribune
 */

if ( ! defined( 'TRIBUNE_VERSION' ) ) {
	define( 'TRIBUNE_VERSION', '1.0.0' );
}

if ( ! defined( 'TRIBUNE_DIR' ) ) {
	define( 'TRIBUNE_DIR', get_template_directory() );
}

if ( ! defined( 'TRIBUNE_URI' ) ) {
	define( 'TRIBUNE_URI', get_template_directory_uri() );
}

// -------------------------------------------------------------------------
// 1. THEME SETUP
// -------------------------------------------------------------------------
function tribune_setup() {
	load_theme_textdomain( 'tribune', TRIBUNE_DIR . '/languages' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	) );
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/editor-style.css' );

	// Custom logo
	add_theme_support( 'custom-logo', array(
		'height'      => 80,
		'width'       => 320,
		'flex-height' => true,
		'flex-width'  => true,
	) );

	// Custom background
	add_theme_support( 'custom-background', array(
		'default-color' => 'ffffff',
	) );

	// Register nav menus
	register_nav_menus( array(
		'primary'       => __( 'Primary Navigation', 'tribune' ),
		'section-nav'   => __( 'Section Navigation', 'tribune' ),
		'footer-nav'    => __( 'Footer Navigation', 'tribune' ),
		'footer-legal'  => __( 'Footer Legal', 'tribune' ),
	) );
}
add_action( 'after_setup_theme', 'tribune_setup' );

// -------------------------------------------------------------------------
// 2. CONTENT WIDTH
// -------------------------------------------------------------------------
function tribune_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'tribune_content_width', 1200 );
}
add_action( 'after_setup_theme', 'tribune_content_width', 0 );

// -------------------------------------------------------------------------
// 3. IMAGE SIZES
// -------------------------------------------------------------------------
function tribune_add_image_sizes() {
	// Hero / featured: full-bleed 1920×1080
	add_image_size( 'tribune-hero', 1920, 1080, true );
	// Card: landscape thumbnail
	add_image_size( 'tribune-card', 800, 450, true );
	// Small card / sidebar
	add_image_size( 'tribune-thumb', 400, 225, true );
	// Square avatar
	add_image_size( 'tribune-avatar', 80, 80, true );
}
add_action( 'after_setup_theme', 'tribune_add_image_sizes' );

// Make custom sizes available in the media uploader
function tribune_custom_image_sizes( $sizes ) {
	return array_merge( $sizes, array(
		'tribune-hero'   => __( 'Hero (1920×1080)', 'tribune' ),
		'tribune-card'   => __( 'Card (800×450)', 'tribune' ),
		'tribune-thumb'  => __( 'Thumbnail (400×225)', 'tribune' ),
	) );
}
add_filter( 'image_size_names_choose', 'tribune_custom_image_sizes' );

// -------------------------------------------------------------------------
// 4. ENQUEUE SCRIPTS & STYLES
// -------------------------------------------------------------------------
function tribune_scripts() {
	// Google Fonts
	$google_fonts_url = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap';
	wp_enqueue_style( 'tribune-google-fonts', $google_fonts_url, array(), null );

	// Main stylesheet
	wp_enqueue_style( 'tribune-style', TRIBUNE_URI . '/assets/css/main.css', array( 'tribune-google-fonts' ), TRIBUNE_VERSION );

	// Navigation
	wp_enqueue_script( 'tribune-navigation', TRIBUNE_URI . '/assets/js/navigation.js', array(), TRIBUNE_VERSION, true );

	// Main JS
	wp_enqueue_script( 'tribune-main', TRIBUNE_URI . '/assets/js/main.js', array( 'jquery' ), TRIBUNE_VERSION, true );

	// Paywall (single articles only, non-subscribers)
	if ( is_single() && ! tribune_user_has_access() ) {
		wp_enqueue_script( 'tribune-paywall', TRIBUNE_URI . '/assets/js/paywall.js', array( 'jquery' ), TRIBUNE_VERSION, true );
		wp_localize_script( 'tribune-paywall', 'tribunePaywall', array(
			'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
			'nonce'       => wp_create_nonce( 'tribune_email_gate' ),
			'threshold'   => get_option( 'tribune_paywall_threshold', 60 ),
			'cookieName'  => 'tribune_access',
			'cookieDays'  => get_option( 'tribune_cookie_days', 7 ),
		) );
	}

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'tribune_scripts' );

// -------------------------------------------------------------------------
// 5. REGISTER SIDEBARS
// -------------------------------------------------------------------------
function tribune_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Main Sidebar', 'tribune' ),
		'id'            => 'sidebar-main',
		'description'   => __( 'Appears on homepage and archives.', 'tribune' ),
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name'          => __( 'Article Sidebar', 'tribune' ),
		'id'            => 'sidebar-article',
		'description'   => __( 'Appears alongside single articles.', 'tribune' ),
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name'          => __( 'Footer Column 1', 'tribune' ),
		'id'            => 'footer-1',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name'          => __( 'Footer Column 2', 'tribune' ),
		'id'            => 'footer-2',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );

	register_sidebar( array(
		'name'          => __( 'Footer Column 3', 'tribune' ),
		'id'            => 'footer-3',
		'before_widget' => '<div id="%1$s" class="widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
}
add_action( 'widgets_init', 'tribune_widgets_init' );

// -------------------------------------------------------------------------
// 6. CUSTOM TAXONOMY: SECTION
// -------------------------------------------------------------------------
function tribune_register_taxonomies() {
	$labels = array(
		'name'                       => __( 'Sections', 'tribune' ),
		'singular_name'              => __( 'Section', 'tribune' ),
		'search_items'               => __( 'Search Sections', 'tribune' ),
		'popular_items'              => __( 'Popular Sections', 'tribune' ),
		'all_items'                  => __( 'All Sections', 'tribune' ),
		'parent_item'                => __( 'Parent Section', 'tribune' ),
		'parent_item_colon'          => __( 'Parent Section:', 'tribune' ),
		'edit_item'                  => __( 'Edit Section', 'tribune' ),
		'update_item'                => __( 'Update Section', 'tribune' ),
		'add_new_item'               => __( 'Add New Section', 'tribune' ),
		'new_item_name'              => __( 'New Section Name', 'tribune' ),
		'separate_items_with_commas' => __( 'Separate sections with commas', 'tribune' ),
		'add_or_remove_items'        => __( 'Add or remove sections', 'tribune' ),
		'choose_from_most_used'      => __( 'Choose from most used sections', 'tribune' ),
		'not_found'                  => __( 'No sections found', 'tribune' ),
		'menu_name'                  => __( 'Sections', 'tribune' ),
	);

	register_taxonomy( 'section', array( 'post' ), array(
		'labels'            => $labels,
		'hierarchical'      => true,
		'public'            => true,
		'show_ui'           => true,
		'show_admin_column' => true,
		'show_in_nav_menus' => true,
		'show_tagcloud'     => false,
		'show_in_rest'      => true,
		'rewrite'           => array(
			'slug'         => 'section',
			'with_front'   => false,
			'hierarchical' => true,
		),
		'query_var'         => true,
	) );
}
add_action( 'init', 'tribune_register_taxonomies' );

// -------------------------------------------------------------------------
// 7. INCLUDE ADDITIONAL FILES
// -------------------------------------------------------------------------
require TRIBUNE_DIR . '/inc/meta-boxes.php';
require TRIBUNE_DIR . '/inc/paywall.php';
require TRIBUNE_DIR . '/inc/user-accounts.php';
require TRIBUNE_DIR . '/inc/template-functions.php';
require TRIBUNE_DIR . '/inc/customizer.php';

// -------------------------------------------------------------------------
// 8. READING TIME
// -------------------------------------------------------------------------
function tribune_reading_time( $post_id = null ) {
	$post_id = $post_id ?: get_the_ID();
	$content = get_post_field( 'post_content', $post_id );
	$word_count = str_word_count( strip_tags( $content ) );
	$minutes = max( 1, (int) ceil( $word_count / 225 ) );
	/* translators: %d = number of minutes */
	return sprintf( _n( '%d min read', '%d min read', $minutes, 'tribune' ), $minutes );
}

// -------------------------------------------------------------------------
// 9. BODY CLASSES
// -------------------------------------------------------------------------
function tribune_body_classes( $classes ) {
	if ( is_singular() && ! is_front_page() ) {
		$classes[] = 'single-view';
	}
	if ( ! is_user_logged_in() ) {
		$classes[] = 'logged-out';
	}
	if ( tribune_user_has_access() ) {
		$classes[] = 'has-access';
	}
	return $classes;
}
add_filter( 'body_class', 'tribune_body_classes' );

// -------------------------------------------------------------------------
// 10. CUSTOM EXCERPT LENGTH & MORE TEXT
// -------------------------------------------------------------------------
function tribune_excerpt_length( $length ) {
	return 30;
}
add_filter( 'excerpt_length', 'tribune_excerpt_length' );

function tribune_excerpt_more( $more ) {
	return '&hellip;';
}
add_filter( 'excerpt_more', 'tribune_excerpt_more' );

// -------------------------------------------------------------------------
// 11. DISABLE BLOCK EDITOR FOR PAGES IF NEEDED (keep it for posts)
// -------------------------------------------------------------------------
// Intentionally left enabled for all post types.

// -------------------------------------------------------------------------
// 12. ADMIN COLUMNS: Add Section column to posts list
// -------------------------------------------------------------------------
function tribune_add_section_column( $columns ) {
	$new = array();
	foreach ( $columns as $key => $label ) {
		$new[ $key ] = $label;
		if ( $key === 'title' ) {
			$new['section'] = __( 'Section', 'tribune' );
		}
	}
	return $new;
}
add_filter( 'manage_posts_columns', 'tribune_add_section_column' );

function tribune_show_section_column( $column, $post_id ) {
	if ( $column === 'section' ) {
		$sections = get_the_terms( $post_id, 'section' );
		if ( $sections && ! is_wp_error( $sections ) ) {
			$links = array();
			foreach ( $sections as $section ) {
				$links[] = '<a href="' . esc_url( admin_url( 'edit.php?section=' . $section->slug ) ) . '">' . esc_html( $section->name ) . '</a>';
			}
			echo implode( ', ', $links );
		} else {
			echo '&mdash;';
		}
	}
}
add_action( 'manage_posts_custom_column', 'tribune_show_section_column', 10, 2 );

// -------------------------------------------------------------------------
// 13. CUSTOM LOGIN REDIRECT
// -------------------------------------------------------------------------
function tribune_login_redirect( $redirect_to, $request, $user ) {
	if ( isset( $user->roles ) && is_array( $user->roles ) ) {
		if ( in_array( 'administrator', $user->roles ) || in_array( 'editor', $user->roles ) ) {
			return $redirect_to;
		}
		// Redirect subscribers to the homepage or previous page
		$login_page = get_option( 'tribune_login_page', '' );
		return $redirect_to !== admin_url() ? $redirect_to : home_url();
	}
	return $redirect_to;
}
add_filter( 'login_redirect', 'tribune_login_redirect', 10, 3 );

// -------------------------------------------------------------------------
// 14. DISABLE ADMIN BAR FOR NON-ADMINS
// -------------------------------------------------------------------------
function tribune_disable_admin_bar_for_subscribers() {
	if ( is_user_logged_in() && ! current_user_can( 'edit_posts' ) ) {
		show_admin_bar( false );
	}
}
add_action( 'after_setup_theme', 'tribune_disable_admin_bar_for_subscribers' );

// -------------------------------------------------------------------------
// 15. SEO: Open Graph meta tags
// -------------------------------------------------------------------------
function tribune_og_meta_tags() {
	if ( ! is_singular() ) return;
	global $post;
	$description = $post->post_excerpt ?: wp_trim_words( strip_tags( $post->post_content ), 30, '...' );
	$image       = get_the_post_thumbnail_url( $post->ID, 'tribune-hero' );
	?>
	<meta property="og:title" content="<?php echo esc_attr( get_the_title() ); ?>">
	<meta property="og:description" content="<?php echo esc_attr( $description ); ?>">
	<meta property="og:type" content="article">
	<meta property="og:url" content="<?php the_permalink(); ?>">
	<?php if ( $image ) : ?>
	<meta property="og:image" content="<?php echo esc_url( $image ); ?>">
	<meta property="og:image:width" content="1920">
	<meta property="og:image:height" content="1080">
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:image" content="<?php echo esc_url( $image ); ?>">
	<?php endif; ?>
	<meta name="twitter:title" content="<?php echo esc_attr( get_the_title() ); ?>">
	<meta name="twitter:description" content="<?php echo esc_attr( $description ); ?>">
	<?php
}
add_action( 'wp_head', 'tribune_og_meta_tags' );

// -------------------------------------------------------------------------
// 16. PAGINATION
// -------------------------------------------------------------------------
function tribune_pagination() {
	global $wp_query;
	$big = 999999999;
	$pages = paginate_links( array(
		'base'    => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
		'format'  => '?paged=%#%',
		'current' => max( 1, get_query_var( 'paged' ) ),
		'total'   => $wp_query->max_num_pages,
		'type'    => 'array',
		'prev_text' => '&larr; Previous',
		'next_text' => 'Next &rarr;',
	) );

	if ( $pages ) {
		echo '<nav class="pagination" aria-label="' . esc_attr__( 'Posts navigation', 'tribune' ) . '">';
		echo '<ul class="pagination__list">';
		foreach ( $pages as $page ) {
			echo '<li class="pagination__item">' . $page . '</li>';
		}
		echo '</ul>';
		echo '</nav>';
	}
}
