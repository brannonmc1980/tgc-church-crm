<?php
/**
 * Template helper functions for Tribune theme
 *
 * @package Tribune
 */

// -------------------------------------------------------------------------
// BYLINE
// -------------------------------------------------------------------------
function tribune_get_byline( $post_id = null ) {
	$post_id = $post_id ?: get_the_ID();
	$custom_byline = get_post_meta( $post_id, '_tribune_byline', true );
	if ( $custom_byline ) {
		return esc_html( $custom_byline );
	}
	return esc_html( get_the_author_meta( 'display_name', get_post_field( 'post_author', $post_id ) ) );
}

function tribune_the_byline( $post_id = null ) {
	echo tribune_get_byline( $post_id );
}

// -------------------------------------------------------------------------
// SECTION LABEL
// -------------------------------------------------------------------------
function tribune_get_section( $post_id = null ) {
	$post_id = $post_id ?: get_the_ID();
	$sections = get_the_terms( $post_id, 'section' );
	if ( $sections && ! is_wp_error( $sections ) ) {
		return $sections[0];
	}
	return null;
}

function tribune_get_section_label( $post_id = null ) {
	$section = tribune_get_section( $post_id );
	if ( ! $section ) return '';

	$color = get_term_meta( $section->term_id, 'tribune_section_color', true ) ?: '#C41E3A';
	$url   = get_term_link( $section );

	return sprintf(
		'<a href="%s" class="section-label" style="--section-color: %s">%s</a>',
		esc_url( $url ),
		esc_attr( $color ),
		esc_html( $section->name )
	);
}

function tribune_the_section_label( $post_id = null ) {
	echo tribune_get_section_label( $post_id );
}

// -------------------------------------------------------------------------
// SUBTITLE
// -------------------------------------------------------------------------
function tribune_get_subtitle( $post_id = null ) {
	$post_id = $post_id ?: get_the_ID();
	return get_post_meta( $post_id, '_tribune_subtitle', true );
}

function tribune_the_subtitle( $post_id = null ) {
	$subtitle = tribune_get_subtitle( $post_id );
	if ( $subtitle ) {
		echo '<p class="article-subtitle">' . esc_html( $subtitle ) . '</p>';
	}
}

// -------------------------------------------------------------------------
// PULL QUOTE
// -------------------------------------------------------------------------
function tribune_get_pull_quote( $post_id = null ) {
	$post_id = $post_id ?: get_the_ID();
	return array(
		'text' => get_post_meta( $post_id, '_tribune_pull_quote', true ),
		'attr' => get_post_meta( $post_id, '_tribune_pull_quote_attr', true ),
	);
}

function tribune_the_pull_quote( $post_id = null ) {
	$pq = tribune_get_pull_quote( $post_id );
	if ( empty( $pq['text'] ) ) return;
	?>
	<blockquote class="pull-quote">
		<p class="pull-quote__text"><?php echo esc_html( $pq['text'] ); ?></p>
		<?php if ( $pq['attr'] ) : ?>
			<cite class="pull-quote__attr"><?php echo esc_html( $pq['attr'] ); ?></cite>
		<?php endif; ?>
	</blockquote>
	<?php
}

// -------------------------------------------------------------------------
// KEYWORDS / META
// -------------------------------------------------------------------------
function tribune_get_keywords( $post_id = null ) {
	$post_id  = $post_id ?: get_the_ID();
	$keywords = get_post_meta( $post_id, '_tribune_keywords', true );
	if ( $keywords ) {
		return array_map( 'trim', explode( ',', $keywords ) );
	}
	// Fall back to post tags
	$tags = get_the_tags( $post_id );
	if ( $tags && ! is_wp_error( $tags ) ) {
		return wp_list_pluck( $tags, 'name' );
	}
	return array();
}

