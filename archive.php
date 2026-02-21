<?php
/**
 * Archive template (date, author, tag archives)
 *
 * @package Tribune
 */

get_header();
?>

<main id="primary" class="site-main archive-page">

	<header class="archive-header container">
		<div class="archive-header__inner">
			<?php the_archive_title( '<h1 class="archive-header__title">', '</h1>' ); ?>
			<?php the_archive_description( '<p class="archive-header__description">', '</p>' ); ?>
		</div>
	</header>

	<div class="archive-main container">
		<div class="archive-main__content">
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

		<div class="archive-main__sidebar">
			<?php get_sidebar(); ?>
		</div>
	</div>

</main>

<?php get_footer(); ?>
