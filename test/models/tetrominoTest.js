'use strict';

var assert = require('assert'),
    Tetromino = require('../../js/models/tetromino'),
    tetromino;

describe('Tetromino', function() {

    beforeEach(function() {
        tetromino = Tetromino.create('o');
    });

    describe('#moveByOffset', function() {
        it('should move dimensions by given offset', function() {
            tetromino.x = 10;
            tetromino.y = 10;
            tetromino.moveByOffset(10, 10);

            assert.strictEqual(20, tetromino.x);
            assert.strictEqual(20, tetromino.y);
        });
    });

    describe('#update', function() {
        it('', function() {
            tetromino.x = 10;
            tetromino.y = 10;
            tetromino.destinationY = 100;
            tetromino.update(10);

            assert.strictEqual(10, tetromino.x);
            assert.strictEqual(20, tetromino.y);
        });
    });

    describe('#atDestination', function() {
        it('should return false if not at the specified destination', function() {
            tetromino.y = 9;
            tetromino.destinationY = 10;
            
            assert(false === tetromino.atDestination());
        });
    });

    describe('#atDestination', function() {
        it('should return true if at the specified destination', function() {
            tetromino.y = 10;
            tetromino.destinationY = 10;
            
            assert(true === tetromino.atDestination());
            tetromino.y++;
            assert(true === tetromino.atDestination());
        });
    });

    describe('#getBlockCoordinates', function() {
        it('should return array of block coordinates', function() {
            tetromino.x = 10;
            tetromino.y = 10;
            var blocks = tetromino.getBlockCoordinates();

            assert(4 === blocks.length);
            assert.strictEqual(10, blocks[0].x);
            assert.strictEqual(10, blocks[0].y);
            assert.strictEqual(11, blocks[1].x);
            assert.strictEqual(10, blocks[1].y);
        });
    });

    describe('#getBlockCoordinatesForRotation', function() {
        it('should return array of block coordinates', function() {
            tetromino.x = 10;
            tetromino.y = 10;
            
            var blocks = tetromino.getBlockCoordinatesForRotation();

            assert(4 === blocks.length);
        });
    });

});