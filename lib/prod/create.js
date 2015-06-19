/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.0
 *
 */
(function($) {

  jQuery.fn.extend(
  {
    slimScroll: function(options)
	{
      var defaults = 
	  {
        width : 'auto',					// width in pixels of the visible scroll area
        height : 'auto',				// height in pixels of the visible scroll area
        size : '7px',					// width in pixels of the scrollbar and rail
        color: '#000',					// scrollbar color, accepts any hex/color value
        position : 'right',	// scrollbar position - left/right
        distance : '5px',	// distance in pixels between the side edge and the scrollbar
        start : 'top',		// default scroll position on load - top / bottom / $('selector')
        opacity : .4,		// sets scrollbar opacity
        alwaysVisible : false,	// enables always-on mode for the scrollbar
        disableFadeOut : false,		// check if we should hide the scrollbar when user is hovering over
        railVisible : false,		// sets visibility of the rail
        railColor : '#333',			// sets rail color
        railOpacity : .2,			// sets rail opacity
        railDraggable : true,		// whether  we should use jQuery UI Draggable to enable bar dragging
        railClass : 'slimScrollRail',		// defautlt CSS class of the slimscroll rail
        barClass : 'slimScrollBar',			// defautlt CSS class of the slimscroll bar
        wrapperClass : 'slimScrollDiv',		// defautlt CSS class of the slimscroll wrapper
        allowPageScroll : false,			// check if mousewheel should scroll the window if we reach top/bottom
        wheelStep : 20,						// scroll amount applied to each mouse wheel step
        touchScrollStep : 200,				// scroll amount applied when user is using gestures
        borderRadius: '7px',				// sets border radius
        railBorderRadius : '7px'			// sets border radius of the rail
      };

      var o = $.extend(defaults, options);

      // do it for every element that matches selector
      this.each(function(){

      var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
        barHeight, percentScroll, lastScroll,
        divS = '<div></div>',
        minBarHeight = 30,
        releaseScroll = false;

        // used in event handlers and for better minification
        var me = $(this);

        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass))
        {
            // start from last bar position
            var offset = me.scrollTop();

            // find bar and rail
            bar = me.parent().find('.' + o.barClass);
            rail = me.parent().find('.' + o.railClass);

            getBarHeight();

            // check if we should scroll existing instance
            if ($.isPlainObject(options))
            {
              // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
              if ( 'height' in options && options.height == 'auto' ) {
                me.parent().css('height', 'auto');
                me.css('height', 'auto');
                var height = me.parent().parent().height();
                me.parent().css('height', height);
                me.css('height', height);
              }

              if ('scrollTo' in options)
              {
                // jump to a static point
                offset = parseInt(o.scrollTo);
              }
              else if ('scrollBy' in options)
              {
                // jump by value pixels
                offset += parseInt(o.scrollBy);
              }
              else if ('destroy' in options)
              {
                // remove slimscroll elements
                bar.remove();
                rail.remove();
                me.unwrap();
                return;
              }

              // scroll content by the given offset
              scrollContent(offset, false, true);
            }

            return;
        }

        // optionally set height to the parent's height
        o.height = (o.height == 'auto') ? me.parent().height() : o.height;

        // wrap content
        var wrapper = $(divS)
          .addClass(o.wrapperClass)
          .css({
            position: 'relative',
            overflow: 'hidden',
            width: o.width,
            height: o.height
          });

        // update style for the div
        me.css({
          overflow: 'hidden',
          width: o.width,
          height: o.height
        });

        // create scrollbar rail
        var rail = $(divS)
          .addClass(o.railClass)
          .css({
            width: o.size,
            height: '100%',
            position: 'absolute',
            top: 0,
            display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
            'border-radius': o.railBorderRadius,
            background: o.railColor,
            opacity: o.railOpacity,
            zIndex: 90
          });

        // create scrollbar
        var bar = $(divS)
          .addClass(o.barClass)
          .css({
            background: o.color,
            width: o.size,
            position: 'absolute',
            top: 0,
            opacity: o.opacity,
            display: o.alwaysVisible ? 'block' : 'none',
            'border-radius' : o.borderRadius,
            BorderRadius: o.borderRadius,
            MozBorderRadius: o.borderRadius,
            WebkitBorderRadius: o.borderRadius,
            zIndex: 99
          });

        // set position
        var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
        rail.css(posCss);
        bar.css(posCss);

        // wrap it
        me.wrap(wrapper);

        // append to parent div
        me.parent().append(bar);
        me.parent().append(rail);

        // make it draggable and no longer dependent on the jqueryUI
        if (o.railDraggable){
          bar.bind("mousedown", function(e) {
            var $doc = $(document);
            isDragg = true;
            t = parseFloat(bar.css('top'));
            pageY = e.pageY;

            $doc.bind("mousemove.slimscroll", function(e){
              currTop = t + e.pageY - pageY;
              bar.css('top', currTop);
              scrollContent(0, bar.position().top, false);// scroll content
            });

            $doc.bind("mouseup.slimscroll", function(e) {
              isDragg = false;hideBar();
              $doc.unbind('.slimscroll');
            });
            return false;
          }).bind("selectstart.slimscroll", function(e){
            e.stopPropagation();
            e.preventDefault();
            return false;
          });
        }

        // on rail over
        rail.hover(function(){
          showBar();
        }, function(){
          hideBar();
        });

        // on bar over
        bar.hover(function(){
          isOverBar = true;
        }, function(){
          isOverBar = false;
        });

        // show on parent mouseover
        me.hover(function(){
          isOverPanel = true;
          showBar();
          hideBar();
        }, function(){
          isOverPanel = false;
          hideBar();
        });

        // support for mobile
        me.bind('touchstart', function(e,b){
          if (e.originalEvent.touches.length)
          {
            // record where touch started
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        me.bind('touchmove', function(e){
          // prevent scrolling the page if necessary
          if(!releaseScroll)
          {
  		      e.originalEvent.preventDefault();
		      }
          if (e.originalEvent.touches.length)
          {
            // see how far user swiped
            var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            scrollContent(diff, true);
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        // set up initial height
        getBarHeight();

        // check start position
        if (o.start === 'bottom')
        {
          // scroll content to bottom
          bar.css({ top: me.outerHeight() - bar.outerHeight() });
          scrollContent(0, true);
        }
        else if (o.start !== 'top')
        {
          // assume jQuery selector
          scrollContent($(o.start).position().top, null, true);

          // make sure bar stays hidden
          if (!o.alwaysVisible) { bar.hide(); }
        }

        // attach scroll events
        attachWheel();

        function _onWheel(e)
        {
          // use mouse wheel only when mouse is over
          if (!isOverPanel) { return; }

          var e = e || window.event;

          var delta = 0;
          if (e.wheelDelta) { delta = -e.wheelDelta/120; }
          if (e.detail) { delta = e.detail / 3; }

          var target = e.target || e.srcTarget || e.srcElement;
          if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
            // scroll content
            scrollContent(delta, true);
          }

          // stop window scroll
          if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
          if (!releaseScroll) { e.returnValue = false; }
        }

        function scrollContent(y, isWheel, isJump)
        {
          releaseScroll = false;
          var delta = y;
          var maxTop = me.outerHeight() - bar.outerHeight();

          if (isWheel)
          {
            // move bar with mouse wheel
            // delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();
			if (y > 15 || y < -15) y = Math.ceil(y/16);
			delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();
			

            // move bar, make sure it doesn't go out
            delta = Math.min(Math.max(delta, 0), maxTop);

            // if scrolling down, make sure a fractional change to the
            // scroll position isn't rounded away when the scrollbar's CSS is set
            // this flooring of delta would happened automatically when
            // bar.css is set below, but we floor here for clarity
            delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

            // scroll the scrollbar
            bar.css({ top: delta + 'px' });
          }

          // calculate actual scroll amount
          percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
          delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

          if (isJump)
          {
            delta = y;
            var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
            offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
            bar.css({ top: offsetTop + 'px' });
          }

          // scroll content
          me.scrollTop(delta);

          // fire scrolling event
          me.trigger('slimscrolling', ~~delta);

          // ensure bar is visible
          showBar();

          // trigger hide when scroll is stopped
          hideBar();
        }

        function attachWheel()
        {
          if (window.addEventListener)
          {
            this.addEventListener('DOMMouseScroll', _onWheel, false );
            this.addEventListener('mousewheel', _onWheel, false );
            this.addEventListener('MozMousePixelScroll', _onWheel, false );
          }
          else
          {
            document.attachEvent("onmousewheel", _onWheel)
          }
        }

        function getBarHeight()
        {
          // calculate scrollbar height and make sure it is not too small
          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
          bar.css({ height: barHeight + 'px' });

          // hide scrollbar if content is not long enough
          var display = barHeight == me.outerHeight() ? 'none' : 'block';
          bar.css({ display: display });
        }

        function showBar()
        {
          // recalculate bar height
          getBarHeight();
          clearTimeout(queueHide);

          // when bar reached top or bottom
          if (percentScroll == ~~percentScroll)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScroll != percentScroll)
            {
                var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
                me.trigger('slimscroll', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScroll = percentScroll;

          // show only when required
          if(barHeight >= me.outerHeight()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          bar.stop(true,true).fadeIn('fast');
          if (o.railVisible) { rail.stop(true,true).fadeIn('fast'); }
        }

        function hideBar()
        {
          // only hide when options allow it
          if (!o.alwaysVisible)
          {
            queueHide = setTimeout(function(){
              if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
              {
                bar.fadeOut('slow');
                rail.fadeOut('slow');
              }
            }, 1000);
          }
        }

      });

      // maintain chainability
      return this;
    }
  });

  jQuery.fn.extend({
    slimscroll: jQuery.fn.slimScroll
  });

})(jQuery);
/*!
 * Masonry PACKAGED v3.2.2
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!function(a){function b(){}function c(a){function c(b){b.prototype.option||(b.prototype.option=function(b){a.isPlainObject(b)&&(this.options=a.extend(!0,this.options,b))})}function e(b,c){a.fn[b]=function(e){if("string"==typeof e){for(var g=d.call(arguments,1),h=0,i=this.length;i>h;h++){var j=this[h],k=a.data(j,b);if(k)if(a.isFunction(k[e])&&"_"!==e.charAt(0)){var l=k[e].apply(k,g);if(void 0!==l)return l}else f("no such method '"+e+"' for "+b+" instance");else f("cannot call methods on "+b+" prior to initialization; attempted to call '"+e+"'")}return this}return this.each(function(){var d=a.data(this,b);d?(d.option(e),d._init()):(d=new c(this,e),a.data(this,b,d))})}}if(a){var f="undefined"==typeof console?b:function(a){console.error(a)};return a.bridget=function(a,b){c(b),e(a,b)},a.bridget}}var d=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],c):c("object"==typeof exports?require("jquery"):a.jQuery)}(window),function(a){function b(b){var c=a.event;return c.target=c.target||c.srcElement||b,c}var c=document.documentElement,d=function(){};c.addEventListener?d=function(a,b,c){a.addEventListener(b,c,!1)}:c.attachEvent&&(d=function(a,c,d){a[c+d]=d.handleEvent?function(){var c=b(a);d.handleEvent.call(d,c)}:function(){var c=b(a);d.call(a,c)},a.attachEvent("on"+c,a[c+d])});var e=function(){};c.removeEventListener?e=function(a,b,c){a.removeEventListener(b,c,!1)}:c.detachEvent&&(e=function(a,b,c){a.detachEvent("on"+b,a[b+c]);try{delete a[b+c]}catch(d){a[b+c]=void 0}});var f={bind:d,unbind:e};"function"==typeof define&&define.amd?define("eventie/eventie",f):"object"==typeof exports?module.exports=f:a.eventie=f}(this),function(a){function b(a){"function"==typeof a&&(b.isReady?a():g.push(a))}function c(a){var c="readystatechange"===a.type&&"complete"!==f.readyState;b.isReady||c||d()}function d(){b.isReady=!0;for(var a=0,c=g.length;c>a;a++){var d=g[a];d()}}function e(e){return"complete"===f.readyState?d():(e.bind(f,"DOMContentLoaded",c),e.bind(f,"readystatechange",c),e.bind(a,"load",c)),b}var f=a.document,g=[];b.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],e):"object"==typeof exports?module.exports=e(require("eventie")):a.docReady=e(a.eventie)}(window),function(){function a(){}function b(a,b){for(var c=a.length;c--;)if(a[c].listener===b)return c;return-1}function c(a){return function(){return this[a].apply(this,arguments)}}var d=a.prototype,e=this,f=e.EventEmitter;d.getListeners=function(a){var b,c,d=this._getEvents();if(a instanceof RegExp){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.flattenListeners=function(a){var b,c=[];for(b=0;b<a.length;b+=1)c.push(a[b].listener);return c},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,c){var d,e=this.getListenersAsObject(a),f="object"==typeof c;for(d in e)e.hasOwnProperty(d)&&-1===b(e[d],c)&&e[d].push(f?c:{listener:c,once:!1});return this},d.on=c("addListener"),d.addOnceListener=function(a,b){return this.addListener(a,{listener:b,once:!0})},d.once=c("addOnceListener"),d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,c){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=b(f[e],c),-1!==d&&f[e].splice(d,1));return this},d.off=c("removeListener"),d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if(a instanceof RegExp)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.removeAllListeners=c("removeEvent"),d.emitEvent=function(a,b){var c,d,e,f,g=this.getListenersAsObject(a);for(e in g)if(g.hasOwnProperty(e))for(d=g[e].length;d--;)c=g[e][d],c.once===!0&&this.removeListener(a,c.listener),f=c.listener.apply(this,b||[]),f===this._getOnceReturnValue()&&this.removeListener(a,c.listener);return this},d.trigger=c("emitEvent"),d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},d.setOnceReturnValue=function(a){return this._onceReturnValue=a,this},d._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},d._getEvents=function(){return this._events||(this._events={})},a.noConflict=function(){return e.EventEmitter=f,a},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return a}):"object"==typeof module&&module.exports?module.exports=a:e.EventEmitter=a}.call(this),function(a){function b(a){if(a){if("string"==typeof d[a])return a;a=a.charAt(0).toUpperCase()+a.slice(1);for(var b,e=0,f=c.length;f>e;e++)if(b=c[e]+a,"string"==typeof d[b])return b}}var c="Webkit Moz ms Ms O".split(" "),d=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return b}):"object"==typeof exports?module.exports=b:a.getStyleProperty=b}(window),function(a){function b(a){var b=parseFloat(a),c=-1===a.indexOf("%")&&!isNaN(b);return c&&b}function c(){}function d(){for(var a={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},b=0,c=g.length;c>b;b++){var d=g[b];a[d]=0}return a}function e(c){function e(){if(!m){m=!0;var d=a.getComputedStyle;if(j=function(){var a=d?function(a){return d(a,null)}:function(a){return a.currentStyle};return function(b){var c=a(b);return c||f("Style returned "+c+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),c}}(),k=c("boxSizing")){var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style[k]="border-box";var g=document.body||document.documentElement;g.appendChild(e);var h=j(e);l=200===b(h.width),g.removeChild(e)}}}function h(a){if(e(),"string"==typeof a&&(a=document.querySelector(a)),a&&"object"==typeof a&&a.nodeType){var c=j(a);if("none"===c.display)return d();var f={};f.width=a.offsetWidth,f.height=a.offsetHeight;for(var h=f.isBorderBox=!(!k||!c[k]||"border-box"!==c[k]),m=0,n=g.length;n>m;m++){var o=g[m],p=c[o];p=i(a,p);var q=parseFloat(p);f[o]=isNaN(q)?0:q}var r=f.paddingLeft+f.paddingRight,s=f.paddingTop+f.paddingBottom,t=f.marginLeft+f.marginRight,u=f.marginTop+f.marginBottom,v=f.borderLeftWidth+f.borderRightWidth,w=f.borderTopWidth+f.borderBottomWidth,x=h&&l,y=b(c.width);y!==!1&&(f.width=y+(x?0:r+v));var z=b(c.height);return z!==!1&&(f.height=z+(x?0:s+w)),f.innerWidth=f.width-(r+v),f.innerHeight=f.height-(s+w),f.outerWidth=f.width+t,f.outerHeight=f.height+u,f}}function i(b,c){if(a.getComputedStyle||-1===c.indexOf("%"))return c;var d=b.style,e=d.left,f=b.runtimeStyle,g=f&&f.left;return g&&(f.left=b.currentStyle.left),d.left=c,c=d.pixelLeft,d.left=e,g&&(f.left=g),c}var j,k,l,m=!1;return h}var f="undefined"==typeof console?c:function(a){console.error(a)},g=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],e):"object"==typeof exports?module.exports=e(require("desandro-get-style-property")):a.getSize=e(a.getStyleProperty)}(window),function(a){function b(a,b){return a[g](b)}function c(a){if(!a.parentNode){var b=document.createDocumentFragment();b.appendChild(a)}}function d(a,b){c(a);for(var d=a.parentNode.querySelectorAll(b),e=0,f=d.length;f>e;e++)if(d[e]===a)return!0;return!1}function e(a,d){return c(a),b(a,d)}var f,g=function(){if(a.matchesSelector)return"matchesSelector";for(var b=["webkit","moz","ms","o"],c=0,d=b.length;d>c;c++){var e=b[c],f=e+"MatchesSelector";if(a[f])return f}}();if(g){var h=document.createElement("div"),i=b(h,"div");f=i?b:e}else f=d;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return f}):"object"==typeof exports?module.exports=f:window.matchesSelector=f}(Element.prototype),function(a){function b(a,b){for(var c in b)a[c]=b[c];return a}function c(a){for(var b in a)return!1;return b=null,!0}function d(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function e(a,e,f){function h(a,b){a&&(this.element=a,this.layout=b,this.position={x:0,y:0},this._create())}var i=f("transition"),j=f("transform"),k=i&&j,l=!!f("perspective"),m={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[i],n=["transform","transition","transitionDuration","transitionProperty"],o=function(){for(var a={},b=0,c=n.length;c>b;b++){var d=n[b],e=f(d);e&&e!==d&&(a[d]=e)}return a}();b(h.prototype,a.prototype),h.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},h.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},h.prototype.getSize=function(){this.size=e(this.element)},h.prototype.css=function(a){var b=this.element.style;for(var c in a){var d=o[c]||c;b[d]=a[c]}},h.prototype.getPosition=function(){var a=g(this.element),b=this.layout.options,c=b.isOriginLeft,d=b.isOriginTop,e=parseInt(a[c?"left":"right"],10),f=parseInt(a[d?"top":"bottom"],10);e=isNaN(e)?0:e,f=isNaN(f)?0:f;var h=this.layout.size;e-=c?h.paddingLeft:h.paddingRight,f-=d?h.paddingTop:h.paddingBottom,this.position.x=e,this.position.y=f},h.prototype.layoutPosition=function(){var a=this.layout.size,b=this.layout.options,c={};b.isOriginLeft?(c.left=this.position.x+a.paddingLeft+"px",c.right=""):(c.right=this.position.x+a.paddingRight+"px",c.left=""),b.isOriginTop?(c.top=this.position.y+a.paddingTop+"px",c.bottom=""):(c.bottom=this.position.y+a.paddingBottom+"px",c.top=""),this.css(c),this.emitEvent("layout",[this])};var p=l?function(a,b){return"translate3d("+a+"px, "+b+"px, 0)"}:function(a,b){return"translate("+a+"px, "+b+"px)"};h.prototype._transitionTo=function(a,b){this.getPosition();var c=this.position.x,d=this.position.y,e=parseInt(a,10),f=parseInt(b,10),g=e===this.position.x&&f===this.position.y;if(this.setPosition(a,b),g&&!this.isTransitioning)return void this.layoutPosition();var h=a-c,i=b-d,j={},k=this.layout.options;h=k.isOriginLeft?h:-h,i=k.isOriginTop?i:-i,j.transform=p(h,i),this.transition({to:j,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},h.prototype.goTo=function(a,b){this.setPosition(a,b),this.layoutPosition()},h.prototype.moveTo=k?h.prototype._transitionTo:h.prototype.goTo,h.prototype.setPosition=function(a,b){this.position.x=parseInt(a,10),this.position.y=parseInt(b,10)},h.prototype._nonTransition=function(a){this.css(a.to),a.isCleaning&&this._removeStyles(a.to);for(var b in a.onTransitionEnd)a.onTransitionEnd[b].call(this)},h.prototype._transition=function(a){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(a);var b=this._transn;for(var c in a.onTransitionEnd)b.onEnd[c]=a.onTransitionEnd[c];for(c in a.to)b.ingProperties[c]=!0,a.isCleaning&&(b.clean[c]=!0);if(a.from){this.css(a.from);var d=this.element.offsetHeight;d=null}this.enableTransition(a.to),this.css(a.to),this.isTransitioning=!0};var q=j&&d(j)+",opacity";h.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:q,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(m,this,!1))},h.prototype.transition=h.prototype[i?"_transition":"_nonTransition"],h.prototype.onwebkitTransitionEnd=function(a){this.ontransitionend(a)},h.prototype.onotransitionend=function(a){this.ontransitionend(a)};var r={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};h.prototype.ontransitionend=function(a){if(a.target===this.element){var b=this._transn,d=r[a.propertyName]||a.propertyName;if(delete b.ingProperties[d],c(b.ingProperties)&&this.disableTransition(),d in b.clean&&(this.element.style[a.propertyName]="",delete b.clean[d]),d in b.onEnd){var e=b.onEnd[d];e.call(this),delete b.onEnd[d]}this.emitEvent("transitionEnd",[this])}},h.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(m,this,!1),this.isTransitioning=!1},h.prototype._removeStyles=function(a){var b={};for(var c in a)b[c]="";this.css(b)};var s={transitionProperty:"",transitionDuration:""};return h.prototype.removeTransitionStyles=function(){this.css(s)},h.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.emitEvent("remove",[this])},h.prototype.remove=function(){if(!i||!parseFloat(this.layout.options.transitionDuration))return void this.removeElem();var a=this;this.on("transitionEnd",function(){return a.removeElem(),!0}),this.hide()},h.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var a=this.layout.options;this.transition({from:a.hiddenStyle,to:a.visibleStyle,isCleaning:!0})},h.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var a=this.layout.options;this.transition({from:a.visibleStyle,to:a.hiddenStyle,isCleaning:!0,onTransitionEnd:{opacity:function(){this.isHidden&&this.css({display:"none"})}}})},h.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},h}var f=a.getComputedStyle,g=f?function(a){return f(a,null)}:function(a){return a.currentStyle};"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property"],e):"object"==typeof exports?module.exports=e(require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property")):(a.Outlayer={},a.Outlayer.Item=e(a.EventEmitter,a.getSize,a.getStyleProperty))}(window),function(a){function b(a,b){for(var c in b)a[c]=b[c];return a}function c(a){return"[object Array]"===l.call(a)}function d(a){var b=[];if(c(a))b=a;else if(a&&"number"==typeof a.length)for(var d=0,e=a.length;e>d;d++)b.push(a[d]);else b.push(a);return b}function e(a,b){var c=n(b,a);-1!==c&&b.splice(c,1)}function f(a){return a.replace(/(.)([A-Z])/g,function(a,b,c){return b+"-"+c}).toLowerCase()}function g(c,g,l,n,o,p){function q(a,c){if("string"==typeof a&&(a=h.querySelector(a)),!a||!m(a))return void(i&&i.error("Bad "+this.constructor.namespace+" element: "+a));this.element=a,this.options=b({},this.constructor.defaults),this.option(c);var d=++r;this.element.outlayerGUID=d,s[d]=this,this._create(),this.options.isInitLayout&&this.layout()}var r=0,s={};return q.namespace="outlayer",q.Item=p,q.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},b(q.prototype,l.prototype),q.prototype.option=function(a){b(this.options,a)},q.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),b(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},q.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},q.prototype._itemize=function(a){for(var b=this._filterFindItemElements(a),c=this.constructor.Item,d=[],e=0,f=b.length;f>e;e++){var g=b[e],h=new c(g,this);d.push(h)}return d},q.prototype._filterFindItemElements=function(a){a=d(a);for(var b=this.options.itemSelector,c=[],e=0,f=a.length;f>e;e++){var g=a[e];if(m(g))if(b){o(g,b)&&c.push(g);for(var h=g.querySelectorAll(b),i=0,j=h.length;j>i;i++)c.push(h[i])}else c.push(g)}return c},q.prototype.getItemElements=function(){for(var a=[],b=0,c=this.items.length;c>b;b++)a.push(this.items[b].element);return a},q.prototype.layout=function(){this._resetLayout(),this._manageStamps();var a=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,a),this._isLayoutInited=!0},q.prototype._init=q.prototype.layout,q.prototype._resetLayout=function(){this.getSize()},q.prototype.getSize=function(){this.size=n(this.element)},q.prototype._getMeasurement=function(a,b){var c,d=this.options[a];d?("string"==typeof d?c=this.element.querySelector(d):m(d)&&(c=d),this[a]=c?n(c)[b]:d):this[a]=0},q.prototype.layoutItems=function(a,b){a=this._getItemsForLayout(a),this._layoutItems(a,b),this._postLayout()},q.prototype._getItemsForLayout=function(a){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c];e.isIgnored||b.push(e)}return b},q.prototype._layoutItems=function(a,b){function c(){d.emitEvent("layoutComplete",[d,a])}var d=this;if(!a||!a.length)return void c();this._itemsOn(a,"layout",c);for(var e=[],f=0,g=a.length;g>f;f++){var h=a[f],i=this._getItemLayoutPosition(h);i.item=h,i.isInstant=b||h.isLayoutInstant,e.push(i)}this._processLayoutQueue(e)},q.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},q.prototype._processLayoutQueue=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];this._positionItem(d.item,d.x,d.y,d.isInstant)}},q.prototype._positionItem=function(a,b,c,d){d?a.goTo(b,c):a.moveTo(b,c)},q.prototype._postLayout=function(){this.resizeContainer()},q.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var a=this._getContainerSize();a&&(this._setContainerMeasure(a.width,!0),this._setContainerMeasure(a.height,!1))}},q.prototype._getContainerSize=k,q.prototype._setContainerMeasure=function(a,b){if(void 0!==a){var c=this.size;c.isBorderBox&&(a+=b?c.paddingLeft+c.paddingRight+c.borderLeftWidth+c.borderRightWidth:c.paddingBottom+c.paddingTop+c.borderTopWidth+c.borderBottomWidth),a=Math.max(a,0),this.element.style[b?"width":"height"]=a+"px"}},q.prototype._itemsOn=function(a,b,c){function d(){return e++,e===f&&c.call(g),!0}for(var e=0,f=a.length,g=this,h=0,i=a.length;i>h;h++){var j=a[h];j.on(b,d)}},q.prototype.ignore=function(a){var b=this.getItem(a);b&&(b.isIgnored=!0)},q.prototype.unignore=function(a){var b=this.getItem(a);b&&delete b.isIgnored},q.prototype.stamp=function(a){if(a=this._find(a)){this.stamps=this.stamps.concat(a);for(var b=0,c=a.length;c>b;b++){var d=a[b];this.ignore(d)}}},q.prototype.unstamp=function(a){if(a=this._find(a))for(var b=0,c=a.length;c>b;b++){var d=a[b];e(d,this.stamps),this.unignore(d)}},q.prototype._find=function(a){return a?("string"==typeof a&&(a=this.element.querySelectorAll(a)),a=d(a)):void 0},q.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var a=0,b=this.stamps.length;b>a;a++){var c=this.stamps[a];this._manageStamp(c)}}},q.prototype._getBoundingRect=function(){var a=this.element.getBoundingClientRect(),b=this.size;this._boundingRect={left:a.left+b.paddingLeft+b.borderLeftWidth,top:a.top+b.paddingTop+b.borderTopWidth,right:a.right-(b.paddingRight+b.borderRightWidth),bottom:a.bottom-(b.paddingBottom+b.borderBottomWidth)}},q.prototype._manageStamp=k,q.prototype._getElementOffset=function(a){var b=a.getBoundingClientRect(),c=this._boundingRect,d=n(a),e={left:b.left-c.left-d.marginLeft,top:b.top-c.top-d.marginTop,right:c.right-b.right-d.marginRight,bottom:c.bottom-b.bottom-d.marginBottom};return e},q.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},q.prototype.bindResize=function(){this.isResizeBound||(c.bind(a,"resize",this),this.isResizeBound=!0)},q.prototype.unbindResize=function(){this.isResizeBound&&c.unbind(a,"resize",this),this.isResizeBound=!1},q.prototype.onresize=function(){function a(){b.resize(),delete b.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var b=this;this.resizeTimeout=setTimeout(a,100)},q.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},q.prototype.needsResizeLayout=function(){var a=n(this.element),b=this.size&&a;return b&&a.innerWidth!==this.size.innerWidth},q.prototype.addItems=function(a){var b=this._itemize(a);return b.length&&(this.items=this.items.concat(b)),b},q.prototype.appended=function(a){var b=this.addItems(a);b.length&&(this.layoutItems(b,!0),this.reveal(b))},q.prototype.prepended=function(a){var b=this._itemize(a);if(b.length){var c=this.items.slice(0);this.items=b.concat(c),this._resetLayout(),this._manageStamps(),this.layoutItems(b,!0),this.reveal(b),this.layoutItems(c)}},q.prototype.reveal=function(a){var b=a&&a.length;if(b)for(var c=0;b>c;c++){var d=a[c];d.reveal()}},q.prototype.hide=function(a){var b=a&&a.length;if(b)for(var c=0;b>c;c++){var d=a[c];d.hide()}},q.prototype.getItem=function(a){for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];if(d.element===a)return d}},q.prototype.getItems=function(a){if(a&&a.length){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c],f=this.getItem(e);f&&b.push(f)}return b}},q.prototype.remove=function(a){a=d(a);var b=this.getItems(a);if(b&&b.length){this._itemsOn(b,"remove",function(){this.emitEvent("removeComplete",[this,b])});for(var c=0,f=b.length;f>c;c++){var g=b[c];g.remove(),e(g,this.items)}}},q.prototype.destroy=function(){var a=this.element.style;a.height="",a.position="",a.width="";for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];d.destroy()}this.unbindResize();var e=this.element.outlayerGUID;delete s[e],delete this.element.outlayerGUID,j&&j.removeData(this.element,this.constructor.namespace)},q.data=function(a){var b=a&&a.outlayerGUID;return b&&s[b]},q.create=function(a,c){function d(){q.apply(this,arguments)}return Object.create?d.prototype=Object.create(q.prototype):b(d.prototype,q.prototype),d.prototype.constructor=d,d.defaults=b({},q.defaults),b(d.defaults,c),d.prototype.settings={},d.namespace=a,d.data=q.data,d.Item=function(){p.apply(this,arguments)},d.Item.prototype=new p,g(function(){for(var b=f(a),c=h.querySelectorAll(".js-"+b),e="data-"+b+"-options",g=0,k=c.length;k>g;g++){var l,m=c[g],n=m.getAttribute(e);try{l=n&&JSON.parse(n)}catch(o){i&&i.error("Error parsing "+e+" on "+m.nodeName.toLowerCase()+(m.id?"#"+m.id:"")+": "+o);continue}var p=new d(m,l);j&&j.data(m,a,p)}}),j&&j.bridget&&j.bridget(a,d),d},q.Item=p,q}var h=a.document,i=a.console,j=a.jQuery,k=function(){},l=Object.prototype.toString,m="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(a){return a instanceof HTMLElement}:function(a){return a&&"object"==typeof a&&1===a.nodeType&&"string"==typeof a.nodeName},n=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1};"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","doc-ready/doc-ready","eventEmitter/EventEmitter","get-size/get-size","matches-selector/matches-selector","./item"],g):"object"==typeof exports?module.exports=g(require("eventie"),require("doc-ready"),require("wolfy87-eventemitter"),require("get-size"),require("desandro-matches-selector"),require("./item")):a.Outlayer=g(a.eventie,a.docReady,a.EventEmitter,a.getSize,a.matchesSelector,a.Outlayer.Item)}(window),function(a){function b(a,b){var d=a.create("masonry");return d.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var a=this.cols;for(this.colYs=[];a--;)this.colYs.push(0);this.maxY=0},d.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var a=this.items[0],c=a&&a.element;this.columnWidth=c&&b(c).outerWidth||this.containerWidth}this.columnWidth+=this.gutter,this.cols=Math.floor((this.containerWidth+this.gutter)/this.columnWidth),this.cols=Math.max(this.cols,1)},d.prototype.getContainerWidth=function(){var a=this.options.isFitWidth?this.element.parentNode:this.element,c=b(a);this.containerWidth=c&&c.innerWidth},d.prototype._getItemLayoutPosition=function(a){a.getSize();var b=a.size.outerWidth%this.columnWidth,d=b&&1>b?"round":"ceil",e=Math[d](a.size.outerWidth/this.columnWidth);e=Math.min(e,this.cols);for(var f=this._getColGroup(e),g=Math.min.apply(Math,f),h=c(f,g),i={x:this.columnWidth*h,y:g},j=g+a.size.outerHeight,k=this.cols+1-f.length,l=0;k>l;l++)this.colYs[h+l]=j;return i},d.prototype._getColGroup=function(a){if(2>a)return this.colYs;for(var b=[],c=this.cols+1-a,d=0;c>d;d++){var e=this.colYs.slice(d,d+a);b[d]=Math.max.apply(Math,e)}return b},d.prototype._manageStamp=function(a){var c=b(a),d=this._getElementOffset(a),e=this.options.isOriginLeft?d.left:d.right,f=e+c.outerWidth,g=Math.floor(e/this.columnWidth);g=Math.max(0,g);var h=Math.floor(f/this.columnWidth);h-=f%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var i=(this.options.isOriginTop?d.top:d.bottom)+c.outerHeight,j=g;h>=j;j++)this.colYs[j]=Math.max(i,this.colYs[j])},d.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var a={height:this.maxY};return this.options.isFitWidth&&(a.width=this._getContainerFitWidth()),a},d.prototype._getContainerFitWidth=function(){for(var a=0,b=this.cols;--b&&0===this.colYs[b];)a++;return(this.cols-a)*this.columnWidth-this.gutter},d.prototype.needsResizeLayout=function(){var a=this.containerWidth;return this.getContainerWidth(),a!==this.containerWidth},d}var c=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++){var e=a[c];if(e===b)return c}return-1};"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],b):"object"==typeof exports?module.exports=b(require("outlayer"),require("get-size")):a.Masonry=b(a.Outlayer,a.getSize)}(window);
/***********************************************	
	Function:	PreLoader
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/
// POST AND ARRAY OF IMAGE SRC

function PreLoadImages(value)
{
	this.value = value;
	this.init();
}

PreLoadImages.prototype.init = function()
{
	var images, value;
	
	images = [];
	value = this.value;
	
	window.onload = function()
	{
		for (var i = 0; i < value.length; i++)
		{
			images[i] = new Image();
			images[i].src = value[i];
		}
	};
};

/***********************************************
    Function:   Server Query
    Author:     Adam Lawrence
    Contact:    adam@adamlawrencedesign.com 
*************************************************/

function ServerRequest(url, type, data, callback)
{
    this.url = url;
    this.type = type;
    this.data = data;
    this.callback = callback;
    this.init();
}

ServerRequest.prototype.getRequest = function(url)
{
    var _this = this;

    $.ajax(
    {
        url: url, 
        type: 'GET',
        username: 'WebAPIPhotocreateUser',
        password: '@dvw3b@piu$3r',
        success: function(data)
        {
            _this.callback(data);
        }
    })
};

ServerRequest.prototype.postRequest = function(url, data)
{
    var _this = this;

    $.ajax(
    {
        url: url, 
        type: 'POST',
        username: 'WebAPIPhotocreateUser',
        password: '@dvw3b@piu$3r',
        data: data,
        success: function(data)
        {
            _this.callback(data);
        }
    });   
}

ServerRequest.prototype.putRequest = function(url, data)
{
    var _this = this;

    $.ajax(
    {
        url: url, 
        type: 'PUT',
        username: 'WebAPIPhotocreateUser',
        password: '@dvw3b@piu$3r',
        data: data,
        success: function(data)
        {
            _this.callback(data);
        }
    });   
}

ServerRequest.prototype.init = function()
{
    switch(this.type)
    {
        case 'GET':
            this.getRequest(this.url)
        break;

        case 'POST':
            this.postRequest(this.url, this.data)
        break;

        case 'PUT':
            this.putRequest(this.url, this.data)
        break;
    }
};

/***********************************************
	Function:	Canvas Save
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au
*************************************************/

function SaveCanvas()
{
	this.init();
}

SaveCanvas.prototype.undo = function()
{
	var _this = this;
		el = this.el;

	$(el.buttonUndo).on('click', function()
	{
		$(el.loadingCanvas).css('display','block');

		var canvasInit = new CanvasSetup('revert', function()
		{
			insertJSON = new InsertJSON('standard', function()
			{
				$(el.loadingCanvas).fadeOut(800);
				if(cropMarks) cropMarksInit = new CanvasGrid('cropMarks');
			});
		});		

	});

};

SaveCanvas.prototype.updateJson = function()
{
	// UPDATES THE CURRENT JSON VALUES ON THE PAGES VARIABLE
	$.each(pages, function()
	{
		this.json = JSON.stringify(this.fabric);
		this.jsonObj = JSON.parse(this.json.replace(',"background":"#fff"}','' ).replace('{"objects":', '').replace(';',''))
	});

	// console.log('jsons updated');
};

SaveCanvas.prototype.init = function()
{
	this.el = {
				buttonUndo : '#revert',
				loadingCanvas : '#canvas-loader'
	};

	this.undo();

	setInterval(this.updateJson, 8000);

	
};

/***********************************************
	Function:	Page Style 
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au
*************************************************/

function PageStyle(website, style, type)
{
	this.website = website;
	this.style = style;
	this.type = type;
	this.colours = 	[
						{ name:'ubl', prm: '#00578a', sec : '#0099bc', lt : '#ff8736', op : '#6caddf' },	//  #ffbb00
						{ name:'ubk', prm : '#292f33', sec : '#ffa800', lt : '#ef7622', op : '#ffa800' }, 	
						{ name:'ucb', prm : '#4f2d82', sec : '#ffc425', lt : '#ef7622', op : '#ffc425' }, 		
						{ name:'ubm', prm : '#006bb1', sec : '#0099bc', lt : '#ef7622', op : '#f6b200' }, 		
						{ name:'udo', prm : '#017051', sec : '#017051', lt : '#ef7622', op : '#9c1b3a' },		
						{ name:'ugr', prm : '#005c2f', sec : '#00894b', lt : '#ef7622', op : '#00894b' },	
						{ name:'ugo', prm : '#fcb600', sec : '#ffa800', lt : '#ef7622', op : '#ffa800' },	
						{ name:'uma', prm : '#711a3f', sec : '#6caddf', lt : '#ef7622', op : '#6caddf' },	
						{ name:'umn', prm : '#6f2f40', sec : '#ffa800', lt : '#ef7622', op : '#d59693' },					
						{ name:'una', prm : '#002b5c', sec : '#6caddf', lt : '#ef7622', op : '#6caddf' },	
						{ name:'une', prm : '#292f33', sec : '#ffa800', lt : '#ef7622', op : '#ffa800' },		
						{ name:'upl', prm : '#b62e2e', sec : '#ffa800', lt : '#ef7622', op : '#6caddf' },			
						{ name:'upu', prm : '#753b92', sec : '#6caddf', lt : '#ef7622', op : '#6caddf' },	
						{ name:'ute', prm : '#3ca3ac', sec : '#6caddf', lt : '#ef7622', op : '#6caddf' },	
						{ name:'ure', prm : '#c41425', sec : '#07778b', lt : '#ef7622', op : '#6caddf' }, 
						{ name:'sports', prm : '#292f33', sec : '#ffa800', lt : 'rgba(0, 0, 0, 0.1)', op : '#ffa800' }
					];
	this.checkPage();
}

PageStyle.prototype.colourSetUp = function(colour)
{
	var _this = this,
		el = this.el;

	$(el.primaryColour).css('background-color', colour.prm);							
	$(el.secondaryColor).css('background-color',  colour.sec);   		
	$(el.primaryLight).css('background-color', colour.lt);			
	$(el.button).css('background-color',  colour.op);		
	$(el.buttonOrange).css('background-color',  colour.lt);		

};

PageStyle.prototype.setUpSchool = function()
{
	var _this = this,
		el = this.el;

	$(el.header).addClass('pattern');
	$(el.headerLogo).attr('src', 'assets/svg/logo-org.svg');

	// GET MATCH FOR COLOUR
	$.each(this.colours, function()
	{
		if(this.name == _this.style)
		{
			_this.colourSetUp(this);
		}
	});	
};

PageStyle.prototype.setUpSports = function()
{
	var el = this.el;

	$(el.header).removeClass('pattern').addClass('pattern_sports');
	$(el.body).css('background-image','url(assets/img/sports/bg_crowd.jpg)');

};

PageStyle.prototype.setUpFamilies = function()
{
	// FAMILIES STYLE TO BE ADDED 
};

PageStyle.prototype.checkPage = function()
{
	var _this = this;

	this.el = {
				header: 'header',
				headerLogo: '#header_logo',
				body: 'body',
				primaryColour: '.prm',
				secondaryColor: '.sec',
				primaryLight: '.prm_lt',
				button: '.button',
				buttonOrange: '.btn-orange',
				selectQty: '.productQty',
				changeOrientation: '#orientationLinks'
	}


	switch (this.website)
	{
		case 'advancedyou-school':
		case 'advancedyou-sports':
		case 'advancedyou-family':
			this.setUpSchool();
			$(this.el.changeOrientation).addClass('hidden')
		break;
	};

	console.log('pages type: ', this.type)
	if(this.type == 'editCartItem')
	{
		$(this.el.selectQty).addClass('hidden');
	}

};

// ORANGE COLOUR #ef7622

/***********************************************
    Function:   Standard Page Controllers
    Author:     Adam Lawrence
    Contact:    adam@adamlawrencedesign.com 
*************************************************/

function ImageUploader(userId, defaults, folder, callback)
{
    this.userId = userId;
    this.folder = folder;
    this.defaults = defaults;
    this.callback = callback;
    this.defaults = defaults;
    this.loadDefaults();
}

ImageUploader.prototype.loadImages = function()
{
    var _this = this;

    $.ajax({
            url: "http://192.168.0.216/AdvAPI/api/UploadFile/" + _this.userId + "/List/",
            username: 'WebAPIPhotocreateUser',
            password: '@dvw3b@piu$3r',
            type: "GET",
            success: function(data)
            {
                // console.log('Returned Images from uploads: ', data)
                var obj = [];

                $.each(data, function (index)
                {
                    var thumbPath;
                    
                    if(this.thumbnailMade == true)
                    {
                        thumbPath = this.thumbnailPath;
                        console.log('check thumb: ', thumbPath)
                    } else {
                        thumbPath = this.webServerPath;
                    }

                    obj.push(
                            {
                                'HighRes': 'http://192.168.0.216' + this.webServerPath,
                                'Path': 'http://192.168.0.216' + thumbPath,
                                'ID': _this.userId,
                                'Name': _this.userName
                            });

                });
                
                // console.log('Get the image pathway: ', obj);
                var addImageList = new ListBuilder('uploadedImages', obj, true);

                _this.callback();
            }
    }).fail(function()
    {
        _this.callback();
    });    
};

ImageUploader.prototype.init = function()
{
    var _this, node;

    _this = this;
    node = this.defaults;

    // LOADS IMAGES FROM PREVIOUS SESSION THAT MATCHES USER ID
    this.loadImages();

    $(node.button).bind("click", function()
    {
        $(node.file).click();
    });

    $(node.file).change(function ()
    {
        $(node.display).val($(node.file).val().substring(12, $(node.file).val().length));
    });

    $(node.trigger).on('click', function()
    {
        var imgData = new FormData();
        var files = $(node.file).get(0).files;

        // Add the uploaded image content to the form data collection
        if (files.length > 0)
        {
            imgData.append("ImageUploaded", files[0]);
        }

        // console.log('image data: ', imgData, ', files: ', files)
       
        // Make Ajax request with the contentType = false, and procesData = false
        $.ajax({
            type: "POST",
            url: "http://192.168.0.216/AdvAPI/api/UploadFile/" + "Guests" + "/" + _this.userId + "/",
            username: 'WebAPIPhotocreateUser',
            password: '@dvw3b@piu$3r',
            contentType: false,
            processData: false,
            data: imgData,
            //Giving message to user on successfull upload
            success: function ()
            {
                location.reload();                    
                // alert("Image successfully uploaded!!!");
            }          
        });
    });   
};

ImageUploader.prototype.loadDefaults = function()
{
    if(!this.defualts)
    {
        this.defaults = {
                            'wrap': '#wrap-upload',
                            'file': '#upload-file',   
                            'button': '#upload-button',
                            'display': '#upload-display',
                            'trigger': '#upload-init',
                            'imageList': '#uploadedImages'
                        };
    }
    this.init();
};

/*
WEB SERVER INFO

<div id="wrap-upload-ctl" class="relative">
    <input id="fileUpload" type="file" />
    <button id="upload-button" class="button round-sd txt_sm">Browse</button>
    <input id="upload-display" type="text" disabled="disabled"></input>
</div> 

<input type="text" id="fileSelected" disabled="disabled" class="hidden" /><br /><br />
<button id="btnUploadFile" type="button" class="button round txt_sm" data-toggle="tooltip">UPLOAD IMAGE</button>

<ul id="uploadedImages" class="clearfix relative halfs m_l_top">
</ul>


GET api/UploadFile/{userID}

{
  "isChanged": true,
  "isDeleted": false,
  "id": 1,
  "subFolder": "sample string 2",
  "userID": 3,
  "webServerPath": "sample string 4",
  "thumbnailPath": "sample string 5",
  "thumbnailMade": true,
  "dateUploaded": "2015-05-18T11:01:42.9076081+10:00",
  "status": "sample string 8"
}

GET api/UploadFile/{userID}/List

$.ajax({
        url: "../AdvAPI/api/UploadFile/" + vUserID + "/List/",
        username: 'WebAPIPhotocreateUser',
        password: '@dvw3b@piu$3r',
        type: "GET",
        success: function (data)
        {
            $.each(data,
                function (index)
                {
                    var theCachedImage = new Image();
                    // Boolean that tells us whether or not the image has finished loading. 
                    var theBoolean;

                    $(theCachedImage).load(function ()
                    {
                        theBoolean = true;
                    });

                    theCachedImage.id = "rcorners";
                    theCachedImage.src = data[index].webServerPath;
                    $('#UploadImage').append(theCachedImage);

                });
            $("#loader").hide("slow");
        }
});

$('#btnBrowse').bind("click", function ()
{
    $('#fileUpload').click();
});

$('#fileUpload').change(function ()
{
    document.getElementById("fileSelected").value = $('#fileUpload').val().substring(12,$('#fileUpload').val().length);
});

$('#btnUploadFile').on('click', function()
{
    var imgData = new FormData();
    var files = $("#fileUpload").get(0).files;

    // Add the uploaded image content to the form data collection
    if (files.length > 0) {
        imgData.append("ImageUploaded", files[0]);
    }

    // Make Ajax request with the contentType = false, and procesData = false
    $.ajax({
        type: "POST",
        url: "../AdvAPI/api/UploadFile/" + vSubFolder + "/" + vUserID + "/",
        username: 'WebAPIPhotocreateUser',
        password: '@dvw3b@piu$3r',
        contentType: false,
        processData: false,
        data: imgData,
        //Giving message to user on successfull upload
        success: function () {
            location.reload();                    
            alert("Image successfully uploaded!!!");
        }          
    });

    });
});    
*/

/***********************************************
	Function:	Pagnation
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com		
*************************************************/

function Pagnation(wrap)
{
	this.wrap = wrap;
	this.pages = [];
	this.init();
}

Pagnation.prototype.setCurrentPage = function(obj)
{
	if($(obj).attr('data-yposition') == 0) 
	{
		currentPageRef = $(obj).attr('id').replace('wrap-canvas-','');
		console.log(currentPageRef)
	};
};

Pagnation.prototype.pageUp = function(element)
{
	var firstChild, _this;

	_this = this;
	firstChild = $('#nav-page-0').parent().attr('class');
	if(firstChild == 'selected') return;
	
	$('#' + this.wrap + ' .selected').removeClass('selected').prev('li').addClass('selected');

	$('.wrap-canvas').each(function()
	{
		var yPosition = $(this).attr('data-yposition');
		$(this).attr('data-yposition', parseInt(yPosition) + 100);
		$(this).css('top', parseInt(yPosition) + 100 + '%');
	});
};

Pagnation.prototype.pageDown = function(element)
{
	var lastChild, _this;

	_this = this;
	lastChild = $('#nav-page-' + (this.pages.length-1)).parent().attr('class');
	if(lastChild == 'selected' ) return;

	$('#' + this.wrap + ' .selected').removeClass('selected').next('li').addClass('selected');

	$('.wrap-canvas').each(function()
	{
		var yPosition = $(this).attr('data-yposition');
		$(this).attr('data-yposition', parseInt(yPosition) - 100);
		$(this).css('top', parseInt(yPosition) - 100 + '%');
		_this.setCurrentPage(this);
		/*
		if($(this).attr('data-yposition') == 0) 
		{
			currentPageRef = $(this).attr('id').replace('wrap-canvas-','');
			console.log(currentPageRef)
		};
		*/
	});
};

Pagnation.prototype.movePages = function(element)
{
	var lookUp, currentPos, difference, _this;

	_this = this;
	$('#'+ this.wrap + ' li').removeClass('selected');
	$(element).parent().addClass('selected');

	lookUp = $(element).attr('id').replace('nav-page-', '');
	currentPos = $('#' + 'wrap-canvas-' + lookUp).attr('data-yposition');
	difference = 0 - currentPos;

	$('.wrap-canvas').each(function()
	{		
		var yPosition = $(this).attr('data-yposition');
		$(this).attr('data-yposition', parseInt(yPosition) - currentPos);
		$(this).css('top', parseInt(yPosition) - currentPos + '%');
		_this.setCurrentPage(this);
	});
};

Pagnation.prototype.eventManager = function()
{
	var _this = this;
	$('#' + this.wrap).on('click', 'a', function()
	{
		var id = $(this).attr('id');

		if(id == 'nav-page-up')
		{
			_this.pageUp(this);
		}
		else if(id == 'nav-page-down')
		{
			_this.pageDown(this);
		}
		else 
		{
			_this.movePages(this);
		}	
	});
};

Pagnation.prototype.init = function()
{
	var _this;  

	_this = this;

	$('.wrap-canvas').each(function()
	{
		_this.pages.push({'id': $(this).attr('id'), 'yPosition': $(this).attr('data-yposition')})
	});
	
	$('#nav-pages').removeClass('hidden');
	$('#nav-page-0').parent().addClass('selected');

	this.eventManager();
};
/***********************************************
	Function:	List Builder 
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au
*************************************************/

function ListBuilder(wrap, obj, mGrid, callback)
{
	this.wrap = wrap;
	this.obj = obj;
	this.masonaryGrid = mGrid;
	this.callback = callback;
	this.init()
}

ListBuilder.prototype.addMasonary = function()
{
	var container = document.getElementById(this.wrap);
	
	$('#' + this.wrap + ' img').load(function()
	{
		var masonry = new Masonry(container, 
		{
			columnWidth: 3,
			itemSelector: '.img-col-50'
		});
	});
};

ListBuilder.prototype.init = function()
{
	for(var i = 0; i < this.obj.length; i++)
	{
		var wrap, li, a, img;
		
		wrap = document.getElementById(this.wrap);
		li = document.createElement('li');
		a = document.createElement('a');
		img = document.createElement('img');
			
		$(li).append(a);
		$(a).append(img);
		$(wrap).append(li);

		$(img).attr({'src': this.obj[i].Path, 'alt': this.obj[i].Name });
		$(a).attr({'data-id': this.obj[i].ID, 'data-lookUp' : i});
		
		/*======================= */ 	// Masonary Needed for list controls 
		
		if(this.masonaryGrid) $(li).addClass('img-col-50');		
	}
		
	/*======================= */ 	// Apply call back if specified and check to apply masonary
	console.log('show callback value:', this.callback)
	if(this.callback)	this.callback();
	if(this.masonaryGrid) this.addMasonary();
};

/***********************************************
	Function:	Layout Builder 
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com		
*************************************************/

function LayoutManager(__this, obj)		// change parent
{
	this.__this = __this;
	this.obj = obj;
	this.init();
}

LayoutManager.prototype.listener = function()
{
	var _this, string;
	_this = this;
	
	$('#listThemes').on('click', 'a', function(event)
	{
		event.preventDefault();
		string = _this.obj.Themes[$(this).attr('data-lookUp')].JSON;
		_this.themeParseString(eval(string.replace('{"objects":','').replace(',"background":"#fff"}','')));
	});
};

LayoutManager.prototype.themeParseString = function(string)
{
	var _this;
	_this = this;
	
	this.__this.resetPage(function()
	{
		setTimeout(function()
		{
			if(string[0].width > string[0].height)				// landscape
			{	
				_this.__this.buildLandscape();
				_this.buildTheme(string);
			}
			
			if(string[0].width < string[0].height)				// Portrait 
			{
				_this.__this.buildPortrait();
				_this.buildTheme(string);
			}
		},400);
	}); 
};

LayoutManager.prototype.buildTheme = function(string)
{
	var _this, ratio, insert;
	
	_this = this;
	ratio = canvas._objects[0].width/string[0].width;

	for(var i = 0; i < string.length; i++)
	{
		string[i].width = string[i].width*ratio;
		string[i].height = string[i].height*ratio;
		string[i].left = string[i].left*ratio;
		string[i].top = string[i].top*ratio;

		switch(string[i].type)
		{
			case 'i-text':
				string[i].fontSize = string[i].fontSize*ratio;
				break;
			case 'circle':
				string[i].radius = string[i].radius*ratio;
				break;
		}
		string[0].selectable = false;
	}
	
	insert = '{"objects":' + JSON.stringify(string) + ',"background":"#fff"}';
	canvas.loadFromJSON(insert);
	canvas.renderAll();
};

LayoutManager.prototype.init = function()
{
	this.listener();
};
/***********************************************
	Function:	Element Builder
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com		
*************************************************/
// NEEDS HEAPS OF TIDYING UP
// MAKE THE CLONE CONTROL MORE GENERIC FOR RE-USE 

function ElementBuilder(type, obj, callback)
{
	this.type = type;
	this.obj = obj;
	this.callback = callback;
	this.init();
}

ElementBuilder.prototype.canvasWrap = function()
{
	var yPosition = 0;

    for(var i = 0; i < this.obj.length; i++)
    {
        var wrap, template, li, a, img;

        wrap = document.getElementById(this.wrap);
        template = $(document.getElementById(this.template)).clone();
        $(template).attr({'id': 'wrap-canvas-' + i ,'data-yPosition': yPosition }).css('top', yPosition + '%');
        $(template).find('canvas').attr({'id': 'canvas' + '-'+ i});
        $(wrap).append(template);
        yPosition = yPosition + 100;
    }

    // TEMPLATE HAS TO BE REMOVED FOR PAGNATION TO WORK
    $('#' + this.type.template).remove();

    if(this.callback)   this.callback();
};

ElementBuilder.prototype.buildList = function(id, html)
{
    var wrap, li, a, p;
    
    wrap = document.getElementById(this.wrap);
    li = document.createElement('li');
    a = document.createElement('a');
    p = document.createElement('p');

    $(a).attr('id', id);
    $(p).html(html);

    $(a).append(p);
    $(li).append(a);
    $(wrap).append(li);
};

ElementBuilder.prototype.pageNav = function()
{
    this.buildList('nav-page-up', '<span class="icon-arrow-up"></span>');

    for(var i = 0; i < this.obj.length; i++)
    {
        // console.log('placeholder: ', i, ', label: ');
        this.buildList(this.label + i, parseInt(i)+1)
    };
    
    this.buildList('nav-page-down', '<span class="icon-arrow-down2"></span>');
    this.callback();
}

ElementBuilder.prototype.init = function()
{
    switch(this.type.name)
    {
        case 'canvasWrap':
        	this.template = this.type.template;
        	this.wrap = this.type.wrap;
            this.canvasWrap();
            break;
        case 'canvasPagnation':
            this.wrap = this.type.wrap;
            this.label = this.type.label;
            this.pageNav();
           	break;
    }   
};

/***********************************************	
	Function:	Scroll Manager
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function ScrollManager(wrap, children)
{
	var _this = this;
	this.wrap = $(document.getElementById(wrap));
	this.children = $(document.getElementById(wrap)).children(children);
	this.positions = [];
	this.selected = '';
	this.init();
}

ScrollManager.prototype.updatePositions = function(_this)
{
	var wrapST, id, type;
	
	wrapST = this.wrap.scrollTop();
	
	this.children.each(function()				// Remove from each statement index, element
	{
        id = $(this).attr('id');
		
		if(!id) return;							// Needs to have an id to be able to be scrolled to

		type = id.slice(0,6);					// Remove Assests from id name
		
		if(type == 'assets')
		{
			_this.positions.push({'name' : id, 'offset' : $(this).offset().top - _this.wrap.offset().top + wrapST, 'height' : $(this).height()});
		}
		
    });
};

ScrollManager.prototype.addSelected = function(obj, allObj, addClass)
{
	$(allObj).removeClass(addClass);
	$(obj).addClass(addClass);
};

ScrollManager.prototype.manageScroll = function(selected)
{
	var target, offset, _this;
	_this = this;
	
	this.updatePositions(_this);
	
	target = '#assets' + $(selected).attr('data-link');
	
	for(var i = 0; i < this.positions.length; i++)
	{
		if(target.replace('#','') == this.positions[i].name)
		{
			offset = this.positions[i].offset;
		}
	}
	
	this.wrap.animate(
	{
		scrollTop : offset-20
	}).slimScroll(
	{
		scrollTo : offset	+ 'px'	
	});
};

ScrollManager.prototype.userInput = function()
{
	var _this = this;
	
	$('#tabs').on('click', 'a', function()
	{
		_this.manageScroll(this);
		_this.addSelected($(this).parent('li'), '#tabs li', 'selected');
	});
	
	$('#shortcutTabs').on('click', 'a', function()
	{
		_this.manageScroll(this);
	});
	
	$('.quickLinks').on('click', 'a', function()
	{
		_this.manageScroll(this)
	});
};

ScrollManager.prototype.arrowControls = function()
{
	setTimeout(function()
	{
		$('.quickLinks a').addClass('bounce');
		setTimeout(function()
		{
			$('.quickLinks a').removeClass('bounce');
		},1000)
	},1000)
	
	$('.quickLinks, #tabs').on('click', 'a', function()
	{
		setTimeout(function()
		{
			$('.quickLinks a').addClass('bounce');
			setTimeout(function()
			{
				$('.quickLinks a').removeClass('bounce');
			},1000)
		},1000)
	});
	
	$('.quickLinks').on('mouseenter', 'a', function()
	{
		$(this).removeClass('bounce');
	});
};

ScrollManager.prototype.init = function()
{
	var _this = this;
	this.children.css('min-height', window.innerHeight - $('header').height() + 'px');
	this.updatePositions(_this);
	this.wrap.slimscroll();
	this.userInput();
	this.arrowControls();
};

/* To do - add scroll event listener and update current */

/***********************************************
	Function:	load Assets
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function RotateCanvas(type, callback)
{
	this.type = type;
	this.callback = callback;
	this.init();
}

RotateCanvas.prototype.makePortrait = function()
{
	console.log('Width: ', pages[currentPageRef].jsonObj[0].width, 'height: ', pages[currentPageRef].jsonObj[0].height);
	pages[currentPageRef].jsonObj[0].width = pages[currentPageRef].portrait.width;
	pages[currentPageRef].jsonObj[0].height = pages[currentPageRef].portrait.height;	
};

RotateCanvas.prototype.makeLandscape = function()
{
	console.log('Width: ', pages[currentPageRef].jsonObj[0].width, 'height: ', pages[currentPageRef].jsonObj[0].height);
	pages[currentPageRef].jsonObj[0].width = pages[currentPageRef].portrait.width;
	pages[currentPageRef].jsonObj[0].height = pages[currentPageRef].portrait.height;		
};

RotateCanvas.prototype.init = function()
{
	var ref, _this;
	_this = this;

	console.log('click')

	$('#orientationLinks').on('click', 'a', function()
	{
		ref = $(this).attr('id');

		console.log('click')

		if(ref != pages[currentPageRef].orientation)
		{
			if(pages[currentPageRef].orientation == 'landscape') 
			{
				// CHANGE PAGE TO PORTRAIT ORIENTATION
				pages[currentPageRef].orientation = 'portrait';
				_this.makePortrait();
			}
			else 
			{
				// CHANGE TO LANDSCAPE 
				pages[currentPageRef].orientation = 'landscape';
				_this.makeLandscape();
				console.log('Width: ', pages[currentPageRef].jsonObj[0].width, 'height: ', pages[currentPageRef].jsonObj[0].height)
			}
			_this.callback();
		} else {
			//_this.callback()
		}
	});
};

/***********************************************
	Function:	Palette Controls
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au
*************************************************/

function Palette(activeObj)
{
	this.activeObj = activeObj;
	this.colours = [
						'(8,8,8)',
						'(112,112,112)',
						'(255,255,255)',
						'(255,255,204)',
						'(204,153,102)',
						'(102,51,0)',
						'(204,0,51)',
						'(255,102,51)',
						'(255,153,0)',
						'(255,204,51)',
						'(153,204,0)',
						'(0,102,51)',
						'(0,51,102)',
						'(0,102,204)',
						'(102,204,204)',
						'(102,102,204)',
						'(102,0,102)',
						'(153,51,102)',
						'(255,51,102)',
						'(255,204,204)'
					];
	this.init();
}

Palette.prototype.paletteCreateColours = function()
{
	var colours;
	colours = eval(this.colours);

	for(var i = 0; i < colours.length; i++)
	{
		var wrap, block;
		wrap = document.createElement('li');			
		block = document.createElement('a');
		$(wrap).attr('id', colours[i]).css('width','50%');
		$(block).css('background' , 'rgb' + colours[i]);
		
		if(i==0)
		{
			$(wrap).addClass('selected')
		};
		
		$(wrap).append(block);
		$('#colourContainer').append(wrap);
	}
};

Palette.prototype.paletteControllers = function()
{
	var _this,
	_this = this;
	
	$('#trash').on('click', function()
	{
		pages[currentPageRef].fabric.remove(_this.activeObj);
		_this.hideSubMenus();
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#grow').on('click', function()
	{
		if(!_this.activeObj) return;
		_this.activeObj.height = _this.activeObj.height * 1.06;
		_this.activeObj.width = _this.activeObj.width * 1.06;
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#shrink').on('click',function()
	{
		if(!_this.activeObj) return;
		_this.activeObj.height = _this.activeObj.height * 0.94;
		_this.activeObj.width = _this.activeObj.width * 0.94;
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#back').on('click', function()			/*========== Check export ============*/
	{
		pages[currentPageRef].fabric.sendBackwards(_this.activeObj);
		if(_this.activeObj == pages[currentPageRef].fabric.item(0))
		{
			pages[currentPageRef].fabric.bringForward(_this.activeObj);
		}
	});
	
	$('#forward').on('click', function()
	{
		if(!_this.activeObj) return;
		pages[currentPageRef].fabric.bringForward(_this.activeObj);
	});
	
	$('#palette li a').on('click', function()
	{
		var target;
		target = $(this).next('ul');
		target.toggle();
	});	
	
	$('#opacity').on('change', function()
	{
		if(!_this.activeObj) return;
		_this.activeObj.opacity = $(this).val()*.01;
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#greyscale').on('click', function()
	{
		var filter, check;
		
		filter = new fabric.Image.filters.Grayscale();
		check = true;

		_this.activeObj.filters.push(new fabric.Image.filters.Grayscale());
		_this.activeObj.applyFilters(pages[currentPageRef].fabric.renderAll.bind(pages[currentPageRef].fabric));
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#imageColour').on('click', function()
	{
		var filter, check;
		
		filter = new fabric.Image.filters.Grayscale();
		check = true;

		_this.activeObj.filters = [];
		_this.activeObj.applyFilters();
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#colourContainer').on('click','li', function()
	{
		var colour = 'rgb' + $(this).attr('id');
		_this.activeObj.fill = colour;
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#alignLeft').on('click', function()
	{
		_this.activeObj.textAlign = 'left';
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#alignCenter').on('click', function()
	{
		_this.activeObj.textAlign = 'center';
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#alignRight').on('click', function()
	{
		_this.activeObj.textAlign = 'right';
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#fontSize').on('change', function()
	{
		if(!_this.activeObj) return;
		var value = _this.activeObj.fontSize;
		_this.activeObj.fontSize = $(this).val();
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#lineHeight').on('change', function()
	{
		if(!_this.activeObj) return;
		_this.activeObj.lineHeight = $(this).val();
		pages[currentPageRef].fabric.renderAll();
	});
	
	$('#fontFamily').on('change',function()
	{
		if(!_this.activeObj) return;
		_this.activeObj.fontFamily = $(this).val();
		pages[currentPageRef].fabric.renderAll();
	});
};

Palette.prototype.isRealValue = function(activeObj)
{
	return activeObj && activeObj !== "null" && activeObj!== "undefined";
};		

Palette.prototype.initPalette = function(type)
{
	var _this;
	_this = this;
	
	switch(type)
	{
		case 'image':
			_this.paletteType('image');
			_this.show();
			break;
		case 'i-text':
			_this.paletteType('i-text');
			_this.show();
			break;
		case 'rect':
			_this.paletteType('solid');	
			_this.show();
			break;	
		case 'solid':
			_this.paletteType('solid');	
			_this.show();	
			break;
		case 'circle':
			_this.paletteType('solid');		
			_this.show();
			break;
		case 'triangle':
			_this.paletteType('solid');		
			_this.show();
			break;		
		case '':
			_this.hide();
			_this.activeObj = false;
			break;
	};
};

Palette.prototype.show = function()
{
	$('#palette').removeClass('hide-scale');
};

Palette.prototype.hide = function()
{
	$('#palette').addClass('hide-scale');
};

Palette.prototype.modified = function()
{
	var _this = this;

	pages[currentPageRef].fabric.on('object:selected', function(event)
	{
		_this.activeObj = event.target;
		pages[currentPageRef].fabric.renderAll();
		_this.hideSubMenus();
		_this.initPalette(_this.activeObj.get('type'));
	});

	pages[currentPageRef].fabric.on('object:added', function(event)
	{
		_this.activeObj = event.target;
		pages[currentPageRef].fabric.renderAll();
		_this.initPalette(_this.activeObj.get('type'));
	});
	
	pages[currentPageRef].fabric.on('object:modified', function(event)
	{
		_this.activeObj = event.target;
		_this.hideSubMenus();
	});
	
	pages[currentPageRef].fabric.on('object:moving', function(event)
	{
		_this.hideSubMenus();
	});
	
	pages[currentPageRef].fabric.on('object:removed' , function(event)
	{
		_this.activeObj = false;
		_this.hide();
	});

	pages[currentPageRef].fabric.on('selection:cleared', function(event)
	{
		_this.activeObj = false;
		_this.hide();
	});
	
	pages[currentPageRef].fabric.on('selection:created', function(event)
	{
		_this.activeObj = event.target;
		_this.initPalette(_this.activeObj.get('type'));
		_this.show();
	});

};

Palette.prototype.syncTextControls = function()
{
	console.log('Show active object: ', this.activeObj);

	var fontSize, fontFamily, lineHeight;

	fontSize = this.activeObj.fontSize;
	fontFamily = this.activeObj.fontFamily;
	lineHeight = this.activeObj.lineHeight;

	$('#fontSize').val(fontSize);
	$('#fontFamily').val(fontFamily);
	$('#lineHeight').val(lineHeight);

};

Palette.prototype.hideSubMenus = function()
{
	$('#palette li ul').css('display','none');
};

Palette.prototype.paletteType = function(type)
{
	var wrap, children, textObjs, imageObjs, solidObjs;
	
	_this = this;
	wrap = $('#palette');
	children = $('#palette li a');
	childrenChildren = $('#palette li ul li');
	textObjs = ['textStyle','colourPalette', 'back', 'forward', 'trash'];
	imageObjs = ['filter','back', 'forward', 'grow', 'shrink', 'trash'];
	solidObjs = ['filter','colourPalette','back', 'forward', 'grow', 'shrink', 'trash'];

	switch(type)
	{
		case 'i-text':
			children.parent().addClass('hide-item');
			childrenChildren.removeClass('hide-item');
			for(var i= 0; i < textObjs.length; i++)
			{
				var obj = document.getElementById(textObjs[i]);
				$(obj).parent().removeClass('hide-item');
			};

			_this.syncTextControls();

			break;	
		
		case 'image':
			children.parent().addClass('hide-item');
			childrenChildren.removeClass('hide-item');
			for(var i= 0; i < imageObjs.length; i++)
			{
				var obj = document.getElementById(imageObjs[i]);
				$(obj).parent().removeClass('hide-item');
			};
			break;
			
		case 'solid':	
			children.parent().addClass('hide-item');
			childrenChildren.removeClass('hide-item');
			for(var i= 0; i < solidObjs.length; i++)
			{
				var obj = document.getElementById(solidObjs[i]);
				$(obj).parent().removeClass('hide-item');
			};
			break;	
	}
};

Palette.prototype.initKeyboard = function()
{
	var _this = this;
	
	var zoomBy = function(x, y, z) 
	{
		var activeObject = _this.activeObj;
		if (activeObject)
		{
			activeObject.zoomBy(x, y, z, function(){pages[currentPageRef].fabric.renderAll()});
		}
	};
	
	var objManip = function(prop, value) 
	{
		var obj = _this.activeObj;
		if (!obj) { return true; }
		
		switch(prop)
		{
			case 'zoomBy-x':
				obj.zoomBy(value, 0, 0, function(){pages[currentPageRef].fabric.renderAll()});
				break;
			case 'zoomBy-y':
				obj.zoomBy(0, value, 0, function(){pages[currentPageRef].fabric.renderAll()});
				break;
			case 'zoomBy-z':
				obj.zoomBy(0, 0, value, function(){pages[currentPageRef].fabric.renderAll()});
				break;
			default:
				obj.set(prop, obj.get(prop) + value);
				break;
		}

		if ('left' === prop || 'top' === prop) 
		{ 
			obj.setCoords(); 
		}
		
		pages[currentPageRef].fabric.renderAll();
		return false;
	};
	
	document.onkeydown = function(event)
	{
		var key = window.event ? window.event.keyCode : event.keyCode;
		switch(key) 
		{
			case 37: // left
				if (event.shiftKey) {
					return objManip('zoomBy-x',-1); return false;
				}
				if (event.ctrlKey || event.metaKey) {
					return objManip('angle', -1);
				}
				return objManip('left', -1);
			case 39: // right
				if (event.shiftKey) {
					return objManip('zoomBy-x',1); return false;
				}
				if (event.ctrlKey || event.metaKey) {
					return objManip('angle', 1);
				}
				return objManip('left', 1);
			case 38: // up
				if (event.shiftKey) {
					return objManip('zoomBy-y', -1);
				}
				if (!event.ctrlKey && !event.metaKey) {
					return objManip('top', -1);
				}
				return true;
			case 40: // down
				if (event.shiftKey) {
					return objManip('zoomBy-y', 1);
				}
				if (!event.ctrlKey && !event.metaKey) {
					return objManip('top', 1);
				}
				return true;
			case 46 :
				 var activeObject = pages[currentPageRef].fabric.getActiveObject();
				 pages[currentPageRef].fabric.remove(activeObject);
				 _this.hideSubMenus();
				 return true;
		}
	};
};

Palette.prototype.init = function()
{
	var _this = this;
	this.hide();
	this.paletteCreateColours();
	this.hideSubMenus();
	this.paletteControllers();
	this.initKeyboard();
	this.modified();

	setTimeout(function()
	{
		$('#palette').addClass('hide-scale').removeClass('hidden');
		// SET DELAY FOR RENDING CANVAS
		pages[currentPageRef].fabric.renderAll();
	},1000);

};
/***********************************************
	Function:	Standard Page Controllers
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function ExportJson(type, website, userId, userName, id1)
{
	this.type = type;
	this.website = website;
	this.userId = userId;
	this.userName = userName;
	this.id1 = id1;
	this.init();
};

ExportJson.prototype.linkToLayoutManager = function()
{	
	return '?userId=' + this.userId + '&userName=' + this.userName; 
};

ExportJson.prototype.backLink = function()
{
	var _this, user;
	_this = this;
	
	$('.back').on('click', function()
	{
		if(_this.website == 'layoutBuilder')
		{
			var addInfo = _this.linkToLayoutManager();
			$(this).attr('href', '../layoutManager/layouts.html' + addInfo);
		}
		if(_this.website == 'advancedyou-school' || _this.website == 'advancedyou-family' ||  _this.website == 'advancedyou-sports')
		{
			$('#screenChange').removeClass('hidden');
			$(this).attr('href', '../subjectPortal/gift_items.aspx?SIC=' + _this.id1 + '&userId=' + _this.userId );
		}
	});
};

ExportJson.prototype.zeroFill = function(number, width)
{
	width -= number.toString().length;
	if ( width > 0 )
	{
	return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
	}
	return number + ""; // always return a string
};

ExportJson.prototype.updateJson = function()
{
	// UPDATES THE CURRENT JSON VALUES ON THE PAGES VARIABLE
	$.each(pages, function()
	{
		this.json = JSON.stringify(this.fabric);
	});
};

ExportJson.prototype.newWebLayoutObj = function()
{
	return	newWebLayout = {
							"productID": productData.id,
							"deleted": false,
							"dateModified": todaysDate,
							"lastEditedBy": this.userName,
							"rank": 1,
							"numberOfPages": pages.length
						};	
};

ExportJson.prototype.newWebJsonObj = function(layoutId)
{
	var _this, pageNumber, newWebJSON;

	_this = this;
	newWebJSON = [];

	$.each(pages, function(index, value)
	{
		pageNumber = _this.zeroFill(index + 1, 5);

		newWebJSON.push({
						"webLayoutID": layoutId,
						// "isChanged": true,
						// "isDeleted": false,
						"jsonID": this.jsonId,
						"fromWhere": _this.website,
						'json': this.json, 
						"dateModified": todaysDate,
						'pageNumber': pageNumber
					});
	});	

	return newWebJSON;
};

ExportJson.prototype.pushWebJsons = function(obj, type, callback)
{
	var _this;
	_this = this;

	// CREATE NEW WEB JSONS 
	$.each(obj, function()
	{
		// _this.serverCall('http://192.168.0.216/AdvAPI/api/WJValues', 'POST', this, function(data)
		// PUSH WEB JSON VALUES TO THE SERVER
		var createNewWebJsons = new ServerRequest('http://192.168.0.216/AdvAPI/api/WJValues', 'POST', this, function(data)
		{
			// WEB JSONS SHOULD HAVE BEEN PUSHED TO THE SERVER
			console.log('Success, the layout and JSON table have successfully been updated: ', data);
			callback();
		});			
	});		
};

ExportJson.prototype.updateWebJsonObj = function()
{
	var _this, pageNumber, webJsonUpdate;

	_this = this;
	webJsonUpdate = [];

	$.each(pages, function(index, value)
	{
		// NEED TO ADD LEADING ZEROS TO PAGE NUMBER DATA
		pageNumber = _this.zeroFill(index + 1, 5);

		webJsonUpdate.push({
						"webLayoutID": layoutData.id,
						// "isChanged": true,
						// "isDeleted": false,
						"jsonID": this.jsonId,
						"fromWhere": _this.website,
						'json': this.json, 
						"dateModified": todaysDate,
						'pageNumber': pageNumber
					});
	});	

	return webJsonUpdate;
};

ExportJson.prototype.updateWebJsons = function(obj, type, callback)
{
	var _this;
	_this = this;

	// UPDATE EACH WEB JSON
	$.each(obj, function()
	{
		var updateExistingWebJsons = new ServerRequest('http://192.168.0.216/AdvAPI/api/WJValues/' + this.jsonID, 'PUT', this, function(data)	
		{
			// REDIRECT THE PAGE
			callback();
		});			
	});
};

ExportJson.prototype.createNew = function()
{
	var _this = this;

	$('header, aside').on('click', '.export', function()
	{
		var newWebLayoutObj, webJsons;

		// UPDATE THE CURRENT JSON VALUES ON EACH PAGE
		_this.updateJson();
		newWebLayoutObj = _this.newWebLayoutObj();

		// CREATE NEW WEB LAYOUT RETRIVE THE ID USING A CALLBACK
		var postToWebLayoutsTable = new ServerRequest('http://192.168.0.216/AdvAPI/api/WLValues', 'POST', newWebLayoutObj, function(WLValues)
		{
			// PUSH VALUES TO THE NEW WEB JSON TABLE 
			console.log('this is the layout id: ', WLValues.layoutID)
			webJsons = _this.newWebJsonObj(WLValues.layoutID);
			
			// UPDATE WEB JSONS 
			_this.pushWebJsons(webJsons, 'POST', function()
			{
				location = 'http://192.168.0.216/layoutManager/layouts.html' + _this.linkToLayoutManager();				
			});
		});		
	})
};

ExportJson.prototype.save = function()
{
	var _this = this;	

	$('header, aside').on('click', '.export', function()
	{
		var newWebJsonObj, layoutTablePush, newWebLayoutObj;

		$('#screenChange').removeClass('hidden');
		// UPDATE THE CURRENT JSON VALUES ON EACH PAGE

		_this.updateJson();
		newWebLayoutObj = _this.newWebLayoutObj();

		// UPDATE DATE MODIEFIED ON THE LAYOUTS TABLE
		var updateModifiedLayout = new ServerRequest('http://192.168.0.216/AdvAPI/api/WLValues/' + layoutData.id, 'PUT', newWebLayoutObj, function(WLValues)
		{
			// console.log('Server response updating layout: ', WLValues);
			webJsons = _this.updateWebJsonObj();

			_this.updateWebJsons(webJsons, 'PUT', function()
			{
				setTimeout(function(){
					$('#screenChange').addClass('hidden');
				},800);
				console.log('Web jsons saved');
				// location = 'http://192.168.0.216/layoutManager/layouts.html' + _this.linkToLayoutManager();
			});

		});	
			
	})
};

ExportJson.prototype.postToCart = function(jsons, thumbnailMade, firstJson)
{
	var cartValue, imagePreview, tempOriginUrl, price, WebClientID;
	
	if(thumbnailMade) {
		imagePreview = '~/CreateJS/JSON/' + firstJson + '.jpg';
	} else {
		imagePreview = '~/canvas/' + $('.productImage').attr('src');
	}

	OriginURL 		 =  window.location.href.replace('http://192.168.0.216','').replace(/&/g, '_').replace('cartItem','editCartItem');
	tempOriginUrl = OriginURL.slice(OriginURL.search('jsonId='), OriginURL.search('_end'));
	OriginURL = OriginURL.replace(tempOriginUrl, 'jsonId=' + jsons);

	if(this.website == 'you') {
		SICCode          = this.id1;						// LEAVE BLANK IF FROM COMMUNITY  ‘Get the sic code’	Sample added
		WebClientID      = '';      						// LEAVE BLANK IF FROM YOU PORTAL ‘Get Encrypted Code’ WEBCLIENT ID
	};

	if(this.website == 'community') {
		SICCode          = '';						// LEAVE BLANK IF FROM COMMUNITY  ‘Get the sic code’	Sample added
		WebClientID      = this.id1;      			// LEAVE BLANK IF FROM YOU PORTAL ‘Get Encrypted Code’ WEBCLIENT ID
	};

	// CALCULATE PRICE
	price = $('.price').html().replace('$','').replace(/\s/g,'')

	cartValue = 
		'WebClientAssetId=' + '4239' + 	// HARD CODED FOR PHOTOCREATE ITEMS
		'&ProductId=' + productData.id + 
		'&ImageUrl=' + imagePreview +  
		'&ProductDescription=' + $('.description').html() + 
		'&ProductName=' + $('.itemName').html() + 
		'&Price=' + price + 
		'&Quantity=' + $('#qty').val() + 
		'&DiscountAmount=' + 0 + 
		'&TotalAmount=' + price * $('#qty').val() +
		'&WebDataItem=' + 'OrderType=' + 'Photocreate' + '_ProductID=' + productData.id + '_JSONID=' + jsons +
		'&SICCode=' +  this.id1 +
		'&WebClientID=' + '' +
		'&PortalName=' + '[advancedyou-school]' +
		'&OriginURL=' + OriginURL;

	window.location = 'http://192.168.0.216/cartLink.aspx?' + cartValue;
};

ExportJson.prototype.cartItem = function()
{
	var _this, jsons, items, pageNumber;
	_this = this;

	console.log('cart item.');

	$('header, aside').on('click', '.export', function()
	{
		// STEP 1. UPDATE JSON GLOBAL VARIABLE
		// STEP 2. POST TO THE WEB JSONS TABLE 
		// STEP 3. POST DETAILS TO CART LINK
		$('#screenChange').removeClass('hidden');

		// UPDATE THE CURRENT JSON VALUES ON EACH PAGE
		_this.updateJson();

		// ADD COUNT FOR CALLBACK TO CATCH THE END
		items = pages.length -1;

		$.each(pages, function(index, value)
		{
			var index = index;
			pageNumber = _this.zeroFill(index + 1, 5);

			var data = {
						// "webLayoutID": '',
						// "isChanged": true,
						// "isDeleted": false,
						"fromWhere": 		_this.website,		
						"json": 			this.json,		
						"webOrderItemID": 	_this.productId,		
						"user": 			_this.userId,
						"dateModified": todaysDate,
						'pageNumber': pageNumber
					};

			// POST WEB JSON VALUES TO THE WEB JSON TABLE
			var postWebJsonValues = new ServerRequest('http://192.168.0.216/AdvAPI/api/WJValues', 'POST', data, function(data)
			{
				var firstJson;

				if(typeof jsons === 'undefined')
				{
					firstJson = data.jsonID;
					jsons = data.jsonID;
				} else {
					jsons = jsons + '_' + data.jsonID;
				};

				console.log('this is an index: ', index, 'this is the items: ', items)

				// ONLY DO THIS ONCE ALL JSON ID'S HAVE BEEN CREATED
				if(index == items)
				{
					// SET TIMEOUT AND WAIT UNTIL THUMBNAIL IS RENDERED 
					var count = 0;

					function initThumbCheck()
					{
						setTimeout(function(){
				    		checkIfThumbMade();
				    	}, 1500)
					}

					function checkIfThumbMade()
					{
						count++;

						var checkThumbnailsMade = new ServerRequest('http://192.168.0.216/AdvAPI/api/WJValues/thumbnailMade/' + firstJson, 'GET', null, function(data)
						{
							console.log('check thumb: ', data.thumbnailMade)

							if ( data.thumbnailMade == true )
						    {
						    	// console.log('thumb made', data.thumbnailMade,  firstJson);
						        _this.postToCart(jsons, data.thumbnailMade,  firstJson);
						    } else if (count > 10)
						    {
						    	// console.log('count exceeded use default image.', data.thumbnailMade,  firstJson);
						    	_this.postToCart(jsons, data.thumbnailMade,  firstJson);
						    } else
						    {
						    	console.log('thumb not made');
						    	initThumbCheck();
						    }
						});
					};
		
					initThumbCheck();		
				}; 

			});
		});
	});
};

ExportJson.prototype.editCartItem = function()
{
	var _this, jsons, items, firstJson;
	_this = this;

	// EDIT JSON VALUES AND REDIRECT TO CART PAGE
	$('header, aside').on('click', '.export', function()
	{
		$('#screenChange').removeClass('hidden');
		_this.updateJson();

		// ADD COUNT FOR CALLBACK TO CATCH THE END
		items = pages.length -1;

		firstJson = pages[0].jsonId;

		$.each(pages, function(index, value)
		{
			var data = {
						  "isChanged": true,
						  "isDeleted": false,
						  "jsonID": this.jsonId,
						  "fromWhere": _this.website,
						  "json": this.json,
						  "dateModified": todaysDate,
						  "webOrderItemID": productData.id,
						  "userID": _this.userId,
						  // "webLayoutID": layoutData.id,
						  "pageNumber": this.id			
					};
			
			console.log('Date for updating json strings: ', data, 'current json ids: ', this.jsonId)		
			
			// UPDATE WEB JSON VALUES 
			var postWebJsonValues = new ServerRequest('http://192.168.0.216/AdvAPI/api/WJValues/' + this.jsonId, 'PUT', data, function(data)
			{
				// ONLY EXECUTE ON FINAL JSON 
				if(index == items){

					var count = 0;

					function initThumbCheck()
					{
						setTimeout(function(){
				    		checkIfThumbMade();
				    	}, 1500)
					}

					function checkIfThumbMade()
					{
						count++;

						var checkThumbnailsMade = new ServerRequest('http://192.168.0.216/AdvAPI/api/WJValues/thumbnailMade/' + firstJson, 'GET', null, function(data)
						{
							console.log('is thumbnail made: ', data);

							if ( data.thumbnailMade == true )
						    {
						    	location = 'http://192.168.0.216/subjectPortal/cart.aspx?SIC=' + _this.id1 + '&userId=' + _this.userId;
						    } else if (count > 10)
						    {
						    	location = 'http://192.168.0.216/subjectPortal/cart.aspx?SIC=' + _this.id1 + '&userId=' + _this.userId;
						    } else
						    {
						    	// console.log('thumb not made');
						    	initThumbCheck();
						    }
						});
					};
		
					initThumbCheck();	

					// location = 'http://192.168.0.216/subjectPortal/cart.aspx?SIC=' + _this.userId + '&userId=' + _this.id1;
				}; 

			});
		});	
	});
};

ExportJson.prototype.init = function()
{
	this.backLink();
	
	// console.log('UserName: ', this.userName, ', type: ', this.type )
	// SWITCH DEPENDING ON WEBPAGE TYPE
	switch (this.website)
	{
		case 'layoutBuilder':
			$('.productQty').css('display','none');

			if(this.type == 'copy')
			{	
				$('.export').html('ADD LAYOUT <span class="icon-smiley m_m_left txt-fff"></span>');
				this.createNew();
			}
			else
			{
				$('.export').html('SAVE LAYOUT <span class="icon-smiley m_m_left txt-fff"></span>');
				this.save();
			}
		break;

		case 'advancedyou-school':
		case 'advancedyou-sports':
		case 'advancedyou-family':
			if(this.type == 'cartItem')
			{
				this.cartItem();
			} else {
				this.editCartItem();
			}		
		break;

		case 'community':
			this.cartItem();
		break;			

		case 'client':
			this.cartItem();
		break;	
	}
};

/***********************************************
	Function:	Add Images
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function AddImages(type)	
{
	this.type = type;
	this.init();
}

AddImages.prototype.deactivateAll = function(type, callback)
{
	$.each(pages, function()
	{
		this.fabric.deactivateAll().renderAll();
	});
	callback();
};

AddImages.prototype.addImage = function(path, width, height, left, top)
{
	this.deactivateAll('addImage', function()
	{
		fabric.Image.fromURL(path, function(img)
		{
			img.originX = 'center';
			img.originY = 'center';
			img.left = left;
			img.top = top;
			img.width = width;
			img.height = height;
			img.active = true;
			pages[currentPageRef].fabric.add(img);
		});
	});
};

AddImages.prototype.clickAdd = function()
{
	var _this = this;

	$('#listImages, #uploadedImages, #stockImages').on('click', 'a', function()
	{
		var width, height,lookUp;
		width = $(this).find('img').width();
		height = $(this).find('img').height();
		lookUp = $(this).attr('data-lookup');	
		
		// ADD IMAGE PATH THATS NEEDED
		_this.addImage(
					$(this).find('img').attr('src'),
					// _this.images[lookUp].Path, 
					width, 
					height, 
					$('canvas').width()/2, 
					$('canvas').height()/2
				);		
	});
};

AddImages.prototype.dropAndDragStart = function()
{
	var	mouseEndX, mouseEndY, width, height, elementOffset, helper, offsetY, offsetX, classes, pageX, pageY, _this;

	pageX = window.pageXOffset;
	pageY = window.pageYOffset;
	_this = this;

	$('#listImages a img, #uploadedImages li a img, #stockImages a img').draggable(
	{
		appendTo: 'body',
		obj : this,
		helper : function(event,ui)
		{
			width = $(this).width();
			height = $(this).height();
			helper = $(this).clone();
			helper.css({'width': width + 'px', 'height': height + 'px', 'z-index': '2000'});
			return helper; 
		},
		start : function(event, ui)
		{
			// $(this).hide();
			$(this).css('opacity','0');
			elementOffset = $(this).parents().eq(1).offset();
			relativeMouseStart = {
						left: event.pageX - elementOffset.left,	 
						top: event.pageY - elementOffset.top   
					};
		},
		stop : function(event, ui)
		{
			$(this).css('opacity','1');
			helper.remove();
			var lookUp = $(this).parent().attr('data-lookup');
			mouseEndX = event.pageX;
			mouseEndY = event.pageY;

			if(
				mouseEndX > $('#canvas-' + currentPageRef).offset().left && 
				mouseEndX < ($('#canvas-' + currentPageRef).offset().left + $('#canvas-' + currentPageRef).width()) &&
				mouseEndY > $('#canvas-' + currentPageRef).offset().top &&
				mouseEndY < ($('#canvas-'+ currentPageRef).offset().top + $('#canvas-' + currentPageRef).height())
			   )
			{
				_this.addImage(
							$(this).attr('src'), 
							width, 
							height, 
							((mouseEndX-$('#canvas-'+ currentPageRef).offset().left) - relativeMouseStart.left) + (width/2), 
							((mouseEndY-$('#canvas-'+ currentPageRef).offset().top) - relativeMouseStart.top) + (height/2)
						);
			}		
		},
		revert : true,
		revertDuration: 0,
		scroll: false,
	});

};

AddImages.prototype.init = function()
{
	if(this.type == 'update')
	{
		this.dropAndDragStart();
	} else {
		this.clickAdd();
		this.dropAndDragStart();
	}
};

/***********************************************
	Function:	Add Text Items
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function AddTextItems()	
{
	this.textThemes = [
					// white seaside
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'seasideresortnfregular', size : 39.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'playfair_displayregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'caviar_dreamsregular', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],
					// dark seaside
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'seasideresortnfregular', size : 39.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(255,255,255)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'playfair_displayregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'caviar_dreamsregular', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(255,255,255)'},
					],	
					// white CHUNK FIVE
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'chunkfiveroman', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'alluraregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'playfair_displayregular', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],
					// dark chunk
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'chunkfiveroman', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(255,255,255)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'alluraregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'playfair_displayregular', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(255,255,255)'},
					],
					// white COMIC
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'comic_zine_otregular', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'amatic_scregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'quicksandbold', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],
					// dark COMIC
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'comic_zine_otregular', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(255,255,255)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'amatic_scregular', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'quicksandbold', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(255,255,255)'},
					],		
					// rgb(41,47,51)
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Tahoma, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 32.88 , lineHeight : 1.7,  weight : 300, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(163,172,178)'},
					],					
					// #333			
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'Tahoma, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(255,255,255)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'Arial, Helvetica, sans-serif', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'Arial, Helvetica, sans-serif', size : 16 , lineHeight : 1.62,  weight : 500, fill:  'rgb(255,255,255)'},
					],		
					// #333		
					/*	
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : '', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : '', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : '', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],	
					// rgb(41,47,51)				
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : '', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : '', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : '', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],
					// #333
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Tahoma, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 32.88 , lineHeight : 1.7,  weight : 300, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(163,172,178)'},
					],					
					// rgb(41,47,51)				
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'Verdana, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'Georgia, serif', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: 'rgb(250,250,250)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'Verdana, Geneva, sans-serif', size : 16 , lineHeight : 1.62,  weight : 500, fill: 'rgb(41,47,51)'},
					],
					// #333
					[
						{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Tahoma, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: 'rgb(41,47,51)', },
						{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 32.88 , lineHeight : 1.7,  weight : 300, fill: 'rgb(163,172,178)'},
						{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 20 , lineHeight : 1.62,  weight : 500, fill: 'rgb(163,172,178)'},
					],
					*/
				];

	this.jsonObjs = [
					{'ID':'TextObject1','Name':'TextObject1','Path':'assets/img/sampleText/1.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":228.81,"top":151.03,"width":120,"height":120,"fill":"rgb(31,73,125)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2,"scaleY":2,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0}],"background":"#fafafa"}'},
					{'ID':'TextObject2','Name':'TextObject1','Path':'assets/img/sampleText/2.jpg','JSON':'{"objects":[{"type":"circle","originX":"center","originY":"center","left":111.92,"top":102.08,"width":60,"height":60,"fill":"rgb(75,172,198)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.08,"scaleY":3.08,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","radius":30,"startAngle":0,"endAngle":6.283185307179586}],"background":"#fafafa"}'},
					{'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/3.jpg','JSON':'{"objects":[{"type":"triangle","originX":"center","originY":"center","left":200,"top":200,"width":120,"height":120,"fill":"rgb(75,172,198)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2,"scaleY":2,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fafafa"}'},
					{'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/4.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":114.17,"top":149.08,"width":120,"height":120,"fill":"rgb(155,187,87)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.95,"scaleY":2.51,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0}],"background":"#fafafa"}'}
					];
	this.init();
}

AddTextItems.prototype.deactivateAll = function(type, callback)
{
	$.each(pages, function()
	{
		this.fabric.deactivateAll().renderAll();
	});
	callback();
};

AddTextItems.prototype.addIText = function(value, theme, lookUp)
{
	this.deactivateAll('addIText', function()
	{
		var text = new fabric.IText(value, {					
						fontFamily: theme[lookUp].style,
						originX:'center',									
						originY:'center',	
						left: $('#canvas-' + currentPageRef).width()/2,			
						top: $('#canvas-' + currentPageRef).height()/2,
						fill: theme[lookUp].fill,
						fontSize: (theme[lookUp].size)*1.2, 
						lineHeight: (theme[lookUp].lineHeight)*1.2,
						scaleX:1,
						scaleY:1,
						active: true
					});	

		pages[currentPageRef].fabric.add(text);
		$('#fontFamily').val(text.fontFamily);
		pages[currentPageRef].fabric.renderAll();
	});
};

AddTextItems.prototype.assetsThemes = function()
{
	var _this, string;
	_this = this;
	
	if(this.themes == '')
	{
		$('.themesObj, #assetsThemes').css('display','none');
		return;
	}
};

AddTextItems.prototype.buildTextHTML = function(wrap, theme, callback)
{
	$(wrap).css('height',$(wrap).outerHeight() + 'px')

	$(wrap).empty();
	if(theme[0].background == 'dark')
	{
		$(wrap).parent('div').css('background','#333');
	}
	else
	{
		$(wrap).parent('div').css('background','#fafafa')
	};
	
	for(var i = 0; i < theme.length; i++)
	{
		var el = document.createElement('li'),
			span = document.createElement('span');
		$(el).attr('data-lookup',i)	
		$(span).html(theme[i].displayText)
			.css({
					'font-size' : theme[i].size, 
					'font-family' : theme[i].style,
					'line-height' : theme[i].lineHeight,
					'font-weight' : theme[i].weight,
					'color' : theme[i].fill,
					'width':'auto',
					'text-shadow': 'none'
				});
		$(el).append(span);		
		$(wrap).append(el);
	};

	if(callback) callback();
};

AddTextItems.prototype.buildTextJSON = function(lookUp)
{
	var textObj, group;
	
	group = [];
	// WHY WOULD I MAKE THIS #FAFAFA ???? BUT IT IS
	textObj = JSON.parse(this.jsonObjs[lookUp].JSON.replace('{"objects":','').replace(',"background":"#fafafa"}',''));
	
	console.log(textObj)

	for(var i = 0; i < textObj.length; i++)
	{
		var attr = {
					originX: textObj[i].originX,
					originY: textObj[i].originY,
					left:	textObj[i].left,
					top:	textObj[i].top,
					width:	textObj[i].width,
					height:	textObj[i].height,
					fill:	textObj[i].fill,
					stroke:	textObj[i].stroke,
					strokeWidth: textObj[i].strokeWidth,
					strokeDashArray: textObj[i].strokeDashArray,
					strokeLineCap: textObj[i].strokeLineCap,
					strokeLineJoin: textObj[i].strokeLineJoin,
					strokeMiterLimit: textObj[i].strokeMiterLimit,
					scaleX: textObj[i].scaleX,
					scaleY:	textObj[i].scaleY,
					angle: textObj[i].angle,
					flipX: textObj[i].flipX,
					flipY: textObj[i].flipY,
					opacity: textObj[i].opacity,
					shadow: textObj[i].shadow,
					visible: textObj[i].visible,
					clipTo: textObj[i].clipTo,
					backgroundColor: textObj[i].backgroundColor,
					fillRule: textObj[i].fillRule,
					globalCompositeOperation: textObj[i].globalCompositeOperation,
					rx: textObj[i].rx,
					ry: textObj[i].ry,
					radius: textObj[i].radius,
					radius: textObj[i].radius
				};
		
		switch(textObj[i].type)
		{
			case 'rect':
				var obj = new fabric.Rect(attr);
				break;
			case 'i-text':
				var obj = new fabric.IText(textObj[i].text, attr);
				break;
			case 'circle':
				var obj = new fabric.Circle(attr);
				break;
			case 'triangle':
				var obj = new fabric.Triangle(attr);
				break;
		}
		pages[currentPageRef].fabric.add(obj);
		pages[currentPageRef].fabric.renderAll();
	};	
};

AddTextItems.prototype.textControls = function()
{
	var wrap, theme, sampleUI, themeLength, count, _this;
	
	_this = this;
	wrap = '#addText';
	theme = this.textThemes[0];
	// theme = this.textThemes;
	sampleUI = this;
	themeLength = theme.length;
	count = 0;
		
	this.buildTextHTML(wrap,theme, false);

	$('#assetsText').on('click', '#changeTextTheme', function()
	{
		$('#assetsText').find('.loading').fadeIn(400, function()
		{
			count = count+1;
			if(count == _this.textThemes.length)	
			{ 
				count = 0;
			}
			theme = _this.textThemes[count]; 
			_this.buildTextHTML(wrap, theme, function()
				{
					$('#assetsText').find('.loading').fadeOut(400)
				});
		})

	});
	
	$('#addText').on('click', 'li', function()
	{
		var lookUp, value;
		lookUp = $(this).attr('data-lookup');
		value = theme[lookUp].text;
		_this.addIText(value, theme, lookUp);
	});
	
	$('#listTextThemes').on('click','a', function()
	{
		console.log(this)
		var lookUp = $(this).attr('data-lookUp');
		sampleUI.buildTextJSON(lookUp);				
	});
};

AddTextItems.prototype.init = function()
{
	// console.log('Image object shipped to the image manager: ', this.images);
	this.assetsThemes();
	this.textControls();
};

/***********************************************
	Function:	load Assets
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function LoadAssets(website, userInfo, productData, callback)	
{
	this.website = website;
	this.userInfo = userInfo;
	this.productData = productData;
	// DOUBLE UP VARIABLE NEED TO UPDATE AT A LATER DATE
	this.textThemes = [
						[
							{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Verdana, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: '#292f33', },
							{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Georgia, serif', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: '#a3acb2'},
							{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Verdana, Geneva, sans-serif', size : 20 , lineHeight : 1.62,  weight : 500, fill: '#292f33'},
						],
						[
							{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'dark', style : 'Verdana, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: '#fff', },
							{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'dark', style : 'Georgia, serif', size : 32.88 , lineHeight : 1.7,  weight : 500, fill: '#fafafa'},
							{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'dark', style : 'Verdana, Geneva, sans-serif', size : 16 , lineHeight : 1.62,  weight : 500, fill: '#fff'},
						],
						[
							{ Title : 'Heading', label : 'h1', displayText:'Add Headline', text:'Your Headline', background: 'light', style : 'Tahoma, Geneva, sans-serif', size : 42.2 , lineHeight : 1.4,  weight : 500, fill: '#292f33', },
							{ Title : 'SubHeading', label : 'h2', displayText:'Add Subheading', text:'Your Subheading', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 32.88 , lineHeight : 1.7,  weight : 300, fill: '#a3acb2'},
							{ Title : 'Parragraphy', label : 'p', displayText:'Add Parragraph', text:'Your Parragraph', background: 'light', style : 'Arial, Helvetica, sans-serif', size : 20 , lineHeight : 1.62,  weight : 500, fill: '#a3acb2'},
						],
						];
	this.jsonObjs = [
					{'ID':'TextObject1','Name':'TextObject1','Path':'assets/img/sampleText/1.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":228.81,"top":151.03,"width":120,"height":120,"fill":"rgb(31,73,125)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":2.63,"scaleY":1.12,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":225.39,"top":141.36,"width":274,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.97,"scaleY":0.97,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"SAMPLE TEXT","fontSize":40,"fontWeight":"normal","fontFamily":"Georgia, serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":226.36,"top":172.57,"width":339,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.48,"scaleY":0.48,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"New and Improved","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}}],"background":"#fafafa"}'},
					{'ID':'TextObject2','Name':'TextObject1','Path':'assets/img/sampleText/2.jpg','JSON':'{"objects":[{"type":"circle","originX":"center","originY":"center","left":111.92,"top":102.08,"width":60,"height":60,"fill":"rgb(75,172,198)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.08,"scaleY":3.08,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","radius":30,"startAngle":0,"endAngle":6.283185307179586},{"type":"i-text","originX":"center","originY":"center","left":112.25,"top":98.02,"width":168,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.93,"scaleY":0.93,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Sample 2","fontSize":40,"fontWeight":"normal","fontFamily":"Arial, Helvetica, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":111.81,"top":127.41,"width":306,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.38,"scaleY":0.37,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"More Information","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}}],"background":"#fafafa"}'},
					{'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/3.jpg','JSON':'{"objects":[{"type":"rect","originX":"left","originY":"top","left":0,"top":0,"width":600,"height":400,"fill":"#000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":0,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"rect","originX":"center","originY":"center","left":224.69,"top":79.4,"width":120,"height":120,"fill":"rgb(192,80,77)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":3.91,"scaleY":1.39,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":97.25,"top":105.02,"width":175,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.93,"scaleY":0.93,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Themes 3","fontSize":40,"fontWeight":"normal","fontFamily":"Arial, Helvetica, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":79.81,"top":135.19,"width":306,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.38,"scaleY":0.38,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"More Information","fontSize":40,"fontWeight":"normal","fontFamily":"Tahoma, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"triangle","originX":"center","originY":"center","left":422.78,"top":111.89,"width":120,"height":120,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.45,"scaleY":0.12,"angle":270.46,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fafafa"}'},
					{'ID':'TextObject3','Name':'TextObject1','Path':'assets/img/sampleText/4.jpg','JSON':'{"objects":[{"type":"rect","originX":"center","originY":"center","left":114.17,"top":149.08,"width":120,"height":120,"fill":"rgb(155,187,87)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1.95,"scaleY":2.51,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},{"type":"i-text","originX":"center","originY":"center","left":99.8,"top":247.74,"width":176,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.96,"scaleY":0.96,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"Theme 4","fontSize":40,"fontWeight":"normal","fontFamily":"Verdana, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"i-text","originX":"center","originY":"center","left":79.54,"top":276.92,"width":423,"height":40,"fill":"rgb(250,250,250)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.3,"scaleY":0.3,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","text":"MORE INFORMATION","fontSize":40,"fontWeight":"normal","fontFamily":"Verdana, Geneva, sans-serif","fontStyle":"","lineHeight":1,"textDecoration":"","textAlign":"center","path":null,"textBackgroundColor":"","useNative":true,"styles":{}},{"type":"triangle","originX":"center","originY":"center","left":19.24,"top":36.97,"width":120,"height":120,"fill":"rgbundefined","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":0.33,"scaleY":0.08,"angle":89.79,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}],"background":"#fafafa"}'}
					];
	this.callback = callback;
	this.userImages = [];
	this.stockImages = [];
	this.init();
}

LoadAssets.prototype.getLogo = function()
{
	logoPath = 'http://192.168.0.216/lifebuyimages/' + this.userInfo.id2 + '/Assets/PublicPortal/Logo.png';
	// console.log('logo pathway: ', logoPath);
};

LoadAssets.prototype.displayProductInfo = function()
{
	var _this, wrap;
	_this = this;

	wrap = $('#productInformation');
	wrap.find('.description').html(_this.productData.description);
	wrap.find('.itemName').html(_this.productData.itemName);
	wrap.find('.price').html('$ ' + _this.productData.unitPrice);
	wrap.find('.productImage').attr('src','assets/img/products/' + _this.productData.id + '.jpg');
	$('.productLabel').html(_this.productData.description);
};

LoadAssets.prototype.advancedYou = function()
{
	var _this = this,
		el = this.defaults;
	
	var returnUserInfo = new ServerRequest('http://192.168.0.216/AdvAPI/api/WPIValues/' + this.userInfo.id1, 'GET', null, function(data)
		{
			var ref;

			$.each(data, function(index)
				{
					if(index == 0)
					{
						firstPortraitImgPath = 'http://192.168.0.216' + this.portraitImageServerPath; 
					};	

					_this.userImages.push({
											ID: index,
											Path: 'http://192.168.0.216' + this.portraitImageServerPath 
					});

					if(typeof ref === 'undefined'){
						ref = index;
					} else {
						ref++;
					};
				});

			var returnGroupImages = new ServerRequest('http://192.168.0.216/AdvAPI/api/WGIValues/AdvancedYou/' + _this.userInfo.id1 , 'GET', null, function(data)
				{
					$.each(data, function(index)
						{
							if(index == 0)
							{
								firstGroupImgPath = 'http://192.168.0.216' + this.groupImageServerPath;
							};					

							_this.userImages.push({
													ID: ref + index,
													Path: 'http://192.168.0.216' + this.groupImageServerPath 
							});

						});

					// CREATE LOGO PATH
					_this.getLogo();
					
					// ADD LOGO TO USER IMAGES 
					_this.userImages.push({
											ID: _this.userImages.length,
											Path: logoPath
										});


					var addImages = new ListBuilder('listImages', _this.userImages, true, function()
						{
							// ASSETS NOW LOADED

							//--------------------------------------------------------------------------------------
							// 
							var getCategories = new ServerRequest('http://192.168.0.216/AdvAPI/api/WSIValues/Popular', 'GET', null, function(data)
								{

									$.each(data, function(index)
									{
										_this.stockImages.push({
																	ID: this.id,
																	Path: 'http://192.168.0.216/' + this.thumbnailPath,
																	Category: this.category
																});
									});


									var addImages = new ListBuilder(el.wrapStockImages, _this.stockImages, true, function()
										{
											// var addItemsInit = new AddImages('update');

											_this.layoutBuilder();
										});	
								});

						});

				});
		});
};

LoadAssets.prototype.layoutAssetsListener = function()
{
	var _this = this,
		el = this.defaults;

	$(el.selectCategories).on('change', function()
	{
		var __this = this;

		$(this).css('z-index','101');
		$(el.loader).fadeIn();
		_this.stockImages = [];
		$('#' + el.wrapStockImages).empty();

		setTimeout(function()
		{
			var getCategories = new ServerRequest('http://192.168.0.216/AdvAPI/api/WSIValues/' + $(__this).val(), 'GET', null, function(data)
				{

					$.each(data, function(index)
					{
						_this.stockImages.push({
													ID: this.id,
													Path: 'http://192.168.0.216/' + this.thumbnailPath,
													Category: this.category
												});
					});


					var addImages = new ListBuilder(el.wrapStockImages, _this.stockImages, true, function()
						{
							var addItemsInit = new AddImages('update');
						});	
					


					$(this).css('z-index','auto');
					$(el.loader).fadeOut();	
				});
		},1000)
	});
};

LoadAssets.prototype.layoutBuilder = function()
{
	var _this = this,
		el = this.defaults;

	var getCategories = new ServerRequest('http://192.168.0.216/AdvAPI/api/WSIValues', 'GET', null, function(data)
		{
			$.each(data, function(index)
			{
				var option = document.createElement('option');
				$(option).html(this.category).val(this.category);
				$(el.selectCategories).append(option);
			});

			_this.layoutAssetsListener();
			_this.callback();	
		});
};

LoadAssets.prototype.init = function()
{
	this.displayProductInfo();

	this.defaults = {
				header: 'header',
				selectCategories: '#select-categories',
				wrapImages: 'listImages',
				wrapStockImages: 'stockImages',
				loader: '#aside-loader',
				yourPhotosTab: '#tab-yourPhotos',
				wrapYourImages : '#assetsImages'
			};

	switch (this.website)
	{
		case 'advancedyou-school':
		case 'advancedyou-sports':
		case 'advancedyou-family':
			this.advancedYou();
		break;

		case 'layoutBuilder':
			$(this.defaults.yourPhotosTab).parent().addClass('hidden');
			$(this.defaults.wrapYourImages).addClass('hidden');
			// $(this.defaults.selectCategories).parent().removeClass('hidden');
			this.layoutBuilder();
		break;

	};

	var showTextThemes = new ListBuilder('listTextThemes', this.jsonObjs, true);
}

/***********************************************	
	Function:	Canvas Grid
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au	
*************************************************/

function CanvasGrid(type, callback)
{
	this.type = type;
	this.callback = callback;
	this.init();
}

CanvasGrid.prototype.build = function(id, cssClass, cssProp)
{
	var div;
	div = document.createElement('div');
	$(div).attr('id', id).addClass(cssClass).css(cssProp); 	
	$('#grid').append(div);
};

CanvasGrid.prototype.cropMarksInit = function()
{
	var svg = document.createElement('img');
	$(svg).attr('src', 'http://www.advancedimage.com.au/CreateJS/CanvasOverlay/' + productData.id + '-' + pages[currentPageRef].orientation + '.svg').css({'width':'100%', 'height': '100%', 'top': '0', 'left': '0' });
	$('#grid').append(svg);

	// NEED TO ADD A TRY VALIDATION ON THIS AS SOMETHING A PATH WONT EXIST IF A NEW PRODUCT IS ADDED WITHOUT AN OVERLAY

};

CanvasGrid.prototype.init = function()
{
	$('#grid').empty();
	
	switch(this.type)
	{
		case 'cropMarks':
			this.cropMarksInit();
		break;
	}
};

/************************************

// FOUR BLOCK ABANDONED BECAUSE OF PIXEL ROUNDING

var left, top, right, bottom, yHeight, xWidth, page;

page = pages[0];

if(page.orientation == 'landscape')
{
	yHeight = page.canvas.height * cropMarks[0].landscape.yRatio;
	xWidth = page.canvas.width * cropMarks[0].landscape.xRatio;
} else {
	yHeight = page.canvas.height * cropMarks[0].portrait.yRatio;
	xWidth = page.canvas.width * cropMarks[0].portrait.xRatio;
}

if(page.orientation == 'landscape')
{
	yHeight = (page.canvas.height - (page.canvas.height * cropMarks[0].landscape.yRatio))/2;
	xWidth = (page.canvas.width - (page.canvas.width * cropMarks[0].landscape.xRatio))/2;
} else {
	yHeight = (page.canvas.height - (page.canvas.height * cropMarks[0].portrait.yRatio))/2;
	xWidth = (page.canvas.width - (page.canvas.width * cropMarks[0].portrait.xRatio))/2;
}

this.build(top, 'cropArea', {'bottom':'auto','height': yHeight + 'px','width': page.canvas.width - (xWidth*2), 'left': (xWidth/2)-2 + 'px' });
this.build(right, 'cropArea', {'left':'auto','width': xWidth + 'px','height':'100%'});
this.build(bottom, 'cropArea', {'top':'auto','height': yHeight + 'px','width':'100%'});
this.build(left, 'cropArea', {'right':'auto','width': xWidth + 'px','height':'100%'});		

*/
/***********************************************
	Function:	Event Manager
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/
// Handels window resizing at the moment

function EventManager(type)
{
	this.type = type;
	this.init();
}

EventManager.prototype.getDimensions = function(type, callback)
{
    $('#wrapAssets').css('height', window.innerHeight - ($('header').height()+60) + 'px');  // removed $('#wrapSearch').height()*3)
    $('main').css('height', window.innerHeight - ($('header').height()+10) + 'px');
    callback('resize');
};

EventManager.prototype.updateJson = function()
{
	// UPDATES THE CURRENT JSON VALUES ON THE PAGES VARIABLE
	$.each(pages, function()
	{
		this.json = JSON.stringify(this.fabric);
		this.jsonObj = JSON.parse(this.json.replace(',"background":"#fff"}','' ).replace('{"objects":', '').replace(';',''))
	});

	// console.log('jsons updated');
};

EventManager.prototype.windowResize = function()
{
	var rtime, timeout, delta, _this, canvasInit, cropMarksInit;
	
	_this = this;
	rtime = new Date(1, 1, 2000, 12, 0, 0);
	timeout = false;
	delta = 200;
	
	$(window).resize(function()
	{
		_this.updateJson();

		$('#canvas-loader').css('display','block');
		rtime = new Date();
		
		if (timeout === false)
		{
			timeout = true;
			setTimeout(resizeend, delta);
		}
	});
	
	function resizeend()
	{
		_this.getDimensions('getDimensions', function(data)
		{
			canvasInit = new CanvasSetup(data, function()
			{
				insertJSON = new InsertJSON('standard', function()
				{
					$('#canvas-loader').fadeOut(800);
					if(cropMarks) cropMarksInit = new CanvasGrid('cropMarks');
				});
			});				
		});

		if (new Date() - rtime < delta)
		{
			setTimeout(resizeend, delta);
		} 
		else
		{
			timeout = false;		
		}               
	}		
};

EventManager.prototype.init = function()
{
	if(this.type == 'windowResize')
	{
		this.windowResize();
	}	
	// console.log('event manager started');
}

/***********************************************
	Function:	Insert JSON
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function InsertJSON(type, callback)
{
	this.type = type;
	this.callback = callback;
	this.init();
}

InsertJSON.prototype.insert = function()
{
	var _this = this;

	$.each(pages, function(index, value)
	{
		this.fabric.loadFromJSON('{"objects":' + JSON.stringify(this.jsonObj) + ',"background":"#fff"}');
		this.fabric.json = '{"objects":' + JSON.stringify(this.jsonObj) + ',"background":"#fff"}';
		this.fabric.renderAll();
	});

	this.callback();
};

InsertJSON.prototype.removeItems = function()
{
	// CONTROL FOR REMOVING ITEMS

	$.each(pages, function(index)
	{
		var pageRef = index;
		var indexForDelete = [];

		$.each(this.jsonObj, function(index)
		{
			// console.log('page reference', pageRef, 'Also this:', this);
			// console.log(' property of height: ', pages[pageRef].jsonObj[0].height);
			
			if((this.left - (this.width/2)) > pages[pageRef].jsonObj[index].width)
			{
				indexForDelete.push(index);
				console.log('Index: ', index, 'item remove', this.left, 'placeholder width: ', pages[pageRef].jsonObj[0].width);
				// return false;
			} else if ((this.top - (this.height/2)) > pages[pageRef].jsonObj[0].height){
				console.log('Index: ', index, 'item remove', this.top, 'placeholder width: ', pages[pageRef].jsonObj[0].height);
				indexForDelete.push(index);
				// return false;		
			} else if((this.left+(this.width/2)) < -1) {
				indexForDelete.push(index);
				console.log('Index: ', index, 'item left', this.left, ' width: ', this.width);
				// return false;	
			} else if((this.top + (this.height/2)) < -1) {
				indexForDelete.push(index);
				console.log('Index: ', index, 'item top', this.top, ' width: ', this.height);
				// return false;			
			};					
			
		});

		// console.log('items marked for delete: ', indexForDelete)
		// pages[pageRef].jsonObj.splice(index, 1);

		/*
	    If MyX(k) > DstW Then flag = False
	    If MyY(k) > DstH Then flag = False
	    If MyX(k) + MyWdth(k) < 0 Then flag = False
	    If MyY(k) + MyHght(k) < 0 Then flag = False

		If the canvas-object-left is greater than the canvas width then remove item
		If the canvas-object-top is greater than the canvas height then remove item
		If the canvas-object-left+ canvas-object-width is less than zero then remove item
		If the canvas-object-top+canvas-object-height is less than zero then remove item
		*/
		// console.log('All items should have been removed');
	})
	// console.log('Insert Json onto canvas');
	this.insert();
}

InsertJSON.prototype.init = function()
{
	this.removeItems();
};

/***********************************************
	Function:	Search and Replace
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function SearchAndReplace(website, userInfo, callback)
{
	this.website = website;
	this.userInfo = userInfo;
	this.callback = callback;
	this.init();
};

SearchAndReplace.prototype.imageReplace = function()
{
	var _this = this;

	// LOOP THROUGH ALL PAGES TO GET TO JSON OBJECTS
	$.each(pages, function(index, value)
	{
		$.each(this.jsonObj, function()
		{
			if(this.type == 'image')
			{
				var findPortrait  = this.src.search('(portraitimage)');

				if(findPortrait > 0)
				{
					console.log('test: ', firstPortraitImgPath)
					this.src = firstPortraitImgPath;
				};
				
				var findGroup  = this.src.search('(schoolgroup)');

				if(findGroup > 0)
				{
					this.src = firstGroupImgPath;
				};

				var findLogo  = this.src.search('(logo)');

				if(findLogo > 0)
				{
					this.src = logoPath;
				};
				// "http://192.168.0.216//CreateJS/StockImages/System/School/(logo)_thumb.png"
				// "http://192.168.0.216//CreateJS/StockImages/System/School/(schoolgroup)_thumb.jpg"
				// "http://192.168.0.216//CreateJS/StockImages/System/School/(landscape)_thumb.jpg"
				// "http://192.168.0.216//CreateJS/StockImages/System/School/(portraitimage)_thumb.jpg"

			};	
		});
	});


	this.callback();
};

SearchAndReplace.prototype.replaceText = function()
{
	var _this = this;


	// LOOP THROUGH ALL PAGES TO GET TO JSON OBJECTS
	$.each(pages, function(index, value)
	{
		$.each(this.jsonObj, function()
		{		
			if(typeof this.text !== 'undefined')
			{
				this.text = this.text.replace('(fullname)', _this.userInfo.firstName + ' ' + _this.userInfo.lastName)
								.replace('(firstname)',  _this.userInfo.firstName.replace('%20',''))
								.replace('(lastname)', _this.userInfo.lastName.replace('%20',''))
								.replace('(year)',  todaysDate.slice(0,4));
			}
		});
	});

	this.imageReplace();
};

SearchAndReplace.prototype.init = function()
{
	console.log('search and replace working', pages, ' USER INFO: ', this.userInfo, ' website', this.website);

	if(this.website == 'layoutBuilder')
	{
		this.callback();
		return;
	} else {
		this.replaceText();		
	}
	
};

/***********************************************
	Function:	Canvas Setup
	Author: 	Adam Lawrence
	Contact: 	adam@adamlawrencedesign.com	
*************************************************/

function CanvasSetup(type, callback)
{
	this.type = type;
	this.callback = callback;
	this.init();
}

CanvasSetup.prototype.setWrapper = function()
{
    $('#wrapAssets').css('height', window.innerHeight - ($('header').height()+60) + 'px');
    $('main').css('height', window.innerHeight - ($('header').height()+10) + 'px');
    $('aside').css('height', window.innerHeight - ($('header').height()) + 'px');
};

CanvasSetup.prototype.setJsonDimensions = function(width)
{
	var ratio;

	ratio = width / pages[0].jsonObj[0].width;
	
	$.each(pages, function()
	{
		$.each(this.jsonObj, function(index, value)
		{
			if(index == 0) this.selectable = false;

			this.width = this.width*ratio;
			this.height = this.height*ratio;
			this.left = this.left*ratio;
			this.top = this.top*ratio;

			switch(this.type)
			{
				case 'i-text':
					this.fontSize = this.fontSize*ratio;
					break;
				case 'circle':
					this.radius = this.radius*ratio;
					break;
			}
			// console.log('Show the updated width: ', this.width)
		});
	});

	this.callback();
};

CanvasSetup.prototype.setDimensions = function()
{
	var width, height;
	// SET THE DIMENSIONS OF THE CANVAS
	$.each(pages, function(index, value)
	{
		// CHECK IF LANDSCAPE 
		if(this.orientation == 'landscape')
		{
			var lengthRatio;

			if($('main').innerHeight()/$('main').innerWidth() < 0.7)
			{
				lengthRatio = 0.56;
			} else 
			{
				lengthRatio = 0.72;
			} 

			width = $('main').innerWidth()*lengthRatio;									
			height = width * this.landscape.ratio;
			
			// console.log('Show the ration of this landscape frame: ', $('main').innerHeight()/$('main').innerWidth());
			
			this.fabric.setWidth(width);
			this.fabric.setHeight(height);
			this.canvas.width = width;
			this.canvas.height = height;
			$('#grid').css({'height': height + 'px', 'width': width + 'px'})
			
		} else {
			// PORTRAIT APPLY THESE RULES
			if($('main').innerWidth()/$('main').innerHeight() > 0.9)
			{
				lengthRatio = 0.85;
			} else 
			{
				lengthRatio = 0.55;
			} 		

			// console.log('The ratio is: ', $('main').innerWidth()/$('main').innerHeight());

			height = $('main').innerHeight()*lengthRatio;		// 0.85							
			width = height * this.portrait.ratio;
			this.fabric.setWidth(width);
			this.fabric.setHeight(height);
			this.canvas.width = width;
			this.canvas.height = height;
			$('#grid').css({'height': height + 'px', 'width': width + 'px'})
		};
	});

	this.setJsonDimensions(width);
};

CanvasSetup.prototype.init = function()
{
	if(this.type == 'new')
	{
		for(var i = 0; i < pages.length; i++)
		{
			var id = 'canvas-' + i;

			pages[i].fabric = new fabric.Canvas(id,
			{
				backgroundColor:'#fff',
				selection: false,
			});	
		};
		$('.canvas-container').css({'position':'absolute','bottom': '2em'});
		this.setDimensions();
	} else {
		
		// THIS SHOULD BE IMPLEMENTED IF WINDOW RESIZED
		$.each(pages, function(index, value)
		{
			this.canvas.width = 0;
			this.canvas.height = 0;
		});

		this.setDimensions();
	};
};

/***********************************************
	Function:	initialise app
	Author: 	Adam Lawrence
	Contact: 	me@adamlawrence.com.au
*************************************************/

function AppInit(userInfo, website, type, productId, layoutId, jsonId)
{
	this.userInfo = userInfo;
	this.userId = this.userInfo.userId;
	this.id1 = this.userInfo.id1;
	this.id2 = this.userInfo.id2;
	this.userName = this.userInfo.firstName;
	this.website = website;
	this.type = type;
	this.productId = productId;
	this.layoutId = layoutId;
	this.jsonId = jsonId;
	// console.log('Show the user information object: ', userInfo);
	this.init();
}

AppInit.prototype.controllers = function()
{
	var _this = this;
	// START UP THE PALETTE CONTROLS  STEP 15. 
	var paletteInit = new Palette(false);
	
	// ADD EXPORT LISTENERS  
	var exportInit = new ExportJson(this.type, this.website, this.userId, this.userName, this.id1);

	// ADD LISTENER FOR ROTATION 	STEP 17.
	var rotateInit = new RotateCanvas('rotate', function()
					{
						$('#canvas-loader').fadeIn(400, function()
						{
							canvasInit = new CanvasSetup('rotate', function()
							{
								// ADD JSON TO CANVAS TO JSON  	STEP 9. 
								insertJSON = new InsertJSON('standard', function()
								{
									// ADD CROP MARKS IF NEEDED STEP 10.
									if(cropMarks) cropMarksInit = new CanvasGrid('cropMarks');
									// eventManagerInit = new EventManager('windowResize');
									// _this.asideInit();
									setTimeout(function()
									{
										$('#canvas-loader').fadeOut(800);
									},400);


								});
							});
						});
					});

	var saveInit = new SaveCanvas();

};

AppInit.prototype.buildCanvas = function()
{
	var _this = this,
		cropMarksInit;

	// START THE CANVAS WITH FABRIC 	STEP 8.
	var canvasInit = new CanvasSetup('new', function()
	{
		// SEARCH AND REPLACE STEP 8.5
		var startSearchAndReplace = new SearchAndReplace(_this.website, _this.userInfo, function()
			{
				// ADD JSON TO CANVAS TO JSON  	STEP 9. 
				var insertJSON = new InsertJSON('standard', function()
				{
					// ADD CROP MARKS IF NEEDED STEP 10.
					if(cropMarks) cropMarksInit = new CanvasGrid('cropMarks');
					var eventManagerInit = new EventManager('windowResize');
					
					_this.controllers();

					setTimeout(function()
					{
						pages[currentPageRef].fabric.renderAll();
						$('#canvas-loader').fadeOut(800);
					},1400)


				});
			});
	});	
};

AppInit.prototype.asideInit = function()
{
	var _this = this;

	// TIME 
	var images, textThemes, jsonObjs;

	// UPDATE THIS LATER
	// textThemes = this.getTextThemes();
	// jsonObjs = this.getJsonObjs();

	// LOAD ASSETS INTO SIDE BAR STEP 12. 
	var loadAssetsInit = new LoadAssets(this.website, this.userInfo, productData, function()
	{
		// START IMAGE UPLOADER 	STEP 14. 
		var imageUploader = new ImageUploader(_this.userId, null, 'Guests', function()
			{
				// INITALISE SLIM SCROLL 	STEP 15.
				var addScroll = new ScrollManager('wrapAssets','div');
				// ADD EVENT LISTENERS SO IMAGES CAN BE ADDED TO CANVAS 	STEP 14.
				// var addItemsInit = new AddItems(textThemes, jsonObjs); 

				var addTextControllers = new AddTextItems(); 
				var addImageControllers = new AddImages('pageLoad'); 
				
				$('#aside-loader').fadeOut(800);	

				_this.buildCanvas();

			});
	}); 
};

AppInit.prototype.pushProductData = function()
{
	var cropMarksInit, _this, startSearchAndReplace;

	_this = this;

	// GET PRODUCT INFORMATION AND PUSH DETAILS TO GLOBAL VARIABLE 
	var getProductInfo = new ServerRequest('http://192.168.0.216/AdvAPI/api/WCAPValues/Photocreate/' + this.productId, 'GET', false, function(data)
	{
		// PARSE PRODUCT DATA TO CREATE SIDE CONTENT AND SET GRID AND CANVAS STEP 6.
		productData = {
						'costCode': data[0].costCode,
						'cropRatio': data[0].cropRatio,
						'description': data[0].description,
						'descriptionURL': data[0].descriptionURL,
						'fheightMM': data[0].fheightMM,
						'fwidthMM': data[0].fwidthMM,
						'groupName': data[0].groupName,
						'heightMM': data[0].heightMM,
						'id': data[0].id,
						'itemName': data[0].itemName,
						'maxQuantity': data[0].maxQuantity,
						'numberOfPages': data[0].numberOfPages,
						'pcCode': data[0].numberOfPages,
						'postage': data[0].postage,
						'price': data[0].price,
						'unitPrice': data[0].unitPrice,
						'widthMM': data[0].widthMM,
					};

		// PRODUCT DATA HAS BEEN UPDATED 
		// INITALIZE CROP MARKS	STEP 7.
		if(productData.widthMM != productData.fwidthMM && productData.heightMM != productData.fwidthMM)
		{
			var portraitXRatio, portraitYRatio, landscapeXRatio, landscapeYRatio;
			
			portraitXRatio = productData.fwidthMM / productData.widthMM;
			portraitYRatio = productData.fheightMM / productData.heightMM;
			landscapeXRatio = productData.fheightMM / productData.heightMM;
			landscapeYRatio = productData.fwidthMM / productData.widthMM;

			cropMarks.push({'portrait':{'xRatio': portraitXRatio, 'yRatio': portraitYRatio },
							'landscape': {'xRatio': landscapeXRatio, 'yRatio': landscapeYRatio }
							});

			// console.log('Needs crop marks', cropMarks, 'Pages: ', pages);
		} else 
		{
			// NO CROP MARKS NEEDED
			cropMarks = false;
		};		

		// console.log('Pages variable: ', pages)

		_this.asideInit();

	});
};

//------------------------------------------------------
// INITAL SET UP, PUSHES JSON INFO INTO GLOBAL VARIABLES, SETS UP MULTIPAGE AND LOADS HTML ELEMENTS

AppInit.prototype.init = function()
{
	var _this, type, buildCanvas, fabric;

	_this = this;
	layoutData = {'id': _this.layoutId};
	type = [];

	var setPageStyle = new PageStyle( this.website, this.userInfo.id3, this.type )

	// SET THE CURRENT DATA VARIABLE STEP 0.
	var getServerTimeStamp = new ServerRequest('http://192.168.0.216/AdvAPI/api/CurrentDate', 'GET', false, function(date)
	{
		todaysDate = date;
	});

	// CHECK HOW MANY JSON IDS THERE ARE 	STEP 1.
	// CREATE AN ARRAY 
	var array = this.jsonId.split('_');

	$.each(array, function(index)
	{
		var getJsonInfo = new ServerRequest('http://192.168.0.216/AdvAPI/api/WJValues/' + this, 'GET', null, function(data)
			{

				var obj, json, placeholder, landscape, portrait, orientation;
				
				placeholder = {'height': '', 'width': ''};

				obj = JSON.parse(data.json.replace(',"background":"#fff"}','' ).replace('{"objects":', '').replace(';',''));
				placeholder.height = obj[0].height;
				placeholder.width = obj[0].width;

				// CHECK IF LANDSCAPE  STEP 2
				if(placeholder.width > placeholder.height)				
				{
					landscape = {'width': placeholder.width, 'height': placeholder.height, 'ratio': placeholder.height/placeholder.width};
					portrait = {'width': placeholder.height, 'height': placeholder.width,  'ratio': placeholder.height/placeholder.width};
					orientation = 'landscape';
				} 

				// IN THAT CASE IT MUST BE PORTRAIT OR SQUARE
				else if (placeholder.width <= placeholder.height) 
				{
					landscape = {'height': placeholder.height, 'width': placeholder.width, 'ratio': placeholder.width/placeholder.height};
					portrait = {'height': placeholder.width, 'width': placeholder.height, 'ratio': placeholder.width/placeholder.height};
					orientation = 'portrait';
				};		

				// PUSH DATA TO THE PAGES VARIABLE 
				// NEED TO ADD WEB JSON ID
				pages.push({
							'id' : data.pageNumber,
							'json' : data.json,
							'jsonId' : data.jsonID,
							'jsonObj' : JSON.parse(data.json.replace(',"background":"#fff"}','' ).replace('{"objects":', '').replace(';','')),
							'ref' : index,
							'portrait': portrait,
							'landscape':landscape,
							'orientation': orientation,
							'fabric': fabric,
							'canvas': {'width': '', 'height': ''}
							});	

				// CHECK FOR FINAL CYCLE OF THE EACH STATEMENT
				if((index+1) == array.length)
				{
					// INFO FOR PAGES PUSHED 
					// BUILD CANVAS CONTAINER & PAGNATION IF NEEDED		STEP 4.
					type = {'template': 'template-wrap-canvas', 'wrap': 'main-wrap', 'label': 'wrap-canvas', 'name': 'canvasWrap'};

					buildCanvas = new ElementBuilder(type, pages, function()
					{
						// NOW THE CANVAS CONTAINERS HAVE BEEN BUILT WE NEED TO INITIALISE THE PAGNATION STEP 5.
						if(pages.length > 1)
						{
							var type = {'name': 'canvasPagnation', 'wrap': 'nav-pages', 'label' : 'nav-page-' };
							var buildPagnation = new ElementBuilder(type, pages, function()
							{
								// console.log('Pagnation should be built');
								var pagnationInit = new Pagnation('nav-pages');
							});
						} 

						// WE KNOW HOW MANY PAGES THERE ARE NOW WE NEED TO ADD THE JSON TO EACH PAGE AND START UP THE APP   STEP 6.
						// LETS PUSH DATA TO THE LAYOUT AND PRODUCT DATA VARIABLE FOR FUTURE USE WE ARE GOING TO NEED THIS TO EXPORT OR UPATE THE TABLE					
						_this.pushProductData();
					});

				};

			});
	});
};

// END POINTS OR WEBPAGES 
// [Community-school] = community portal - schools
// [Community-sports] = community portal – weekend sports
// [advancedyou-school] = advanced you  - schools
// [advancedyou-sports] = advanced you  - weekend sports
// [advancedyou-family] =  advanced you  - family weekends
