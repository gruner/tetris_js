'use strict';

var TestCase = require('../../juniper/testCase'),
    Playfield = require('../../models/playfield');

var ROW_COUNT = 20,
    COL_COUNT = 10;

var PlayfieldTest = function() {};

PlayfieldTest.prototype = new TestCase();

PlayfieldTest.prototype.setup = function() {
    this.fixture = new Playfield(COL_COUNT, ROW_COUNT);
};

PlayfieldTest.prototype.testInit = function() {
    this.assertEquals(ROW_COUNT, this.fixture.grid.length);
};

PlayfieldTest.prototype.testBuildGrid = function() {
    var result = this.fixture.buildGrid();
    this.assertEquals(ROW_COUNT, result.length);
};

PlayfieldTest.prototype.testCellInBounds_True = function() {
    this.assertTrue(this.fixture.cellInBounds(0,0));
    this.assertTrue(this.fixture.cellInBounds(1,1));
    this.assertTrue(this.fixture.cellInBounds(5,6));
};

PlayfieldTest.prototype.testCellInBounds_False = function() {
    this.assertFalse(this.fixture.cellInBounds(10,20));
    this.assertFalse(this.fixture.cellInBounds(11,20));
    this.assertFalse(this.fixture.cellInBounds(10,21));
    this.assertFalse(this.fixture.cellInBounds(11,21));
    this.assertFalse(this.fixture.cellInBounds(50,50));
    this.assertFalse(this.fixture.cellInBounds(1000,1000));
};

PlayfieldTest.prototype.testRemoveRowAt_AddsNewRow = function() {
    this.fixture.grid[0] = [1,2,3,4,5];
    this.fixture.removeRowAt(10);

    this.assertTrue(this.fixture.grid[0].length === 0);
    this.assertTrue(this.fixture.grid[1].length === 5);
};

PlayfieldTest.prototype.testRemoveRowAt_RowCount = function() {
    this.fixture.removeRowAt(10);
    this.assertEquals(ROW_COUNT, this.fixture.grid.length);
};

PlayfieldTest.prototype.testRemoveRowAt_RemovesRow = function() {
    this.fixture.grid[10] = [0,1,2,3,4,5];
    this.assertTrue(typeof this.fixture.grid[10] !== 'undefined');
    this.fixture.removeRowAt(10);

    this.assertUndefined(this.fixture.grid[10]);
};

PlayfieldTest.prototype.testRemoveRowAt_TopRowsMoveDown = function() {
    var row = [1,2,3,4,5];
    this.fixture.grid[9] = row;
    this.fixture.removeRowAt(10);

    this.assertEquals(row, this.fixture.grid[10]);
};

PlayfieldTest.prototype.testRemoveRowAt_ReturnsRow = function() {
    var row = [1,2,3,4,5];
    this.fixture.grid[10] = row;
    var result = this.fixture.removeRowAt(10);

    this.assertEquals(row, result);
};

PlayfieldTest.prototype.testRemoveRowAt_OutOfBounds = function() {
    this.fixture.grid[0] = [1,2,3,4,5];
    var row = this.fixture.removeRowAt(100);

    this.assertUndefined(row);
    // ensure row 0 is not altered
    this.assertEquals(5, this.fixture.grid[0].length);
};

PlayfieldTest.prototype.testRowComplete_True = function() {
    this.fixture.grid[10] = [0,1,2,3,4,5,6,7,8,9];
    this.assertTrue(this.fixture.rowComplete(10));
};

PlayfieldTest.prototype.testRowComplete_False = function() {
    this.assertFalse(this.fixture.rowComplete(10));
};

PlayfieldTest.prototype.testRowComplete_Empty = function() {
    this.fixture.grid[10] = [];
    this.assertFalse(this.fixture.rowComplete(10));
};

PlayfieldTest.prototype.testRowComplete_Incomplete = function() {
    this.fixture.grid[10] = [1,2,3,4,5,6,7,8,9];
    this.assertFalse(this.fixture.rowComplete(10));
};

PlayfieldTest.prototype.testRowComplete_OutOfBounds = function() {
    this.assertFalse(this.fixture.rowComplete(ROW_COUNT + 10));
};

PlayfieldTest.prototype.testCellEmpty_True = function() {
    this.assertTrue(this.fixture.cellEmpty(0,0));
    this.assertTrue(this.fixture.cellEmpty(5,6));
};

PlayfieldTest.prototype.testCellEmpty_False = function() {
    this.fixture.grid[0] = [0,1,2,3,4];
    this.assertFalse(this.fixture.cellEmpty(0,0));
    this.assertFalse(this.fixture.cellEmpty(4,0));
};

PlayfieldTest.prototype.testCellEmpty_OutOfBounds = function() {
    this.assertFalse(this.fixture.cellEmpty(COL_COUNT + 10, ROW_COUNT + 10));
};

PlayfieldTest.prototype.testCellInBounds_True = function() {
    this.assertTrue(this.fixture.cellInBounds(0, 0));
    this.assertTrue(this.fixture.cellInBounds(COL_COUNT - 1, ROW_COUNT - 1));
};

PlayfieldTest.prototype.testCellInBounds_False = function() {
    this.assertFalse(this.fixture.cellInBounds(COL_COUNT, ROW_COUNT));
    this.assertFalse(this.fixture.cellInBounds(COL_COUNT + 1, ROW_COUNT + 1));
    this.assertFalse(this.fixture.cellInBounds(-1, -1));
};

PlayfieldTest.prototype.testValidateBlock_True = function() {
    this.assertTrue(this.fixture.validateBlock({x:0, y:0}));
};

PlayfieldTest.prototype.testValidateBlock_OutOfBounds = function() {
    this.assertFalse(this.fixture.validateBlock({x:-1, y:-1}));
};

PlayfieldTest.prototype.testValidateBlock_CellNotEmpty = function() {
    this.fixture.grid[0] = [1];
    this.assertFalse(this.fixture.validateBlock({x:0, y:0}));
};

PlayfieldTest.prototype.testValidateBlocks_True = function() {
    var blocks = [
        {x:0, y:0},
        {x:1, y:0},
        {x:2, y:0}
    ];
    this.assertTrue(this.fixture.validateBlockPlacement(blocks));
};

PlayfieldTest.prototype.testValidateBlocks_OutOfBounds = function() {
    var blocks = [
        {x:-1, y:-1},
        {x:1, y:0},
        {x:2, y:0}
    ];
    this.assertFalse(this.fixture.validateBlockPlacement(blocks));
};

PlayfieldTest.prototype.testValidateBlocks_CellNotEmpty = function() {
    this.fixture.grid[0] = [1];
    var blocks = [
        {x:0, y:0},
        {x:1, y:0},
        {x:2, y:0}
    ];
    this.assertFalse(this.fixture.validateBlockPlacement(blocks));
};

PlayfieldTest.prototype.testPlaceBlock = function() {
    var block = {x:0, y:0};
    this.fixture.placeBlock(block);
    
    this.assertEquals(block, this.fixture.grid[0][0]);
};

PlayfieldTest.prototype.testPlaceBlocks = function() {
    var block1 = {x:0, y:0},
        block2 = {x:1, y:0},
        block3 = {x:2, y:0},
        blocks = [block1, block2, block3]
        ;
    this.fixture.placeBlocks(blocks);

    this.assertEquals(block1, this.fixture.grid[0][0]);
    this.assertEquals(block2, this.fixture.grid[0][1]);
    this.assertEquals(block3, this.fixture.grid[0][2]);
};

module.exports = PlayfieldTest;