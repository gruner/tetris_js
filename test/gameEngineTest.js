'use strict';

var assert = require('assert'),
    GameEngine = require('../js/gameEngine'),
    gameEngine;

describe('GameEngine', function() {

    before(function() {
        GameEngine.prototype.init = function() {}; // Disable original constructor
    });

    beforeEach(function() {
        gameEngine = new GameEngine();
    });

    describe('#initThemes', function() {
        it('should initialize with default theme', function() {
            assert.ok(gameEngine.theme);
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
            gameEngine.getNextPiece();
            gameEngine.activeTetromino.move({x:5, y:2});
        
            var dest = gameEngine.getProjectedDestination();
        
            //console.log(dest);

            assert.equal(5, dest.x);
            assert.equal(22, dest.y); //19
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