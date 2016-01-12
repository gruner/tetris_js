'use strict';

/**
 * Models a single square
 */
var Block = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 1;
    this.height = 1;
    this.color = null;
};

/**
 * Detects collision with another block
 * @return bool
 */
Block.prototype.collidesWith = function(block) {
    return this.x < block.x + block.width &&
        this.x + this.width > block.x &&
        this.y < block.y + block.height &&
        this.y + this.height > block.y;
};

/**
 * Detects collision between two blocks
 */
Block.collides = function(blockA, blockB) {
    return blockA.collidesWith(blockB);
};

module.exports = Block;