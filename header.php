<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">

	<!-- Skip to content -->
	<a class="skip-link screen-reader-text" href="#primary"><?php _e( 'Skip to content', 'tribune' ); ?></a>

	<!-- ============================================================
	     TOPBAR (date + secondary links)
	     ============================================================ -->
	<div class="topbar">
		<div class="topbar__inner container">
			<div class="topbar__date">
				<?php echo date_i18n( 'l, F j, Y' ); ?>
			</div>
			<div class="topbar__links">
				<?php if ( is_user_logged_in() ) :
					$current_user = wp_get_current_user();
				?>
					<span class="topbar__user"><?php echo esc_html( $current_user->display_name ); ?></span>
					<a href="<?php echo esc_url( tribune_account_url() ); ?>" class="topbar__link"><?php _e( 'My Account', 'tribune' ); ?></a>
					<a href="<?php echo esc_url( wp_logout_url( home_url() ) ); ?>" class="topbar__link"><?php _e( 'Sign Out', 'tribune' ); ?></a>
				<?php else : ?>
					<a href="<?php echo esc_url( tribune_login_url() ); ?>" class="topbar__link"><?php _e( 'Sign In', 'tribune' ); ?></a>
					<a href="<?php echo esc_url( tribune_register_url() ); ?>" class="topbar__link topbar__link--cta"><?php _e( 'Subscribe', 'tribune' ); ?></a>
				<?php endif; ?>
			</div>
		</div>
	</div>

	<!-- ============================================================
	     HEADER
	     ============================================================ -->
	<header id="masthead" class="site-header">
		<div class="site-header__inner container">

			<!-- Logo / Site Title -->
			<div class="site-header__branding">
				<?php if ( has_custom_logo() ) : ?>
					<div class="site-header__logo">
						<?php the_custom_logo(); ?>
					</div>
				<?php else : ?>
					<div class="site-header__wordmark">
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
							<?php bloginfo( 'name' ); ?>
						</a>
					</div>
					<?php $tagline = get_theme_mod( 'tribune_tagline', '' ) ?: get_bloginfo( 'description' ); ?>
					<?php if ( $tagline ) : ?>
						<p class="site-header__tagline"><?php echo esc_html( $tagline ); ?></p>
					<?php endif; ?>
				<?php endif; ?>
			</div>

			<!-- Header Actions -->
			<div class="site-header__actions">
				<?php
				$cta_text = get_theme_mod( 'tribune_header_cta_text', __( 'Subscribe', 'tribune' ) );
				$cta_url  = get_theme_mod( 'tribune_header_cta_url', tribune_register_url() );
				if ( ! is_user_logged_in() && $cta_text ) :
				?>
					<a href="<?php echo esc_url( $cta_url ); ?>" class="header-cta-btn">
						<?php echo esc_html( $cta_text ); ?>
					</a>
				<?php endif; ?>

				<!-- Search toggle -->
				<button class="header-search-toggle" aria-expanded="false" aria-controls="header-search" aria-label="<?php esc_attr_e( 'Search', 'tribune' ); ?>">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
					</svg>
				</button>

				<!-- Mobile menu toggle -->
				<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false" aria-label="<?php esc_attr_e( 'Toggle menu', 'tribune' ); ?>">
					<span class="menu-toggle__bar"></span>
					<span class="menu-toggle__bar"></span>
					<span class="menu-toggle__bar"></span>
				</button>
			</div>
		</div>

		<!-- Search bar (hidden by default) -->
		<div id="header-search" class="header-search" hidden>
			<div class="header-search__inner container">
				<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="header-search__form">
					<label class="screen-reader-text" for="header-search-input"><?php _e( 'Search', 'tribune' ); ?></label>
					<input type="search" id="header-search-input" class="header-search__input"
						placeholder="<?php esc_attr_e( 'Search articles, authors, topics&hellip;', 'tribune' ); ?>"
						value="<?php echo get_search_query(); ?>" name="s" autocomplete="off">
					<button type="submit" class="header-search__submit">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
						</svg>
					</button>
					<button type="button" class="header-search__close" aria-label="<?php esc_attr_e( 'Close search', 'tribune' ); ?>">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					</button>
				</form>
			</div>
		</div>
	</header>

	<!-- ============================================================
	     SECTION / PRIMARY NAVIGATION
	     ============================================================ -->
	<nav id="primary-navigation" class="section-nav" aria-label="<?php esc_attr_e( 'Section navigation', 'tribune' ); ?>">
		<div class="section-nav__inner container">
			<ul class="section-nav__list" id="primary-menu">

				<!-- Home link -->
				<li class="section-nav__item <?php echo is_front_page() ? 'current-menu-item' : ''; ?>">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="section-nav__link"><?php _e( 'Home', 'tribune' ); ?></a>
				</li>

				<?php
				// Render sections as nav items
				$sections = tribune_get_sections();
				if ( $sections && ! is_wp_error( $sections ) ) :
					foreach ( $sections as $section ) :
						$color = get_term_meta( $section->term_id, 'tribune_section_color', true );
						$current = ( is_tax( 'section', $section->term_id ) ) ? ' current-menu-item' : '';
						?>
						<li class="section-nav__item<?php echo $current; ?>" <?php echo $color ? 'style="--section-color:' . esc_attr($color) . '"' : ''; ?>>
							<a href="<?php echo esc_url( get_term_link( $section ) ); ?>" class="section-nav__link">
								<?php echo esc_html( $section->name ); ?>
							</a>
						</li>
					<?php endforeach;
				endif;

				// Or use a registered "section-nav" menu if it exists
				if ( has_nav_menu( 'section-nav' ) ) {
					wp_nav_menu( array(
						'theme_location' => 'section-nav',
						'menu_id'        => 'section-nav-menu',
						'container'      => false,
						'items_wrap'     => '%3$s',
						'fallback_cb'    => false,
					) );
				}
				?>
			</ul>
		</div>
	</nav>

	<!-- ============================================================
	     MAIN CONTENT
	     ============================================================ -->
	<div id="content" class="site-content">
