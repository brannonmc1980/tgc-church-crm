<?php
/**
 * Custom meta boxes for Tribune theme
 *
 * @package Tribune
 */

// -------------------------------------------------------------------------
// ARTICLE META BOX
// -------------------------------------------------------------------------
function tribune_register_meta_boxes() {
	add_meta_box(
		'tribune_article_meta',
		__( 'Article Details', 'tribune' ),
		'tribune_article_meta_callback',
		'post',
		'normal',
		'high'
	);

	add_meta_box(
		'tribune_author_meta',
		__( 'Article Author', 'tribune' ),
		'tribune_author_meta_callback',
		'post',
		'side',
		'default'
	);
}
add_action( 'add_meta_boxes', 'tribune_register_meta_boxes' );

// -------------------------------------------------------------------------
// ARTICLE META CALLBACK
// -------------------------------------------------------------------------
function tribune_article_meta_callback( $post ) {
	wp_nonce_field( 'tribune_article_meta_save', 'tribune_article_nonce' );

	$subtitle   = get_post_meta( $post->ID, '_tribune_subtitle', true );
	$pull_quote = get_post_meta( $post->ID, '_tribune_pull_quote', true );
	$pull_attr  = get_post_meta( $post->ID, '_tribune_pull_quote_attr', true );
	$keywords   = get_post_meta( $post->ID, '_tribune_keywords', true );
	$premium    = get_post_meta( $post->ID, '_tribune_premium', true );
	$featured   = get_post_meta( $post->ID, '_tribune_featured', true );
	?>
	<table class="form-table">
		<tr>
			<th><label for="tribune_subtitle"><?php _e( 'Subtitle / Deck', 'tribune' ); ?></label></th>
			<td>
				<input type="text" id="tribune_subtitle" name="tribune_subtitle"
					value="<?php echo esc_attr( $subtitle ); ?>"
					class="large-text"
					placeholder="<?php esc_attr_e( 'A short explanatory subtitle displayed below the headline', 'tribune' ); ?>">
				<p class="description"><?php _e( 'Appears below the article title in the header. Limit to ~120 characters.', 'tribune' ); ?></p>
			</td>
		</tr>
		<tr>
			<th><label for="tribune_pull_quote"><?php _e( 'Pull Quote', 'tribune' ); ?></label></th>
			<td>
				<textarea id="tribune_pull_quote" name="tribune_pull_quote" rows="3" class="large-text"
					placeholder="<?php esc_attr_e( 'A compelling quote from the article to display prominently', 'tribune' ); ?>"><?php echo esc_textarea( $pull_quote ); ?></textarea>
				<p class="description"><?php _e( 'Displayed as a styled pull quote within the article body.', 'tribune' ); ?></p>
			</td>
		</tr>
		<tr>
			<th><label for="tribune_pull_quote_attr"><?php _e( 'Pull Quote Attribution', 'tribune' ); ?></label></th>
			<td>
				<input type="text" id="tribune_pull_quote_attr" name="tribune_pull_quote_attr"
					value="<?php echo esc_attr( $pull_attr ); ?>"
					class="regular-text"
					placeholder="<?php esc_attr_e( 'e.g. John Smith, Secretary of State', 'tribune' ); ?>">
			</td>
		</tr>
		<tr>
			<th><label for="tribune_keywords"><?php _e( 'Keywords / SEO Tags', 'tribune' ); ?></label></th>
			<td>
				<input type="text" id="tribune_keywords" name="tribune_keywords"
					value="<?php echo esc_attr( $keywords ); ?>"
					class="large-text"
					placeholder="<?php esc_attr_e( 'keyword1, keyword2, keyword3', 'tribune' ); ?>">
				<p class="description"><?php _e( 'Comma-separated keywords used in meta tags and article indexing.', 'tribune' ); ?></p>
			</td>
		</tr>
		<tr>
			<th><?php _e( 'Article Flags', 'tribune' ); ?></th>
			<td>
				<label>
					<input type="checkbox" name="tribune_premium" value="1" <?php checked( $premium, '1' ); ?>>
					<?php _e( 'Premium / Subscriber-only content (always requires login)', 'tribune' ); ?>
				</label>
				<br><br>
				<label>
					<input type="checkbox" name="tribune_featured" value="1" <?php checked( $featured, '1' ); ?>>
					<?php _e( 'Featured article (appears in homepage hero)', 'tribune' ); ?>
				</label>
			</td>
		</tr>
	</table>
	<?php
}

