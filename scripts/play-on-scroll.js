/**
 * Returns a function, that, when invoked, will only be triggered at most once during a given window of time. Normally,
 * the throttled function will run as much as it can, without ever going more than once per wait duration; but if you’d
 * like to disable the execution on the leading edge, pass {leading: false}. To disable execution on the trailing edge,
 * ditto.
 *
 * Source: http://underscorejs.org/docs/underscore.html
 *
 * @param func
 * @param wait
 * @param options
 * @returns {Function}
 */
var throttle = function(func, wait, options) {
	var context, args, result;
	var timeout = null;
	var previous = 0;
	if (!options) options = {};
	var later = function() {
		previous = options.leading === false ? 0 : new Date().getTime();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	return function() {
		var now = new Date().getTime();
		if (!previous && options.leading === false) previous = now;
		var remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
};

/**
 * Control HTML5 videos on scroll
 * - When a video is in view this plugin will
 * - play the video when scrolling down
 * - rewind the video when scrolling up
 *
 * @copyright   (c) Develo Design 2015
 * @author      paul
 * @package     play-on-scroll
 * @date        08/06/15
 */
+function ($) {
	'use strict';

	var $window = $( window );

	/**
	 *
	 * @param $el
	 * @param options
	 * @constructor
	 */
	var PlayOnScroll = function( $el, options ){

		this.$el = $el;
		window.video = this.video = this.$el[0];

		this.setupBindings();
	};

	/**
	 * On initialize cache the window height
	 */
	PlayOnScroll.prototype.initialize = function(){

		this.cacheHeights();
		this.currentTime = 0;
		this.ratio = this.video.duration / this.windowHeight;

		this.render();
	};

	/**
	 * Wait until we have the loaded metadata for the video before initalising the plugin
	 * Bind to window events
	 */
	PlayOnScroll.prototype.setupBindings = function(){

		var throttled = throttle( $.proxy( this.onWindowScroll, this ), 100 );

		this.$el.on( 'loadedmetadata', $.proxy( this.initialize, this ) );

		$window.on( 'resize', $.proxy( this.cacheHeights, this ) );
		$window.on( 'scroll', throttled );
	};

	PlayOnScroll.prototype.render = function(){

		this.video.currentTime = this.currentTime;

		requestAnimationFrame( $.proxy( this.render, this ) );
	};

	/**
	 * Recalculate the window height
	 */
	PlayOnScroll.prototype.cacheHeights = function(){

		this.windowHeight = parseInt( $window.height() );
		this.videoHeight = parseInt( this.$el.height() );
	};

	/**
	 * Called when the window is scrolling
	 *
	 */
	PlayOnScroll.prototype.onWindowScroll = function(){

		this.playOrRewind();
	};

	/**
	 * - Find the position of the element in the window
	 * - Set its current time relative to it's position in the window
	 *
	 *
	 */
	PlayOnScroll.prototype.playOrRewind = function(){

		if( this.canPlay() ){

			var time = this.videoPosition * this.ratio;
			//console.log( time );

			this.currentTime = time;
		}
	};

	/**
	 * Video should only play if the video is fully inside the window
	 */
	PlayOnScroll.prototype.canPlay = function(){

		var offsetTop = this.$el.offset().top;
		var windowScrollTop = $window.scrollTop();
		var windowHeight = this.windowHeight;
		var videoHeight = this.videoHeight;

		var overBottomFold = function(){

			return offsetTop + videoHeight < windowScrollTop + windowHeight;
		};

		var underTopFold = function(){

			return offsetTop > windowScrollTop;
		};

		this.videoPosition = offsetTop - windowScrollTop;

		return underTopFold() && overBottomFold();
	};

	/**
	 * Attach the plugin to all elements
	 *
	 * @param options {object}
	 *
	 * @returns {$.fn}
	 */
	$.fn.playOnScroll = function( options ) {

		this.each( function(){

			var $el = $( this );

			$el.data( 'playOnScroll', new PlayOnScroll( $el, options ) );
		} );

		return this;
	};


}( jQuery );