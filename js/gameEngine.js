'use strict';

var Playfield = require('./models/playfield'),
    Tetromino = require('./models/tetromino'),
    Sprite = require('./view/sprite'),
    SoundEffects = require('./soundEffects'), 
    ThemeLoader = require('./themeLoader'),
    themeConfigs = require('./config/themes'),
    activeTheme = require('./services/activeThemeService'),
    eventDispatcher = require('./eventDispatcher'),
    events = require('./config/events'),
    constants = require('./config/constants'),
    features = require('./config/features'),
    StateMachine = require('javascript-state-machine'),
    debug = require('./debug');

/**
 * Puts all the pieces together
 */
var GameEngine = function() {
    
    this.activeTetromino = null;
    this.pieceQueue = [];
    this.pieceHistory = [];
    this.level = 0;
    this.gravity = 0.05;
    this.accelerateGravity = false;
    this.playfield = new Playfield(
        Playfield.defaults.xCount,
        Playfield.defaults.yCount
    );
    this.soundEffects = new SoundEffects();

    this.fsm = this.initStates();
    this.initThemes();
    this.init();
};

GameEngine.QUEUE_MINIMUM = 3;
GameEngine.ACCELERATED_GRAVITY = 0.5;

GameEngine.prototype.init = function() {
    this.bindEvents();
    this.advanceNextPiece();
    this.soundEffects.enabled = features.enabled('soundEffects');
    this.initDebug();
};

GameEngine.prototype.initStates = function() {
    return StateMachine.create({
        initial: 'play',
        events: [
            { name: 'rowComplete', from: 'play',       to: 'suspended' },
            { name: 'rowCleared',  from: 'suspended',  to: 'suspended' },
            //{ name: 'rowCollapse', from: 'animatingRowClear',  to: 'animatingRowCollapse' },
            { name: 'suspend',     from: 'play',       to: 'suspended' },
            { name: 'pause',       from: 'play',       to: 'paused' },
            { name: 'resume',      from: ['play', 'paused', 'suspended'], to: 'play' }
        ]
    });
};

GameEngine.prototype.initThemes = function() {
    var themeLoader = new ThemeLoader(themeConfigs);
    activeTheme.set(themeLoader.getTheme());
};

GameEngine.prototype.initDebug = function() {
    if (features.enabled('initWithRemnants')) {
        this.playfield.distributeRandomBlocks(10);
    } else if (features.enabled('initWithTetris')) {
        this.activeTetromino = Tetromino.create('i');
        this.playfield.debugRowClear();
    }
};

/**
 * Returns the configured theme style for the given tetromino type
 */
GameEngine.prototype.getTetrominoStyle = function(type) {
    var theme = activeTheme.get();
    return theme.tetrominos[type] ? theme.tetrominos[type] : null;
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

    if (!this.fsm.is('play')) {
        return;
    }
    
    if (this.shouldMoveDownOnCurrentFrame()) {
        
        // Move down if able, else trigger final position events

        var validDrop = this.playfield.validateBlockPlacement(
            this.activeTetromino.getBlockCoordinatesForDrop()
        );
        if (validDrop) {
            this.activeTetromino.drop();
        } else { // Can't move down any farther, lock piece in final position

            // Check for end of game - tetromino hasn't moved, and can't drop
            if (this.activeTetromino.atOrigin()) {
                this.topOut();
                return;
            }

            eventDispatcher.trigger(events.activePiecePositioned);

            // Convert tetromino into component blocks
            this.playfield.placeBlocks(this.activeTetromino.releaseBlocks());
            
            // Set the next tetromino
            this.advanceNextPiece();

            // Check for completed rows and process them
            this.settleBlocks();
        }
    }
};

GameEngine.prototype.frameCounter = 0;

/**
 * Only move the tetromino down on specific intervals,
 * timed by counting the number of game loops.
 */
