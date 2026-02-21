<?php
/**
 * Comments template
 *
 * @package Tribune
 */

if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-area">

	<?php if ( have_comments() ) : ?>
		<h3 class="comments-area__title">
			<?php
			$count = get_comments_number();
			printf(
				/* translators: %d = number of comments */
				_n( '%d Response', '%d Responses', $count, 'tribune' ),
				$count
			);
			?>
		</h3>

		<ol class="comment-list">
			<?php
			wp_list_comments( array(
				'style'       => 'ol',
				'short_ping'  => true,
				'avatar_size' => 48,
				'callback'    => 'tribune_comment_callback',
			) );
			?>
		</ol>

		<?php the_comments_pagination( array(
			'prev_text' => '&larr; ' . __( 'Older', 'tribune' ),
			'next_text' => __( 'Newer', 'tribune' ) . ' &rarr;',
		) ); ?>

	<?php endif; ?>

	<?php
	comment_form( array(
		'title_reply'        => __( 'Leave a reply', 'tribune' ),
		'title_reply_to'     => __( 'Leave a reply to %s', 'tribune' ),
		'cancel_reply_link'  => __( 'Cancel reply', 'tribune' ),
		'label_submit'       => __( 'Post Comment', 'tribune' ),
		'class_submit'       => 'btn btn--primary',
		'comment_notes_before' => '',
		'fields'             => array(
			'author' => '<div class="form-row"><div class="form-group"><label for="author">' . __( 'Name', 'tribune' ) . ' <span class="required">*</span></label><input id="author" name="author" type="text" class="form-control" required></div>',
			'email'  => '<div class="form-group"><label for="email">' . __( 'Email', 'tribune' ) . ' <span class="required">*</span></label><input id="email" name="email" type="email" class="form-control" required></div></div>',
			'url'    => '',
			'cookies' => '<p class="form-group"><label class="checkbox-label"><input id="wp-comment-cookies-consent" name="wp-comment-cookies-consent" type="checkbox" value="yes"> ' . __( 'Save my name and email for future comments.', 'tribune' ) . '</label></p>',
		),
		'comment_field'      => '<div class="form-group"><label for="comment">' . __( 'Comment', 'tribune' ) . '</label><textarea id="comment" name="comment" class="form-control" rows="6" required></textarea></div>',
	) );
	?>

</div><!-- #comments -->

<?php
/**
 * Custom comment callback
 */
function tribune_comment_callback( $comment, $args, $depth ) {
	?>
	<li id="comment-<?php comment_ID(); ?>" <?php comment_class( 'comment-item' ); ?>>
		<article class="comment-body">
			<header class="comment-header">
				<div class="comment-avatar">
					<?php echo get_avatar( $comment, 48, '', '', array( 'class' => 'comment-avatar__img' ) ); ?>
				</div>
				<div class="comment-meta">
					<span class="comment-author"><?php comment_author(); ?></span>
					<time class="comment-time" datetime="<?php comment_date( 'c' ); ?>">
						<?php comment_date( 'F j, Y' ); ?>
					</time>
					<?php comment_reply_link( array_merge( $args, array(
						'add_below' => 'comment',
						'depth'     => $depth,
						'max_depth' => $args['max_depth'],
						'before'    => '<span class="comment-reply">',
						'after'     => '</span>',
					) ) ); ?>
					<?php edit_comment_link( __( 'Edit', 'tribune' ), '<span class="comment-edit">', '</span>' ); ?>
				</div>
			</header>

			<?php if ( '0' === $comment->comment_approved ) : ?>
				<p class="comment-awaiting"><em><?php _e( 'Your comment is awaiting moderation.', 'tribune' ); ?></em></p>
			<?php endif; ?>

			<div class="comment-content">
				<?php comment_text(); ?>
			</div>
		</article>
	<?php
}
