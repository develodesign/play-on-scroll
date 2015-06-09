# Play HTML Videos On Scroll

jQuery plugin that will play video elements when you scroll down the page.

- Scrolling down plays the video.
- Scrolling up rewinds the video.

## Inspiration ##

https://www.apple.com/macbook/

## Installation ##

Using Bower:

```bower install play-on-scroll```

Attach the script to the page, after jQuery

```
    <script src="/bower_components/play-on-scroll/scripts/play-on-scroll.js"></script>
```

To make the plugin work just select the elements you want and call the plugin

```
    $( 'video' ).playOnScroll();
```

## Configuration ##

You can set it to play the video backwards, ie scrolling down rewinds the video and scrolling up will play the video.

```
    $( 'video' ).playOnScroll( {
        reverse: true
    });
```

The plugin will throttle calls to update on scroll. However it seems to work really well in Safari without the throttle.
If you don't care about cross browser performance or are only targeting certain browsers you can set the throttle when
initializing the plugin.

Lower throttle speeds will increase the the framerate.

```
    $( 'video' ).playOnScroll( {
        scrollThrottle: 100
    } );
```

## Examples ##

Have a look at the examples in the examples/test.html file. 

## TODO's ##

Create vanilla js version.





