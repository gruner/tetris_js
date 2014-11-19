define(['config/canvasDimensions'], function(dimensions) {

    /**
     * Maintains state of a Tetromino on the canvas,
     * converting canvas coordinates to the playfield grid.
     */
    var TetrominoSprite = function(tetromino) {
        this.model = tetromino;
        this.x = dimensions.transpose(tetromino.x);
        this.y = dimensions.transpose(tetromino.y);
        this.color = null;
    };

    TetrominoSprite.prototype.getRow = function() {
        return this.model.x;
    };

    TetrominoSprite.prototype.getColumn = function() {
        return this.model.y;
    };

    TetrominoSprite.prototype.update = function(yOffset) {
        var newY = this.y + yOffset;
        if (newY <= this.model.destinationY) {
            this.y = newY;
            this.updateModel();
        } else {
            this.y = this.model.destinationY;
            this.model.y = this.model.destinationY;
        }
    };

    /**
     * As the sprite's coordinates change, update the model's
     * playfield grid coordinates
     */
    TetrominoSprite.prototype.updateModel = function() {
        if (this.y > dimensions.transpose(this.model.y)) {
            this.model.y++;
        }
    };

    return TetrominoSprite;
});