// -------------------------------------------------------------------------
// FEATURED IMAGE HTML
// -------------------------------------------------------------------------
function tribune_get_hero_image( $post_id = null, $extra_class = '' ) {
	$post_id = $post_id ?: get_the_ID();
	if ( ! has_post_thumbnail( $post_id ) ) return '';

	return get_the_post_thumbnail( $post_id, 'tribune-hero', array(
		'class'   => 'hero-image__img ' . $extra_class,
		'loading' => 'eager',
		'alt'     => esc_attr( get_the_title( $post_id ) ),
	) );
}

function tribune_get_card_image( $post_id = null ) {
	$post_id = $post_id ?: get_the_ID();
	if ( ! has_post_thumbnail( $post_id ) ) return '';

	return get_the_post_thumbnail( $post_id, 'tribune-card', array(
		'class'   => 'article-card__img',
		'loading' => 'lazy',
		'alt'     => esc_attr( get_the_title( $post_id ) ),
	) );
}

// -------------------------------------------------------------------------
// PREMIUM BADGE
// -------------------------------------------------------------------------
function tribune_premium_badge( $post_id = null ) {
	if ( tribune_post_is_premium( $post_id ) ) {
		echo '<span class="badge badge--premium">' . __( 'Subscriber', 'tribune' ) . '</span>';
	}
}

// -------------------------------------------------------------------------
// AUTHOR BOX (below article)
// -------------------------------------------------------------------------
function tribune_author_box( $post_id = null ) {
	$post_id    = $post_id ?: get_the_ID();
	$author_id  = get_post_field( 'post_author', $post_id );
	$byline     = tribune_get_byline( $post_id );
	$bio        = get_post_meta( $post_id, '_tribune_author_bio', true )
					?: get_the_author_meta( 'description', $author_id );
	$author_url = get_post_meta( $post_id, '_tribune_author_url', true )
					?: get_the_author_meta( 'user_url', $author_id );
	$twitter    = get_post_meta( $post_id, '_tribune_author_twitter', true );
	?>
	<div class="author-box">
		<div class="author-box__avatar">
			<?php echo get_avatar( $author_id, 80, '', $byline, array( 'class' => 'author-box__avatar-img' ) ); ?>
		</div>
		<div class="author-box__content">
			<div class="author-box__meta">
				<span class="author-box__label"><?php _e( 'Written by', 'tribune' ); ?></span>
				<?php if ( $author_url ) : ?>
					<a href="<?php echo esc_url( $author_url ); ?>" class="author-box__name"><?php echo $byline; ?></a>
				<?php else : ?>
					<span class="author-box__name"><?php echo $byline; ?></span>
				<?php endif; ?>
				<?php if ( $twitter ) : ?>
					<a href="https://twitter.com/<?php echo esc_attr( ltrim( $twitter, '@' ) ); ?>" class="author-box__twitter" target="_blank" rel="noopener"><?php echo esc_html( $twitter ); ?></a>
				<?php endif; ?>
			</div>
			<?php if ( $bio ) : ?>
				<p class="author-box__bio"><?php echo esc_html( $bio ); ?></p>
			<?php endif; ?>
		</div>
	</div>
	<?php
}

// -------------------------------------------------------------------------
// RELATED ARTICLES
// -------------------------------------------------------------------------
function tribune_related_articles( $post_id = null, $count = 3 ) {
	$post_id  = $post_id ?: get_the_ID();
	$section  = tribune_get_section( $post_id );

	$args = array(
		'post_type'           => 'post',
		'posts_per_page'      => $count,
		'post__not_in'        => array( $post_id ),
		'ignore_sticky_posts' => true,
	);

	if ( $section ) {
		$args['tax_query'] = array(
			array(
				'taxonomy' => 'section',
				'field'    => 'term_id',
				'terms'    => $section->term_id,
			),
		);
	}

	$related = new WP_Query( $args );

	if ( ! $related->have_posts() ) return;
	?>
	<section class="related-articles">
		<h3 class="related-articles__heading"><?php _e( 'More to Read', 'tribune' ); ?></h3>
		<div class="related-articles__grid">
			<?php while ( $related->have_posts() ) : $related->the_post(); ?>
				<?php get_template_part( 'template-parts/content/content', 'card' ); ?>
			<?php endwhile; ?>
		</div>
	</section>
	<?php
	wp_reset_postdata();
}