GameEngine.prototype.shouldMoveDownOnCurrentFrame = function() {
    this.frameCounter += this.getGravity();
    if (this.frameCounter >= 1) {
        this.frameCounter = 0;

        return true;
    }
};

/**
 * Recursively check if rows are completed after completed rows are cleared and blocks are settled
 */
GameEngine.prototype.settleBlocks = function(iteration) {
    var self = this,
        iteration = iteration || 0;

    // Don't need to make this call on the first iteration
    if (iteration > 0) {
        // Resume if the playfield has nothing to settle
        if (! this.playfield.settleRows()) {
            this.fsm.resume();
            return;
        }
    }
    
    var completedRows = this.playfield.getCompletedRows();

    if (completedRows.length) {

        console.log('Playfield.grid before', this.playfield.grid);
        console.log('Playfield.grid.length before', this.playfield.grid.length);

        // Update the model
        this.playfield.clearRows(completedRows);

        console.log('Playfield.grid after', this.playfield.grid);
        console.log('Playfield.grid.length after', this.playfield.grid.length);

        // triggered when rowComplete animation completes
        // After row is cleared, settle blocks again
        this.fsm.onrowCleared = function() {
            debug.info('onrowCleared');
            self.settleBlocks(iteration + 1); // recursively check if settling completes any rows
        };

        // Trigger rowComplete - suspends update and starts rowComplete animation
        this.fsm.rowComplete(completedRows);
    } else {
        // After blocks are settled, resume updates
        this.fsm.resume();
    }
};

/**
 * Returns the gravity for the current state,
 * checking if in "soft drop" mode (i.e. down button being pressed)
 */
GameEngine.prototype.getGravity = function() {
    return (this.accelerateGravity) ? GameEngine.ACCELERATED_GRAVITY : this.gravity;
};

/**
 * Sets the active tetromino to the next one in the queue
 */
GameEngine.prototype.advanceNextPiece = function() {
    if (this.activeTetromino !== null) {
        this.pieceHistory.push(this.activeTetromino.type);
    }
    this.refreshPieceQueue();
    this.activeTetromino = Tetromino.create(this.pieceQueue.shift());
};

/**
 * Returns the type of the next tetromino in the queue
 */
GameEngine.prototype.getNextPiece = function() {
    return this.pieceQueue[1];
};

/**
 * Sets a delay after a tetromino has been placed
 * before the next piece is spawned
 */
// GameEngine.prototype.spawnDelay = function() {
// }

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
 */
GameEngine.prototype.togglePause = function() {
    if (this.fsm.is('paused')) {
        this.fsm.resume();
    } else {
        this.fsm.pause();
    }
};

/**
 * Ends the game
 */
GameEngine.prototype.topOut = function() {
    this.fsm.suspend();
    eventDispatcher.trigger(events.topOut);
};

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
 * Returns destination coordinates for the given tetromino based on its current position
 * by projecting it down the y axis until it collides with a block or the playfield edge
 */
GameEngine.prototype.getProjectedDestination = function(tetromino) {
    var offsetY = 0,
        valid = true
        ;

    while(valid) {
        valid = this.playfield.validateBlockPlacement(
            tetromino.getBlockCoordinatesForOffset({x:0, y:offsetY + 1})
        );
        if (valid) {
            offsetY++;
        }
    }

    return {
        x: tetromino.x,
        y: tetromino.y + offsetY
    };
};

/**
 * Returns a tetromino instance for a tetromino at the projected destination of the active tetromino,
 * for displaying a "ghost piece" where the active tetromino will land
 */
GameEngine.prototype.getGhostPiece = function() {
    var ghostPiece = Tetromino.create(this.activeTetromino.type),
        dest = this.getProjectedDestination(this.activeTetromino);

    ghostPiece.blocks = this.activeTetromino.blocks;
    ghostPiece.x = dest.x;
    ghostPiece.y = dest.y;

    return ghostPiece;
};

module.exports = GameEngine;