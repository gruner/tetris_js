'use strict';

var TestCase = require('../juniper/testCase'),
	GameEngine = require('../gameEngine');

var GameEngineTest = function() {};

GameEngineTest.prototype = new TestCase();

GameEngineTest.prototype.setup = function() {
    this.fixture = new GameEngine();
};

GameEngineTest.prototype.testTheme = function() {
	this.assertFalse(this.fixture.theme === undefined);
};

module.exports = GameEngineTest;