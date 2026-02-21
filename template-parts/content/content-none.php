<?php
/**
 * No results template
 *
 * @package Tribune
 */
?>

<div class="no-results">
	<h2 class="no-results__title"><?php _e( 'Nothing found', 'tribune' ); ?></h2>
	<p class="no-results__desc">
		<?php if ( is_search() ) :
			_e( 'Sorry, no results matched your search terms. Please try again with different keywords.', 'tribune' );
		else :
			_e( 'It looks like nothing was found here. Perhaps try a search?', 'tribune' );
		endif; ?>
	</p>
	<?php get_search_form(); ?>
</div>
