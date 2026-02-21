<?php
/**
 * Single article template
 *
 * @package Tribune
 */

get_header();
?>

<main id="primary" class="site-main single-article">

	<?php while ( have_posts() ) : the_post();
		$post_id    = get_the_ID();
		$subtitle   = tribune_get_subtitle();
		$pull_quote = tribune_get_pull_quote();
		$is_premium = tribune_post_is_premium();
		$has_access = tribune_user_has_access();
	?>

	<!-- ================================================================
	     ARTICLE HEADER
	     ================================================================ -->
	<header class="article-header">
		<div class="article-header__inner container--narrow">

			<!-- Section + Premium badge -->
			<div class="article-header__meta">
				<?php tribune_the_section_label(); ?>
				<?php if ( $is_premium ) : ?>
					<span class="badge badge--premium"><?php _e( 'Subscriber', 'tribune' ); ?></span>
				<?php endif; ?>
			</div>

			<!-- Title -->
			<h1 class="article-header__title"><?php the_title(); ?></h1>

			<!-- Subtitle / deck -->
			<?php if ( $subtitle ) : ?>
				<p class="article-header__subtitle"><?php echo esc_html( $subtitle ); ?></p>
			<?php endif; ?>

			<!-- Byline row -->
			<div class="article-header__byline">
				<div class="article-header__author">
					<?php echo get_avatar( get_the_author_meta( 'ID' ), 40, '', '', array( 'class' => 'article-header__avatar' ) ); ?>
					<div class="article-header__author-info">
						<span class="article-header__author-name"><?php tribune_the_byline(); ?></span>
						<div class="article-header__dateline">
							<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo tribune_formatted_date(); ?></time>
							<span class="article-header__sep">&middot;</span>
							<span class="article-header__read-time"><?php echo tribune_reading_time(); ?></span>
						</div>
					</div>
				</div>

				<!-- Share buttons -->
				<div class="article-header__share">
					<button class="share-btn share-btn--twitter" data-url="<?php the_permalink(); ?>" data-title="<?php echo esc_attr( get_the_title() ); ?>" aria-label="<?php esc_attr_e( 'Share on Twitter', 'tribune' ); ?>">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
						<span class="screen-reader-text"><?php _e( 'Share on Twitter', 'tribune' ); ?></span>
					</button>
					<button class="share-btn share-btn--copy" data-url="<?php the_permalink(); ?>" aria-label="<?php esc_attr_e( 'Copy link', 'tribune' ); ?>">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
						<span class="screen-reader-text"><?php _e( 'Copy link', 'tribune' ); ?></span>
					</button>
				</div>
			</div>
		</div>
	</header>

	<!-- ================================================================
	     HERO IMAGE (1920×1080)
	     ================================================================ -->
	<?php if ( has_post_thumbnail() ) : ?>
	<div class="article-hero">
		<?php echo tribune_get_hero_image(); ?>
		<?php
		$caption = get_the_post_thumbnail_caption();
		if ( $caption ) :
		?>
			<p class="article-hero__caption container--narrow"><?php echo wp_kses_post( $caption ); ?></p>
		<?php endif; ?>
	</div>
	<?php endif; ?>

	<!-- ================================================================
	     ARTICLE BODY
	     ================================================================ -->
	<div class="article-body-wrap container--narrow">
		<div class="article-body-inner">

			<!-- Pull quote — shown before body on mobile, floated right on desktop -->
			<?php if ( ! empty( $pull_quote['text'] ) ) : ?>
				<?php tribune_the_pull_quote(); ?>
			<?php endif; ?>

			<!-- The content -->
			<div class="article-content entry-content">
				<?php the_content(); ?>
			</div>

			<!-- Keywords / Tags -->
			<?php tribune_the_tags(); ?>

		</div><!-- .article-body-inner -->
	</div><!-- .article-body-wrap -->

	<!-- ================================================================
	     PERMISSION WALL (rendered by JS if needed; PHP fallback here)
	     ================================================================ -->
	<?php if ( ! $has_access ) : ?>
		<?php get_template_part( 'template-parts/paywall/email-gate' ); ?>
	<?php endif; ?>

	<!-- ================================================================
	     ARTICLE FOOTER
	     ================================================================ -->
	<div class="article-footer container--narrow">

		<!-- Author box -->
		<?php tribune_author_box(); ?>

		<!-- Comments -->
		<?php if ( comments_open() || get_comments_number() ) : ?>
			<div class="article-comments">
				<?php comments_template(); ?>
			</div>
		<?php endif; ?>

	</div>

	<!-- ================================================================
	     RELATED ARTICLES
	     ================================================================ -->
	<div class="container">
		<?php tribune_related_articles(); ?>
	</div>

	<?php endwhile; ?>

</main><!-- #primary -->

<?php get_footer(); ?>
