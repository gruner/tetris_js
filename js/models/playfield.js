'use strict';

var debug = require('../debug'),
    Block = require('./block'),
    Validate = require('../util/validate');

/**
 * Models the state of the playfield game grid.
 * A multidimensional array represents the x and y grid coordinates.
 * Each cell in the grid can hold one Block model
 */
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
 * Returns a multidimensional array of undefined values
 * in the dimensions of the grid
 */
Playfield.prototype.buildGrid = function() {
    return new Array(this.yCount);
};

/**
 * Returns an array of undefined values for each column in a row
 */
Playfield.prototype.createEmptyRow = function() {
    return new Array(this.xCount);
};

/**
 * Executes a callback for each row in the grid (bottom to top)
 * passing the contents of the row to the callback
 */
Playfield.prototype.traverseRows = function(callback) {
    for (var i = this.yCount - 1; i >= 0; i--) {
        var row = this.grid[i];
        callback(i, row);
    }
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
 * Removes an array of rows one at a time
 */
Playfield.prototype.clearRows = function(rows) {
    var i,
        iMax = rows.length;

    for (i = 0; i < iMax; i++) {
        this.clearRowAt(rows[i]);
    }
};

/**
 * Removes a row at the given index and adds
 * a new empty row to the top
 */
Playfield.prototype.clearRowAt = function(y) {
    var row;
    if (y < this.grid.length) {
        row = this.grid.splice(y, 1)[0]; // splice returns array, we only want the first element
        this.grid.unshift([]); // insert new empty top row
    }

    return row;
};

/**
 * Settle any remaining blocks after a row is cleared.
 *
 * For each occupied cell in a row, check if the cell below it is empty
 * And merge them
 *
 *        A
 *   BB
 * CC  CCC CC => CCBBCCCACC
 * ------
 *   xxxx
 * xx  xxxxxx => no change, treat line as a whole
 */
Playfield.prototype.settleRows = function() {
    var self = this,
        merges = false,
        j;

    // For each row, find empty places
    // that the above row can fill
    self.traverseRows(function(i, targetRow) {
        var topNeighboringRow = self.grid[i-1], // traversing bottom to top
            mergable = false,
            mergedRow;

        if (!targetRow || !topNeighboringRow) { return; }

        if (self.rowsAreMergable(targetRow, topNeighboringRow)) {
            self.grid[i] = self.mergeRows(targetRow, topNeighboringRow);
            self.clearRowAt(i-1);
            merges = true;
        }
    });

    // Recurse until all rows are settled
    if (merges) {
        self.settleRows();
    }

    return merges;
};

/**
 * Checks if topNeighboringRow can be merged into targetRow
 * @return bool
 */
Playfield.prototype.rowsAreMergable = function(targetRow, topNeighboringRow) {
    var mergable = false,
        i;

    for (i = 0; i < topNeighboringRow.length; i++) {
        if (topNeighboringRow[i]) {
            if (targetRow[i] === undefined) {
                mergable = true;
            } else {
                mergable = false;
                break;
            }
        }
    }

    return mergable;
};

/**
 * Merges topNeighboringRow into targetRow
 * @return array
 */
Playfield.prototype.mergeRows = function(targetRow, topNeighboringRow) {
    var i,
        merged = new Array(this.xCount);
    for (i = 0; i < this.xCount; i++) {
        merged[i] = (targetRow[i] === undefined) ? topNeighboringRow[i] : targetRow[i];
    }

    return merged;
};

/**
 * Checks that a row is complete, i.e. filled with blocks. If a row is undefined, it has no cells,
 * if any cells are undefined they are empty
 * @return bool
 */
Playfield.prototype.rowComplete = function(y) {
    var complete,
        i;

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
 * Returns array of y coordinates for all completed rows
 * TODO: pass in optional rows to check (i.e. only check the rows that a newly placed tetromino is touching)
 */
Playfield.prototype.getCompletedRows = function() {
    var self = this,
        completedRows = [];

    this.traverseRows(function(i, row) {
        if (self.rowComplete(i)) {
            completedRows.push(i);
        }
    });

    return completedRows;
};

/**
 * Checks that a cell is empty
 * @return bool
 */
Playfield.prototype.cellEmpty = function(cell) {
    var empty = false;

    if (this.cellInBounds(cell)) {
        if (typeof this.grid[cell.y] === 'undefined' || typeof this.grid[cell.y][cell.x] === 'undefined') {
            empty = true;
        }
    }

    return empty;
};

/**
 * Checks that a cell is in the bounds of the playfield
 * @return bool
 */
Playfield.prototype.cellInBounds = function(cell) {
    return (cell.y >= 0 && cell.y < this.yCount && cell.x >= 0 && cell.x < this.xCount);
};

/**
 * Checks that an array of blocks are valid for placement at their given coordinates
 * @return bool
 */
Playfield.prototype.validateBlockPlacement = function(blocks) {
    var valid = Array.isArray(blocks);
    for (var i = 0; i < blocks.length; i++) {
        if (!this.validateBlock(blocks[i])) {
            valid = false;
            break;
        }
    }

    return valid;
};

/**
 * Checks that a block's coordinates are within the bounds of the playfield,
 * and that the block's cell is available
 * @param Block block
 * @return bool
 */
Playfield.prototype.validateBlock = function(block) {
    return (
        Validate.coordinates(block) && 
        this.cellInBounds(block) && 
        this.cellEmpty(block)
    );
};

/**
 * Adds a block to the playfield at the block's coordinates
 */
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

/**
 * Adds an array of blocks to the playfield
 */
Playfield.prototype.placeBlocks = function(blocks) {
    for (var i = 0, iMax = blocks.length; i < iMax; i++) {
        this.placeBlock(blocks[i]);
    }
};

Playfield.prototype.distributeRandomBlocks = function(blockCount) {
    var blockTypes = require('./tetrominoTypes').getTypeKeys();

    // While there remain blocks to distribute...
    while (0 !== blockCount) {
        var block = new Block(
            Math.floor(Math.random() * this.xCount),
            Math.floor(Math.random() * this.yCount)
        );
        block.type = blockTypes[Math.floor(Math.random() * blockTypes.length)];

        if (this.validateBlock(block)) {
            this.placeBlock(block);
            blockCount--;
        }
    }
};

module.exports = Playfield;