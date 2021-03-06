(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var debug = require('./debug');

// Modified version of http://www.html5rocks.com/en/tutorials/webaudio/intro/js/buffer-loader.js

function BufferLoader(ctx, urlList, callback) {
    this.ctx = ctx;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = {};
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(key, url) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
  
    var loader = this;
  
    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.ctx.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    debug.log('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[key] = buffer;

                // When all buffers are loaded, call the callback
                if (++loader.loadCount === Object.keys(loader.urlList).length) {
                    loader.onload(loader.bufferList);
                }
            },
            function(error) {
                debug.log('decodeAudioData error', error);
            }
        );
    };
  
    request.onerror = function() {
        debug.log('BufferLoader: XHR error');
    };
  
    request.send();
};

BufferLoader.prototype.load = function() {
    for (var key in this.urlList) {
        this.loadBuffer(key, this.urlList[key]);
    }
};

module.exports = BufferLoader;
},{"./debug":8}],2:[function(require,module,exports){
'use strict';

module.exports = {
    gridSize: 30,
    playfieldOrigin: {x:0, y:0},
    blockBorderWidth: 1,

    /**
     * Multiplies GameEngine units to the rendered grid size
     */
    transpose: function(value) {
        return this.gridSize * value;
    }
};
},{}],3:[function(require,module,exports){
'use strict';

module.exports = {
    DIRECTION_LEFT:  'left',
    DIRECTION_RIGHT: 'right',
    DIRECTION_DOWN:  'down',
    DIRECTION_UP:    'up'
};
},{}],4:[function(require,module,exports){
'use strict';

module.exports = {
    moveActivePiece:        'tetris.moveActivePiece',
    rotateActivePiece:      'tetris.rotateActivePiece',
    accelerateActivePiece:  'tetris.accelerateActivePiece',
    deccelerateActivePiece: 'tetris.accelerateActivePiece',
    activePiecePositioned:  'tetris.activePiecePositioned',
    rowComplete:            'tetris.rowComplete',
    rowCleared:             'tetris.rowCleared',
    playfieldSettled:       'tetris.playfieldSettled',
    invalidMove:            'tetris.invalidMove',
    topOut:                 'tetris.topOut',
    pause:                  'tetris.pause',
    animationEnd:           'tetris.animationEnd'
};
},{}],5:[function(require,module,exports){
'use strict';

var features = {
    testMovementMode: {
        desc: "Allows free movement of a single tetromino without it falling",
        enabled: false
    },
    initWithRemnants: {
        desc: "Starts the game with remnant blocks already on the playfield",
        enabled: false
    },
    initWithTetris: {
        desc: "Starts the game with blocks ready for a Tetris",
        enabled: false
    },
    displayGhostPiece: {
        desc: "Highlights where the current piece will land",
        enabled: true,
        public: true
    },
    soundEffects: {
        desc: "Play sound effects",
        enabled: false,
        public: true
    }
};

module.exports = {
    enable: function(featureKey) {
        if (features.hasOwnProperty(featureKey)) {
            features[featureKey].enabled = true;
        }
    },
    enabled: function(featureKey) {
        return features.hasOwnProperty(featureKey) && features[featureKey].enabled === true;
    },
    set: function(featureKey, featureConfig) {
        if (featureConfig.hasOwnProperty('enabled')) {
            features[featureKey] = featureConfig;
        }
    },
    getPublic: function() {
        var publicFeatures = {};
        for (var feature in features) {
            if (features[feature].public === true) {
                publicFeatures[feature] = features[feature];
            }
        }

        return publicFeatures;
    }
};
},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
    //activePieceRotate: 'sounds/activePieceRotate.mp3',
    activePieceLock:   'sounds/activePieceLock.mp3',
    rowComplete:       'sounds/lineClear.mp3',
    //invalidMove:       'sounds/invalidMove.mp3',
    gameOver:          'sounds/gameOver.mp3'
};
},{}],7:[function(require,module,exports){
'use strict';

/**
 * Config for different themes
 */
module.exports = {
    default: {
        playfield: {color: "#000000"},
        ghostPiece: {color: "#333333"},
        tetrominos: {
            i: {color: "#dd5b4d"}, // red
            o: {color: "#4f718b"}, // blue
            t: {color: "#4ab18f"}, // green
            j: {color: "purple"},
            l: {color: "#eec857"}, // yellow
            s: {color: "#e07a46"}, // orange
            z: {color: "#e07a46"}  // orange
        },
        tetrominoBorder: {color: "#000000"}
    },
    level1: {
        parent: 'default'
    }
};
},{}],8:[function(require,module,exports){
'use strict';

var enabled = false,
    levels = {
        info: 1,
        debug: 2,
        error: 4
    },
    level = levels.debug;

function toggle(on) {
    if (consoleAvailable()) {
        enabled = (typeof on === 'undefined') ? !enabled : !!on;
    }
}

function consoleAvailable() {
    return (typeof console !== 'undefined') && (typeof console.log === 'function');
}

module.exports = {
    log: function(msg) {
        if (enabled && typeof console !== 'undefined') {
            console.log(msg);
        }
    },

    info: function(msg) {
        if (level >= levels.info) {
            this.log(msg);
        }
    },

    enable: function() {
        toggle(true);
    },

    disable: function() {
        toggle(false);
    },

    enabled: function() {
        return enabled === true;
    },
    
    profile: function(name, callback) {
        console.time(name);
        callback();
        console.timeEnd(name);
    }
};
},{}],9:[function(require,module,exports){
'use strict';
    
var dispatcher = require('./eventDispatcher'),
    constants = require('./config/constants'),
    features = require('./config/features'),
    events = require('./config/events');

var keyCodes = {
    left:  37,
    up:    38,
    right: 39,
    down:  40,
    spacebar: 32
};

var eventBinding = {
    bindKeydown: function() {
        document.addEventListener('keydown', function(e) {
            var code = e.keyCode || e.which;
            if (code === keyCodes.left) {
                dispatcher.trigger(events.moveActivePiece, {direction: constants.DIRECTION_LEFT}, this);
            } else if (code === keyCodes.right) {
                dispatcher.trigger(events.moveActivePiece, {direction: constants.DIRECTION_RIGHT}, this);
            } else if (code === keyCodes.down) {
                dispatcher.trigger(events.moveActivePiece, {direction: constants.DIRECTION_DOWN}, this);
            } else if (code === keyCodes.up) {
                if (features.enabled('testMovementMode')) {
                    dispatcher.trigger(events.moveActivePiece, {direction: constants.DIRECTION_UP}, this);
                } else {
                    dispatcher.trigger(events.rotateActivePiece, {direction: constants.DIRECTION_LEFT}, this);
                }
            } else if (code === keyCodes.spacebar) {
                dispatcher.trigger(events.pause);
            }
        });
    }

    // bindKeyup: function($document) {
    //     $document.on('keyup', function(e) {
    //         var code = e.keyCode || e.which;
    //     });
    // }
};

module.exports = {
    init: function() {
        var i;

        for (i in eventBinding) {
            if (eventBinding.hasOwnProperty(i)) {
                eventBinding[i]();
            }
        }
    }
};
},{"./config/constants":3,"./config/events":4,"./config/features":5,"./eventDispatcher":10}],10:[function(require,module,exports){
(function (global){
'use strict';
    
var debug = require('./debug'),
    eventSubscriptions = {};

module.exports = {
 
    subscribe: function (eventName, callback) {

        if (typeof callback !== 'function') {
            return;
        }

        if (!eventSubscriptions.hasOwnProperty(eventName)) {
            eventSubscriptions[eventName] = [];
        }

        eventSubscriptions[eventName].push(callback);
    },

    unsubscribe: function(eventName, callback) {
        var subscribers = eventSubscriptions[eventName];
 
        if (subscribers === undefined) { return; }

        var index = subscribers.indexOf(callback);

        if (index !== -1) {
            subscribers.splice(index, 1);
        }
    },

    once: function(eventName, callback) {
        var self = this;
        this.subscribe(eventName, function() {
            callback.apply(this, arguments);
            self.unsubscribe(eventName, callback);
        });
    },
 
    trigger: function (eventName, data, context) {
 
        var subscribers = eventSubscriptions[eventName],
            i;
 
        if (typeof subscribers === 'undefined') {
            return;
        }
 
        // Ensure data is an array or is wrapped in an array,
        // for Function.prototype.apply use
        data = [data];
 
        // Set a default value for `this` in the callback
        var window = window || global;
        context = context || window;

        for (i = 0; i < subscribers.length; i++) {
            subscribers[i].apply(context, data);
        }
    },

    hasSubscriber: function (eventName, callback) {
        if (eventSubscriptions[eventName] !== undefined && eventSubscriptions[eventName].indexOf(callback) !== - 1 ) {
            return true;
        }

        return false;
    },
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./debug":8}],11:[function(require,module,exports){
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

        // Update the model
        this.playfield.clearRows(completedRows);

        // triggered when rowComplete animation completes
        // After row is cleared, settle blocks again
        this.fsm.onrowCleared = function() {
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
},{"./config/constants":3,"./config/events":4,"./config/features":5,"./config/themes":7,"./debug":8,"./eventDispatcher":10,"./models/playfield":14,"./models/tetromino":15,"./services/activeThemeService":18,"./soundEffects":19,"./themeLoader":21,"./view/sprite":30,"javascript-state-machine":31}],12:[function(require,module,exports){
'use strict';

var Tetris  = require('./tetris'),
    debug = require('./debug')
    ;

/**
 * Expose Tetris global
 */
(function() {
    // Globally enable
    debug.enable();

    window.Tetris = Tetris;
})();

},{"./debug":8,"./tetris":20}],13:[function(require,module,exports){
'use strict';

/**
 * Models a single square
 */
var Block = function(x, y) {
    this.x = x;
    this.y = y;
    this.width = 1;
    this.height = 1;
    this.type = null;
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
},{}],14:[function(require,module,exports){
'use strict';

var debug = require('../debug'),
    Block = require('./block'),
    Validate = require('../util/validate');

/**
 * Models the state of the playfield game grid.
 * A multidimensional array represents the x and y grid coordinates.
 * Each cell in the grid can hold one Block model
 */
var Playfield = function(xCount, yCount) {
    this.xCount = xCount;
    this.yCount = yCount;
    this.grid = this.buildGrid();
};

Playfield.defaults = {
    xCount: 10,
    yCount: 22
};

/**
 * Returns a multidimensional array of undefined values
 * in the dimensions of the grid
 */
Playfield.prototype.buildGrid = function() {
    var grid = new Array(this.yCount);
    for (var i = 0; i < grid.length; i++) {
        grid[i] = this.createEmptyRow();
    }
    return grid;
};

/**
 * Returns an array of undefined values for each column in a row
 */
Playfield.prototype.createEmptyRow = function() {
    return new Array(this.xCount);
};

/**
 * Executes a callback for each row in the grid (bottom to top)
 * passing the contents of the row to the callback
 */
Playfield.prototype.traverseRows = function(callback) {
    for (var i = this.yCount - 1; i >= 0; i--) {
        var row = this.grid[i];
        callback(i, row);
    }
};

/**
 * Executes a callback for each cell in the grid, passing the contents
 * of the cell to the callback
 */
Playfield.prototype.traverseGrid = function(callback) {
    for (var i = 0; i < this.yCount; i++) {
        for (var j = 0; j < this.xCount; j++) {
            var cell;
            if (this.grid[i] && this.grid[i][j]) {
                cell = this.grid[i][j];
                cell.x = j;
                cell.y = i;
            }
            callback(cell);
        }
    }
};

/**
 * Removes an array of rows
 */
Playfield.prototype.clearRows = function(rowIndices) {
    var i,
        rowCount = rowIndices.length,
        clearedRows = [];

    // make sure rows are in descending order
    // so that we splice from biggest to smallest and avoid scrambling the indices
    rowIndices.sort(function(a,b) { return b - a; });

    for (var i = 0; i < rowCount; i++) {
        if (rowIndices[i] < this.grid.length) {
            clearedRows.push(this.grid.splice(rowIndices[i], 1)[0]);
        }
    }

    // add empty rows at the top
    while (this.grid.length < this.yCount) {
        this.grid.unshift(this.createEmptyRow());
    }

    return clearedRows;
};

/**
 * Removes a row at the given index and adds
 * a new empty row to the top
 */
Playfield.prototype.clearRowAt = function(y) {
    var rows = this.clearRows([y]);
    if (rows && rows.length) {
        return rows[0];
    }
};

/**
 * Settle any remaining blocks after a row is cleared.
 *
 * For each occupied cell in a row, check if the cell below it is empty
 * And merge them
 *
 *        A
 *   BB
 * CC  CCC CC => CCBBCCCACC
 * ------
 *   xxxx
 * xx  xxxxxx => no change, treat line as a whole
 */
Playfield.prototype.settleRows = function() {
    var self = this,
        merges = false,
        j;

    // For each row, find empty places
    // that the above row can fill
    self.traverseRows(function(i, targetRow) {
        var topNeighboringRow = self.grid[i-1]; // traversing bottom to top

        if (self.rowsAreMergable(targetRow, topNeighboringRow)) {
            self.grid[i] = self.mergeRows(targetRow, topNeighboringRow);
            self.clearRowAt(i-1);
            merges = true;
        }
    });

    // Recurse until all rows are settled
    if (merges) {
        self.settleRows();
    }

    return merges;
};

/**
 * Checks if topNeighboringRow can be merged into targetRow
 * @return bool
 */
Playfield.prototype.rowsAreMergable = function(targetRow, topNeighboringRow) {
    var mergable = false,
        targetRowChecksum = 0,
        topNeighboringRowChecksum = 0,
        i;

    if (!targetRow || !topNeighboringRow) {
        return false;
    }

    for (i = 0; i < topNeighboringRow.length; i++) {
        if (targetRow[i] !== undefined) {
            targetRowChecksum++;
        }
        if (topNeighboringRow[i] !== undefined) {
            topNeighboringRowChecksum++;
        }
        if (targetRow[i] !== undefined && topNeighboringRow[i] !== undefined) {
            mergable = false;
            break;
        } else if (targetRow[i] !== undefined || topNeighboringRow[i] !== undefined) {
            mergable = true;
        }
    }

    return (mergable && targetRowChecksum !== 0 && topNeighboringRowChecksum !== 0);
};

/**
 * Returns a merged array of topNeighboringRow into targetRow
 * @return array
 */
Playfield.prototype.mergeRows = function(targetRow, topNeighboringRow) {
    var i,
        merged = this.createEmptyRow(),
        mergedLength = merged.length,
        topColumnValue;
    for (i = 0; i < mergedLength; i++) {
        topColumnValue = (topNeighboringRow && topNeighboringRow[i] !== undefined) ? topNeighboringRow[i] : undefined;
        merged[i] = (targetRow[i] === undefined) ? topColumnValue : targetRow[i];
    }

    return merged;
};

/**
 * Checks that a row is complete, i.e. filled with blocks.
 * If any cells are undefined they are empty
 * @return bool
 */
Playfield.prototype.rowComplete = function(y) {
    var complete,
        i;

    if (typeof this.grid[y] === 'undefined') {
        complete = false;
    } else {
        complete = true;
        for (i = 0; i < this.xCount; i++) {
            if (typeof this.grid[y][i] === 'undefined') {
                complete = false;
                break;
            }
        }
    }

    return complete;
};

/**
 * Returns array of y coordinates for all completed rows
 * TODO: pass in optional rows to check (i.e. only check the rows that a newly placed tetromino is touching)
 */
Playfield.prototype.getCompletedRows = function() {
    var self = this,
        completedRows = [];

    this.traverseRows(function(i, row) {
        if (self.rowComplete(i)) {
            completedRows.push(i);
        }
    });

    return completedRows;
};

/**
 * Checks that a cell is empty
 * @return bool
 */
Playfield.prototype.cellEmpty = function(cell) {
    var empty = false;

    if (this.cellInBounds(cell)) {
        if (typeof this.grid[cell.y] === 'undefined' || typeof this.grid[cell.y][cell.x] === 'undefined') {
            empty = true;
        }
    }

    return empty;
};

/**
 * Checks that a cell is in the bounds of the playfield
 * @return bool
 */
Playfield.prototype.cellInBounds = function(cell) {
    return (cell.y >= 0 && cell.y < this.yCount && cell.x >= 0 && cell.x < this.xCount);
};

/**
 * Checks that an array of blocks are valid for placement at their given coordinates
 * @return bool
 */
Playfield.prototype.validateBlockPlacement = function(blocks) {
    var valid = Array.isArray(blocks);
    for (var i = 0; i < blocks.length; i++) {
        if (!this.validateBlock(blocks[i])) {
            valid = false;
            break;
        }
    }

    return valid;
};

/**
 * Checks that a block's coordinates are within the bounds of the playfield,
 * and that the block's cell is available
 * @param Block block
 * @return bool
 */
Playfield.prototype.validateBlock = function(block) {
    return (
        Validate.coordinates(block) && 
        this.cellInBounds(block) && 
        this.cellEmpty(block)
    );
};

/**
 * Adds a block to the playfield at the block's coordinates
 */
Playfield.prototype.placeBlock = function(block) {
    if (this.validateBlock(block)) {
        if (typeof this.grid[block.y] === 'undefined') {
            this.grid[block.y] = this.createEmptyRow();
        }
        this.grid[block.y][block.x] = block;
    } else {
        debug.log('invalid block placement at ' + block.x + ', ' + block.y);
    }
};

/**
 * Adds an array of blocks to the playfield
 */
Playfield.prototype.placeBlocks = function(blocks) {
    for (var i = 0, iMax = blocks.length; i < iMax; i++) {
        this.placeBlock(blocks[i]);
    }
};

/**
 * Adds random blocks to the playfield for debugging
 */
Playfield.prototype.distributeRandomBlocks = function(blockCount) {
    var blockTypes = require('./tetrominoTypes').getTypeKeys();

    // While there remain blocks to distribute...
    while (0 !== blockCount) {
        var block = new Block(
            Math.floor(Math.random() * this.xCount),
            Math.floor(Math.random() * this.yCount)
        );
        block.type = blockTypes[Math.floor(Math.random() * blockTypes.length)];

        if (this.validateBlock(block)) {
            this.placeBlock(block);
            blockCount--;
        }
    }
};

/**
 * Adds blocks to the playfield for debugging a row clearing
 */
Playfield.prototype.debugRowClear = function() {

    var self = this,
        block,
        x,
        rows = 4,
        columns = this.xCount - 1;

    this.traverseRows(function(y) {
        if (rows > 0) {
            for (x = 0; x < columns; x++) {
                block = new Block(x,y);
                block.type = 'i';
                self.placeBlock(block);
            }
        }
        rows--;
    });
};

module.exports = Playfield;
},{"../debug":8,"../util/validate":23,"./block":13,"./tetrominoTypes":16}],15:[function(require,module,exports){
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
    this.origin = {x:3, y:0}
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
            }

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
 * Checks that tetromino is at its original coordinates
 */
Tetromino.prototype.atOrigin = function() {
    return (this.x === this.origin.x && this.y === this.origin.y);
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

    var offsetX = this.x + coordinates.x,
        offsetY = this.y + coordinates.y,
        offsetCoordinates = []
        ;

    this.traverseBlocks(function(i, block) {
        offsetCoordinates.push({
            x: offsetX + block.x,
            y: offsetY + block.y
        });
    });

    return offsetCoordinates;
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
        
    }

    return coordinates;
};

Tetromino.prototype.rotateLeft = function() {
    this.rotate(constants.DIRECTION_LEFT);
};

Tetromino.prototype.rotateRight = function() {
    this.rotate(constants.DIRECTION_RIGHT);
};

module.exports = Tetromino;
},{"../config/constants":3,"../debug":8,"../util/validate":23,"./block":13,"./tetrominoTypes":16}],16:[function(require,module,exports){
'use strict';

/**
 * Define the different types (shapes) of tetrominos
 */
var types = {
    i: {
        blocks: [
            [
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 2, y: 1},
                {x: 3, y: 1}
            ],
            [
                {x: 2, y: 0},
                {x: 2, y: 1},
                {x: 2, y: 2},
                {x: 2, y: 3}
            ],
            [
                {x: 0, y: 2},
                {x: 1, y: 2},
                {x: 2, y: 2},
                {x: 3, y: 2}
            ],
            [
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 1, y: 3}
            ]
        ]
    },
    o: {
        blocks: [
            [
                {x: 1, y: 0},
                {x: 2, y: 0},
                {x: 1, y: 1},
                {x: 2, y: 1}
            ]
        ],
    },
    t: {
        blocks: [
            [
                {x: 1, y: 0},
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 2, y: 1}            
            ],
            [
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 1}
            ],
            [
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 2, y: 1},
                {x: 1, y: 2}
            ],
            [
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 0, y: 1}
            ]
        ]
    },
    j: {
        blocks: [
            [
                {x: 0, y: 0},
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 2, y: 1}
            ],
            [
                {x: 1, y: 0},
                {x: 2, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2}
            ],    
            [
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 2, y: 1},
                {x: 2, y: 2}
            ],            
            [
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 0, y: 2}
            ]
        ]
    },
    l: {
        blocks: [
            [
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 2, y: 1},
                {x: 2, y: 0}
            ],
            [
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 2}
            ],
            [
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 2, y: 1},
                {x: 0, y: 2}
            ],
            [
                {x: 0, y: 0},
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 1, y: 2}
            ]            
        ]
    },
    s: {
        blocks: [
            [
                {x: 1, y: 0},
                {x: 2, y: 0},
                {x: 0, y: 1},
                {x: 1, y: 1}
            ],
            [
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 2, y: 1},
                {x: 2, y: 2}
            ],
            [
                {x: 1, y: 1},
                {x: 2, y: 1},
                {x: 0, y: 2},
                {x: 1, y: 2}
            ],
            [
                {x: 0, y: 0},
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 1, y: 2}
            ]
        ]
    },
    z: {
        blocks: [
            [
                {x: 0, y: 0},
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 2, y: 1}
            ],
            [
                {x: 2, y: 0},
                {x: 2, y: 1},
                {x: 1, y: 1},
                {x: 1, y: 2}
            ],
            [
                {x: 0, y: 1},
                {x: 1, y: 1},
                {x: 1, y: 2},
                {x: 2, y: 2}
            ],
            [
                {x: 1, y: 0},
                {x: 1, y: 1},
                {x: 0, y: 1},
                {x: 0, y: 2}
            ]
        ]
    }
};

