<?php
/**
 * Static page template
 *
 * @package Tribune
 */

get_header();
?>

<main id="primary" class="site-main page-view">
	<?php while ( have_posts() ) : the_post(); ?>

	<article id="post-<?php the_ID(); ?>" <?php post_class( 'page-article' ); ?>>

		<?php if ( has_post_thumbnail() ) : ?>
		<div class="page-hero">
			<?php the_post_thumbnail( 'tribune-hero', array( 'class' => 'page-hero__img' ) ); ?>
		</div>
		<?php endif; ?>

		<div class="page-inner container--narrow">
			<header class="page-header">
				<h1 class="page-header__title"><?php the_title(); ?></h1>
			</header>

			<div class="page-content entry-content">
				<?php the_content(); ?>
			</div>

			<?php
			wp_link_pages( array(
				'before' => '<nav class="page-links" aria-label="' . __( 'Page', 'tribune' ) . '">',
				'after'  => '</nav>',
			) );
			?>
		</div>

	</article>

	<?php endwhile; ?>
</main>

<?php get_footer(); ?>
