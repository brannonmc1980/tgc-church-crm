<?php
/**
 * Main index / blog template fallback
 *
 * @package Tribune
 */

get_header();
?>

<main id="primary" class="site-main index-page">

	<?php if ( is_home() && ! is_front_page() ) : ?>
		<header class="page-header container">
			<h1 class="page-header__title"><?php single_post_title(); ?></h1>
		</header>
	<?php endif; ?>

	<div class="index-main container">
		<div class="index-main__content">
			<?php if ( have_posts() ) : ?>
				<div class="article-list">
					<?php while ( have_posts() ) : the_post(); ?>
						<?php get_template_part( 'template-parts/content/content', 'card' ); ?>
					<?php endwhile; ?>
				</div>
				<?php tribune_pagination(); ?>
			<?php else : ?>
				<?php get_template_part( 'template-parts/content/content', 'none' ); ?>
			<?php endif; ?>
		</div>

		<div class="index-main__sidebar">
			<?php get_sidebar(); ?>
		</div>
	</div>

</main>

<?php get_footer(); ?>
