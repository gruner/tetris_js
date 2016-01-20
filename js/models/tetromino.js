'use strict';

var Block = require('./block'),
    tetrominos = require('./tetrominoTypes'),
    constants = require('../config/constants'),
    Validate = require('../util/validate'),
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
    this.destination = null;
};

/**
 * Factory for creating a tetromino based on the given type
 */
Tetromino.create = function(typeKey) {

    var type = tetrominos.getType(typeKey);

    if (type) {
        var blockRotations = [],
            tetromino;

        for (var i = 0; i < type.blocks.length; i++) {
            var blocks = [];
            for (var j = 0; j < type.blocks[i].length; j++) {
                var coordinates = type.blocks[i][j];
                if (Validate.coordinates(coordinates)) {
                    blocks.push(new Block(coordinates.x, coordinates.y));
                } else {
                    throw new Error('Invalid block coordinates');
                }
            };

            blockRotations.push(blocks);
        }

        return new Tetromino(typeKey, blockRotations);
    } else {
        throw new Error('Cannot create tetromino of type ' + typeKey);
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
Tetromino.prototype.moveByOffset = function(coordinates) {
    if (Validate.coordinates(coordinates)) {
        this.x += coordinates.x;
        this.y += coordinates.y;
    }
};

/**
 * Replaces the tetromino coordinates with the given coordinates
 * e.g. tetromino.move({x:3, y:7});
 */
Tetromino.prototype.move = function(coordinates) {
    if (Validate.coordinates(coordinates)) {
        this.x = coordinates.x;
        this.y = coordinates.y;
    }
};

/**
 * Moves tetromino down by one grid unit
 */
Tetromino.prototype.drop = function() {
    this.move({x:this.x, y:this.y+1});
};

/**
 * DEPRICATED
 * Increments y coordinates by the given offset,
 * used to update the position as it falls
 */
// Tetromino.prototype.update = function(yOffset) {
//     var newY = this.y + yOffset;
//     if (newY <= this.destination.y) {
//         this.y = newY;
//     } else {
//         this.y = this.destination.y;
//     }
// };

Tetromino.prototype.setDestination = function(coordinates) {
    if (Validate.coordinates(coordinates)) {
        this.destination = coordinates;  
    }
};

/**
 * Tests that the current y coordinate matches the destination
 * @return bool
 */
Tetromino.prototype.atDestination = function() {
    return (this.y >= this.destination.y);
};

/**
 * Returns array of absolute block coordinates
 * for the current orientation
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
 * This converts the coordinates to absolute values, returning a new array.
 * Used to convert a discrete tetromino into blocks on the playfield
 */
Tetromino.prototype.releaseBlocks = function() {
    var self = this,
        blocks = [];

    this.traverseBlocks(function(i, block) {
        var absoluteBlock = new Block(
            block.x += self.x,
            block.y += self.y
        );
        absoluteBlock.type = self.type; // released blocks reference their original type for styling

        blocks.push(absoluteBlock);
    });

    return blocks;
};

/**
 * Returns array of coordinates for each block in the current orientation,
 * calculated from offset x and y
 */
Tetromino.prototype.getBlockCoordinatesForOffset = function(coordinates) {

    if (!Validate.coordinates(coordinates)) {
        return;
    }

    var projectedX = this.x + coordinates.x,
        projectedY = this.y + coordinates.y,
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

Tetromino.prototype.getBlockCoordinatesForDrop = function() {
    return this.getBlockCoordinatesForOffset({x:0, y:1});
};

/**
 * Iterates over blocks array passing each block to the given callback
 */
Tetromino.prototype.traverseBlocks = function(callback) {
    var iMax = this.blocks[0].length,
        i;
    for (i = 0; i < iMax; i++) {
        callback(i, this.blocks[0][i]);
    }
};

/**
 * Rotates tetromino left or right by cycling through block orientation configurations
 */
Tetromino.prototype.rotate = function(direction) {
    direction = direction || constants.DIRECTION_LEFT;

    if (direction === constants.DIRECTION_RIGHT) {
        // The first becomes last
        this.blocks.push(this.blocks.shift());
    } else if (direction === constants.DIRECTION_LEFT) {
        // The last becomes first
        this.blocks.unshift(this.blocks.pop());
    }
};

/**
 * Returns array of absolute coordinates for the given rotation
 */
Tetromino.prototype.getBlockCoordinatesForRotation = function(direction) {
    var coordinates = [],
        rotatedBlocks = this.blocks.length > 1 ? this.blocks[1] : this.blocks[0],

    rotatedBlocks = direction === constants.DIRECTION_RIGHT ? rotatedBlocks : this.blocks[this.blocks.length - 1];

    for (var i = 0; i < rotatedBlocks.length; i++) {
        coordinates.push({
            x: this.x + rotatedBlocks[i].x,
            y: this.y + rotatedBlocks[i].y
        });
        
    };

    return coordinates;
};

Tetromino.prototype.rotateLeft = function() {
    this.rotate(constants.DIRECTION_LEFT);
};

Tetromino.prototype.rotateRight = function() {
    this.rotate(constants.DIRECTION_RIGHT);
};

module.exports = Tetromino;