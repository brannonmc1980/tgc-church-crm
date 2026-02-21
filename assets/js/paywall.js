/**
 * Tribune Paywall / Permission Wall
 *
 * Flow:
 *  1. Find .paywall-content wrapper (added by PHP filter)
 *  2. After user has scrolled past `threshold`% of the content, show the gate
 *  3. Apply a fade-blur overlay over the last portion of the content
 *  4. Gate floats just below the visible content
 *  5. On email submit: AJAX to PHP → set cookie → reveal full content
 *  6. On page load: check cookie → if valid, skip gate
 *
 * Requires: jQuery, tribunePaywall localized object
 */
( function( $ ) {
	'use strict';

	// ----------------------------------------------------------------
	// Config (from wp_localize_script)
	// ----------------------------------------------------------------
	var config = window.tribunePaywall || {};
	var threshold   = parseInt( config.threshold,  10 ) || 60;
	var cookieName  = config.cookieName  || 'tribune_access';
	var cookieDays  = parseInt( config.cookieDays, 10 ) || 7;
	var ajaxUrl     = config.ajaxUrl;
	var nonce       = config.nonce;

	// ----------------------------------------------------------------
	// Cookie helpers
	// ----------------------------------------------------------------
	function setCookie( name, value, days ) {
		var expires = '';
		if ( days ) {
			var d = new Date();
			d.setTime( d.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
			expires = '; expires=' + d.toUTCString();
		}
		document.cookie = name + '=' + encodeURIComponent( value ) + expires + '; path=/; SameSite=Lax';
	}

	function getCookie( name ) {
		var nameEQ = name + '=';
		var ca = document.cookie.split( ';' );
		for ( var i = 0; i < ca.length; i++ ) {
			var c = ca[ i ].trim();
			if ( c.indexOf( nameEQ ) === 0 ) {
				return decodeURIComponent( c.substring( nameEQ.length ) );
			}
		}
		return null;
	}

	// ----------------------------------------------------------------
	// Main init
	// ----------------------------------------------------------------
	$( document ).ready( function() {

		// Check cookie first — if valid, do nothing
		if ( getCookie( cookieName ) ) {
			removePaywallGate();
			return;
		}

		var $content    = $( '.paywall-content' );
		var $gate       = $( '#paywall-gate' );
		var $articleBody = $( '.article-body-wrap' );

		if ( ! $content.length || ! $gate.length ) {
			return;
		}

		var isPremium = $content.data( 'premium' ) === 1 || $content.data( 'premium' ) === '1';
		var gateShown = false;

		// If premium, show gate immediately (no scroll trigger)
		if ( isPremium ) {
			applyFade();
			positionGate();
			return;
		}

		// Scroll-triggered gate
		function checkScrollGate() {
			if ( gateShown ) return;

			var contentTop    = $content.offset().top;
			var contentHeight = $content.outerHeight();
			var scrollBottom  = $( window ).scrollTop() + $( window ).height();
			var scrolled      = scrollBottom - contentTop;
			var percentage    = ( scrolled / contentHeight ) * 100;

			if ( percentage >= threshold ) {
				gateShown = true;
				applyFade();
				positionGate();
				$( window ).off( 'scroll.paywall' );
			}
		}

		$( window ).on( 'scroll.paywall', checkScrollGate );
		checkScrollGate(); // check on load too

		// ----------------------------------------------------------------
		// Apply fade overlay to the bottom of the content
		// ----------------------------------------------------------------
		function applyFade() {
			$content.addClass( 'paywall-content--faded' );

			// Inject inline fade style if not already in CSS
			if ( ! $( '#tribune-paywall-fade-style' ).length ) {
				$( '<style id="tribune-paywall-fade-style">' +
					'.paywall-content--faded { position: relative; overflow: hidden; }' +
					'.paywall-content--faded::after {' +
					'  content: "";' +
					'  position: absolute;' +
					'  bottom: 0; left: 0; right: 0;' +
					'  height: 280px;' +
					'  background: linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 40%, #fff 80%);' +
					'  pointer-events: none;' +
					'}' +
				'</style>' ).appendTo( 'head' );
			}

			// Truncate visible content at threshold
			var contentEl = $content[0];
			var fullHeight = contentEl.scrollHeight;
			var visibleHeight = Math.round( fullHeight * threshold / 100 );
			$content.css( 'max-height', visibleHeight + 'px' );
		}

		// ----------------------------------------------------------------
		// Position the gate element below the faded content
		// ----------------------------------------------------------------
		function positionGate() {
			$gate.removeClass( 'is-hidden' ).addClass( 'is-visible' );
			// Smooth scroll gate into view
			$( 'html, body' ).animate( {
				scrollTop: $gate.offset().top - 80
			}, 400 );
		}

		// ----------------------------------------------------------------
		// Email form submit
		// ----------------------------------------------------------------
		var $form    = $( '#paywall-email-form' );
		var $message = $( '#paywall-message' );

		$form.on( 'submit', function( e ) {
			e.preventDefault();

			var email   = $form.find( '[name="email"]' ).val().trim();
			var $submit = $form.find( '.paywall-gate__submit' );

			if ( ! email ) return;

			$submit.prop( 'disabled', true ).text( '...' );
			$message.hide().removeClass( 'paywall-gate__message--success paywall-gate__message--error' );

			$.ajax( {
				url:    ajaxUrl,
				method: 'POST',
				data: {
					action: 'tribune_email_gate',
					email:  email,
					nonce:  nonce,
				},
				success: function( response ) {
					if ( response.success ) {
						// Set cookie
						setCookie( cookieName, response.data.token, cookieDays );

						// Show success message briefly
						$message.addClass( 'paywall-gate__message--success' ).text( response.data.message ).show();

						// Reveal content
						setTimeout( function() {
							revealContent();
						}, 800 );
					} else {
						$message.addClass( 'paywall-gate__message--error' ).text( response.data.message ).show();
						$submit.prop( 'disabled', false ).text( 'Continue Reading' );
					}
				},
				error: function() {
					$message.addClass( 'paywall-gate__message--error' ).text( 'Something went wrong. Please try again.' ).show();
					$submit.prop( 'disabled', false ).text( 'Continue Reading' );
				}
			} );
		} );

		// ----------------------------------------------------------------
		// Reveal full content
		// ----------------------------------------------------------------
		function revealContent() {
			$content.css( 'max-height', '' ).removeClass( 'paywall-content--faded' );
			$gate.addClass( 'is-hidden' ).fadeOut( 400, function() {
				$gate.remove();
			} );
		}

	} );

	// ----------------------------------------------------------------
	// Remove gate entirely (for cookie-validated users)
	// ----------------------------------------------------------------
	function removePaywallGate() {
		var $gate    = $( '#paywall-gate' );
		var $content = $( '.paywall-content' );
		$gate.remove();
		$content.css( 'max-height', '' ).removeClass( 'paywall-content--faded' );
	}

} )( jQuery );
