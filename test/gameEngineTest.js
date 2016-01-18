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

    describe('#initThemes', function() {
        it('should initialize with default theme', function() {
            assert.ok(gameEngine.theme);
        });
    });

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

    describe('#getVelocity', function() {
        it('should determine velocity state', function() {
            gameEngine.velocity = 50;
            assert(50 === gameEngine.getVelocity());
        });
    });

    describe('#getVelocity', function() {
        it('should determine accelerated velocity state', function() {
            gameEngine.accelerate = true;
            assert(GameEngine.ACCELERATED_VELOCITY == gameEngine.getVelocity());
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
                    expectedY: 19
                }
            ];

            assert(gameEngine.playfield.yCount === 22);
            assert(gameEngine.playfield.grid.length === 22);

            for (var i = 0; i < data.length; i++) {
                var testData = data[i];

                gameEngine.activeTetromino = Tetromino.create(testData.type);
                gameEngine.activeTetromino.move({x: testData.x, y: testData.y});
        
                var dest = gameEngine.getProjectedDestination();

                assert.equal(testData.expectedX, dest.x);
                assert.equal(testData.expectedY, dest.y);
            }
        });
    });

    describe('#getNextPiece', function() {
        it('should determine the next tetromino', function() {
            assert.strictEqual(null, gameEngine.activeTetromino);
            gameEngine.getNextPiece();
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