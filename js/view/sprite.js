'use strict';

/**
 * Represents the on-screen version of a model
 */
var Sprite = function(color) {
    this.x = 0;
    this.y = 0;
    this.color = color;
};

// Sprite.prototype.move = function(xOffset, yOffset) {
//     this.x += xOffset;
//     this.y += yOffset;
// };

// Sprite.prototype.moveLeft = function(xOffset) {
//     this.x -= xOffset;
// };

// Sprite.prototype.moveRight = function(xOffset) {
//     this.x += xOffset;
// };

// Sprite.prototype.moveDown = function(yOffset) {
//     this.y += yOffset;
// };

module.exports.Sprite = Sprite;