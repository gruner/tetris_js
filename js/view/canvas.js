'use strict';

var eventDispatcher = require('../eventDispatcher'),
    events = require('../config/events'),
    dimensions = require('../config/canvasDimensions'),
    Sprite = require('./sprite'),
    canvasCache = require('./canvasCache'),
    animationQueue = require('./animationQueue');

var Canvas = function(canvasElement, gameEngine) {

    this.ctx = null;
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

Canvas.prototype.draw = function() {
    this.drawPlayfield();
    this.drawTetromino(this.gameEngine.activeTetromino);
    // this.drawBlocks();
    this.drawGhostPiece();
    //this.drawAnimations();
    animationQueue.draw();
};

Canvas.prototype.drawPlayfield = function() {
    var width = dimensions.transpose(this.gameEngine.playfield.xCount);
        height = dimensions.transpose(this.gameEngine.playfield.yCount);

    this.ctx.fillStyle = this.gameEngine.theme.playfield.color;
    this.ctx.fillRect (dimensions.playfield.x, dimensions.playfield.y, width, height);
};

Canvas.prototype.drawBlocks = function() {
    this.gameEngine.playfield.traverseGrid(function(block) {
        var color = this.gameEngine.theme.playfield.color;
        if (typeof block !== 'undefined') {
            color = block.color;
        }
        this.drawBlock(block.x, block.y, color);
    });
};

Canvas.prototype.drawBlock = function(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, dimensions.gridSize, dimensions.gridSize);
};

Canvas.prototype.drawTetromino = function(tetromino) {
    var self = this,
        color = this.gameEngine.theme.tetrominos[tetromino.type].color,
        x, y
        ;
    
    tetromino.traverseBlocks(function(block) {
        x = dimensions.transpose(tetromino.x) + dimensions.transpose(block.x);
        y = dimensions.transpose(tetromino.y) + dimensions.transpose(block.y);

        self.drawBlock(x, y, color);
    });
};

Canvas.prototype.drawGhostPiece = function() {
    // var blocks = this.gameEngine.getGhostPiece().getBlockCoordinates();
    // for (var i = 0; i < blocks.length; i++) {
    //     this.drawBlock(
    //         dimensions.transpose(blocks[i].x),
    //         dimensions.transpose(blocks[i].y),
    //         this.gameEngine.theme.ghostPiece.color
    //     );
    // }

    this.drawTetromino(this.gameEngine.getGhostPiece());
};

// Canvas.prototype.drawAnimations = function() {
//     for (var i = 0; i < this.animations.length; i++) {
//         if (typeof this.animations[i].draw === 'function') {
//             this.animations[i].draw();
//         }
//     }
// };

// Canvas.prototype.getTetrominoSprite = function() {
//     if (typeof this.tetrominoSprite === 'undefined') {
//         this.tetrominoSprite = new Sprite();
//     }
//     this.tetrominoSprite.x = dimensions.transpose(this.gameEngine.activeTetromino.x);
//     this.tetrominoSprite.y = dimensions.transpose(this.gameEngine.activeTetromino.y);
// };

Canvas.prototype.animateRowComplete = function(data) {
    var rows = data.rows;

    // this.animationQueue.push(new animations.rowComplete(this.ctx, rows));
    // animate the row(s) turning white, then disappearing,

    // this.animationQueue.push(new animations.rowCollapse(this.ctx, rows));
    // spliceTop() - save state of everything above completed rows,
    // animate the saved top moving back down
};

Canvas.prototype.spliceTop = function() {};

module.exports.Canvas = Canvas;