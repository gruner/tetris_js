'use strict';

var Block = require('./block'),
    tetrominos = require('../config/tetrominos'),
    constants = require('../config/constants'),
    debug = require('../debug');

/**
 * All x and y dimensions are based on the playfield grid, NOT the canvas
 */
var Tetromino = function(type, blocks) {
    this.x = 3;
    this.y = 0;
    this.type = type;
    this.blocks = blocks;
    this.destinationX = null;
    this.destinationY = null;
};

/**
 * Define the different types (shapes) of tetrominos
 */
Tetromino.types = tetrominos;

/**
 * Creates a tetromino based on the given type
 */
Tetromino.create = function(type) {
    if (typeof tetrominos[type] !== 'undefined') {
        var blocks = [];

        for (var i = 0; i < tetrominos[type].blocks.length; i++) {
            var dims = tetrominos[type].blocks[i];
            blocks.push(new Block(dims.x, dims.y));
        }

        return new Tetromino(type, blocks);
    }
};

/**
 * Generates the random order of the next seven pieces
 */
Tetromino.randomizeNextBag = function() {

    // FisherYates shuffle - http://bost.ocks.org/mike/shuffle/
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex
            ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    if (typeof this.tetrominoTypeKeys === 'undefined') {
        this.tetrominoTypeKeys = Object.keys(Tetromino.types);
    }

    return shuffle(this.tetrominoTypeKeys);
};

Tetromino.prototype.moveByOffset = function(xOffset, yOffset) {
    this.x += xOffset;
    this.y += yOffset;
};

Tetromino.prototype.update = function(yOffset) {
    var newY = this.y + yOffset;
    if (newY <= this.destinationY) {
        this.y = newY;
    } else {
        this.y = this.destinationY;
    }
};

Tetromino.prototype.atDestination = function() {
    return (this.y >= this.destinationY);
};

/**
 * Returns array of block absolute block coordinates
 */
Tetromino.prototype.getBlockCoordinates = function() {
    var coordinates = [],
        self = this;

    this.traverseBlocks(function(block) {
        coordinates.push({
            x: self.x + block.x,
            y: self.y + block.y
        });
    });

    return coordinates;
};

/**
 * Blocks are saved with relative coordinates. This 
 * converts the coordinates to absolute values, and removes
 * the blocks from the stack, returning a new array
 */
Tetromino.prototype.releaseBlocks = function() {
    var blocks = [];

    while(this.blocks.length) {
        var block = this.blocks.shift();
        block.x += this.x;
        block.y += this.y;
        blocks.push(block);
    }

    return blocks;
};

Tetromino.prototype.getProjectedBlockCoordinates = function(xOffset, yOffset) {
    var projectedX = this.x + xOffset,
        projectedY = this.y + yOffset,
        coordinates = []
        ;

    for (var i = 0; i < this.blocks.length; i++) {
        coordinates.push({
            x: projectedX + this.blocks[i].x,
            y: projectedY + this.blocks[i].y
        });
    }

    return coordinates;
};
          
Tetromino.prototype.traverseBlocks = function(callback) {
    var iMax = this.blocks.length,
        i;
    for (i = 0; i < iMax; i++) {
        callback(this.blocks[i]);
    }
};

Tetromino.prototype.getTouchingRows = function() {
    var rows = [],
        uniqe = {};
    for (var i = 0; i < this.blocks.length; i++) {
        var row = this.blocks[i].y;

        if(uniqe.hasOwnProperty(row)) {
            continue;
        }
  
        rows.push(row);
        uniqe[row] = 1;
    }

    return rows;
};

Tetromino.prototype.handleCollision = function() {
};

Tetromino.prototype.rotateLeft = function() {
    this.rotate(constants.DIRECTION_LEFT);
};

Tetromino.prototype.rotateRight = function() {
    this.rotate(constants.DIRECTION_RIGHT);
};

Tetromino.prototype.rotate = function(direction) {
    if (direction === constants.DIRECTION_RIGHT) {
        this.traverseBlocks(function(i, block) {
            var swap = block.x;
            block.x = block.y;
            block.y = swap;
        });
    } else if (direction === constants.DIRECTION_LEFT) {
        this.traverseBlocks(function(i, block) {
            var swap = block.x;
            block.x = -block.y;
            block.y = swap;
        });
    }
};

module.exports = Tetromino;