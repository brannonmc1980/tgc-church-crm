<?php
/**
 * Sidebar template
 *
 * @package Tribune
 */
?>

<aside id="secondary" class="sidebar">

	<?php if ( is_active_sidebar( 'sidebar-main' ) ) : ?>
		<?php dynamic_sidebar( 'sidebar-main' ); ?>
	<?php else : ?>

		<!-- Default sidebar content when no widgets are set -->

		<!-- Newsletter signup widget -->
		<div class="widget widget--newsletter">
			<?php tribune_newsletter_form( 'sidebar' ); ?>
		</div>

		<!-- Latest articles -->
		<div class="widget">
			<h3 class="widget-title"><?php _e( 'Latest', 'tribune' ); ?></h3>
			<?php
			$latest = new WP_Query( array(
				'posts_per_page'      => 5,
				'ignore_sticky_posts' => true,
			) );
			if ( $latest->have_posts() ) : ?>
				<ul class="widget-post-list">
					<?php while ( $latest->have_posts() ) : $latest->the_post(); ?>
						<li class="widget-post-list__item">
							<?php if ( has_post_thumbnail() ) : ?>
								<a href="<?php the_permalink(); ?>" class="widget-post-list__thumb" tabindex="-1">
									<?php the_post_thumbnail( 'tribune-thumb', array( 'class' => 'widget-post-list__img' ) ); ?>
								</a>
							<?php endif; ?>
							<div class="widget-post-list__text">
								<?php tribune_the_section_label(); ?>
								<a href="<?php the_permalink(); ?>" class="widget-post-list__title"><?php the_title(); ?></a>
								<span class="widget-post-list__date"><?php echo tribune_formatted_date(); ?></span>
							</div>
						</li>
					<?php endwhile; ?>
				</ul>
			<?php endif; wp_reset_postdata(); ?>
		</div>

		<!-- Sections widget -->
		<div class="widget">
			<h3 class="widget-title"><?php _e( 'Sections', 'tribune' ); ?></h3>
			<?php
			$sections = tribune_get_sections();
			if ( $sections && ! is_wp_error( $sections ) ) : ?>
				<ul class="widget-section-list">
					<?php foreach ( $sections as $section ) : ?>
						<li>
							<a href="<?php echo esc_url( get_term_link( $section ) ); ?>">
								<?php echo esc_html( $section->name ); ?>
								<span class="widget-section-list__count"><?php echo esc_html( $section->count ); ?></span>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php endif; ?>
		</div>

	<?php endif; ?>

</aside><!-- #secondary -->