// -------------------------------------------------------------------------
// AUTHOR META CALLBACK
// -------------------------------------------------------------------------
function tribune_author_meta_callback( $post ) {
	wp_nonce_field( 'tribune_author_meta_save', 'tribune_author_nonce' );

	$byline      = get_post_meta( $post->ID, '_tribune_byline', true );
	$author_bio  = get_post_meta( $post->ID, '_tribune_author_bio', true );
	$author_url  = get_post_meta( $post->ID, '_tribune_author_url', true );
	$author_twitter = get_post_meta( $post->ID, '_tribune_author_twitter', true );
	?>
	<p>
		<label for="tribune_byline"><?php _e( 'Custom Byline', 'tribune' ); ?></label><br>
		<input type="text" id="tribune_byline" name="tribune_byline"
			value="<?php echo esc_attr( $byline ); ?>"
			class="widefat"
			placeholder="<?php esc_attr_e( 'Overrides WordPress author name', 'tribune' ); ?>">
	</p>
	<p class="description"><?php _e( 'Leave blank to use the post author\'s display name.', 'tribune' ); ?></p>

	<p>
		<label for="tribune_author_bio"><?php _e( 'Author Bio (for this article)', 'tribune' ); ?></label><br>
		<textarea id="tribune_author_bio" name="tribune_author_bio" rows="3" class="widefat"
			placeholder="<?php esc_attr_e( 'Short bio shown in the author box below the article', 'tribune' ); ?>"><?php echo esc_textarea( $author_bio ); ?></textarea>
	</p>

	<p>
		<label for="tribune_author_url"><?php _e( 'Author URL', 'tribune' ); ?></label><br>
		<input type="url" id="tribune_author_url" name="tribune_author_url"
			value="<?php echo esc_url( $author_url ); ?>"
			class="widefat"
			placeholder="https://">
	</p>

	<p>
		<label for="tribune_author_twitter"><?php _e( 'Twitter Handle', 'tribune' ); ?></label><br>
		<input type="text" id="tribune_author_twitter" name="tribune_author_twitter"
			value="<?php echo esc_attr( $author_twitter ); ?>"
			class="widefat"
			placeholder="@username">
	</p>
	<?php
}

// -------------------------------------------------------------------------
// SAVE META BOXES
// -------------------------------------------------------------------------
function tribune_save_meta_boxes( $post_id ) {
	// Article meta
	if ( isset( $_POST['tribune_article_nonce'] ) &&
		wp_verify_nonce( $_POST['tribune_article_nonce'], 'tribune_article_meta_save' ) ) {

		if ( ! current_user_can( 'edit_post', $post_id ) ) return;

		$fields = array(
			'_tribune_subtitle'        => 'tribune_subtitle',
			'_tribune_pull_quote'      => 'tribune_pull_quote',
			'_tribune_pull_quote_attr' => 'tribune_pull_quote_attr',
			'_tribune_keywords'        => 'tribune_keywords',
		);

		foreach ( $fields as $meta_key => $field_name ) {
			if ( isset( $_POST[ $field_name ] ) ) {
				update_post_meta( $post_id, $meta_key, sanitize_textarea_field( $_POST[ $field_name ] ) );
			}
		}

		// Checkboxes
		$premium = isset( $_POST['tribune_premium'] ) ? '1' : '0';
		update_post_meta( $post_id, '_tribune_premium', $premium );

		$featured = isset( $_POST['tribune_featured'] ) ? '1' : '0';
		update_post_meta( $post_id, '_tribune_featured', $featured );
	}

	// Author meta
	if ( isset( $_POST['tribune_author_nonce'] ) &&
		wp_verify_nonce( $_POST['tribune_author_nonce'], 'tribune_author_meta_save' ) ) {

		if ( ! current_user_can( 'edit_post', $post_id ) ) return;

		$author_fields = array(
			'_tribune_byline'          => 'tribune_byline',
			'_tribune_author_bio'      => 'tribune_author_bio',
			'_tribune_author_twitter'  => 'tribune_author_twitter',
		);

		foreach ( $author_fields as $meta_key => $field_name ) {
			if ( isset( $_POST[ $field_name ] ) ) {
				update_post_meta( $post_id, $meta_key, sanitize_text_field( $_POST[ $field_name ] ) );
			}
		}

		if ( isset( $_POST['tribune_author_url'] ) ) {
			update_post_meta( $post_id, '_tribune_author_url', esc_url_raw( $_POST['tribune_author_url'] ) );
		}
	}
}
add_action( 'save_post', 'tribune_save_meta_boxes' );

