'use strict';

var eventDispatcher = require('../eventDispatcher'),
    events = require('../config/events'),
    dimensions = require('../config/canvasDimensions'),
    Sprite = require('./sprite'),
    RowCompleteAnimation = require('./rowCompleteAnimation'),
    RowCollapseAnimation = require('./rowCollapseAnimation'),
    canvasCache = require('./canvasCache'),
    animationQueue = require('./animationQueue'),
    features = require('../config/features');

/**
 * Renders the view according to GameEngine state.
 * Encapsulates canvas draw commands.
 */
var Canvas = function(canvasElement, gameEngine) {

    this.ctx = null; // canvas context
    this.gameEngine = gameEngine;

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
    var self = this;
    eventDispatcher.subscribe(events.rowComplete, self.animateRowComplete);
};

/**
 * Draws entire game on each update loop
 */
Canvas.prototype.draw = function() {
    this.drawPlayfield();
    this.drawRemnantBlocks();

    // If animations are in-progress, draw the next frame,
    // otherwise resume normal drawing
    if (!animationQueue.draw()) {
        if (features.enabled('ghostPiece')) {
            this.drawGhostPiece(); // has to draw before tetromino, so that it renders behind it
        }
        this.drawTetromino(
            this.gameEngine.activeTetromino,
            this.gameEngine.getTetrominoStyle(this.gameEngine.activeTetromino.type).color,
            this.gameEngine.theme.tetrominoBorder
        );
    }
};

/**
 * Draws the playfield - the background rectangle
 * @TODO cache this as an image after the first draw
 */
Canvas.prototype.drawPlayfield = function() {
    this.ctx.fillStyle = this.gameEngine.theme.playfield.color;
    this.ctx.fillRect(
        dimensions.playfieldOrigin.x,
        dimensions.playfieldOrigin.y,
        dimensions.transpose(this.gameEngine.playfield.xCount),
        dimensions.transpose(this.gameEngine.playfield.yCount)
    );
};

/**
 * Draws all blocks from previously dropped tetrominos
 */
Canvas.prototype.drawRemnantBlocks = function() {
    var self = this;
    this.gameEngine.playfield.traverseGrid(function(block) {
        if (typeof block !== 'undefined') {
            self.drawBlock(
                dimensions.transpose(block.x),
                dimensions.transpose(block.y),
                self.gameEngine.getTetrominoStyle(block.type).color,
                self.gameEngine.theme.tetrominoBorder
            );
        }
    });
};

/**
 * Draws a single block. All game elements are made of blocks.
 */
Canvas.prototype.drawBlock = function(x, y, fillColor, borderColor) {
    this.ctx.beginPath();
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(x, y, dimensions.gridSize, dimensions.gridSize);

    if (borderColor) {
        this.ctx.lineWidth = dimensions.blockBorderWidth;
        this.ctx.strokeStyle = borderColor;
        this.ctx.strokeRect(x, y, dimensions.gridSize, dimensions.gridSize);
    }
};

/**
 * Draws a tetromino by drawing each of its blocks
 */
Canvas.prototype.drawTetromino = function(tetromino, fillColor, borderColor) {
    var self = this,
        originX = dimensions.transpose(tetromino.x),
        originY = dimensions.transpose(tetromino.y);
    
    tetromino.traverseBlocks(function(i, block) {
        self.drawBlock(
            originX + dimensions.transpose(block.x),
            originY + dimensions.transpose(block.y),
            fillColor,
            borderColor
        );
    });
};

/**
 * Draws the ghost piece - the shadow showing where the active piece will come to rest
 */
Canvas.prototype.drawGhostPiece = function() {
    this.drawTetromino(this.gameEngine.getGhostPiece(), this.gameEngine.theme.ghostPiece.color);
};

/**
 * Handler for the rowComplete event
 * Adds row complete and collapse animations to the animation queue
 */
Canvas.prototype.animateRowComplete = function(data) {
    var rows = data.rows;
    animationQueue.push(new RowCompleteAnimation(this.ctx, rows));
    animationQueue.push(new RowCollapseAnimation(this.ctx, rows));
};

/**
 * When a row is complete, save everything above it in order to animate it moving down
 */
// Canvas.prototype.spliceTop = function() {};

module.exports = Canvas;