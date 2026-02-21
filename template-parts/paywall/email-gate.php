<?php
/**
 * Permission wall / email gate template
 *
 * This is rendered server-side as a fallback and also used as
 * the template that JavaScript populates into the DOM.
 *
 * @package Tribune
 */

$headline = get_option( 'tribune_paywall_headline', __( 'Read the full story.', 'tribune' ) );
$subhead  = get_option( 'tribune_paywall_subhead', __( 'Enter your email for free access, or create an account to subscribe.', 'tribune' ) );
$is_premium = tribune_post_is_premium();
?>

<div id="paywall-gate" class="paywall-gate" aria-live="polite" role="dialog" aria-label="<?php esc_attr_e( 'Article access', 'tribune' ); ?>">
	<div class="paywall-gate__inner">

		<!-- Icon -->
		<div class="paywall-gate__icon">
			<?php if ( $is_premium ) : ?>
				<!-- Lock icon for premium -->
				<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
				</svg>
			<?php else : ?>
				<!-- Mail icon for email gate -->
				<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
				</svg>
			<?php endif; ?>
		</div>

		<!-- Publication name -->
		<div class="paywall-gate__pub"><?php bloginfo( 'name' ); ?></div>

		<!-- Headline -->
		<h2 class="paywall-gate__headline"><?php echo esc_html( $headline ); ?></h2>
		<p class="paywall-gate__subhead"><?php echo esc_html( $subhead ); ?></p>

		<?php if ( $is_premium ) : ?>
			<!-- Premium: Login or Subscribe only -->
			<div class="paywall-gate__actions paywall-gate__actions--premium">
				<a href="<?php echo esc_url( tribune_register_url() ); ?>" class="btn btn--accent btn--lg">
					<?php _e( 'Subscribe Now', 'tribune' ); ?>
				</a>
				<p class="paywall-gate__login-link">
					<?php _e( 'Already a subscriber?', 'tribune' ); ?>
					<a href="<?php echo esc_url( tribune_login_url( get_permalink() ) ); ?>"><?php _e( 'Sign in', 'tribune' ); ?></a>
				</p>
			</div>

		<?php else : ?>
			<!-- Free: Email gate -->
			<form class="paywall-gate__form" id="paywall-email-form"
				data-nonce="<?php echo esc_attr( wp_create_nonce( 'tribune_email_gate' ) ); ?>"
				data-ajax-url="<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>">

				<div class="paywall-gate__email-row">
					<input
						type="email"
						name="email"
						id="paywall-email-input"
						class="paywall-gate__input"
						placeholder="<?php esc_attr_e( 'Your email address', 'tribune' ); ?>"
						required
						autocomplete="email"
					>
					<button type="submit" class="btn btn--accent btn--lg paywall-gate__submit">
						<?php _e( 'Continue Reading', 'tribune' ); ?>
					</button>
				</div>

				<div class="paywall-gate__message" id="paywall-message" hidden></div>

				<p class="paywall-gate__legal">
					<?php printf(
						/* translators: %s = privacy policy link */
						__( 'Free to read. We may send you newsletters. See our <a href="%s">Privacy Policy</a>.', 'tribune' ),
						esc_url( home_url( '/privacy-policy' ) )
					); ?>
				</p>
			</form>

			<div class="paywall-gate__divider">
				<span><?php _e( 'or', 'tribune' ); ?></span>
			</div>

			<div class="paywall-gate__account-links">
				<a href="<?php echo esc_url( tribune_login_url( get_permalink() ) ); ?>" class="btn btn--outline">
					<?php _e( 'Sign In', 'tribune' ); ?>
				</a>
				<a href="<?php echo esc_url( tribune_register_url() ); ?>" class="btn btn--ghost">
					<?php _e( 'Create Account', 'tribune' ); ?>
				</a>
			</div>

		<?php endif; ?>

	</div><!-- .paywall-gate__inner -->
</div><!-- #paywall-gate -->
