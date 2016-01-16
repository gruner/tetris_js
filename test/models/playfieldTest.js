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
        it('should initialize with expected row count', function() {
            assert.equal(ROW_COUNT, playfield.grid.length);
        });
    });

    describe('#cellInBounds', function() {
        it('should calculate if a cell exists within the playfield bounds', function() {
            assert(true === playfield.cellInBounds({x:0, y:0}));
            assert(true === playfield.cellInBounds({x:1, y:1}));
            assert(true === playfield.cellInBounds({x:5, y:6}));
            assert(true === playfield.cellInBounds({x:9, y:19}));

            assert(false === playfield.cellInBounds({x:9, y:20}));
            assert(false === playfield.cellInBounds({x:10, y:19}));
            assert(false === playfield.cellInBounds({x:10, y:20}));
            assert(false === playfield.cellInBounds({x:11, y:20}));
            assert(false === playfield.cellInBounds({x:10, y:21}));
            assert(false === playfield.cellInBounds({x:11, y:21}));
            assert(false === playfield.cellInBounds({x:50, y:50}));
            assert(false === playfield.cellInBounds({x:1000, y:1000}));
        });
    });

    describe('#removeRowAt', function() {
        it('should insert new empty row', function() {

            playfield.grid[0] = [1,2,3,4,5];
            playfield.removeRowAt(10);
        
            assert.strictEqual(0, playfield.grid[0].length);
            assert.strictEqual(5, playfield.grid[1].length);
            
        });
    });

    describe('#removeRowAt', function() {
        it('should insert new empty row', function() {

            playfield.grid[0] = [1,2,3,4,5];
            playfield.removeRowAt(10);
        
            assert.strictEqual(0, playfield.grid[0].length);
            assert.strictEqual(5, playfield.grid[1].length);
            
        });
    });

    describe('#removeRowAt', function() {
        it('should remove row and insert new empty row at top of playfield', function() {

            playfield.grid[0] = [1,2,3,4,5];
            playfield.removeRowAt(10);
        
            assert.strictEqual(0, playfield.grid[0].length);
            assert.strictEqual(5, playfield.grid[1].length);
            assert.strictEqual(ROW_COUNT, playfield.grid.length);
            
        });
    });

    describe('#removeRowAt', function() {
        it('should remove row', function() {

            playfield.grid[10] = [0,1,2,3,4,5];

            assert.strictEqual(6, playfield.grid[10].length);
            playfield.removeRowAt(10);

            assert(playfield.grid[10] === undefined);
            
        });
    });

    describe('#removeRowAt', function() {
        it('should move top row down', function() {
            var row = [1,2,3,4,5];
            playfield.grid[9] = row;
            playfield.removeRowAt(10);

            assert.strictEqual(row, playfield.grid[10]);
            
        });
    });

    describe('#removeRowAt', function() {
        it('should return removed row', function() {
            var row = [1,2,3,4,5];
            playfield.grid[10] = row;
            var result = playfield.removeRowAt(10);

            assert.strictEqual(row, result);
            
        });
    });

    describe('#removeRowAt', function() {
        it('should not alter grid if row is out of bounds', function() {
            playfield.grid[0] = [1,2,3,4,5];
            var row = playfield.removeRowAt(100);

            assert(row === undefined);
            // ensure row 0 is not altered
            assert.equal(5, playfield.grid[0].length);
            
        });
    });

    describe('#rowComplete', function() {
        it('should return true if all columns are filled', function() {
                playfield.grid[10] = [0,1,2,3,4,5,6,7,8,9];
                assert(playfield.rowComplete(10) === true);
            
        });
    });

    describe('#rowComplete', function() {
        it('should return false if all columns are not filled', function() {
            assert(playfield.rowComplete(10) === false);
            
        });
    });

    describe('#rowComplete', function() {
        it('should return false if row is empty', function() {
            playfield.grid[10] = [];
            assert(playfield.rowComplete(10) === false);
        });
    });

    describe('#rowComplete', function() {
        it('should return false if row is incomplete', function() {
            playfield.grid[10] = [1,2,3,4,5,6,7,8,9];
            assert(playfield.rowComplete(10) === false);
        });
    });

    describe('#rowComplete', function() {
        it('should return false if row is out of bounds', function() {
            assert(playfield.rowComplete(ROW_COUNT + 10) === false);
        });
    });

    describe('#getCompletedRows', function() {
        it('should return array of rows', function() {
            playfield.grid[1] = [0,1,2,3,4,5,6,7,8,9];
            playfield.grid[2] = [1,2,3,4,5,6,7,8,9];
            playfield.grid[3] = [0,1,2,3,4,5,6,7,8,9];
            playfield.grid[5] = [0,1,2,3,4,5,6,7,8,9];

            var completedRows = playfield.getCompletedRows();

            assert.equal(1, completedRows[0]);
            assert.equal(3, completedRows[1]);
            assert.equal(5, completedRows[2]);
            assert.equal(3, completedRows.length);
        });
    });

    describe('#cellEmpty', function() {
        it('should return true', function() {
            assert(playfield.cellEmpty({x:0, y:0}));
            assert(playfield.cellEmpty({x:5, y:6}));
        });
    });

    describe('#cellEmpty', function() {
        it('should return false', function() {
            playfield.grid[0] = [0,1,2,3,4];
            assert(false === playfield.cellEmpty({x:0, y:0}));
            assert(false === playfield.cellEmpty({x:4, y:0}));
        });
    });

    describe('#cellEmpty', function() {
        it('should return false when out of bounds', function() {
            assert(false === playfield.cellEmpty({x:COL_COUNT + 10, y:ROW_COUNT + 10}));
        });
    });

    describe('#cellInBounds', function() {
        it('should return true when cell is in bounds', function() {
            assert(playfield.cellInBounds({x:0, y:0}));
            assert(playfield.cellInBounds({x:COL_COUNT - 1, y:ROW_COUNT - 1}));
        });
    });

    describe('#cellInBounds', function() {
        it('should return false when cell is out of bounds', function() {
            assert(false === playfield.cellInBounds({x:COL_COUNT, y:ROW_COUNT}));
            assert(false === playfield.cellInBounds({x:COL_COUNT + 1, y:ROW_COUNT + 1}));
            assert(false === playfield.cellInBounds({x:-1, y:-1}));
        });
    });

    describe('#validateBlock', function() {
        it('should return true for valid block dimensions', function() {
            assert(playfield.validateBlock({x:0, y:0}));
        });
    });

    describe('#validateBlock', function() {
        it('should return false for out of bound block dimensions', function() {
            assert(false === playfield.validateBlock({x:-1, y:-1}));
        });
    });

    describe('#validateBlock', function() {
        it('should return false when block is not empty', function() {
            playfield.grid[0] = [1];
            assert(false === playfield.validateBlock({x:0, y:0}));
        });
    });

    describe('#validateBlockPlacement', function() {
        it('should return true when blocks are valid for placement', function() {
            var blocks = [
                {x:0, y:0},
                {x:1, y:0},
                {x:2, y:0}
            ];
            assert(playfield.validateBlockPlacement(blocks));
        });
    });

    describe('#validateBlockPlacement', function() {
        it('should return false when one or more blocks are out of bounds', function() {
            var blocks = [
                {x:-1, y:-1},
                {x:1, y:0},
                {x:2, y:0}
            ];
            assert(false === playfield.validateBlockPlacement(blocks));
        });
    });

    describe('#validateBlockPlacement', function() {
        it('should return false when one or more blocks are not empty', function() {
            playfield.grid[0] = [1];
            var blocks = [
                {x:0, y:0},
                {x:1, y:0},
                {x:2, y:0}
            ];
            assert(false === playfield.validateBlockPlacement(blocks));
        });
    });

    describe('#placeBlock', function() {
        it('should insert block at the correct coordinates', function() {
            var block = {x:0, y:0};
            playfield.placeBlock(block);
            
            assert.strictEqual(block, playfield.grid[0][0]);
        });
    });

    describe('#placeBlocks', function() {
        it('should insert array of blocks at the correct coordinates', function() {
            var block1 = {x:0, y:0},
                block2 = {x:1, y:0},
                block3 = {x:2, y:0},
                blocks = [block1, block2, block3]
                ;
            playfield.placeBlocks(blocks);

            assert.strictEqual(block1, playfield.grid[0][0]);
            assert.strictEqual(block2, playfield.grid[0][1]);
            assert.strictEqual(block3, playfield.grid[0][2]);
        });
    });

});