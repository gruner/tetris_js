'use strict';

var assert = require('assert'),
    RowCompleteAnimation = require('../../js/view/rowCompleteAnimation'),
    animation;

describe('RowCompleteAnimation', function() {

    beforeEach(function() {
        animation = new RowCompleteAnimation();
    });

    describe('#constructor', function() {
        it('should initialize with expected row count', function() {
            assert(animation.opacity === 1);
        });
    });
});