module.exports = {
    types: types,

    getType: function(typeKey) {
        if (typeof types[typeKey] !== 'undefined') {
            return types[typeKey];
        }
    },

    getTypeKeys: function() {
        return Object.keys(types);
    }
};
},{}],17:[function(require,module,exports){
'use strict';

var extend = require('../util/extend');

var Theme = function(config) {
    this.parent = null;
    this.name = Theme.DEFAULT;
    this.playfield = {color: "black"};
    this.ghostPiece = {color: "darkgray"};
    this.tetrominos = {
        i: {color: "red"},
        o: {color: "blue"},
        t: {color: "green"},
        j: {color: "purple"},
        l: {color: "yellow"},
        s: {color: "orange"},
        z: {color: "magenta"}
    };
    this.tetrominoBorder = {color: 'black'};

    if (config) {
        extend.deepExtend(this, config);
    }
};

Theme.DEFAULT = 'default';

module.exports = Theme;
},{"../util/extend":22}],18:[function(require,module,exports){
'use strict';

// Service for sharing the active theme

var activeTheme;

module.exports = {
    set: function(theme) {
        activeTheme = theme;
    },
    get: function() {
        return activeTheme;
    }
};
},{}],19:[function(require,module,exports){
var events = require('./config/events'),
    sounds = require('./config/sounds'),
    eventDispatcher = require('./eventDispatcher'),
    BufferLoader = require('./bufferLoader'),
    debug = require('./debug');

/**
 * Uses Web Audio API to load and play sound files
 * See http://www.html5rocks.com/en/tutorials/webaudio/intro/
 */
var SoundEffects = function() {
    this.enabled = false; // this breaks the game after the first sound plays
    this.sources = {};

    if (!this.initAudioContext()) { return; }
    this.bindEvents();
    this.loadSoundFiles();
};

SoundEffects.prototype.initAudioContext = function() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        return true;
    }
    catch(e) {
        // Web Audio API is not supported in this browser
        return false;
    }
};

