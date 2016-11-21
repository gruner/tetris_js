'use strict';

var assert = require('assert'),
    debug = require('../js/debug');

describe('Theme', function() {

    describe('#enable', function() {
        it('should have a single shared instance', function() {
            debug.enable();
            var debug2 = require('../js/debug');

            assert(debug.enabled());
            assert(debug2.enabled());

            debug2.disable();

            assert(false === debug.enabled());
            assert(false === debug2.enabled());
        });
    });
});
