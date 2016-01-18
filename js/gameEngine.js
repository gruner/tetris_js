'use strict';

var Playfield = require('./models/playfield'),
    Tetromino = require('./models/tetromino'),
    Sprite = require('./view/sprite'),
    SoundEffects = require('./soundEffects'), 
    ThemeLoader = require('./themeLoader'),
    themeConfigs = require('./config/themes'),
    eventDispatcher = require('./eventDispatcher'),
    events = require('./config/events'),
    constants = require('./config/constants'),
    features = require('./config/features'),
    debug = require('./debug');

/**
 * Puts all the pieces together
 */
var GameEngine = function() {
    this.activeTetromino = null;
    this.pieceQueue = [];
    this.pieceHistory = [];
    this.level = 0;
    this.velocity = 0.05;
    this.accelerate = false;
    this.paused = false;
    this.playfield = new Playfield(
        Playfield.defaults.xCount,
        Playfield.defaults.yCount
    );
    this.soundEffects = new SoundEffects();

    this.initThemes();
    this.init();
};

GameEngine.QUEUE_MINIMUM = 3;
GameEngine.ACCELERATED_VELOCITY = 0.5;

GameEngine.prototype.init = function() {
    this.bindEvents();
    this.getNextPiece();
    if (features.enabled('initWithRemnants')) {
        this.playfield.distributeRandomBlocks(10);
    }
};

GameEngine.prototype.initThemes = function() {
    var themeLoader = new ThemeLoader(themeConfigs);
    this.themeLoader = themeLoader;
    this.theme = themeLoader.getTheme();
};

/**
 * Returns the configured theme style for the given tetromino type
 */
GameEngine.prototype.getTetrominoStyle = function(type) {
    return this.theme.tetrominos[type] ? this.theme.tetrominos[type] : null;
};

/**
 * Binds to global events
 */
GameEngine.prototype.bindEvents = function() {
    var self = this;

    eventDispatcher.subscribe(events.moveActivePiece, function(movement) {
        self.moveActivePiece(movement);
    });

    eventDispatcher.subscribe(events.rotateActivePiece, function(movement) {
        self.rotateActivePiece(movement);
    });

    eventDispatcher.subscribe(events.accelerateActivePiece, function() {
        self.accelerate = true;
    });

    eventDispatcher.subscribe(events.deccelerateActivePiece, function() {
        self.accelerate = false;
    });

    eventDispatcher.subscribe(events.pause, function() {
        self.togglePause();
    });
};

/**
 * Called from main update loop.
 * Calls update on all game assets.
 */
GameEngine.prototype.update = function() {

    if (features.enabled('testMovementMode')) { 
        this.updateProjectedDestination();
        return;
    }
    
    if (this.shouldMoveDownOnCurrentFrame()) {
        
        // Move down if able, else trigger final position events

        var validMoveDown = this.playfield.validateBlockPlacement(
            this.activeTetromino.getBlockCoordinatesForMoveDown()
        );
        if (validMoveDown) {
            this.activeTetromino.moveDown();
        } else { // Can't move down any farther, piece is in final position

            eventDispatcher.trigger(events.activePiecePositioned);

            // Convert tetromino into component blocks
            this.addBlocksToPlayfield();

            // Check for completed rows
            var completedRows = this.playfield.getCompletedRows();
            if (completedRows.length) {
                this.playfield.removeRows(completedRows);
                eventDispatcher.trigger(events.rowComplete, {rows: completedRows});

                // TODO: find a way to pause the update loop while the animation runs
                // pause for animation of row removal
                eventDispatcher.subscribe(events.rowRemoved, function() {
                    this.getNextPiece();
                });
            } else {
                this.getNextPiece();
            }
        }

        if (features.enabled('displayGhostPiece')) { 
            this.updateProjectedDestination();
        }
    }
};

GameEngine.prototype.frameCounter = 0;

/**
 * Only move the tetromino down on specific intervals,
 * timed by counting the number of game loops.
 */
GameEngine.prototype.shouldMoveDownOnCurrentFrame = function() {
    this.frameCounter += this.getVelocity();
    if (this.frameCounter >= 1) {
        this.frameCounter = 0;

        return true;
    }
};

