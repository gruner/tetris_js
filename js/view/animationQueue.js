/**
 * Manages a queue of animation objects so that they draw in sequence
 */

'use strict';

var animations = [];

module.exports = {
    /**
     * Draws the next frame in the animation stack
     * @return bool - whether or not a frame was drawn
     */
    draw: function() {
        if (animations.length) {
            animations[0].draw();
            if (animations[0].complete) {
                animations.shift();
            }
            return true;
        } else {
        	return false;
        }
    },
    push: function(animation) {
        return animations.push(animation);
    },
    clear: function() {
        animations = [];
    }
};