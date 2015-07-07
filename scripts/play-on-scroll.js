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
 * @dependencies jQuery, EagleEye
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
	 * @param $el
	 * @param options
	 * @constructor
	 */
	var PlayOnScroll = function( $el, options ){

		this.$el = $el;

		this.video = this.$el[0];

		this.ready = false;

		this.options = $.extend( true, {

			// Rate in which the video catches up with the scroll event. Ranges from 0 - 1, 1 being
			// instant 0 being nothing at all.
			accelerationAmount: 0.1,

			// Start the animation from the end and go backwards
			reverse: false,

			// Throttle timeout to stop spamming on scroll. Higher the number the lower the framerate
			scrollThrottle: 50

		}, options );

		this.cacheHeights();

		this.setupBindings();
	};

	/**
	 * On initialize cache the window height, and set the ratio along with the current start position
	 */
	PlayOnScroll.prototype.initialize = function(){

		this.targetTime = this.currentTime = this.options.reverse ? this.video.duration : 0;

		this.ratio = this.video.duration / ( this.windowHeight - this.videoHeight );

		this.video.pause();

		this.ready = true;
	};

	/**
	 * Wait until we have the loaded metadata for the video before initialising the plugin
	 * Bind to window events
	 */
	PlayOnScroll.prototype.setupBindings = function(){

		this.$el.on( 'loadedmetadata', $.proxy( this.initialize, this ) );

		$window.on( 'resize', $.proxy( this.cacheHeights, this ) );

		// Throttle the play or rewind call.
		var throttled = throttle( $.proxy( this.onVisible, this ), this.options.scrollThrottle );

		// Use eagle eye to watch the video
		this.$el.eagleEye({

			onVisible: $.proxy( throttled, this )
		});
	};

	/**
	 * To render we just set the current time on the video, then constantly render when it can to ensure a smoother
	 * animation.
	 */
	PlayOnScroll.prototype.render = function(){

		if( this.ready && this.video.currentTime != this.targetTime ){

			this.video.pause();

			this.currentTime += ( this.targetTime - this.currentTime ) * this.options.accelerationAmount;
			this.video.currentTime = this.currentTime.toFixed( 4 );
		}
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
	 * - Set the video position
	 * - Play or rewind the video
	 *
	 * @param $el {object}
	 * @param dimensions {object}
	 */
	PlayOnScroll.prototype.onVisible = function( $el, dimensions ){

		this.setVideoPosition( dimensions.el.offsetTop, dimensions.window.scrollTop );
		this.playOrRewind();
	};

	/**
	 * Set the video's current time relative to it's position in the window, scaled to the video duration.
	 */
	PlayOnScroll.prototype.playOrRewind = function(){

		if( this.ready ){

			var time = this.videoPosition * this.ratio;

			if( ! this.options.reverse )
				time = this.video.duration - time;

			this.targetTime = time.toFixed( 4 );
		}
	};

	/**
	 * Set the position of the video in the window.
	 *
	 * @param videoOffsetTop {number}
	 * @param windowScrollTop {number}
	 */
	PlayOnScroll.prototype.setVideoPosition = function( videoOffsetTop, windowScrollTop ){

		this.videoPosition = videoOffsetTop - windowScrollTop;
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

			window.playOnScrollElements.push( new PlayOnScroll( $el, options ) );

			$el.data( 'playOnScroll', window.playOnScrollElements[window.playOnScrollElements.length - 1] );
		} );

		return this;
	};

}( jQuery );

window.playOnScrollElements = [];

var renderLoop = function(){

	requestAnimationFrame( function(){

		for( var i = 0; i < window.playOnScrollElements.length; i++ ){

			window.playOnScrollElements[i].render();
		}

		renderLoop();
	});

};

renderLoop();
