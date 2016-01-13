'use strict';

var Block = require('./block'),
    tetrominos = require('./tetrominoTypes'),
    constants = require('../config/constants'),
    debug = require('../debug');

/**
 * Models a Tetromino tile, composed of Block models
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
 * Factory for creating a tetromino based on the given type
 */
Tetromino.create = function(typeKey) {

    var type = tetrominos.getType(typeKey);

    if (type) {
        var blocks = [];

        for (var i = 0; i < type.blocks.length; i++) {
            var dims = type.blocks[i];
            blocks.push(new Block(dims.x, dims.y));
        }

        return new Tetromino(typeKey, blocks);
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

    return shuffle(tetrominos.getTypeKeys());
};

/**
 * Increments the x and y coordinates by the given offsets
 */
Tetromino.prototype.moveByOffset = function(xOffset, yOffset) {
    this.x += xOffset;
    this.y += yOffset;
};

/**
 * Replaces the tetromino coordinats with the given coordinates
 * e.g. tetromino.move({x:3, y:7});
 */
Tetromino.prototype.move = function(coordinates) {
    if (coordinates.hasOwnProperty('x') && coordinates.hasOwnProperty('y')) {
        this.x = coordinates.x;
        this.y = coordinates.y;
    }
};

/**
 * Increments y coordinates by the given offset,
 * used to update the position as it falls
 */
Tetromino.prototype.update = function(yOffset) {
    var newY = this.y + yOffset;
    if (newY <= this.destinationY) {
        this.y = newY;
    } else {
        this.y = this.destinationY;
    }
};

/**
 * Tests that the current y coordinate matches the destination
 * @return bool
 */
Tetromino.prototype.atDestination = function() {
    return (this.y >= this.destinationY);
};

/**
 * Returns array of absolute block coordinates
 */
Tetromino.prototype.getBlockCoordinates = function() {
    var coordinates = [],
        self = this;

    this.traverseBlocks(function(i, block) {
        coordinates.push({
            x: self.x + block.x,
            y: self.y + block.y
        });
    });

    return coordinates;
};

/**
 * Blocks are saved with relative coordinates.
 * This converts the coordinates to absolute values,
 * and removes the blocks from the stack, returning a new array.
 * Used to convert a discrete tetromino into blocks on the playfield
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

/**
 * Returns array of coordinates for each block, calculated from offset x and y
 */
Tetromino.prototype.getBlockCoordinatesForOffset = function(xOffset, yOffset) {
    var projectedX = this.x + xOffset,
        projectedY = this.y + yOffset,
        coordinates = []
        ;

    this.traverseBlocks(function(i, block) {
        coordinates.push({
            x: projectedX + block.x,
            y: projectedY + block.y
        });
    });

    return coordinates;
};

/**
 * Iterates over blocks array passing each block to the given callback
 */
Tetromino.prototype.traverseBlocks = function(callback) {
    var iMax = this.blocks.length,
        i;
    for (i = 0; i < iMax; i++) {
        callback(i, this.blocks[i]);
    }
};

/**
 * Rotates tetromino left or right by changing its block coordinates
 */
Tetromino.prototype.rotate = function(direction) {
    direction = direction || constants.DIRECTION_LEFT;

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

Tetromino.prototype.getBlockCoordinatesForRotation = function(direction) {
    direction = direction || constants.DIRECTION_LEFT;
    var coordinates = [];

    if (direction === constants.DIRECTION_RIGHT) {
        this.traverseBlocks(function(i, block) {
            coordinates.push({
                x: block.y,
                y: block.x
            });
        });
    } else if (direction === constants.DIRECTION_LEFT) {
        this.traverseBlocks(function(i, block) {
            coordinates.push({
                x: -block.y,
                y: block.x
            });
        });
    }

    return coordinates;
};

Tetromino.prototype.rotateLeft = function() {
    this.rotate(constants.DIRECTION_LEFT);
};

Tetromino.prototype.rotateRight = function() {
    this.rotate(constants.DIRECTION_RIGHT);
};

module.exports = Tetromino;