'use strict';

var assert = require('assert'),
    Tetromino = require('../js/models/tetromino'),
    GameEngine = require('../js/gameEngine'),
    gameEngine;

describe('GameEngine', function() {

    before(function() {
        GameEngine.prototype.init = function() {}; // Disable original constructor
    });

    beforeEach(function() {
        gameEngine = new GameEngine();
        var tetromino = Tetromino.create('i');

    });

    // describe('#initThemes', function() {
    //     it('should initialize with default theme', function() {
    //         assert.ok(gameEngine.theme);
    //     });
    // });

    describe('#getTetrominoStyle', function() {
        it('should return valid style object', function() {
            var style = gameEngine.getTetrominoStyle('o');
            assert.ok(style);
            assert.ok(style.color);
        });
    });

    describe('#getTetrominoStyle', function() {
        it('should return null', function() {
            var style = gameEngine.getTetrominoStyle('NO_EXIST');
            assert(null === style);
        });
    });

    describe('#update', function() {
        it('should update all game assets');
    });

    describe('#getGravity', function() {
        it('should determine gravity rate', function() {
            gameEngine.gravity = 50;
            assert.equal(gameEngine.getGravity(), 50);
        });
    });

    describe('#getGravity', function() {
        it('should determine if gravity rate is accelerated', function() {
            gameEngine.accelerateGravity = true;
            assert.equal(GameEngine.ACCELERATED_GRAVITY, gameEngine.getGravity());
        });
    });

    describe('#getProjectedDestination', function() {
        it('should project the destination of a tetromino', function() {

            var data = [
                {
                    type: 'i',
                    x: 5,
                    y: 2,
                    expectedX: 5,
                    expectedY: 20
                },
                {
                    type: 'o',
                    x: 6,
                    y: 2,
                    expectedX: 6,
                    expectedY: 20
                }
            ];

            assert(gameEngine.playfield.yCount === 22);
            assert(gameEngine.playfield.grid.length === 22);

            for (var i = 0; i < data.length; i++) {
                var testData = data[i];

                gameEngine.activeTetromino = Tetromino.create(testData.type);
                gameEngine.activeTetromino.move({x: testData.x, y: testData.y});
        
                var dest = gameEngine.getProjectedDestination(gameEngine.activeTetromino);

                assert.equal(dest.x, testData.expectedX);
                assert.equal(dest.y, testData.expectedY);
            }
        });
    });

    describe('#advanceNextPiece', function() {
        it('should determine the next tetromino', function() {
            assert.strictEqual(null, gameEngine.activeTetromino);
            gameEngine.advanceNextPiece();
            assert.ok(gameEngine.activeTetromino);
        });
    });

    describe('#moveActivePiece', function() {
        it('should change the coordinates ');
    });

    describe('#rotateActivePiece', function() {
        it('should determine the next tetromino');
    });
});