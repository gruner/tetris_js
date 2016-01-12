'use strict';

var eventDispatcher = require('../eventDispatcher'),
    events = require('../config/events'),
    dimensions = require('../config/canvasDimensions'),
    Sprite = require('./sprite'),
    RowCompleteAnimation = require('./rowCompleteAnimation'),
    RowCollapseAnimation = require('./rowCollapseAnimation'),
    canvasCache = require('./canvasCache'),
    animationQueue = require('./animationQueue');

var Canvas = function(canvasElement, gameEngine) {

    this.ctx = null; // canvas context
    this.gameEngine = gameEngine;
    this.imageCache = {};

    this.dimensions = {
        gridSize: 30,
        playfield: {x:0, y:0}
    };

    this.init(canvasElement);
};

Canvas.prototype.init = function(canvasElement) {

    if (canvasElement.getContext) {
        this.ctx = canvasElement.getContext('2d');
    } else {
        // canvas-unsupported code here
    }
};

Canvas.prototype.bindEvents = function() {
    eventDispatcher.subscribe(events.rowComplete, this.animateRowComplete);
};

/**
 * Draws entire game on each update loop
 */
Canvas.prototype.draw = function() {
    this.drawPlayfield();
    this.drawBlocks();

    // If animations are in-progress, draw the next frame,
    // otherwise resume normal drawing
    if (!animationQueue.draw()) {
        this.drawGhostPiece(); // has to go before tetromino, so that it's behind it
        this.drawTetromino(this.gameEngine.activeTetromino);
    }
};

/**
 * Draws the playfield - the background rectangle
 * @TODO cache this as an image after the first draw
 */
Canvas.prototype.drawPlayfield = function() {
    var width = dimensions.transpose(this.gameEngine.playfield.xCount),
        height = dimensions.transpose(this.gameEngine.playfield.yCount);

    this.ctx.fillStyle = this.gameEngine.theme.playfield.color;
    this.ctx.fillRect(dimensions.playfield.x, dimensions.playfield.y, width, height);
};

/**
 * Draws all blocks (pieces of previously dropped tetrominos)
 */
Canvas.prototype.drawBlocks = function() {
    var self = this;

    this.gameEngine.playfield.traverseGrid(function(block) {
        if (typeof block !== 'undefined') {
            self.drawBlock(dimensions.transpose(block.x), dimensions.transpose(block.y), block.color);
        }
    });
};

/**
 * Draws a single block
 */
Canvas.prototype.drawBlock = function(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, dimensions.gridSize, dimensions.gridSize);
};

/**
 * Draws a tetromino in the current theme
 * TODO: Draw the outline of the entire tetromino rather than
 * all of its blocks to prevent gaps between blocks
 */
Canvas.prototype.drawTetromino = function(tetromino, color) {
    color = color || this.gameEngine.theme.tetrominos[tetromino.type].color;
    
    var self = this,
        x, y
        ;
    
    tetromino.traverseBlocks(function(i, block) {
        x = dimensions.transpose(tetromino.x) + dimensions.transpose(block.x);
        y = dimensions.transpose(tetromino.y) + dimensions.transpose(block.y);

        self.drawBlock(x, y, color);
    });
};

/**
 * Draws the ghost piece
 */
Canvas.prototype.drawGhostPiece = function() {
    this.drawTetromino(this.gameEngine.getGhostPiece(), this.gameEngine.theme.ghostPiece.color);
};

// Canvas.prototype.getTetrominoSprite = function() {
//     if (typeof this.tetrominoSprite === 'undefined') {
//         this.tetrominoSprite = new Sprite();
//     }
//     this.tetrominoSprite.x = dimensions.transpose(this.gameEngine.activeTetromino.x);
//     this.tetrominoSprite.y = dimensions.transpose(this.gameEngine.activeTetromino.y);
// };

/**
 * Handler for the rowComplete event
 * Adds row complete and collapse animations to the animation queue
 */
Canvas.prototype.animateRowComplete = function(data) {
    var rows = data.rows;
    animationQueue.push(new RowCompleteAnimation(this.ctx, rows));
    animationQueue.push(new RowCollapseAnimation(this.ctx, rows));
};

Canvas.prototype.spliceTop = function() {};

module.exports = Canvas;