SoundEffects.prototype.bindEvents = function() {
    var self = this;

    eventDispatcher.subscribe(events.rotateActivePiece, function() { self.play('activePieceRotate'); });
    eventDispatcher.subscribe(events.activePiecePositioned, function() { self.play('activePieceLock'); });
    eventDispatcher.subscribe(events.rowComplete, function() { self.play('rowComplete'); });
    eventDispatcher.subscribe(events.invalidMove, function() { self.play('invalidMove'); });
    eventDispatcher.subscribe(events.topOut, function() { self.play('gameOver'); });
};

SoundEffects.prototype.loadSoundFiles = function() {
    var self = this,
        bufferLoader = new BufferLoader(
            self.ctx,
            sounds,
            function(bufferList) {
                self.onSoundsLoaded(bufferList);
            }
        );

    bufferLoader.load();
};

/**
 * Creates sources for all sound buffers.
 * Called when all sound buffers have loaded.
 */
SoundEffects.prototype.onSoundsLoaded = function(bufferList) {
    for (var key in bufferList) {
        this.sources[key] = this.ctx.createBufferSource(); // creates a sound source
        this.sources[key].buffer = bufferList[key];        // tell the source which sound to play
        this.sources[key].connect(this.ctx.destination);   // connect the source to the context's destination (the speakers)
    }
};