// -------------------------------------------------------------------------
// SECTION NAV (list of all sections for nav bar)
// -------------------------------------------------------------------------
function tribune_get_sections( $args = array() ) {
	$defaults = array(
		'taxonomy'   => 'section',
		'hide_empty' => true,
		'orderby'    => 'name',
		'order'      => 'ASC',
	);
	return get_terms( wp_parse_args( $args, $defaults ) );
}

// -------------------------------------------------------------------------
// NEWSLETTER SIGNUP WIDGET (inline)
// -------------------------------------------------------------------------
function tribune_newsletter_form( $context = 'sidebar' ) {
	$nonce = wp_create_nonce( 'tribune_newsletter' );
	?>
	<div class="newsletter-box newsletter-box--<?php echo esc_attr( $context ); ?>">
		<?php if ( $context === 'footer' ) : ?>
			<h3 class="newsletter-box__title"><?php _e( 'Stay Informed', 'tribune' ); ?></h3>
			<p class="newsletter-box__desc"><?php _e( 'Get our best stories delivered to your inbox every morning.', 'tribune' ); ?></p>
		<?php else : ?>
			<h3 class="newsletter-box__title"><?php _e( 'Daily Newsletter', 'tribune' ); ?></h3>
			<p class="newsletter-box__desc"><?php _e( 'The day\'s most important stories, curated for you.', 'tribune' ); ?></p>
		<?php endif; ?>
		<form class="newsletter-form" data-nonce="<?php echo esc_attr( $nonce ); ?>">
			<div class="newsletter-form__row">
				<input type="email" name="email" class="newsletter-form__input"
					placeholder="<?php esc_attr_e( 'Your email address', 'tribune' ); ?>" required>
				<button type="submit" class="newsletter-form__btn btn btn--accent">
					<?php _e( 'Subscribe', 'tribune' ); ?>
				</button>
			</div>
			<p class="newsletter-form__legal">
				<?php _e( 'Free to subscribe. Unsubscribe anytime.', 'tribune' ); ?>
			</p>
			<div class="newsletter-form__message" hidden></div>
		</form>
	</div>
	<?php
}

// -------------------------------------------------------------------------
// FORMAT DATE
// -------------------------------------------------------------------------
function tribune_formatted_date( $post_id = null ) {
	$post_id = $post_id ?: get_the_ID();
	return get_the_date( 'F j, Y', $post_id );
}

// -------------------------------------------------------------------------
// KEYWORDS META TAG (output in head)
// -------------------------------------------------------------------------
function tribune_meta_keywords() {
	if ( ! is_singular( 'post' ) ) return;
	$keywords = tribune_get_keywords();
	if ( empty( $keywords ) ) return;
	echo '<meta name="keywords" content="' . esc_attr( implode( ', ', $keywords ) ) . '">' . "\n";
}
add_action( 'wp_head', 'tribune_meta_keywords' );

// -------------------------------------------------------------------------
// ARTICLE TAGS DISPLAY
// -------------------------------------------------------------------------
function tribune_the_tags( $post_id = null ) {
	$post_id  = $post_id ?: get_the_ID();
	$keywords = tribune_get_keywords( $post_id );
	if ( empty( $keywords ) ) return;
	echo '<div class="article-tags">';
	foreach ( $keywords as $kw ) {
		$url = home_url( '/tag/' . sanitize_title( $kw ) );
		echo '<a href="' . esc_url( $url ) . '" class="tag">' . esc_html( $kw ) . '</a>';
	}
	echo '</div>';
}
