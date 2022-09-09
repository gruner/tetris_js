'use strict';

var assert = require('assert'),
    RowCompleteAnimation = require('../../js/view/rowCompleteAnimation'),
    animation,
    ctxMock;

describe('RowCompleteAnimation', function() {

    beforeEach(function() {

        ctxMock = {
            beginPath: function() {},
            fillRect: function() {}
        };

        animation = new RowCompleteAnimation(ctxMock, []);
    });

    describe('#constructor', function() {
        it('should initialize with expected row count', function() {
            assert(animation.opacity === 1);
        });
    });
});