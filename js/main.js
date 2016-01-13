'use strict';

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
// (function() {
//     var lastTime = 0;
//     var vendors = ['ms', 'moz', 'webkit', 'o'];
//     for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//         window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
//         window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
//                                    || window[vendors[x]+'CancelRequestAnimationFrame'];
//     }
 
//     if (!window.requestAnimationFrame)
//         window.requestAnimationFrame = function(callback, element) {
//             var currTime = new Date().getTime();
//             var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//             var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
//               timeToCall);
//             lastTime = currTime + timeToCall;
//             return id;
//         };
 
//     if (!window.cancelAnimationFrame)
//         window.cancelAnimationFrame = function(id) {
//             clearTimeout(id);
//         };
// }());

var $ = require('jquery')
    ,Tetris  = require('./tetris')
    ,debug = require('./debug')
    ;
/**
 * Initializes game on the DOM
 */
$(document).ready(function() {
    var el = document.getElementsByClassName('tetris'),
        i,
        iMax = el.length
        ;

    for (i = 0; i < iMax; i++) {
        // TODO: create canvas tag if it doesn't exist
        if (el[i].nodeName == 'CANVAS') {
            var tetris = new Tetris(el[i]);
            tetris.run();
        }
    }
});