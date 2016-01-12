var events = require('./config/events'),
    sounds = require('./config/sounds'),
    eventDispatcher = require('./eventDispatcher'),
    debug = require('./debug');

var Sound = function() {
    var self = this;

    eventDispatcher.subscribe(events.rotateActivePiece, function() { self.play(sounds.rotateActivePiece); });
    eventDispatcher.subscribe(events.activePiecePositioned, function() { self.play(sounds.activePiecePositioned); });
    eventDispatcher.subscribe(events.rowComplete, function() { self.play(sounds.rowComplete); });
    eventDispatcher.subscribe(events.invalidMove, function() { self.play(sounds.invalidMove); });
    eventDispatcher.subscribe(events.topOut, function() { self.play(sounds.topOut); });
};

Sound.prototype.play = function(soundName) {
    //TODO: http://www.html5rocks.com/en/tutorials/webaudio/intro/
};

module.exports = Sound;