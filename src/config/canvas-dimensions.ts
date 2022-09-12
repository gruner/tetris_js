export const CanvasDimensions = {
  gridSize: 30,
  playfieldOrigin: {x:0, y:0},
  blockBorderWidth: 1,

  /**
   * Multiplies GameEngine units to the rendered grid size
   */
  transpose: function(value: number) {
    return this.gridSize * value;
  },

  /**
   * Divides rendered size by GameEngine units
   */
  transposeFrom: function(value: number) {
    return Math.floor(value / this.gridSize);
  }
};