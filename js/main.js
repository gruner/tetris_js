'use strict';

var Tetris  = require('./tetris'),
    debug = require('./debug')
    ;

/**
 * Expose Tetris global
 */
(function() {
    // Globally enable
    debug.enable();

    window.Tetris = Tetris;
})();
