<?php
/**
 * 404 template
 *
 * @package Tribune
 */

get_header();
?>

<main id="primary" class="site-main error-404">
	<div class="container--narrow error-404__inner">
		<div class="error-404__content">
			<span class="error-404__number">404</span>
			<h1 class="error-404__title"><?php _e( 'Page not found.', 'tribune' ); ?></h1>
			<p class="error-404__desc">
				<?php _e( "The page you're looking for may have moved, been removed, or doesn't exist. Try searching, or browse our sections.", 'tribune' ); ?>
			</p>
			<div class="error-404__actions">
				<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="error-404__search">
					<input type="search" class="form-control" placeholder="<?php esc_attr_e( 'Search articles&hellip;', 'tribune' ); ?>" name="s">
					<button type="submit" class="btn btn--primary"><?php _e( 'Search', 'tribune' ); ?></button>
				</form>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn--outline"><?php _e( '&larr; Back to Homepage', 'tribune' ); ?></a>
			</div>
		</div>

		<?php
		$sections = tribune_get_sections( array( 'number' => 6 ) );
		if ( $sections && ! is_wp_error( $sections ) ) :
		?>
		<div class="error-404__sections">
			<h3><?php _e( 'Browse by Section', 'tribune' ); ?></h3>
			<ul class="error-404__section-list">
				<?php foreach ( $sections as $section ) : ?>
					<li>
						<a href="<?php echo esc_url( get_term_link( $section ) ); ?>" class="section-label">
							<?php echo esc_html( $section->name ); ?>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php endif; ?>

	</div>
</main>

<?php get_footer(); ?>
