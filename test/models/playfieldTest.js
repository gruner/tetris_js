'use strict';

var assert = require('assert'),
    Playfield = require('../../js/models/playfield'),
    playfield;

var ROW_COUNT = 20,
    COL_COUNT = 10;

describe('Playfield', function() {

    beforeEach(function() {
        playfield = new Playfield(COL_COUNT, ROW_COUNT);
    });

    describe('#constructor', function() {
        it('should initialize with expected row count', function(done) {
            assert.equal(ROW_COUNT, playfield.grid.length);
            done();
        });
    });

    describe('#cellInBounds', function() {
        it('should calculate if a cell exists within the playfield bounds', function(done) {
            assert(true === playfield.cellInBounds(0,0));
            assert(true === playfield.cellInBounds(1,1));
            assert(true === playfield.cellInBounds(5,6));

            assert(false === playfield.cellInBounds(10,20));
            assert(false === playfield.cellInBounds(11,20));
            assert(false === playfield.cellInBounds(10,21));
            assert(false === playfield.cellInBounds(11,21));
            assert(false === playfield.cellInBounds(50,50));
            assert(false === playfield.cellInBounds(1000,1000));
            
            done();
        });
    });

    describe('#removeRowAt', function() {
        it('should insert new empty row', function(done) {

            playfield.grid[0] = [1,2,3,4,5];
            playfield.removeRowAt(10);
        
            assert.strictEqual(0, playfield.grid[0].length);
            assert.strictEqual(5, playfield.grid[1].length);
            
            done();
        });
    });

    describe('#removeRowAt', function() {
        it('should insert new empty row', function(done) {

            playfield.grid[0] = [1,2,3,4,5];
            playfield.removeRowAt(10);
        
            assert.strictEqual(0, playfield.grid[0].length);
            assert.strictEqual(5, playfield.grid[1].length);
            
            done();
        });
    });

    describe('#removeRowAt', function() {
        it('should remove row and insert new empty row at top of playfield', function(done) {

            playfield.grid[0] = [1,2,3,4,5];
            playfield.removeRowAt(10);
        
            assert.strictEqual(0, playfield.grid[0].length);
            assert.strictEqual(5, playfield.grid[1].length);
            assert.strictEqual(ROW_COUNT, playfield.grid.length);
            
            done();
        });
    });

    describe('#removeRowAt', function() {
        it('should remove row', function(done) {

            playfield.grid[10] = [0,1,2,3,4,5];

            assert.strictEqual(6, playfield.grid[10].length);
            playfield.removeRowAt(10);

            assert(playfield.grid[10] === undefined);
            
            done();
        });
    });

    describe('#removeRowAt', function() {
        it('should move top row down', function(done) {
            var row = [1,2,3,4,5];
            playfield.grid[9] = row;
            playfield.removeRowAt(10);

            assert.strictEqual(row, playfield.grid[10]);
            
            done();
        });
    });

    describe('#removeRowAt', function() {
        it('should return removed row', function(done) {
            var row = [1,2,3,4,5];
            playfield.grid[10] = row;
            var result = playfield.removeRowAt(10);

            assert.strictEqual(row, result);
            
            done();
        });
    });

    describe('#removeRowAt', function() {
        it('should not alter grid if row is out of bounds', function(done) {
            playfield.grid[0] = [1,2,3,4,5];
            var row = playfield.removeRowAt(100);

            assert(row === undefined);
            // ensure row 0 is not altered
            assert.equal(5, playfield.grid[0].length);
            
            done();
        });
    });

    describe('#rowComplete', function() {
        it('should return true if all columns are filled', function(done) {
                playfield.grid[10] = [0,1,2,3,4,5,6,7,8,9];
                assert(playfield.rowComplete(10) === true);
            
                done();
        });
    });

    describe('#rowComplete', function() {
        it('should return false if all columns are not filled', function(done) {
            assert(playfield.rowComplete(10) === false);
            
            done();
        });
    });

    describe('#rowComplete', function() {
        it('should return false if row is empty', function(done) {
            playfield.grid[10] = [];
            assert(playfield.rowComplete(10) === false);
            
            done();
        });
    });

    describe('#rowComplete', function() {
        it('should return false if row is incomplete', function(done) {
            playfield.grid[10] = [1,2,3,4,5,6,7,8,9];
            assert(playfield.rowComplete(10) === false);
            
            done();
        });
    });

    describe('#rowComplete', function() {
        it('should return false if row is out of bounds', function(done) {
            assert(playfield.rowComplete(ROW_COUNT + 10) === false);
            
            done();
        });
    });

    describe('#getCompletedRows', function() {
        it('should return array of rows', function(done) {
            playfield.grid[1] = [0,1,2,3,4,5,6,7,8,9];
            playfield.grid[2] = [1,2,3,4,5,6,7,8,9];
            playfield.grid[3] = [0,1,2,3,4,5,6,7,8,9];
            playfield.grid[5] = [0,1,2,3,4,5,6,7,8,9];

            var completedRows = playfield.getCompletedRows();

            assert.equal(1, completedRows[0]);
            assert.equal(3, completedRows[1]);
            assert.equal(5, completedRows[2]);
            assert.equal(3, completedRows.length);
            
            done();
        });
    });

    describe('#cellEmpty', function() {
        it('should return true', function(done) {
            assert(playfield.cellEmpty(0,0));
            assert(playfield.cellEmpty(5,6));
            
            done();
        });
    });

    describe('#cellEmpty', function() {
        it('should return false', function(done) {
            playfield.grid[0] = [0,1,2,3,4];
            assert(false === playfield.cellEmpty(0,0));
            assert(false === playfield.cellEmpty(4,0));
            
            done();
        });
    });

});


