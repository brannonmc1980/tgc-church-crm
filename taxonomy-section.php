<?php
/**
 * Section taxonomy archive template
 *
 * @package Tribune
 */

get_header();

$section       = get_queried_object();
$section_color = get_term_meta( $section->term_id, 'tribune_section_color', true ) ?: 'var(--color-accent)';
$section_icon  = get_term_meta( $section->term_id, 'tribune_section_icon', true );
?>

<main id="primary" class="site-main section-archive" style="--section-color: <?php echo esc_attr( $section_color ); ?>">

	<!-- ================================================================
	     SECTION HEADER
	     ================================================================ -->
	<header class="section-archive-header">
		<div class="section-archive-header__inner container">
			<?php if ( $section_icon ) : ?>
				<span class="section-archive-header__icon"><?php echo esc_html( $section_icon ); ?></span>
			<?php endif; ?>
			<div class="section-archive-header__text">
				<div class="section-archive-header__label"><?php _e( 'Section', 'tribune' ); ?></div>
				<h1 class="section-archive-header__title"><?php echo esc_html( $section->name ); ?></h1>
				<?php if ( $section->description ) : ?>
					<p class="section-archive-header__desc"><?php echo wp_kses_post( $section->description ); ?></p>
				<?php endif; ?>
				<p class="section-archive-header__count">
					<?php printf(
						_n( '%d article', '%d articles', $section->count, 'tribune' ),
						$section->count
					); ?>
				</p>
			</div>
		</div>
	</header>

	<!-- ================================================================
	     FEATURED ARTICLE IN THIS SECTION
	     ================================================================ -->
	<?php if ( have_posts() ) : ?>
	<?php
	// Show first post as a larger card
	the_post();
	?>
	<section class="section-hero container">
		<article class="section-hero__article">
			<?php if ( has_post_thumbnail() ) : ?>
				<a href="<?php the_permalink(); ?>" class="section-hero__image-link">
					<?php the_post_thumbnail( 'tribune-card', array( 'class' => 'section-hero__img' ) ); ?>
				</a>
			<?php endif; ?>
			<div class="section-hero__body">
				<div class="section-hero__meta">
					<?php tribune_premium_badge(); ?>
				</div>
				<h2 class="section-hero__title">
					<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
				</h2>
				<?php $sub = tribune_get_subtitle(); ?>
				<?php if ( $sub ) : ?>
					<p class="section-hero__subtitle"><?php echo esc_html( $sub ); ?></p>
				<?php else : ?>
					<p class="section-hero__subtitle"><?php echo esc_html( get_the_excerpt() ); ?></p>
				<?php endif; ?>
				<div class="section-hero__byline">
					<span><?php _e( 'By', 'tribune' ); ?> <?php tribune_the_byline(); ?></span>
					<span class="sep">&middot;</span>
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo tribune_formatted_date(); ?></time>
					<span class="sep">&middot;</span>
					<span><?php echo tribune_reading_time(); ?></span>
				</div>
			</div>
		</article>
	</section>

	<!-- ================================================================
	     ARTICLE GRID
	     ================================================================ -->
	<div class="section-main container">
		<div class="section-main__content">
			<div class="article-list">
				<?php while ( have_posts() ) : the_post(); ?>
					<?php get_template_part( 'template-parts/content/content', 'card' ); ?>
				<?php endwhile; ?>
			</div>

			<?php tribune_pagination(); ?>
		</div>

		<div class="section-main__sidebar">
			<?php get_sidebar(); ?>
		</div>
	</div>

	<?php else : ?>
		<?php get_template_part( 'template-parts/content/content', 'none' ); ?>
	<?php endif; ?>

</main>

<?php get_footer(); ?>
