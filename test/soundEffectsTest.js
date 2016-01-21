'use strict';

var assert = require('assert'),
    SoundEffects = require('../js/soundEffects'),
    soundEffects;

describe('SoundEffects', function() {

    beforeEach(function() {
        SoundEffects.prototype.originalInitAudioContext = SoundEffects.prototype.initAudioContext;
        SoundEffects.prototype.initAudioContext = function() { return false;};
        soundEffects = new SoundEffects();
    });

    describe('#constructor', function() {
        it('should initialize', function() {
            assert(soundEffects.isMuted === true);
            assert(soundEffects.sources);
        });
    });
});
