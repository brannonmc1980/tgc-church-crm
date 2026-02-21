/**
 * Tribune Navigation
 * - Mobile menu toggle
 * - Search bar toggle
 * - Section nav scroll indicator
 */
( function() {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function() {

		// ----------------------------------------------------------------
		// Mobile menu toggle
		// ----------------------------------------------------------------
		var menuToggle = document.querySelector( '.menu-toggle' );
		var sectionNav = document.querySelector( '.section-nav' );

		if ( menuToggle && sectionNav ) {
			menuToggle.addEventListener( 'click', function() {
				var expanded = this.getAttribute( 'aria-expanded' ) === 'true';
				this.setAttribute( 'aria-expanded', String( ! expanded ) );
				sectionNav.classList.toggle( 'is-open' );
			} );
		}

		// ----------------------------------------------------------------
		// Search bar toggle
		// ----------------------------------------------------------------
		var searchToggle = document.querySelector( '.header-search-toggle' );
		var headerSearch = document.getElementById( 'header-search' );
		var searchClose  = document.querySelector( '.header-search__close' );
		var searchInput  = document.getElementById( 'header-search-input' );

		function openSearch() {
			if ( ! headerSearch ) return;
			headerSearch.hidden = false;
			searchToggle && searchToggle.setAttribute( 'aria-expanded', 'true' );
			// Focus the input after the element becomes visible
			requestAnimationFrame( function() {
				searchInput && searchInput.focus();
			} );
		}

		function closeSearch() {
			if ( ! headerSearch ) return;
			headerSearch.hidden = true;
			searchToggle && searchToggle.setAttribute( 'aria-expanded', 'false' );
			searchToggle && searchToggle.focus();
		}

		if ( searchToggle ) {
			searchToggle.addEventListener( 'click', function() {
				var isOpen = this.getAttribute( 'aria-expanded' ) === 'true';
				if ( isOpen ) {
					closeSearch();
				} else {
					openSearch();
				}
			} );
		}

		if ( searchClose ) {
			searchClose.addEventListener( 'click', closeSearch );
		}

		// Close search on Escape key
		document.addEventListener( 'keydown', function( e ) {
			if ( e.key === 'Escape' && headerSearch && ! headerSearch.hidden ) {
				closeSearch();
			}
		} );

		// ----------------------------------------------------------------
		// Sticky header: add shadow class on scroll
		// ----------------------------------------------------------------
		var siteHeader = document.getElementById( 'masthead' );
		if ( siteHeader ) {
			var lastScrollY = 0;
			window.addEventListener( 'scroll', function() {
				var scrollY = window.scrollY;
				if ( scrollY > 10 ) {
					siteHeader.classList.add( 'is-scrolled' );
				} else {
					siteHeader.classList.remove( 'is-scrolled' );
				}
				lastScrollY = scrollY;
			}, { passive: true } );
		}

		// ----------------------------------------------------------------
		// Section nav: show scroll shadow when overflowing
		// ----------------------------------------------------------------
		var sectionNavInner = document.querySelector( '.section-nav' );
		if ( sectionNavInner ) {
			function checkNavScroll() {
				if ( sectionNavInner.scrollLeft > 0 ) {
					sectionNavInner.classList.add( 'is-scrolled-left' );
				} else {
					sectionNavInner.classList.remove( 'is-scrolled-left' );
				}
				var atEnd = sectionNavInner.scrollLeft + sectionNavInner.clientWidth >= sectionNavInner.scrollWidth - 2;
				if ( atEnd ) {
					sectionNavInner.classList.add( 'is-scrolled-right' );
				} else {
					sectionNavInner.classList.remove( 'is-scrolled-right' );
				}
			}
			sectionNavInner.addEventListener( 'scroll', checkNavScroll, { passive: true } );
			checkNavScroll();
		}

	} );

} )();
