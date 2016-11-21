'use strict';

var assert = require('assert'),
    animationQueue = require('../../js/view/animationQueue');

var AnimationMock = function() {
    this.complete = false;
};
AnimationMock.prototype.draw = function() {
    this.complete = true;
};

describe('animationQueue', function() {

    beforeEach(function() {
        animationQueue.clear();
    });

    describe('#push', function() {
        it('should have queue of animations', function() {
            var length = animationQueue.push(new AnimationMock());
            assert(length === 1)
            var length = animationQueue.push(new AnimationMock());
            assert(length === 2);
        });
    });

    describe('#draw', function() {
        it('should draw each animation', function() {
            animationQueue.push(new AnimationMock());
            animationQueue.push(new AnimationMock());
            animationQueue.push(new AnimationMock());
            assert(true === animationQueue.draw());
            assert(true === animationQueue.draw());
            assert(true === animationQueue.draw());
            assert(false === animationQueue.draw());
        });
    });
});