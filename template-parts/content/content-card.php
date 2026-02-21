<?php
/**
 * Article card — used in lists, grids, and section strips
 *
 * @package Tribune
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( 'article-card' ); ?>>

	<?php if ( has_post_thumbnail() ) : ?>
		<a href="<?php the_permalink(); ?>" class="article-card__image-link" tabindex="-1" aria-hidden="true">
			<?php echo tribune_get_card_image(); ?>
		</a>
	<?php endif; ?>

	<div class="article-card__body">

		<div class="article-card__meta">
			<?php tribune_the_section_label(); ?>
			<?php tribune_premium_badge(); ?>
		</div>

		<h2 class="article-card__title">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h2>

		<?php $subtitle = tribune_get_subtitle(); ?>
		<?php if ( $subtitle ) : ?>
			<p class="article-card__subtitle"><?php echo esc_html( $subtitle ); ?></p>
		<?php elseif ( has_excerpt() ) : ?>
			<p class="article-card__excerpt"><?php the_excerpt(); ?></p>
		<?php endif; ?>

		<div class="article-card__byline">
			<span class="article-card__author"><?php tribune_the_byline(); ?></span>
			<span class="article-card__sep">&middot;</span>
			<time class="article-card__date" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
				<?php echo tribune_formatted_date(); ?>
			</time>
			<span class="article-card__sep">&middot;</span>
			<span class="article-card__read-time"><?php echo tribune_reading_time(); ?></span>
		</div>

	</div><!-- .article-card__body -->

</article>
