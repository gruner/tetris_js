'use strict';

var TestCase = require('../../juniper/testCase'),
    Tetromino = require('../../models/tetromino');

var TetrominoTest = function() {};

TetrominoTest.prototype = new TestCase();

TetrominoTest.prototype.setup = function() {
    this.fixture = Tetromino.create('o');
};

TetrominoTest.prototype.testMoveByOffset = function() {
    this.fixture.x = 10;
    this.fixture.y = 10;
    this.fixture.moveByOffset(10, 10);

    this.assertEqual(20, this.fixture.x);
    this.assertEqual(20, this.fixture.y);
};

TetrominoTest.prototype.testUpdate = function() {
    this.fixture.x = 10;
    this.fixture.y = 10;
    this.fixture.destinationY = 100;
    this.fixture.update(10);

    this.assertEqual(10, this.fixture.x);
    this.assertEqual(20, this.fixture.y);
};

TetrominoTest.prototype.testAtDestination = function() {
    this.fixture.y = 10;
    this.fixture.destinationY = 10;
    
    this.assertTrue(this.fixture.atDestination());
    this.fixture.y++;
    this.assertTrue(this.fixture.atDestination());
};

TetrominoTest.prototype.testGetBlockCoordinates = function() {
    this.fixture.x = 10;
    this.fixture.y = 10;
    var blocks = this.fixture.getBlockCoordinates();

    this.assertEqual(10, blocks[0]['x']);
    this.assertEqual(10, blocks[0]['y']);
    this.assertEqual(11, blocks[1]['x']);
    this.assertEqual(10, blocks[1]['y']);
};

module.exports.TetrominoTest = TetrominoTest;