'use strict';

var Playfield = require('./models/playfield'),
    Tetromino = require('./models/tetromino'),
    Sprite = require('./view/sprite'),
    ThemeLoader = require('./themeLoader'),
    themeConfigs = require('./config/themes'),
    eventDispatcher = require('./eventDispatcher'),
    events = require('./config/events'),
    constants = require('./config/constants'),
    debug = require('./debug');

var GameEngine = function() {
    this.activeTetromino = null;
    this.pieceQueue = [];
    this.pieceHistory = [];
    this.level = 0;
    this.velocity = 0.05;
    this.accelerate = false;
    this.playfield = new Playfield(
        Playfield.defaults.xCount,
        Playfield.defaults.yCount
    );

    this.init();
};

GameEngine.QUEUE_MINIMUM = 3;
GameEngine.ACCELERATED_VELOCITY = 0.5;

GameEngine.prototype.init = function() {
    var themeLoader = new ThemeLoader(themeConfigs);
    this.themeLoader = themeLoader;
    this.theme = themeLoader.getTheme();

    this.bindEvents();
    this.getNextPiece();
};

GameEngine.prototype.bindEvents = function() {
    var self = this;

    eventDispatcher.subscribe(events.moveActivePiece, function(movement) {
        self.moveActivePiece(movement);
    });

    eventDispatcher.subscribe(events.accelerateActivePiece, function() {
        self.accelerate = true;
    });

    eventDispatcher.subscribe(events.deccelerateActivePiece, function() {
        self.accelerate = false;
    });
};

GameEngine.prototype.update = function() {
    this.activeTetromino.update(this.getVelocity());
    if (this.activeTetromino.atDestination()) {
        console.log('atDestination');
        //eventDispatcher.fire(events.activePiecePositioned);
        this.onActivePiecePosition();

        // if rows are completed, we need a way to pause while
        // animating row removal before advancing to the next piece
        this.getNextPiece();
    }
};

GameEngine.prototype.getVelocity = function() {
    return (this.accelerate) ? GameEngine.ACCELERATED_VELOCITY : this.velocity;
};

/**
 * Updates the destination coordinates of the active tetromino
 * based on its current location
 */
GameEngine.prototype.updateDestination = function() {
    var destination = this.getProjectedDestination();
    this.activeTetromino.destinationY = destination.y;
};

// GameEngine.prototype.pause = function(pauseLength, callback) {
// };

GameEngine.prototype.onActivePiecePosition = function() {
    var completedRows = this.getCompletedRows(),
        rowLength = completedRows.length,
        i
        ;

    if (rowLength) {
        for (i = 0; i < rowLength; i++) {
            this.playfield.removeRowAt(completedRows[i]);
        }
        eventDispatcher.fire(events.rowComplete, {rows: completedRows});
    }
};

GameEngine.prototype.addBlocksToPlayfield = function() {
    var self = this,
        color = self.theme.tetrominos[this.activeTetromino.type].color;

    // It would be nice to handle this color setting without the game
    // engine having to know about color, but we don't want the models to
    // have to know about it either
    this.activeTetromino.traverseBlocks(function(block) {
        block.color = color;
    });

    // todo: resolve playfield grid vs canvas x,y coordinates
    this.playfield.placeBlocks(this.activeTetromino.releaseBlocks());
};

/**
 * Returns array of completed rows, based on the 
 * position of the activeTetromino
 */
GameEngine.prototype.getCompletedRows = function() {
    
    var activeRows = this.activeTetromino.getTouchingRows(),
        rowCount = activeRows.length,
        completedRows = [];

    for (var i = 0; i < rowCount; i++) {
        if (this.playfield.rowComplete(activeRows[i])) {
            completedRows.push(activeRows[i]);
        }
    }

    return completedRows;
};

/**
 * Gets the next tetromino from the queue
 */
GameEngine.prototype.getNextPiece = function() {
    if (this.activeTetromino !== null) {
        this.pieceHistory.push(this.activeTetromino.type);
    }
    this.refreshPieceQueue();
    this.activeTetromino = Tetromino.create(this.pieceQueue.shift());
    this.updateDestination();
};

/**
 * Ensures that there is a minimum number of pieces in the queue,
 * adding more if necessary.
 */
GameEngine.prototype.refreshPieceQueue = function() {
    if (this.pieceQueue.length <= GameEngine.QUEUE_MINIMUM) {
        this.pieceQueue = this.pieceQueue.concat(Tetromino.randomizeNextBag());
    }
};

/**
 * Ends the game
 */
GameEngine.prototype.topOut = function() {};

/**
 * Moves the active piece by 1 grid unit in the specified direction,
 * only if the new position is valid
 */
GameEngine.prototype.moveActivePiece = function(movement) {
    var xOffset = 0,
        yOffset = 0,
        coordinates;

    if (movement.direction === constants.DIRECTION_LEFT) {
        xOffset = -1;
    } else if (movement.direction === constants.DIRECTION_RIGHT) {
        xOffset = 1;
    } else if (movement.direction === constants.DIRECTION_DOWN) {
        yOffset = 1;
    } else {
        return;
    }

    coordinates = this.activeTetromino.getBlockCoordinatesForOffset(xOffset, yOffset);
    
    if (this.playfield.validateBlockPlacement(coordinates)) {
        this.activeTetromino.moveByOffset(xOffset, yOffset);
    } else {
        // eventDispatcher.trigger(events.invalidMove, {});
    }
};

/**
 * 
 */
GameEngine.prototype.getProjectedDestination = function() {
    var yOffset = 1,
        valid = true,
        coordinates
        ;

    while(valid) {
        coordinates = this.activeTetromino.getBlockCoordinatesForOffset(0, yOffset);
        valid = this.playfield.validateBlockPlacement(coordinates);
        if (valid) {
            yOffset++;
        }
    }

    return {
        x: this.activeTetromino.x,
        y: yOffset
    };
};

GameEngine.prototype.getGhostPiece = function() {
    var ghostPiece = Tetromino.create(this.activeTetromino.type);

    ghostPiece.x = this.activeTetromino.destinationX;
    ghostPiece.y = this.activeTetromino.destinationY;

    return ghostPiece;
};

GameEngine.prototype.rotateActivePiece = function(direction) {
    if (direction === constants.DIRECTION_LEFT) {
        this.activeTetromino.rotateLeft();
    } else if (direction === constants.DIRECTION_RIGHT) {
        this.activeTetromino.rotateRight();
    }
};

module.exports = GameEngine;