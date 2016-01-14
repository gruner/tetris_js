'use strict';

module.exports = {
    gridSize: 30,
    playfield: {x:0, y:0},
    blockBorderWidth: 1,

    /**
     * Multiplies GameEngine units to the rendered grid size
     */
    transpose: function(value) {
        return this.gridSize * value;
    }
};