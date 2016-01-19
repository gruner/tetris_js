'use strict';

var assert = require('assert'),
    Tetromino = require('../../js/models/tetromino'),
    tetromino,
    TYPE = 'o';

describe('Tetromino', function() {

    beforeEach(function() {
        tetromino = Tetromino.create(TYPE);
    });   

    describe('#moveByOffset', function() {
        it('should move dimensions by given offset', function() {
            tetromino.x = 10;
            tetromino.y = 10;
            tetromino.moveByOffset({x:10, y:10});

            assert.strictEqual(tetromino.x, 20);
            assert.strictEqual(tetromino.y, 20);
        });
    });

    // DEPRICATED
    // describe('#update', function() {
    //     it('', function() {
    //         tetromino.x = 10;
    //         tetromino.y = 10;
    //         tetromino.destination = {y:100};
    //         tetromino.update(10);

    //         assert.strictEqual(10, tetromino.x);
    //         assert.strictEqual(20, tetromino.y);
    //     });
    // });

    describe('#atDestination', function() {
        it('should return false if not at the specified destination', function() {
            tetromino.y = 9;
            tetromino.destination = {y:10};
            
            assert(false === tetromino.atDestination());
        });
    });

    describe('#atDestination', function() {
        it('should return true if at the specified destination', function() {
            tetromino.y = 10;
            tetromino.destination = {y:10};
            
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
            assert.strictEqual(blocks[0].x, 11);
            assert.strictEqual(blocks[0].y, 10);
            assert.strictEqual(blocks[1].x, 12);
            assert.strictEqual(blocks[1].y, 10);
        });
    });

    describe('#getBlockCoordinatesForOffset', function() {
        it('should return array of block coordinates', function() {
            tetromino.x = 10;
            tetromino.y = 10;
            var coordinates = tetromino.getBlockCoordinatesForOffset({x:1, y:1});

            assert(4 === coordinates.length);
            // assert.equal(coordinates[0].x, 11);
            // assert.equal(coordinates[0].y, 11);

            // assert.equal(coordinates[1].x, 12);
            // assert.equal(coordinates[1].y, 11);

            // assert.equal(coordinates[2].x, 11);
            // assert.equal(coordinates[2].y, 12);

            // assert.equal(coordinates[3].x, 12);
            // assert.equal(coordinates[3].y, 12);
        });
    });

    describe('#getBlockCoordinatesForOffset', function() {
        it('should return array of block coordinates', function() {
            var tetromino = Tetromino.create('i');
            tetromino.x = 10;
            tetromino.y = 11;
            var coordinates = tetromino.getBlockCoordinatesForOffset({x:0, y:1});

            assert(4 === coordinates.length);
            assert.equal(coordinates[0].x, 10);
            assert.equal(coordinates[0].y, 13);

            assert.equal(coordinates[1].x, 11);
            assert.equal(coordinates[1].y, 13);

            assert.equal(coordinates[2].x, 12);
            assert.equal(coordinates[2].y, 13);

            assert.equal(coordinates[3].x, 13);
            assert.equal(coordinates[3].y, 13);
        });
    });

    describe('#getBlockCoordinatesForRotation', function() {
        it('should return array of block coordinates', function() {
            tetromino.x = 10;
            tetromino.y = 10;
            
            var coordinates = tetromino.getBlockCoordinatesForRotation();

            assert(4 === coordinates.length);
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