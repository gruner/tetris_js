/**
 * Manages a queue of animation objects so that they draw in sequence
 */

'use strict';

module.exports = {
    animations: [],
    draw: function() {
        if (this.animations.length) {
            this.animations[0].draw();
            if (this.animations[0].complete) {
                this.animations.shift();
            }
        }
    }
};