// PlayfieldTest.prototype.testCellEmpty_OutOfBounds = function() {
//     this.assertFalse(playfield.cellEmpty(COL_COUNT + 10, ROW_COUNT + 10));
// };

// PlayfieldTest.prototype.testCellInBounds_True = function() {
//     this.assertTrue(playfield.cellInBounds(0, 0));
//     this.assertTrue(playfield.cellInBounds(COL_COUNT - 1, ROW_COUNT - 1));
// };

// PlayfieldTest.prototype.testCellInBounds_False = function() {
//     this.assertFalse(playfield.cellInBounds(COL_COUNT, ROW_COUNT));
//     this.assertFalse(playfield.cellInBounds(COL_COUNT + 1, ROW_COUNT + 1));
//     this.assertFalse(playfield.cellInBounds(-1, -1));
// };

// PlayfieldTest.prototype.testValidateBlock_True = function() {
//     this.assertTrue(playfield.validateBlock({x:0, y:0}));
// };

// PlayfieldTest.prototype.testValidateBlock_OutOfBounds = function() {
//     this.assertFalse(playfield.validateBlock({x:-1, y:-1}));
// };

// PlayfieldTest.prototype.testValidateBlock_CellNotEmpty = function() {
//     playfield.grid[0] = [1];
//     this.assertFalse(playfield.validateBlock({x:0, y:0}));
// };

// PlayfieldTest.prototype.testValidateBlocks_True = function() {
//     var blocks = [
//         {x:0, y:0},
//         {x:1, y:0},
//         {x:2, y:0}
//     ];
//     this.assertTrue(playfield.validateBlockPlacement(blocks));
// };

// PlayfieldTest.prototype.testValidateBlocks_OutOfBounds = function() {
//     var blocks = [
//         {x:-1, y:-1},
//         {x:1, y:0},
//         {x:2, y:0}
//     ];
//     this.assertFalse(playfield.validateBlockPlacement(blocks));
// };

// PlayfieldTest.prototype.testValidateBlocks_CellNotEmpty = function() {
//     playfield.grid[0] = [1];
//     var blocks = [
//         {x:0, y:0},
//         {x:1, y:0},
//         {x:2, y:0}
//     ];
//     this.assertFalse(playfield.validateBlockPlacement(blocks));
// };

// PlayfieldTest.prototype.testPlaceBlock = function() {
//     var block = {x:0, y:0};
//     playfield.placeBlock(block);
    
//     this.assertEquals(block, playfield.grid[0][0]);
// };

// PlayfieldTest.prototype.testPlaceBlocks = function() {
//     var block1 = {x:0, y:0},
//         block2 = {x:1, y:0},
//         block3 = {x:2, y:0},
//         blocks = [block1, block2, block3]
//         ;
//     playfield.placeBlocks(blocks);

//     this.assertEquals(block1, playfield.grid[0][0]);
//     this.assertEquals(block2, playfield.grid[0][1]);
//     this.assertEquals(block3, playfield.grid[0][2]);
// };

// module.exports = PlayfieldTest;