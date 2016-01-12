/**
 * Manages a queue of animation objects so that they draw in sequence
 */

'use strict';

module.exports = {
    animations: [],

    /**
     * Draws the next frame in the animation stack
     * @return bool - whether or not a frame was drawn
     */
    draw: function() {
        if (this.animations.length) {
            this.animations[0].draw();
            if (this.animations[0].complete) {
                this.animations.shift();
            }
            return true;
        } else {
        	return false;
        }
    }
};