// -------------------------------------------------------------------------
// SECTION META BOX (description, color accent for section pages)
// -------------------------------------------------------------------------
function tribune_register_section_meta() {
	add_action( 'section_add_form_fields', 'tribune_section_add_fields' );
	add_action( 'section_edit_form_fields', 'tribune_section_edit_fields' );
	add_action( 'edited_section', 'tribune_save_section_meta' );
	add_action( 'create_section', 'tribune_save_section_meta' );
}
add_action( 'init', 'tribune_register_section_meta' );

function tribune_section_add_fields() {
	wp_nonce_field( 'tribune_section_meta_save', 'tribune_section_nonce' );
	?>
	<div class="form-field">
		<label for="tribune_section_color"><?php _e( 'Section Accent Color', 'tribune' ); ?></label>
		<input type="color" name="tribune_section_color" id="tribune_section_color" value="#C41E3A">
		<p><?php _e( 'Accent color used for section labels and borders.', 'tribune' ); ?></p>
	</div>
	<div class="form-field">
		<label for="tribune_section_icon"><?php _e( 'Section Icon (emoji or shortcode)', 'tribune' ); ?></label>
		<input type="text" name="tribune_section_icon" id="tribune_section_icon" value="">
		<p><?php _e( 'Optional. e.g. &#128227; for news.', 'tribune' ); ?></p>
	</div>
	<?php
}

function tribune_section_edit_fields( $term ) {
	$color = get_term_meta( $term->term_id, 'tribune_section_color', true ) ?: '#C41E3A';
	$icon  = get_term_meta( $term->term_id, 'tribune_section_icon', true );
	wp_nonce_field( 'tribune_section_meta_save', 'tribune_section_nonce' );
	?>
	<tr class="form-field">
		<th><label for="tribune_section_color"><?php _e( 'Section Accent Color', 'tribune' ); ?></label></th>
		<td>
			<input type="color" name="tribune_section_color" id="tribune_section_color" value="<?php echo esc_attr( $color ); ?>">
			<p class="description"><?php _e( 'Accent color used for section labels and borders.', 'tribune' ); ?></p>
		</td>
	</tr>
	<tr class="form-field">
		<th><label for="tribune_section_icon"><?php _e( 'Section Icon', 'tribune' ); ?></label></th>
		<td>
			<input type="text" name="tribune_section_icon" id="tribune_section_icon" value="<?php echo esc_attr( $icon ); ?>">
		</td>
	</tr>
	<?php
}

function tribune_save_section_meta( $term_id ) {
	if ( ! isset( $_POST['tribune_section_nonce'] ) ||
		! wp_verify_nonce( $_POST['tribune_section_nonce'], 'tribune_section_meta_save' ) ) {
		return;
	}

	if ( isset( $_POST['tribune_section_color'] ) ) {
		update_term_meta( $term_id, 'tribune_section_color', sanitize_hex_color( $_POST['tribune_section_color'] ) );
	}
	if ( isset( $_POST['tribune_section_icon'] ) ) {
		update_term_meta( $term_id, 'tribune_section_icon', sanitize_text_field( $_POST['tribune_section_icon'] ) );
	}
}
