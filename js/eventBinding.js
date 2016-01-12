'use strict';
    
var $ = require('jquery'),
    dispatcher = require('./eventDispatcher'),
    constants = require('./config/constants'),
    events = require('./config/events');

var keyCodes = {
    left:  37,
    up:    38,
    right: 39,
    down:  40
};

var eventBinding = {
    bindKeydown: function() {
        $(document).on('keydown', function(e) {
            var code = e.keyCode || e.which;
            if (code === keyCodes.left) {
                dispatcher.trigger(events.moveActivePiece, {direction: constants.DIRECTION_LEFT}, this);
            } else if (code === keyCodes.right) {
                dispatcher.trigger(events.moveActivePiece, {direction: constants.DIRECTION_RIGHT}, this);
            } else if (code === keyCodes.down) {
                dispatcher.trigger(events.moveActivePiece, {direction: constants.DIRECTION_DOWN}, this);
            } else if (code === keyCodes.up) {
                dispatcher.trigger(events.rotateActivePiece, {direction: constants.DIRECTION_LEFT}, this);
            }
        });
    },
    bindKeyup: function() {
        $(document).on('keyup', function(e) {
            var code = e.keyCode || e.which;
            // if (code === keyCodes.left) {
            //     dispatcher.trigger(events.moveActivePiece, {direction: 'left'}, this);
            // } else if (code === keyCodes.right) {
            //     dispatcher.trigger(events.moveActivePiece, {direction: 'right'}, this);
            // } else if (code === keyCodes.down) {
            //     dispatcher.trigger(events.moveActivePiece, {direction: 'down'}, this);
            // }
        });
    }
};

module.exports = {
    init: function() {
        for (var i in eventBinding) {
            if (eventBinding.hasOwnProperty(i)) {
                eventBinding[i]();
            }
        }
    }
};