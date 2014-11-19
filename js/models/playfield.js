define(['debug'], function(debug) {

    var Playfield = function(xCount, yCount) {
        this.xCount = xCount;
        this.yCount = yCount;
        this.grid = this.buildGrid();
    };

    Playfield.defaults = {
        xCount: 10,
        yCount: 22
    };

    /**
     * Returns a multidimensional array of null values
     * in the dimensions of the grid
     */
    Playfield.prototype.buildGrid = function() {
        return new Array(this.yCount);
    };

    /**
     * Returns an array of null values for each column in a row
     */
    Playfield.prototype.createEmptyRow = function() {
        return new Array(this.xCount);
    };

    /**
     * Executes a callback for each cell in the grid, passing the contents
     * of the cell to the callback
     */
    Playfield.prototype.traverseGrid = function(callback) {
        for (var i = 0; i < this.yCount; i++) {
            for (var j = 0; j < this.xCount; j++) {
                var cell;
                if (this.grid[i] && this.grid[i][j]) {
                    cell = this.grid[i][j];
                }
                callback(cell);
            }
        }
    };

    /**
     * Removes a row at the given index and adds
     * a new empty row to the top
     */
    Playfield.prototype.removeRowAt = function(y) {
        var row;
        if (y < this.grid.length) {
            row = this.grid.splice(y, 1)[0];
            this.grid.unshift([]);
        }

        return row;
    };

    /**
     * Checks that a row is complete. If a row is undefined, it has no cells,
     * if any cells are undefined they are empty
     */
    Playfield.prototype.rowComplete = function(y) {
        var complete,
            i, iMax;

        if (typeof this.grid[y] === 'undefined') {
            complete = false;
        } else {
            complete = true;
            for (i = 0; i < this.xCount; i++) {
                if (typeof this.grid[y][i] === 'undefined') {
                    complete = false;
                    break;
                }
            }
        }

        return complete;
    };

    /**
     * Checks that a cell is empty
     */
    Playfield.prototype.cellEmpty = function(x, y) {
        var empty = false;

        if (this.cellInBounds(x, y)) {
            if (typeof this.grid[y] === 'undefined' || typeof this.grid[y][x] === 'undefined') {
                empty = true;
            }
        }

        return empty;
    };

    /**
     * Checks that a cell is in the bounds of the playfield
     */
    Playfield.prototype.cellInBounds = function(x, y) {
        return (y >= 0 && y < this.yCount && x >= 0 && x < this.xCount);
    };

    /**
     * Checks that an array of blocks are valid for placement at their given coordinates
     */
    Playfield.prototype.validateBlockPlacement = function(blocks) {
        var valid = true;
        for (var i = 0; i < blocks.length; i++) {
            if (!this.validateBlock(blocks[i])) {
                valid = false;
                break;
            }
        }

        return valid;
    };

    Playfield.prototype.validateBlock = function(block) {
        return (this.cellInBounds(block.x, block.y) && this.cellEmpty(block.x, block.y));
    };

    Playfield.prototype.placeBlocks = function(blocks) {
        for (var i = 0, iMax = blocks.length; i < iMax; i++) {
            this.placeBlock(blocks[i]);
        }
    };

    Playfield.prototype.placeBlock = function(block) {
        if (this.validateBlock(block)) {
            if (typeof this.grid[block.y] === 'undefined') {
                this.grid[block.y] = this.createEmptyRow();
            }
            this.grid[block.y][block.x] = block;
        } else {
            debug.log('invalid block placement at ' + block.x + ', ' + block.y);
        }
    };

    return Playfield;
});