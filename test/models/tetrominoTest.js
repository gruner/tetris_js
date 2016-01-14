'use strict';

var assert = require('assert'),
    Tetromino = require('../../js/models/tetromino'),
    tetromino,
    TYPE = 'o';

describe('Tetromino', function() {

    beforeEach(function() {
        tetromino = Tetromino.create(TYPE);
    });

    describe('#validateCoordinates', function() {
        it('should validate coordinates have x and y integers', function() {

            var testSets = [
                {
                    coordinates: {x: 0, y: 0},
                    expected: true
                },
                {
                    coordinates: {x: 1, y: 0},
                    expected: true
                },
                {
                    coordinates: {x: 0, y: 1},
                    expected: true
                },
                {
                    coordinates: {x: 1.1, y: 1},
                    expected: false
                },
                {
                    coordinates: {x: '1', y: 1},
                    expected: false
                },
                {
                    coordinates: {x: 1.1, y: 1},
                    expected: false
                },
                {
                    coordinates: {y: 1},
                    expected: false
                }
            ];
            for (var i = 0; i < testSets.length; i++) {
                var set = testSets[i];
                assert(set.expected === tetromino.validateCoordinates(set.coordinates));
            };
        });
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

    describe('#getBlockCoordinatesForOffset', function() {
        it('should return array of block coordinates', function() {
            tetromino.x = 10;
            tetromino.y = 10;
            var coordinates = tetromino.getBlockCoordinatesForOffset(1,1);
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

    describe('#releaseBlocks', function() {
        it('should return blocks with the type property', function() {
            var blocks = tetromino.releaseBlocks();

            assert(blocks.length === 4);
            assert(blocks[0].type === TYPE);
        });
    });

});