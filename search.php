<?php
/**
 * Search results template
 *
 * @package Tribune
 */

get_header();
?>

<main id="primary" class="site-main search-results">

	<header class="search-header container">
		<h1 class="search-header__title">
			<?php printf(
				/* translators: %s = search query */
				__( 'Search results for: <span>%s</span>', 'tribune' ),
				'<em>' . esc_html( get_search_query() ) . '</em>'
			); ?>
		</h1>
		<?php if ( have_posts() ) : ?>
			<p class="search-header__count">
				<?php printf(
					/* translators: %d = number of results */
					_n( 'Found %d result.', 'Found %d results.', $wp_query->found_posts, 'tribune' ),
					$wp_query->found_posts
				); ?>
			</p>
		<?php endif; ?>
		<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="search-header__form">
			<input type="search" class="search-header__input" placeholder="<?php esc_attr_e( 'Refine your search&hellip;', 'tribune' ); ?>"
				value="<?php echo get_search_query(); ?>" name="s">
			<button type="submit" class="btn btn--primary"><?php _e( 'Search', 'tribune' ); ?></button>
		</form>
	</header>

	<div class="search-main container">
		<div class="search-main__content">
			<?php if ( have_posts() ) : ?>
				<div class="article-list">
					<?php while ( have_posts() ) : the_post(); ?>
						<?php get_template_part( 'template-parts/content/content', 'card' ); ?>
					<?php endwhile; ?>
				</div>
				<?php tribune_pagination(); ?>
			<?php else : ?>
				<div class="no-results">
					<h2><?php _e( 'Nothing found', 'tribune' ); ?></h2>
					<p><?php _e( 'Sorry, no articles matched your search. Try different keywords.', 'tribune' ); ?></p>
				</div>
			<?php endif; ?>
		</div>

		<div class="search-main__sidebar">
			<?php get_sidebar(); ?>
		</div>
	</div>

</main>

<?php get_footer(); ?>
