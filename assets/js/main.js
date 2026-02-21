/**
 * Tribune Main JavaScript
 * - Newsletter form AJAX
 * - Share buttons
 * - Copy link button
 * - Reading progress bar
 */
( function( $ ) {
	'use strict';

	$( document ).ready( function() {

		// ----------------------------------------------------------------
		// Newsletter signup forms
		// ----------------------------------------------------------------
		$( '.newsletter-form' ).on( 'submit', function( e ) {
			e.preventDefault();

			var $form    = $( this );
			var $input   = $form.find( '.newsletter-form__input' );
			var $btn     = $form.find( '.newsletter-form__btn' );
			var $message = $form.find( '.newsletter-form__message' );
			var nonce    = $form.data( 'nonce' );
			var email    = $input.val().trim();

			if ( ! email ) return;

			$btn.prop( 'disabled', true );
			$message.hide().removeClass( 'newsletter-form__message--success newsletter-form__message--error' );

			$.ajax( {
				url:    ( window.tribunePaywall && window.tribunePaywall.ajaxUrl ) || '/wp-admin/admin-ajax.php',
				method: 'POST',
				data: {
					action: 'tribune_newsletter_signup',
					email:  email,
					nonce:  nonce,
				},
				success: function( response ) {
					if ( response.success ) {
						$message
							.addClass( 'newsletter-form__message--success' )
							.text( response.data.message )
							.show();
						$input.val( '' );
					} else {
						$message
							.addClass( 'newsletter-form__message--error' )
							.text( response.data.message )
							.show();
					}
				},
				error: function() {
					$message
						.addClass( 'newsletter-form__message--error' )
						.text( 'Something went wrong. Please try again.' )
						.show();
				},
				complete: function() {
					$btn.prop( 'disabled', false );
				}
			} );
		} );

		// ----------------------------------------------------------------
		// Share buttons
		// ----------------------------------------------------------------
		$( '.share-btn--twitter' ).on( 'click', function() {
			var url   = $( this ).data( 'url' );
			var title = $( this ).data( 'title' );
			var twitterUrl = 'https://twitter.com/intent/tweet?text=' +
				encodeURIComponent( title ) + '&url=' + encodeURIComponent( url );
			window.open( twitterUrl, '_blank', 'width=600,height=400,noopener,noreferrer' );
		} );

		$( '.share-btn--copy' ).on( 'click', function() {
			var url = $( this ).data( 'url' );
			var $btn = $( this );

			if ( navigator.clipboard && navigator.clipboard.writeText ) {
				navigator.clipboard.writeText( url ).then( function() {
					showCopyConfirm( $btn );
				} ).catch( function() {
					fallbackCopy( url, $btn );
				} );
			} else {
				fallbackCopy( url, $btn );
			}
		} );

		function showCopyConfirm( $btn ) {
			var $orig = $btn.html();
			$btn.html(
				'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
			).css( 'color', '#16a34a' );
			setTimeout( function() {
				$btn.html( $orig ).css( 'color', '' );
			}, 2000 );
		}

		function fallbackCopy( text, $btn ) {
			var $textarea = $( '<textarea>' ).val( text ).css( { position: 'fixed', top: '-9999px' } ).appendTo( 'body' );
			$textarea[0].select();
			try {
				document.execCommand( 'copy' );
				showCopyConfirm( $btn );
			} catch ( e ) {
				// Silently fail
			}
			$textarea.remove();
		}

		// ----------------------------------------------------------------
		// Reading progress bar (inject on single articles)
		// ----------------------------------------------------------------
		if ( $( 'body' ).hasClass( 'single-post' ) ) {
			var $bar = $( '<div id="reading-progress" style="' +
				'position:fixed;top:0;left:0;height:3px;width:0;' +
				'background:var(--color-accent);z-index:9999;' +
				'transition:width .1s linear;pointer-events:none;' +
				'"></div>' );
			$( 'body' ).append( $bar );

			var $article = $( '.article-content' );

			$( window ).on( 'scroll.progress', function() {
				if ( ! $article.length ) return;
				var articleTop    = $article.offset().top;
				var articleBottom = articleTop + $article.outerHeight();
				var scrollTop     = $( window ).scrollTop();
				var windowHeight  = $( window ).height();
				var scrolledPast  = scrollTop + windowHeight - articleTop;
				var articleLength = articleBottom - articleTop;
				var pct = Math.min( 100, Math.max( 0, ( scrolledPast / articleLength ) * 100 ) );
				$bar.css( 'width', pct + '%' );
			} );
		}

		// ----------------------------------------------------------------
		// Smooth scroll for in-page anchor links
		// ----------------------------------------------------------------
		$( 'a[href^="#"]' ).on( 'click', function( e ) {
			var target = $( this ).attr( 'href' );
			if ( target === '#' || target === '#0' ) return;
			var $target = $( target );
			if ( ! $target.length ) return;
			e.preventDefault();
			$( 'html, body' ).animate( {
				scrollTop: $target.offset().top - 80
			}, 400 );
		} );

		// ----------------------------------------------------------------
		// Lazy load images (Intersection Observer fallback)
		// ----------------------------------------------------------------
		if ( 'loading' in HTMLImageElement.prototype ) {
			// Native lazy load supported — no-op
		} else if ( 'IntersectionObserver' in window ) {
			var lazyImages = document.querySelectorAll( 'img[loading="lazy"]' );
			var observer = new IntersectionObserver( function( entries, obs ) {
				entries.forEach( function( entry ) {
					if ( entry.isIntersecting ) {
						var img = entry.target;
						if ( img.dataset.src ) { img.src = img.dataset.src; }
						img.removeAttribute( 'loading' );
						obs.unobserve( img );
					}
				} );
			} );
			lazyImages.forEach( function( img ) { observer.observe( img ); } );
		}

	} );

} )( jQuery );