/**
 * Plays a specific sound if it exists as a source
 */
SoundEffects.prototype.play = function(soundKey) {
    // Play the source
    if (this.enabled && this.sources[soundKey]) {
        this.sources[soundKey].start(0);
    }
};

module.exports = SoundEffects;
},{"./bufferLoader":1,"./config/events":4,"./config/sounds":6,"./debug":8,"./eventDispatcher":10}],20:[function(require,module,exports){
var GameEngine = require('./gameEngine'),
    Canvas = require('./view/canvas'),
    events = require('./config/events'),
    eventBinding = require('./eventBinding'),
    eventDispatcher = require('./eventDispatcher');

/**
 * Bootstraps all game components together
 */
var Tetris = function(canvasElement) {
    
    canvasElement = canvasElement || Tetris.createCanvasElement();

    var self = this;

    this.gameEngine = new GameEngine();
    this.canvas = new Canvas(canvasElement, this.gameEngine);
    this.frameId = null;
    eventBinding.init();


    // this has to be defined this way or it won't work
    this.run = function() {
        self.frameId = requestAnimationFrame(self.run);
        self.gameEngine.update();
        self.canvas.draw();
    };

    eventDispatcher.subscribe(events.topOut, function() {
        window.cancelAnimationFrame(self.frameId);
    });
};

/**
 * Creates canvas tag on the DOM if one wasn't passed in.
 * TODO: consider preferring this approach as we can dynamically
 * size the element in line with existing configs.
 */
Tetris.createCanvasElement = function() {
}

module.exports = Tetris;
},{"./config/events":4,"./eventBinding":9,"./eventDispatcher":10,"./gameEngine":11,"./view/canvas":26}],21:[function(require,module,exports){
'use strict';

var extend = require('./util/extend'),
    Theme = require('./models/theme');

var ThemeLoader = function(config) {
    this.config = config;
};

/**
 * If a theme config specifies a parent, get the parent config and merge the values
 * @return object
 */
ThemeLoader.prototype.extendThemeConfig = function(themeConfig) {
    if (themeConfig && themeConfig.hasOwnProperty('parent')) {
        var parentConfig = this.getThemeConfig(themeConfig.parent);
        if (parentConfig) {
            themeConfig = extend.deepExtend(extend.deepExtend({}, parentConfig), themeConfig);
        }
    }

    return themeConfig;
};

/**
 * Returns config object for the named theme if it exists
 * @return object
 */
ThemeLoader.prototype.getThemeConfig = function(themeName) {
    if (this.config.hasOwnProperty(themeName)) {
        return this.extendThemeConfig(this.config[themeName]);
    } else {
        return {};
    }
};

/**
 * Returns a fully configured theme instance
 */
ThemeLoader.prototype.getTheme = function(themeName) {
    themeName = themeName || Theme.DEFAULT;
    return new Theme(this.getThemeConfig(themeName));
};

module.exports = ThemeLoader;
},{"./models/theme":17,"./util/extend":22}],22:[function(require,module,exports){
'use strict';

function deepObjectExtend(parent, child) {

    // TODO: recurse for more than two arguments
    // if (arguments.length > 2) {
    //     for (var i = 0; i < arguments.length; i++) {
    //         //
    //     };
    // }

    for (var prop in child) {
        if (parent.hasOwnProperty(prop) && parent[prop] instanceof Object) {
            parent[prop] = deepObjectExtend(parent[prop], child[prop]);
        } else {
            parent[prop] = child[prop];
        }
    }

    return parent;
}

module.exports = {
    deepExtend: deepObjectExtend
};
},{}],23:[function(require,module,exports){
'use strict';

var debug = require('../debug');

var Validate = function() {};

/**
 * Checks that the given object has proper x and y values
 */
Validate.coordinates = function(coordinates) {
    var valid = (coordinates.hasOwnProperty('x') 
        && coordinates.hasOwnProperty('y')
        && Number.isInteger(coordinates.x)
        && Number.isInteger(coordinates.y)
    );

    if (!valid) {
        debug.log('Invalid coordinates:');
        debug.log(coordinates);
    }

    return valid;
};

module.exports = Validate;
},{"../debug":8}],24:[function(require,module,exports){
'use strict';

var Animation = function(ctx) {
    this.ctx = ctx;
    this.complete = false;
};

Animation.prototype.draw = function() {};

module.exports = Animation;
},{}],25:[function(require,module,exports){
/**
 * Manages a queue of animation objects so that they draw in sequence
 */

'use strict';

var animations = [];

module.exports = {
    /**
     * Draws the next frame in the animation stack
     * @return bool - whether or not a frame was drawn
     */
    draw: function() {
        if (animations.length) {
            animations[0].draw();
            if (animations[0].complete) {
                animations.shift();
            }
            return true;
        } else {
        	return false;
        }
    },
    push: function(animation) {
        return animations.push(animation);
    },
    clear: function() {
        animations = [];
    }
};
},{}],26:[function(require,module,exports){
'use strict';

var dimensions = require('../config/canvasDimensions'),
    Sprite = require('./sprite'),
    RowCompleteAnimation = require('./rowCompleteAnimation'),
    RowCollapseAnimation = require('./rowCollapseAnimation'),
    canvasCache = require('./canvasCache'),
    animationQueue = require('./animationQueue'),
    features = require('../config/features'),
    activeTheme = require('../services/activeThemeService'),
    debug = require('../debug');

/**
 * Renders the view according to GameEngine state.
 * Encapsulates canvas draw commands.
 * TODO: Hide first two rows where tetrominos spawn
 */
var Canvas = function(canvasElement, gameEngine) {

    this.ctx = null; // canvas context
    this.gameEngine = gameEngine;
    this.theme = null;

    this.init(canvasElement);
    this.bindEvents();
};

Canvas.prototype.init = function(canvasElement) {
    if (canvasElement.getContext) {
        this.ctx = canvasElement.getContext('2d');
    } else {
        // canvas-unsupported code here
        debug.log('no ctx');
    }
};

Canvas.prototype.bindEvents = function() {
    var self = this;

    this.gameEngine.fsm.onrowComplete = function(e, from, to, completedRows) {
        animationQueue.push(new RowCompleteAnimation(self.ctx, completedRows, function() {
            self.gameEngine.fsm.rowCleared();
        }));
    };
};

/**
 * Draws entire game on each update loop
 */
Canvas.prototype.draw = function() {
    this.theme = activeTheme.get();
    this.drawPlayfield();
    this.drawRemnantBlocks();

    // If animations are in-progress, draw the next frame,
    // otherwise resume normal drawing
    if (!animationQueue.draw()) {
        if (features.enabled('displayGhostPiece')) {
            this.drawGhostPiece(); // has to draw before tetromino, so that it renders behind it
        }
        this.drawTetromino(
            this.gameEngine.activeTetromino,
            this.gameEngine.getTetrominoStyle(this.gameEngine.activeTetromino.type).color,
            this.theme.tetrominoBorder
        );
    }
};

// Uncomment to debug animations
// Canvas.prototype.draw = function() {
//     this.drawPlayfield();
//     animationQueue.draw()
// };

/**
 * Draws the playfield - the background rectangle
 * @TODO cache this as an image after the first draw
 */
Canvas.prototype.drawPlayfield = function() {
    this.ctx.fillStyle = this.theme.playfield.color;
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
                self.theme.tetrominoBorder
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
    this.drawTetromino(this.gameEngine.getGhostPiece(), this.theme.ghostPiece.color);
};

/**
 * When a row is complete, save everything above it in order to animate it moving down
 */
// Canvas.prototype.spliceTop = function() {};

module.exports = Canvas;

},{"../config/canvasDimensions":2,"../config/features":5,"../debug":8,"../services/activeThemeService":18,"./animationQueue":25,"./canvasCache":27,"./rowCollapseAnimation":28,"./rowCompleteAnimation":29,"./sprite":30}],27:[function(require,module,exports){
'use strict';

/**
 * Caches the parts of the canvas that don't need to be updated on each animation frame
 * 
 * Creates a new canvas element
 * Get its context
 * Write pixels to that context
 * Use the canvas in a drawImage() call on another canvas context
 * (Don't add the cached canvas to the DOM)
 */
module.exports = {
    imageCache: {},

    // to retrive a cached image:
    // otherCtx.drawImage(imageCache.retrieve(name), 0, 0)

    addToCache: function(name, image) {
        var canvasCache = document.createElement('canvas'),
            cacheCtx;

        canvasCache.setAttribute('width', image.width);
        canvasCache.setAttribute('height', image.height);

        cacheCtx = canvasCache.getContext('2d');
        cacheCtx.drawImage(image, 0, 0);

        this.imageCache[name] = canvasCache;
    },

    retrive: function(name) {
        return this.imageCache[name] ? this.imageCache[name] : null;
    }
};
},{}],28:[function(require,module,exports){
'use strict';

var Animation = require('./animation');

var RowCollapseAnimation = function(ctx, rows) {
    this.ctx = ctx;
    this.rows = rows;
    this.complete = false;
};

//RowCollapseAnimation.prototype = new Animation();

RowCollapseAnimation.prototype.draw = function() {
    // spliceTop() - save state of everything above completed rows,
    // animate the saved top moving down
};

module.exports = RowCollapseAnimation;
},{"./animation":24}],29:[function(require,module,exports){
'use strict';

var Animation = require('./animation'),
    dimensions = require('../config/canvasDimensions'),
    activeTheme = require('../services/activeThemeService'),
    debug = require('../debug');

var OPACITY_CHANGE_RATE = 0.1,
    ENDING_OPACITY = 0.05;

/**
 * Animates the completed row(s) turning white, then disappearing
 */
var RowCompleteAnimation = function(ctx, rows, onCompleteCallback) {
    this.ctx = ctx;
    this.rows = rows;
    this.onComplete = onCompleteCallback;
    this.complete = false;
    this.opacity = 1;
    this.theme = activeTheme.get();
    this.finalFillColor = this.theme.playfield.color;
};

//RowCompleteAnimation.prototype = new Animation();

RowCompleteAnimation.prototype.draw = function() {
	var width = dimensions.transpose(10), //this.gameEngine.playfield.xCount
        height = dimensions.transpose(this.rows.length);

    this.ctx.beginPath();
    this.ctx.fillStyle = this.getFill();
    this.ctx.fillRect(dimensions.playfieldOrigin.x, dimensions.transpose(this.rows[this.rows.length - 1]), width, height);

    if (this.opacity <= ENDING_OPACITY) {
        this.complete = true;
        if (typeof this.onComplete === 'function') {
            this.onComplete();
        }
    }
};

/**
 * Calculates fill color for the current animation frame
 */
RowCompleteAnimation.prototype.getFill = function() {
	return "rgba(255, 255, 255, " + this.getOpacity() + ")";
};

/**
 * Calculates opacity for the current animation frame
 */
RowCompleteAnimation.prototype.getOpacity = function() {
	this.opacity -= this.opacity * OPACITY_CHANGE_RATE;

	return this.opacity;
};

module.exports = RowCompleteAnimation;
},{"../config/canvasDimensions":2,"../debug":8,"../services/activeThemeService":18,"./animation":24}],30:[function(require,module,exports){
'use strict';

/**
 * Represents the on-screen version of a model
 */
var Sprite = function(color) {
    this.x = 0;
    this.y = 0;
    this.theme = null;
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

module.exports = Sprite;
},{}],31:[function(require,module,exports){
/*

  Javascript State Machine Library - https://github.com/jakesgordon/javascript-state-machine

  Copyright (c) 2012, 2013, 2014, 2015, Jake Gordon and contributors
  Released under the MIT license - https://github.com/jakesgordon/javascript-state-machine/blob/master/LICENSE

*/

(function () {

  var StateMachine = {

    //---------------------------------------------------------------------------

    VERSION: "2.4.0",

    //---------------------------------------------------------------------------

    Result: {
      SUCCEEDED:    1, // the event transitioned successfully from one state to another
      NOTRANSITION: 2, // the event was successfull but no state transition was necessary
      CANCELLED:    3, // the event was cancelled by the caller in a beforeEvent callback
      PENDING:      4  // the event is asynchronous and the caller is in control of when the transition occurs
    },

    Error: {
      INVALID_TRANSITION: 100, // caller tried to fire an event that was innapropriate in the current state
      PENDING_TRANSITION: 200, // caller tried to fire an event while an async transition was still pending
      INVALID_CALLBACK:   300 // caller provided callback function threw an exception
    },

    WILDCARD: '*',
    ASYNC: 'async',

    //---------------------------------------------------------------------------

    create: function(cfg, target) {

      var initial      = (typeof cfg.initial == 'string') ? { state: cfg.initial } : cfg.initial; // allow for a simple string, or an object with { state: 'foo', event: 'setup', defer: true|false }
      var terminal     = cfg.terminal || cfg['final'];
      var fsm          = target || cfg.target  || {};
      var events       = cfg.events || [];
      var callbacks    = cfg.callbacks || {};
      var map          = {}; // track state transitions allowed for an event { event: { from: [ to ] } }
      var transitions  = {}; // track events allowed from a state            { state: [ event ] }

      var add = function(e) {
        var from = Array.isArray(e.from) ? e.from : (e.from ? [e.from] : [StateMachine.WILDCARD]); // allow 'wildcard' transition if 'from' is not specified
        map[e.name] = map[e.name] || {};
        for (var n = 0 ; n < from.length ; n++) {
          transitions[from[n]] = transitions[from[n]] || [];
          transitions[from[n]].push(e.name);

          map[e.name][from[n]] = e.to || from[n]; // allow no-op transition if 'to' is not specified
        }
        if (e.to)
          transitions[e.to] = transitions[e.to] || [];
      };

      if (initial) {
        initial.event = initial.event || 'startup';
        add({ name: initial.event, from: 'none', to: initial.state });
      }

      for(var n = 0 ; n < events.length ; n++)
        add(events[n]);

      for(var name in map) {
        if (map.hasOwnProperty(name))
          fsm[name] = StateMachine.buildEvent(name, map[name]);
      }

      for(var name in callbacks) {
        if (callbacks.hasOwnProperty(name))
          fsm[name] = callbacks[name]
      }

      fsm.current     = 'none';
      fsm.is          = function(state) { return Array.isArray(state) ? (state.indexOf(this.current) >= 0) : (this.current === state); };
      fsm.can         = function(event) { return !this.transition && (map[event] !== undefined) && (map[event].hasOwnProperty(this.current) || map[event].hasOwnProperty(StateMachine.WILDCARD)); }
      fsm.cannot      = function(event) { return !this.can(event); };
      fsm.transitions = function()      { return (transitions[this.current] || []).concat(transitions[StateMachine.WILDCARD] || []); };
      fsm.isFinished  = function()      { return this.is(terminal); };
      fsm.error       = cfg.error || function(name, from, to, args, error, msg, e) { throw e || msg; }; // default behavior when something unexpected happens is to throw an exception, but caller can override this behavior if desired (see github issue #3 and #17)
      fsm.states      = function() { return Object.keys(transitions).sort() };

      if (initial && !initial.defer)
        fsm[initial.event]();

      return fsm;

    },

    //===========================================================================

    doCallback: function(fsm, func, name, from, to, args) {
      if (func) {
        try {
          return func.apply(fsm, [name, from, to].concat(args));
        }
        catch(e) {
          return fsm.error(name, from, to, args, StateMachine.Error.INVALID_CALLBACK, "an exception occurred in a caller-provided callback function", e);
        }
      }
    },

    beforeAnyEvent:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onbeforeevent'],                       name, from, to, args); },
    afterAnyEvent:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onafterevent'] || fsm['onevent'],      name, from, to, args); },
    leaveAnyState:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onleavestate'],                        name, from, to, args); },
    enterAnyState:   function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onenterstate'] || fsm['onstate'],      name, from, to, args); },
    changeState:     function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onchangestate'],                       name, from, to, args); },

    beforeThisEvent: function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onbefore' + name],                     name, from, to, args); },
    afterThisEvent:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onafter'  + name] || fsm['on' + name], name, from, to, args); },
    leaveThisState:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onleave'  + from],                     name, from, to, args); },
    enterThisState:  function(fsm, name, from, to, args) { return StateMachine.doCallback(fsm, fsm['onenter'  + to]   || fsm['on' + to],   name, from, to, args); },

    beforeEvent: function(fsm, name, from, to, args) {
      if ((false === StateMachine.beforeThisEvent(fsm, name, from, to, args)) ||
          (false === StateMachine.beforeAnyEvent( fsm, name, from, to, args)))
        return false;
    },

    afterEvent: function(fsm, name, from, to, args) {
      StateMachine.afterThisEvent(fsm, name, from, to, args);
      StateMachine.afterAnyEvent( fsm, name, from, to, args);
    },

    leaveState: function(fsm, name, from, to, args) {
      var specific = StateMachine.leaveThisState(fsm, name, from, to, args),
          general  = StateMachine.leaveAnyState( fsm, name, from, to, args);
      if ((false === specific) || (false === general))
        return false;
      else if ((StateMachine.ASYNC === specific) || (StateMachine.ASYNC === general))
        return StateMachine.ASYNC;
    },

    enterState: function(fsm, name, from, to, args) {
      StateMachine.enterThisState(fsm, name, from, to, args);
      StateMachine.enterAnyState( fsm, name, from, to, args);
    },

    //===========================================================================

    buildEvent: function(name, map) {
      return function() {

        var from  = this.current;
        var to    = map[from] || (map[StateMachine.WILDCARD] != StateMachine.WILDCARD ? map[StateMachine.WILDCARD] : from) || from;
        var args  = Array.prototype.slice.call(arguments); // turn arguments into pure array

        if (this.transition)
          return this.error(name, from, to, args, StateMachine.Error.PENDING_TRANSITION, "event " + name + " inappropriate because previous transition did not complete");

        if (this.cannot(name))
          return this.error(name, from, to, args, StateMachine.Error.INVALID_TRANSITION, "event " + name + " inappropriate in current state " + this.current);

        if (false === StateMachine.beforeEvent(this, name, from, to, args))
          return StateMachine.Result.CANCELLED;

        if (from === to) {
          StateMachine.afterEvent(this, name, from, to, args);
          return StateMachine.Result.NOTRANSITION;
        }

        // prepare a transition method for use EITHER lower down, or by caller if they want an async transition (indicated by an ASYNC return value from leaveState)
        var fsm = this;
        this.transition = function() {
          fsm.transition = null; // this method should only ever be called once
          fsm.current = to;
          StateMachine.enterState( fsm, name, from, to, args);
          StateMachine.changeState(fsm, name, from, to, args);
          StateMachine.afterEvent( fsm, name, from, to, args);
          return StateMachine.Result.SUCCEEDED;
        };
        this.transition.cancel = function() { // provide a way for caller to cancel async transition if desired (issue #22)
          fsm.transition = null;
          StateMachine.afterEvent(fsm, name, from, to, args);
        }

        var leave = StateMachine.leaveState(this, name, from, to, args);
        if (false === leave) {
          this.transition = null;
          return StateMachine.Result.CANCELLED;
        }
        else if (StateMachine.ASYNC === leave) {
          return StateMachine.Result.PENDING;
        }
        else {
          if (this.transition) // need to check in case user manually called transition() but forgot to return StateMachine.ASYNC
            return this.transition();
        }

      };
    }

  }; // StateMachine

  //===========================================================================

  //======
  // NODE
  //======
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = StateMachine;
    }
    exports.StateMachine = StateMachine;
  }
  //============
  // AMD/REQUIRE
  //============
  else if (typeof define === 'function' && define.amd) {
    define(function(require) { return StateMachine; });
  }
  //========
  // BROWSER
  //========
  else if (typeof window !== 'undefined') {
    window.StateMachine = StateMachine;
  }
  //===========
  // WEB WORKER
  //===========
  else if (typeof self !== 'undefined') {
    self.StateMachine = StateMachine;
  }

}());

},{}]},{},[12]);
