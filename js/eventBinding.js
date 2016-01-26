'use strict';
    
var $ = require('jquery'),
    dispatcher = require('./eventDispatcher'),
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
    bindKeydown: function($document) {
        $document.on('keydown', function(e) {
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
        var $document = $(document),
            i;

        for (i in eventBinding) {
            if (eventBinding.hasOwnProperty(i)) {
                eventBinding[i]($document);
            }
        }
    }
};