/**
 * Returns the velocity for the current state,
 * checking if in accelerated mode (i.e. down button being pressed)
 */
GameEngine.prototype.getVelocity = function() {
    return (this.accelerate) ? GameEngine.ACCELERATED_VELOCITY : this.velocity;
};

/**
 * Updates the destination coordinates of the active tetromino
 * based on its current location
 */
GameEngine.prototype.updateProjectedDestination = function() {
    this.activeTetromino.setDestination(this.getProjectedDestination());
};

/**
 * Converts the active tetromino into its component blocks,
 * which now belong to the playfield
 */
GameEngine.prototype.addBlocksToPlayfield = function() {
    var self = this;

    var blocks = this.activeTetromino.releaseBlocks();
    debug.log(blocks);

    this.playfield.placeBlocks(blocks);
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
};

/**
 * Ensures that there is a minimum number of pieces in the queue,
 * adding more when necessary.
 */
GameEngine.prototype.refreshPieceQueue = function() {
    if (this.pieceQueue.length <= GameEngine.QUEUE_MINIMUM) {
        this.pieceQueue = this.pieceQueue.concat(Tetromino.randomizeNextBag());
    }
};

/**
 * Pauses or resumes the game
 * TODO: currently it stops the game
 */
GameEngine.prototype.togglePause = function() {
    this.paused = !this.paused;
    if (this.paused) {
        eventDispatcher.trigger(events.topOut);
    }
};

/**
 * Ends the game
 */
GameEngine.prototype.topOut = function() {};

/**
 * Moves the active piece by 1 grid unit in the specified direction
 * after verifying that the move is valid.
 */
GameEngine.prototype.moveActivePiece = function(movement) {
    var offsetCoordinates = {x:0, y:0},
        blockOffsetCoordinates;

    if (movement.direction === constants.DIRECTION_LEFT) {
        offsetCoordinates.x = -1;
    } else if (movement.direction === constants.DIRECTION_RIGHT) {
        offsetCoordinates.x = 1;
    } else if (movement.direction === constants.DIRECTION_DOWN) {
        offsetCoordinates.y = 1;
    } else if (movement.direction === constants.DIRECTION_UP && features.enabled('testMovementMode')) {
        offsetCoordinates.y = -1;
    } else {
        debug.log('moveActivePiece: invalid move');
        return;
    }

    blockOffsetCoordinates = this.activeTetromino.getBlockCoordinatesForOffset(offsetCoordinates);
    
    if (this.playfield.validateBlockPlacement(blockOffsetCoordinates)) {
        this.activeTetromino.moveByOffset(offsetCoordinates);
    } else {
        eventDispatcher.trigger(events.invalidMove, {});
    }
};

/**
 * Rotates active tetromino in the specified direction
 * TODO: validate before rotating
 */
GameEngine.prototype.rotateActivePiece = function(movement) {

    var coordinates = this.activeTetromino.getBlockCoordinatesForRotation(movement.direction),
        valid = this.playfield.validateBlockPlacement(coordinates);

    if (valid && movement.direction === constants.DIRECTION_LEFT) {
        this.activeTetromino.rotateLeft();
    } else if (valid && movement.direction === constants.DIRECTION_RIGHT) {
        this.activeTetromino.rotateRight();
    }
};

/**
 * Returns destination coordinates for the active tetromino given its current position
 * by projecting it down the y axis until it collides with a block or the playfield edge
 */
GameEngine.prototype.getProjectedDestination = function() {
    var destY = this.activeTetromino.y,
        valid = true
        ;

    while(valid) {
        valid = this.playfield.validateBlockPlacement(
            this.activeTetromino.getBlockCoordinatesForOffset({x:0, y:destY})
        );
        if (valid) {
            destY++;
        }
    }

    return {
        x: this.activeTetromino.x,
        y: destY
    };
};

/**
 * Returns a tetromino instance for a tetromino at the destination of the active tetromino,
 * for displaying a "ghost piece" where the active tetromino will land
 */
GameEngine.prototype.getGhostPiece = function() {
    var ghostPiece = Tetromino.create(this.activeTetromino.type);

    ghostPiece.x = this.activeTetromino.destination.x;
    ghostPiece.y = this.activeTetromino.destination.y;

    return ghostPiece;
};

module.exports = GameEngine;