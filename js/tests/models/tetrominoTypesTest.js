'use strict';

var TestCase = require('../../juniper/testCase'),
    tTypes = require('../../models/tetrominoTypes');

var TetrominoTypesTest = function() {};

TetrominoTypesTest.prototype = new TestCase();

TetrominoTypesTest.prototype.testGetType = function() {
    var typeZ = tTypes.getType('z');
    this.assertEquals(0, typeZ.blocks[0].x);
    this.assertEquals(0, typeZ.blocks[0].y);
    this.assertEquals(1, typeZ.blocks[1].x);
};

TetrominoTypesTest.prototype.testGetTypeKeys = function() {
    var keys = tTypes.getTypeKeys();
    this.assertEquals('i', keys[0]);
    this.assertEquals('o', keys[1]);
    this.assertEquals('z', keys[6]);
};

module.exports = TetrominoTypesTest;