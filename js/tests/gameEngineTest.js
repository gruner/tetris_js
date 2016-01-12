'use strict';

var TestCase = require('../juniper/testCase'),
	GameEngine = require('../gameEngine');

var GameEngineTest = function() {};

GameEngineTest.prototype = new TestCase();

GameEngineTest.prototype.setup = function() {
    // Disable original constructor
    GameEngine.prototype.init = function() {};
    this.fixture = new GameEngine();
};

GameEngineTest.prototype.testTheme = function() {
	this.assertFalse(this.fixture.theme === undefined);
};

GameEngineTest.prototype.testGetProjectedDestination = function() {
	this.fixture.getNextPiece();
	this.fixture.activeTetromino.move({x:5, y:2});

	var dest = this.fixture.getProjectedDestination();

	console.log(dest);

	this.assertEquals(5, dest.x);
	this.assertEquals(22, dest.y); //18
};

GameEngineTest.prototype.testGetNextPiece = function() {
	this.assertNull(this.fixture.activeTetromino);
	this.fixture.getNextPiece();
	this.assertNotNull(this.fixture.activeTetromino);
};

module.exports = GameEngineTest;