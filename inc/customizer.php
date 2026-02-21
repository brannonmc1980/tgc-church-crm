<?php
/**
 * Theme Customizer settings for Tribune
 *
 * @package Tribune
 */

function tribune_customize_register( $wp_customize ) {

	// -----------------------------------------------------------------------
	// PANEL: Tribune Settings
	// -----------------------------------------------------------------------
	$wp_customize->add_panel( 'tribune_panel', array(
		'title'       => __( 'Tribune Settings', 'tribune' ),
		'description' => __( 'Settings specific to the Tribune editorial theme.', 'tribune' ),
		'priority'    => 130,
	) );

	// -----------------------------------------------------------------------
	// SECTION: Branding
	// -----------------------------------------------------------------------
	$wp_customize->add_section( 'tribune_branding', array(
		'title'    => __( 'Publication Info', 'tribune' ),
		'panel'    => 'tribune_panel',
		'priority' => 10,
	) );

	$wp_customize->add_setting( 'tribune_tagline', array(
		'default'           => '',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'postMessage',
	) );
	$wp_customize->add_control( 'tribune_tagline', array(
		'label'   => __( 'Publication Tagline (Header)', 'tribune' ),
		'section' => 'tribune_branding',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'tribune_header_cta_text', array(
		'default'           => __( 'Subscribe', 'tribune' ),
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'tribune_header_cta_text', array(
		'label'   => __( 'Header CTA Button Text', 'tribune' ),
		'section' => 'tribune_branding',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'tribune_header_cta_url', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'tribune_header_cta_url', array(
		'label'   => __( 'Header CTA Button URL', 'tribune' ),
		'section' => 'tribune_branding',
		'type'    => 'url',
	) );

	// -----------------------------------------------------------------------
	// SECTION: Colors
	// -----------------------------------------------------------------------
	$wp_customize->add_section( 'tribune_colors', array(
		'title'    => __( 'Theme Colors', 'tribune' ),
		'panel'    => 'tribune_panel',
		'priority' => 20,
	) );

	$colors = array(
		'tribune_color_header_bg'   => array( 'label' => __( 'Header Background', 'tribune' ), 'default' => '#1B2A4A' ),
		'tribune_color_accent'      => array( 'label' => __( 'Accent / Red', 'tribune' ),       'default' => '#C41E3A' ),
		'tribune_color_accent_gold' => array( 'label' => __( 'Accent Gold (Premium)', 'tribune' ), 'default' => '#D4A853' ),
		'tribune_color_link'        => array( 'label' => __( 'Link Color', 'tribune' ),          'default' => '#1B2A4A' ),
	);

	foreach ( $colors as $id => $args ) {
		$wp_customize->add_setting( $id, array(
			'default'           => $args['default'],
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'         => 'postMessage',
		) );
		$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, $id, array(
			'label'   => $args['label'],
			'section' => 'tribune_colors',
		) ) );
	}

	// -----------------------------------------------------------------------
	// SECTION: Paywall Settings
	// -----------------------------------------------------------------------
	$wp_customize->add_section( 'tribune_paywall', array(
		'title'    => __( 'Permission Wall / Paywall', 'tribune' ),
		'panel'    => 'tribune_panel',
		'priority' => 30,
	) );

	$wp_customize->add_setting( 'tribune_paywall_enabled', array(
		'default'           => true,
		'sanitize_callback' => 'tribune_sanitize_checkbox',
	) );
	$wp_customize->add_control( 'tribune_paywall_enabled', array(
		'label'   => __( 'Enable permission wall for non-subscribers', 'tribune' ),
		'section' => 'tribune_paywall',
		'type'    => 'checkbox',
	) );

	$wp_customize->add_setting( 'tribune_paywall_threshold', array(
		'default'           => 60,
		'sanitize_callback' => 'absint',
	) );
	$wp_customize->add_control( 'tribune_paywall_threshold', array(
		'label'       => __( 'Content visible before gate (% of article)', 'tribune' ),
		'description' => __( 'Between 20 and 80. Default: 60.', 'tribune' ),
		'section'     => 'tribune_paywall',
		'type'        => 'number',
		'input_attrs' => array( 'min' => 20, 'max' => 80, 'step' => 5 ),
	) );

	$wp_customize->add_setting( 'tribune_cookie_days', array(
		'default'           => 7,
		'sanitize_callback' => 'absint',
	) );
	$wp_customize->add_control( 'tribune_cookie_days', array(
		'label'   => __( 'Days email gate cookie is valid', 'tribune' ),
		'section' => 'tribune_paywall',
		'type'    => 'number',
		'input_attrs' => array( 'min' => 1, 'max' => 365 ),
	) );

	$wp_customize->add_setting( 'tribune_paywall_headline', array(
		'default'           => __( 'Read the full story.', 'tribune' ),
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'tribune_paywall_headline', array(
		'label'   => __( 'Paywall Headline', 'tribune' ),
		'section' => 'tribune_paywall',
		'type'    => 'text',
	) );

	$wp_customize->add_setting( 'tribune_paywall_subhead', array(
		'default'           => __( 'Enter your email for free access, or create an account to subscribe.', 'tribune' ),
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'tribune_paywall_subhead', array(
		'label'   => __( 'Paywall Subheadline', 'tribune' ),
		'section' => 'tribune_paywall',
		'type'    => 'textarea',
	) );

	// -----------------------------------------------------------------------
	// SECTION: Account Pages
	// -----------------------------------------------------------------------
	$wp_customize->add_section( 'tribune_account_pages', array(
		'title'    => __( 'Account Pages', 'tribune' ),
		'panel'    => 'tribune_panel',
		'priority' => 40,
	) );

	$pages = get_pages();
	$page_choices = array( '' => __( '— Select a Page —', 'tribune' ) );
	foreach ( $pages as $page ) {
		$page_choices[ $page->ID ] = $page->post_title;
	}

	$account_pages = array(
		'tribune_login_page'    => __( 'Login Page', 'tribune' ),
		'tribune_register_page' => __( 'Register Page', 'tribune' ),
		'tribune_account_page'  => __( 'My Account Page', 'tribune' ),
	);

	foreach ( $account_pages as $setting_id => $label ) {
		$wp_customize->add_setting( $setting_id, array(
			'default'           => '',
			'sanitize_callback' => 'absint',
			'type'              => 'option',
		) );
		$wp_customize->add_control( $setting_id, array(
			'label'   => $label,
			'section' => 'tribune_account_pages',
			'type'    => 'select',
			'choices' => $page_choices,
		) );
	}

	// -----------------------------------------------------------------------
	// SECTION: Footer
	// -----------------------------------------------------------------------
	$wp_customize->add_section( 'tribune_footer', array(
		'title'    => __( 'Footer', 'tribune' ),
		'panel'    => 'tribune_panel',
		'priority' => 50,
	) );

	$wp_customize->add_setting( 'tribune_footer_copyright', array(
		'default'           => '',
		'sanitize_callback' => 'wp_kses_post',
		'transport'         => 'postMessage',
	) );
	$wp_customize->add_control( 'tribune_footer_copyright', array(
		'label'       => __( 'Copyright / Footer Text', 'tribune' ),
		'description' => __( 'HTML allowed. Leave blank to use default.', 'tribune' ),
		'section'     => 'tribune_footer',
		'type'        => 'textarea',
	) );

	$wp_customize->add_setting( 'tribune_footer_about', array(
		'default'           => '',
		'sanitize_callback' => 'wp_kses_post',
	) );
	$wp_customize->add_control( 'tribune_footer_about', array(
		'label'       => __( 'Footer About Text', 'tribune' ),
		'description' => __( 'Short description shown in footer.', 'tribune' ),
		'section'     => 'tribune_footer',
		'type'        => 'textarea',
	) );

	$wp_customize->add_setting( 'tribune_social_twitter', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'tribune_social_twitter', array(
		'label'   => __( 'Twitter/X URL', 'tribune' ),
		'section' => 'tribune_footer',
		'type'    => 'url',
	) );

	$wp_customize->add_setting( 'tribune_social_facebook', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'tribune_social_facebook', array(
		'label'   => __( 'Facebook URL', 'tribune' ),
		'section' => 'tribune_footer',
		'type'    => 'url',
	) );

	$wp_customize->add_setting( 'tribune_social_instagram', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'tribune_social_instagram', array(
		'label'   => __( 'Instagram URL', 'tribune' ),
		'section' => 'tribune_footer',
		'type'    => 'url',
	) );

	$wp_customize->add_setting( 'tribune_social_youtube', array(
		'default'           => '',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'tribune_social_youtube', array(
		'label'   => __( 'YouTube URL', 'tribune' ),
		'section' => 'tribune_footer',
		'type'    => 'url',
	) );
}
add_action( 'customize_register', 'tribune_customize_register' );

// -----------------------------------------------------------------------
// OUTPUT CUSTOMIZER CSS
// -----------------------------------------------------------------------
function tribune_customizer_css() {
	$header_bg   = get_theme_mod( 'tribune_color_header_bg', '#1B2A4A' );
	$accent      = get_theme_mod( 'tribune_color_accent', '#C41E3A' );
	$accent_gold = get_theme_mod( 'tribune_color_accent_gold', '#D4A853' );
	$link        = get_theme_mod( 'tribune_color_link', '#1B2A4A' );
	?>
	<style id="tribune-customizer-css">
		:root {
			--color-header-bg: <?php echo sanitize_hex_color( $header_bg ); ?>;
			--color-accent: <?php echo sanitize_hex_color( $accent ); ?>;
			--color-accent-gold: <?php echo sanitize_hex_color( $accent_gold ); ?>;
			--color-link: <?php echo sanitize_hex_color( $link ); ?>;
		}
	</style>
	<?php
}
add_action( 'wp_head', 'tribune_customizer_css' );

// -----------------------------------------------------------------------
// SANITIZE HELPERS
// -----------------------------------------------------------------------
function tribune_sanitize_checkbox( $value ) {
	return (bool) $value;
}
