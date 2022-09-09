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