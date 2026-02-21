<?php
/**
 * The homepage / front page template
 *
 * Layout (inspired by The Dispatch + The Free Press):
 *  1. Hero: Top featured article (full-bleed image, large headline)
 *  2. Secondary featured: 2-column pair of next featured articles
 *  3. Main grid: Recent articles (left) + Sidebar (right)
 *  4. Section strips: Latest from each section
 *
 * @package Tribune
 */

get_header();
?>

<main id="primary" class="site-main home-page">

	<!-- ================================================================
	     HERO: Primary featured article
	     ================================================================ -->
	<?php
	$hero_query = new WP_Query( array(
		'posts_per_page' => 1,
		'meta_query'     => array(
			array(
				'key'   => '_tribune_featured',
				'value' => '1',
			),
		),
	) );

	// Fall back to sticky posts, then latest
	if ( ! $hero_query->have_posts() ) {
		$sticky = get_option( 'sticky_posts' );
		if ( ! empty( $sticky ) ) {
			$hero_query = new WP_Query( array( 'p' => $sticky[0] ) );
		} else {
			$hero_query = new WP_Query( array( 'posts_per_page' => 1 ) );
		}
	}
	?>

	<?php if ( $hero_query->have_posts() ) : $hero_query->the_post();
		$hero_id       = get_the_ID();
		$hero_subtitle = tribune_get_subtitle();
		$hero_image    = tribune_get_hero_image();
	?>
	<section class="hero-section">
		<?php if ( $hero_image ) : ?>
		<div class="hero-section__image-wrap">
			<?php echo $hero_image; ?>
			<div class="hero-section__overlay"></div>
		</div>
		<?php endif; ?>

		<div class="hero-section__content container">
			<div class="hero-section__text">
				<div class="hero-section__meta">
					<?php tribune_the_section_label(); ?>
					<?php tribune_premium_badge(); ?>
				</div>
				<h1 class="hero-section__title">
					<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
				</h1>
				<?php if ( $hero_subtitle ) : ?>
					<p class="hero-section__subtitle"><?php echo esc_html( $hero_subtitle ); ?></p>
				<?php else : ?>
					<p class="hero-section__subtitle"><?php the_excerpt(); ?></p>
				<?php endif; ?>
				<div class="hero-section__byline">
					<span><?php _e( 'By', 'tribune' ); ?> <?php tribune_the_byline(); ?></span>
					<span class="hero-section__sep">&middot;</span>
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo tribune_formatted_date(); ?></time>
					<span class="hero-section__sep">&middot;</span>
					<span><?php echo tribune_reading_time(); ?></span>
				</div>
			</div>
		</div>
	</section>
	<?php endif; wp_reset_postdata(); ?>

	<!-- ================================================================
	     SECONDARY FEATURED: 2 articles side by side
	     ================================================================ -->
	<?php
	$secondary_query = new WP_Query( array(
		'posts_per_page' => 2,
		'post__not_in'   => array( $hero_id ),
		'meta_query'     => array(
			array(
				'key'   => '_tribune_featured',
				'value' => '1',
			),
		),
	) );

	if ( ! $secondary_query->have_posts() ) {
		$secondary_query = new WP_Query( array(
			'posts_per_page' => 2,
			'post__not_in'   => array( $hero_id ),
			'offset'         => 1,
		) );
	}
	?>

	<?php if ( $secondary_query->have_posts() ) : ?>
	<section class="secondary-featured container">
		<div class="secondary-featured__grid">
			<?php while ( $secondary_query->have_posts() ) : $secondary_query->the_post(); ?>
				<article class="secondary-featured__item">
					<?php if ( has_post_thumbnail() ) : ?>
						<a href="<?php the_permalink(); ?>" class="secondary-featured__image-link">
							<?php the_post_thumbnail( 'tribune-card', array( 'class' => 'secondary-featured__img' ) ); ?>
						</a>
					<?php endif; ?>
					<div class="secondary-featured__body">
						<div class="secondary-featured__meta">
							<?php tribune_the_section_label(); ?>
							<?php tribune_premium_badge(); ?>
						</div>
						<h2 class="secondary-featured__title">
							<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
						</h2>
						<?php $sub = tribune_get_subtitle(); ?>
						<?php if ( $sub ) : ?>
							<p class="secondary-featured__subtitle"><?php echo esc_html( $sub ); ?></p>
						<?php endif; ?>
						<div class="secondary-featured__byline">
							<span><?php _e( 'By', 'tribune' ); ?> <?php tribune_the_byline(); ?></span>
							<span class="sep">&middot;</span>
							<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo tribune_formatted_date(); ?></time>
						</div>
					</div>
				</article>
			<?php endwhile; ?>
		</div>
	</section>
	<?php endif; wp_reset_postdata(); ?>

	<!-- ================================================================
	     MAIN CONTENT + SIDEBAR
	     ================================================================ -->
	<?php
	$exclude_ids = array( $hero_id );
	$main_query = new WP_Query( array(
		'posts_per_page' => 8,
		'post__not_in'   => $exclude_ids,
		'paged'          => get_query_var( 'paged' ) ?: 1,
	) );
	?>

	<div class="home-main container">
		<div class="home-main__content">

			<?php if ( $main_query->have_posts() ) : ?>
				<div class="article-list">
					<?php while ( $main_query->have_posts() ) : $main_query->the_post(); ?>
						<?php get_template_part( 'template-parts/content/content', 'card' ); ?>
					<?php endwhile; ?>
				</div>
				<?php wp_reset_postdata(); ?>

				<?php tribune_pagination(); ?>

			<?php else : ?>
				<?php get_template_part( 'template-parts/content/content', 'none' ); ?>
			<?php endif; ?>
		</div>

		<div class="home-main__sidebar">
			<?php get_sidebar(); ?>
		</div>
	</div>

	<!-- ================================================================
	     SECTION STRIPS
	     ================================================================ -->
	<?php
	$sections = tribune_get_sections( array( 'number' => 4 ) );
	if ( $sections && ! is_wp_error( $sections ) ) :
		foreach ( $sections as $section ) :
			$section_color = get_term_meta( $section->term_id, 'tribune_section_color', true ) ?: 'var(--color-accent)';

			$section_query = new WP_Query( array(
				'posts_per_page' => 3,
				'tax_query'      => array(
					array(
						'taxonomy' => 'section',
						'field'    => 'term_id',
						'terms'    => $section->term_id,
					),
				),
				'ignore_sticky_posts' => true,
			) );

			if ( ! $section_query->have_posts() ) continue;
	?>
	<section class="section-strip" style="--section-color: <?php echo esc_attr( $section_color ); ?>">
		<div class="section-strip__inner container">
			<div class="section-strip__header">
				<h2 class="section-strip__title">
					<a href="<?php echo esc_url( get_term_link( $section ) ); ?>">
						<?php echo esc_html( $section->name ); ?>
					</a>
				</h2>
				<a href="<?php echo esc_url( get_term_link( $section ) ); ?>" class="section-strip__more">
					<?php _e( 'More', 'tribune' ); ?> &rarr;
				</a>
			</div>
			<div class="section-strip__grid">
				<?php while ( $section_query->have_posts() ) : $section_query->the_post(); ?>
					<?php get_template_part( 'template-parts/content/content', 'card' ); ?>
				<?php endwhile; ?>
			</div>
		</div>
	</section>
	<?php
		wp_reset_postdata();
		endforeach;
	endif;
	?>

</main><!-- #primary -->

<?php get_footer(); ?>
