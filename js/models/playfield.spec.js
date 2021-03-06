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

    describe('#buildGrid', function() {
        it('should initialize grid with predefined rows', function() {
            var result = playfield.buildGrid();
            assert.equal(ROW_COUNT, result.length);
            for (var i = 0; i < result.length; i++) {
                assert.strictEqual(COL_COUNT, result[i].length);
            }
        });
    });

    describe('#traverseRows', function() {
        it('should traverse all rows', function() {
            var traversedRows = [];
            playfield.traverseRows(function(i) {
                traversedRows.push(i);
            });

            assert.equal(ROW_COUNT, traversedRows.length);
        });
    });

    describe('#traverseRows', function() {
        it('should traverse rows from bottom to top', function() {
            var traversedRows = [],
                first,
                last;
            playfield.traverseRows(function(i) {
                traversedRows.push(i);
            });

            first = traversedRows.shift();
            last = traversedRows.pop();

            assert.equal(ROW_COUNT-1, first);
            assert.equal(0, last);
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

    describe('#clearRows', function() {
        it('should remove touching rows', function() {

            playfield.grid[0] = [0,0,0,0,0];
            playfield.grid[1] = [1,1,1,1,1];
            playfield.grid[2] = [2,2,2,2,2];
            playfield.grid[3] = [3,3,3,3,3];
            playfield.grid[4] = [4,4,4,4,4];
            playfield.grid[5] = [5,5,5,5,5];

            playfield.clearRows([5, 4, 3]);

            // Should Result in:
            // playfield.grid[0] = [];
            // playfield.grid[1] = [];
            // playfield.grid[2] = [];
            // playfield.grid[3] = [0,0,0,0,0];
            // playfield.grid[4] = [1,1,1,1,1];
            // playfield.grid[5] = [2,2,2,2,2];
        
            assert.equal(playfield.grid[0][0], undefined);
            assert.equal(playfield.grid[1][0], undefined);
            assert.equal(playfield.grid[2][0], undefined);
            assert.strictEqual(playfield.grid[3][0], 0);
            assert.strictEqual(playfield.grid[4][0], 1);
            assert.strictEqual(playfield.grid[5][0], 2);

            assert.strictEqual(playfield.grid.length, ROW_COUNT);
        });
    });

    describe('#clearRows', function() {
        it('should remove non-touching rows', function() {

            playfield.grid[0] = [0,0,0,0,0];
            playfield.grid[1] = [1,1,1,1,1];
            playfield.grid[2] = [2,2,2,2,2];
            playfield.grid[3] = [3,3,3,3,3];
            playfield.grid[4] = [4,4,4,4,4];
            playfield.grid[5] = [5,5,5,5,5];

            playfield.clearRows([5, 3, 1]);

            // Should Result in:
            // playfield.grid[0] = [];
            // playfield.grid[1] = [];
            // playfield.grid[2] = [];
            // playfield.grid[3] = [0,0,0,0,0];
            // playfield.grid[4] = [2,2,2,2,2];
            // playfield.grid[5] = [4,4,4,4,4];
        
            assert.strictEqual(playfield.grid[0][0], undefined);
            assert.strictEqual(playfield.grid[1][0], undefined);
            assert.strictEqual(playfield.grid[2][0], undefined);
            assert.strictEqual(playfield.grid[3][0], 0);
            assert.strictEqual(playfield.grid[4][0], 2);
            assert.strictEqual(playfield.grid[5][0], 4);
        });
    });

    describe('#clearRows', function() {
        it('should accept arguments in any order', function() {

            playfield.grid[0] = [0,0,0,0,0];
            playfield.grid[1] = [1,1,1,1,1];
            playfield.grid[2] = [2,2,2,2,2];
            playfield.grid[3] = [3,3,3,3,3];
            playfield.grid[4] = [4,4,4,4,4];
            playfield.grid[5] = [5,5,5,5,5];

            playfield.clearRows([1, 3, 5]); // Same as above, but reversed

            // Should Result in:
            // playfield.grid[0] = [];
            // playfield.grid[1] = [];
            // playfield.grid[2] = [];
            // playfield.grid[3] = [0,0,0,0,0];
            // playfield.grid[4] = [2,2,2,2,2];
            // playfield.grid[5] = [4,4,4,4,4];
        
            assert.strictEqual(playfield.grid[0][0], undefined);
            assert.strictEqual(playfield.grid[1][0], undefined);
            assert.strictEqual(playfield.grid[2][0], undefined);
            assert.strictEqual(playfield.grid[3][0], 0);
            assert.strictEqual(playfield.grid[4][0], 2);
            assert.strictEqual(playfield.grid[5][0], 4);
        });
    });

    describe('#clearRowAt', function() {
        it('should clear top row', function() {

            playfield.grid[0] = [1,2,3,4,5];
            playfield.clearRowAt(0);

            assert.strictEqual(playfield.grid[0][0], undefined);
        });
    });

    describe('#clearRowAt', function() {
        it('should clear bottom row', function() {

            var lastRowIndex = playfield.grid.length - 1,
                row = [1,2,3,4,5];

            playfield.grid[lastRowIndex] = row;

            // verify before clearing
            assert.strictEqual(ROW_COUNT, playfield.grid.length);
            assert.strictEqual(5, playfield.grid[lastRowIndex].length);
            
            var result = playfield.clearRowAt(lastRowIndex);
            
            // after clearing
            assert.strictEqual(row, result);
            assert.strictEqual(playfield.grid.length, ROW_COUNT);
            assert.strictEqual(playfield.grid[lastRowIndex].length, COL_COUNT);
            assert.strictEqual(playfield.grid[lastRowIndex][0], undefined);
        });
    });

    describe('#clearRowAt', function() {
        it('should insert new empty row', function() {

            playfield.grid[0] = [1,2,3,4,5];
            playfield.clearRowAt(10);
        
            assert.strictEqual(playfield.grid[0][0], undefined);
            assert.strictEqual(playfield.grid[1].length, 5);
        });
    });

    describe('#clearRowAt', function() {
        it('should remove row and insert new empty row at top of playfield', function() {

            playfield.grid[0] = [1,2,3,4,5];
            playfield.clearRowAt(10);
        
            assert.strictEqual(playfield.grid[0][0], undefined);
            assert.strictEqual(playfield.grid[1].length, 5);
            assert.strictEqual(ROW_COUNT, playfield.grid.length);
            assert.strictEqual(playfield.yCount, playfield.grid.length);
        });
    });

    describe('#clearRowAt', function() {
        it('should remove row', function() {

            playfield.grid[10] = [0,1,2,3,4,5];

            assert.strictEqual(6, playfield.grid[10].length);
            playfield.clearRowAt(10);

            assert(playfield.grid[10].length === COL_COUNT);
            assert(playfield.grid[10][0] === undefined);
        });
    });

    describe('#clearRowAt', function() {
        it('should move top row down', function() {
            var row = [1,2,3,4,5];
            playfield.grid[9] = row;
            playfield.clearRowAt(10);

            assert.strictEqual(row, playfield.grid[10]);
        });
    });

    describe('#clearRowAt', function() {
        it('should return removed row', function() {
            var row = [1,2,3,4,5];
            playfield.grid[10] = row;
            var result = playfield.clearRowAt(10);

            assert.strictEqual(row, result);
        });
    });

    describe('#clearRowAt', function() {
        it('should not alter grid if row is out of bounds', function() {
            playfield.grid[0] = [1,2,3,4,5];
            var row = playfield.clearRowAt(100);

            assert(row === undefined);
            // ensure row 0 is not altered
            assert.equal(5, playfield.grid[0].length);
        });
    });

    describe('#settleRows', function() {
        it('should settle two compatible rows', function() {

            var n; // undefined

            playfield.grid[0]  = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[1]  = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[2]  = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[3]  = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[4]  = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[5]  = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[6]  = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[7]  = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[8]  = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[9]  = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[10] = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[11] = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[12] = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[13] = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[14] = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[15] = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[16] = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[17] = [n,n,n,n,n,n,n,n,n,n];
            playfield.grid[18] = [0,1,2,3,n,n,n,n,n,n];
            playfield.grid[19] = [n,n,n,n,4,5,6,7,8,9];

            var result = playfield.settleRows();

            assert(result);
            assert.strictEqual(playfield.grid[5].length, COL_COUNT);
            assert.equal(playfield.grid[19][0], 0);
            assert.equal(playfield.grid[19][1], 1);
            assert.equal(playfield.grid[19][2], 2);
            assert.equal(playfield.grid[19][3], 3);
            assert.equal(playfield.grid[19][4], 4);
            assert.equal(playfield.grid[19][5], 5);
            assert.equal(playfield.grid[19][6], 6);
            assert.equal(playfield.grid[19][7], 7);
            assert.equal(playfield.grid[19][8], 8);
            assert.equal(playfield.grid[19][9], 9);
            assert.equal(ROW_COUNT, playfield.grid.length);
        });
    });

    describe('#settleRows', function() {
        it('should settle two compatible rows', function() {

            var n; // undefined

            playfield.grid[4] = [0,1,2,n,n,n];
            playfield.grid[5] = [n,n,n,3,4,5];

            var result = playfield.settleRows();

            assert(result);
            assert.strictEqual(playfield.grid[5].length, COL_COUNT);
            assert.equal(playfield.grid[5][0], 0);
            assert.equal(playfield.grid[5][1], 1);
            assert.equal(playfield.grid[5][2], 2);
            assert.equal(playfield.grid[5][3], 3);
            assert.equal(playfield.grid[5][4], 4);
            assert.equal(playfield.grid[5][5], 5);
            assert.equal(ROW_COUNT, playfield.grid.length);
        });
    });

    describe('#settleRows', function() {
        it('should not settle undefined rows', function() {

            var n; // undefined

            playfield.grid[4] = [0,1,2,n,n,n];
            playfield.grid[5] = undefined;

            var result = playfield.settleRows();

            assert(false === result);
        });
    });

    describe('#settleRows', function() {
        it('should settle two+ compatible rows', function() {

            var n; // undefined

            playfield.grid[4] = [n,1,2,n,n,n];
            playfield.grid[5] = [n,n,n,3,4,n];
            playfield.grid[6] = [n,n,n,n,n,5];
            playfield.grid[7] = [0,n,n,n,n,n];

            var result = playfield.settleRows();

            assert(result);
            assert.strictEqual(playfield.grid[7].length, COL_COUNT);
            assert.equal(playfield.grid[7][0], 0);
            assert.equal(playfield.grid[7][1], 1);
            assert.equal(playfield.grid[7][2], 2);
            assert.equal(playfield.grid[7][3], 3);
            assert.equal(playfield.grid[7][4], 4);
            assert.equal(playfield.grid[7][5], 5);
            assert.equal(ROW_COUNT, playfield.grid.length);
        });
    });

    describe('#settleRows', function() {
        it('should not settle incompatible rows', function() {

            var n; // undefined

            playfield.grid[4] = [1,1,1,n,n,n];
            playfield.grid[5] = [2,n,n,2,2,2];

            var result = playfield.settleRows();

            assert(false === result);
            assert.equal(playfield.grid[5][0], 2);
            assert.equal(playfield.grid[5][1], n);
            assert.equal(playfield.grid[5][2], n);
            assert.equal(playfield.grid[5][3], 2);
            assert.equal(playfield.grid[5][4], 2);
            assert.equal(playfield.grid[5][5], 2);
            assert.equal(ROW_COUNT, playfield.grid.length);
        });
    });

    // describe('#settleRows', function() {
    //     it('should not merge incompatible rows', function() {

    //         var n = undefined;

    //         playfield.grid[4] = [1,1,1,n,n,n];
    //         playfield.grid[5] = [2,n,n,2,2,2];
    //         playfield.grid[6] = [n,n,n,n,n,n];
    //         playfield.grid[7] = [n,n,n,n,n,n];

    //         var result = playfield.settleRows();

    //         assert(result);
    //         assert.equal(playfield.grid[7][0], 2);
    //         assert.equal(playfield.grid[7][1], n);
    //         assert.equal(playfield.grid[7][2], n);
    //         assert.equal(playfield.grid[7][3], 2);
    //         assert.equal(playfield.grid[7][4], 2);
    //         assert.equal(playfield.grid[7][5], 2);
    //     });
    // });

    describe('#rowsAreMergable', function() {
        it('should check if rows can be merged', function() {

            var n = undefined,
                r2 = [n,2,2,n,n,n,2,2,n,n],
                r1 = [1,n,n,1,1,1,n,n,1,1],
                result = playfield.rowsAreMergable(r1, r2);

            assert(result);
        });
    });

    describe('#rowsAreMergable', function() {
        it('should check if rows cannot be merged', function() {

            var n = undefined,
                r2 = [2,2,2,2,2,n,2,2,n,n],
                r1 = [1,n,n,1,1,1,n,1,1,1],
                result = playfield.rowsAreMergable(r1, r2);

            assert(false === result);
        });
    });

    describe('#rowsAreMergable', function() {
        it('should verify that empty bottom row cannot be merged', function() {

            var n = undefined,
                r2 = [2,2,2,2,2,n,2,2,n,n],
                r1 = [n,n,n,n,n,n,n,n,n,n],
                result = playfield.rowsAreMergable(r1, r2);

            assert(false === result);
        });
    });

    describe('#rowsAreMergable', function() {
        it('should verify that empty top row cannot be merged', function() {

            var n = undefined,
                r2 = [n,n,n,n,n,n,n,n,n,n],
                r1 = [2,2,2,2,2,n,2,2,n,n],
                result = playfield.rowsAreMergable(r1, r2);

            assert(false === result);
        });
    });

    describe('#rowsAreMergable', function() {
        it('should return false if both rows are empty', function() {

            var n, // undefined
                r2 = [n,n,n,n,n,n,n,n,n,n],
                r1 = [n,n,n,n,n,n,n,n,n,n],
                result = playfield.rowsAreMergable(r1, r2);

            assert(false === result);
        });
    });

    describe('#rowsAreMergable', function() {
        it('should return false if any rows are undefined', function() {

            var r1 = [2,2,2,2,2],
                result;

            result = playfield.rowsAreMergable(undefined, r1);
            assert(false === result);

            result = playfield.rowsAreMergable(r1, undefined);
            assert(false === result);

            result = playfield.rowsAreMergable(undefined, undefined);
            assert(false === result);

            result = playfield.rowsAreMergable();
            assert(false === result);
        });
    });

    describe('#mergeRows', function() {
        it('should merge compatible rows', function() {

            var n, // undefined
                r2 = [1,n,n,3,4,5,n,n,8,9],
                r1 = [0,1,2,n,n,n,6,7,n,n],
                result = playfield.mergeRows(r1, r2);

            assert.equal(result.length, 10);
            assert.equal(result[0], 0);
            assert.equal(result[1], 1);
            assert.equal(result[2], 2);
            assert.equal(result[3], 3);
            assert.equal(result[4], 4);
            assert.equal(result[5], 5);
            assert.equal(result[6], 6);
            assert.equal(result[7], 7);
            assert.equal(result[8], 8);
            assert.equal(result[9], 9);
        });
    });

    describe('#mergeRows', function() {
        it('should merge compatible rows', function() {

            var n, // undefined
                r2 = [1,2,3,3,4,5,7,8,8,9],
                r1 = [0,1,2,n,n,n,6,7,n,n],
                result = playfield.mergeRows(r1, r2);

            assert.equal(result.length, 10);
            assert.equal(result[0], 0);
            assert.equal(result[1], 1);
            assert.equal(result[2], 2);
            assert.equal(result[3], 3);
            assert.equal(result[4], 4);
            assert.equal(result[5], 5);
            assert.equal(result[6], 6);
            assert.equal(result[7], 7);
            assert.equal(result[8], 8);
            assert.equal(result[9], 9);
        });
    });

    describe('#mergeRows', function() {
        it('should merge compatible rows', function() {

            var n, // undefined
                r2 = [n,1,n,3,n,5,n,7,n,9],
                r1 = [0,n,2,n,4,n,6,n,8,n],
                result = playfield.mergeRows(r1, r2);

            assert.equal(result.length, 10);
            assert.equal(result[0], 0);
            assert.equal(result[1], 1);
            assert.equal(result[2], 2);
            assert.equal(result[3], 3);
            assert.equal(result[4], 4);
            assert.equal(result[5], 5);
            assert.equal(result[6], 6);
            assert.equal(result[7], 7);
            assert.equal(result[8], 8);
            assert.equal(result[9], 9);
        });
    });

    describe('#mergeRows', function() {
        it('should merge into empty target row', function() {

            var n, // undefined
                r2 = [0,1,2,3,4,5,6,7,8,9],
                r1 = [n,n,n,n,n,n,n,n,n,n],
                result = playfield.mergeRows(r1, r2);

            assert.equal(result.length, 10);
            assert.equal(result[0], 0);
            assert.equal(result[1], 1);
            assert.equal(result[2], 2);
            assert.equal(result[3], 3);
            assert.equal(result[4], 4);
            assert.equal(result[5], 5);
            assert.equal(result[6], 6);
            assert.equal(result[7], 7);
            assert.equal(result[8], 8);
            assert.equal(result[9], 9);
        });
    });

    describe('#mergeRows', function() {
        it('should not merge empty values into target row', function() {

            var n, // undefined
                r2 = [n,n,n,n,n,n,n,n,n,n],
                r1 = [0,1,2,3,4,5,6,7,8,9],
                result = playfield.mergeRows(r1, r2);

            assert.equal(result.length, 10);
            assert.equal(result[0], 0);
            assert.equal(result[1], 1);
            assert.equal(result[2], 2);
            assert.equal(result[3], 3);
            assert.equal(result[4], 4);
            assert.equal(result[5], 5);
            assert.equal(result[6], 6);
            assert.equal(result[7], 7);
            assert.equal(result[8], 8);
            assert.equal(result[9], 9);
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

            assert.equal(completedRows[0], 5);
            assert.equal(completedRows[1], 3);
            assert.equal(completedRows[2], 1);
            assert.equal(completedRows.length, 3);
        });
    });

    describe('#getCompletedRows', function() {
        it('should return empty array', function() {
            var completedRows = playfield.getCompletedRows();
            assert.equal(completedRows.length, 0);
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
            assert.strictEqual(ROW_COUNT, playfield.grid.length);
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
            assert.strictEqual(ROW_COUNT, playfield.grid.length);
        });
    });

});