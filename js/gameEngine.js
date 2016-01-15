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
};

GameEngine.prototype.initThemes = function() {
    var themeLoader = new ThemeLoader(themeConfigs);
    this.themeLoader = themeLoader;
    this.theme = themeLoader.getTheme();
};

GameEngine.prototype.getTetrominoStyle = function(type) {
    return this.theme.tetrominos[type] ? this.theme.tetrominos[type] : null;
};

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
};

/**
 * Called on main update loop.
 * Calls update on all game assets.
 */
GameEngine.prototype.update = function() {
    
    this.velocityCounter += this.getVelocity();
    if (this.velocityCounter >= 1) {
        this.activeTetromino.update(1);
        this.velocityCounter = 0;
    }

    this.updateDestination();

    if (this.activeTetromino.atDestination()) {
        eventDispatcher.trigger(events.activePiecePositioned);

        // Convert tetromino into component blocks
        this.addBlocksToPlayfield();

        var completedRows = this.playfield.getCompletedRows();
        if (completedRows.length) {
            this.playfield.removeRows(completedRows);
            eventDispatcher.trigger(events.rowComplete, {rows: completedRows});

            // TODO: need a way to pause the update loop while the animation runs
            // pause for animation of row removal
            eventDispatcher.subscribe(events.rowRemoved, function() {
                this.getNextPiece();
            });
        } else {
            this.getNextPiece();
        }
    }
};

GameEngine.prototype.velocityCounter = 0;

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
GameEngine.prototype.updateDestination = function() {
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

    // todo: resolve playfield grid vs canvas x,y pixel coordinates
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
    //this.updateDestination();
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
 * Ends the game
 */
GameEngine.prototype.topOut = function() {};

/**
 * Moves the active piece by 1 grid unit in the specified direction
 * after verifying that the move is valid.
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
        debug.log('moveActivePiece: invalid move');
        return;
    }

    coordinates = this.activeTetromino.getBlockCoordinatesForOffset({x:xOffset, y:yOffset});
    
    if (this.playfield.validateBlockPlacement(coordinates)) {
        this.activeTetromino.moveByOffset({x:xOffset, y:yOffset});
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
 * by projecting it down the y axis until it colldes with a block or the playfield edge
 */
GameEngine.prototype.getProjectedDestination = function() {
    var destY = this.activeTetromino.y,
        valid = true,
        coordinates
        ;

    while(valid) {
        destY++;
        coordinates = this.activeTetromino.getBlockCoordinatesForOffset({x:0, y:destY});
        valid = this.playfield.validateBlockPlacement(coordinates);
        // if (valid) {
        //     destY++;
        // }
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

    ghostPiece.x = this.activeTetromino.destinationX;
    ghostPiece.y = this.activeTetromino.destinationY;

    return ghostPiece;
};

module.exports = GameEngine;