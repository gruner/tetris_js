define(function() {
    return {
        gridSize: 30,
        playfield: {x:0, y:0},

        /**
         * Multiplies GameEngine units to the rendered grid size
         */
        transpose: function(value) {
            return this.gridSize * value;
        }
    };
});