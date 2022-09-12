import { Block } from "./block";
import { Playfield } from "./playfield";

const ROW_COUNT = 20;
const COL_COUNT = 10;

describe('Playfield', () => {

  let playfield: Playfield;

  beforeEach(() => {
    playfield = new Playfield(COL_COUNT, ROW_COUNT);
  });

  describe('#constructor', function() {
    it('should initialize with expected row count', () => {
      expect(playfield.grid.length).toEqual(ROW_COUNT);
    });
  });

  describe('#buildGrid', function() {
    it('should initialize grid with predefined rows', function() {
      const result = playfield.buildGrid();
      expect(result.length).toEqual(ROW_COUNT);
      for (let i = 0; i < result.length; i++) {
        expect(result[i].length).toEqual(COL_COUNT);
      }
    });
  });

  describe('#traverseRows', function() {
    it('should traverse all rows', function() {
      const traversedRows = [];
      playfield.traverseRows(function(i: number) {
        traversedRows.push(i);
      });

      expect(traversedRows.length).toEqual(ROW_COUNT);
    });

    it('should traverse rows from bottom to top', function() {
      const traversedRows: number[] = [];

      playfield.traverseRows(function(i: number) {
        traversedRows.push(i);
      });

      const firstIndex = traversedRows.shift();
      const lastIndex = traversedRows.pop();

      expect(firstIndex).toEqual(ROW_COUNT-1);
      expect(lastIndex).toEqual(0);
    });
  });

  describe('#cellInBounds', function() {
    it('should calculate if a cell exists within the playfield bounds', function() {

      expect(playfield.cellInBounds(new Block(0, 0))).toBeTrue();
      expect(playfield.cellInBounds(new Block(1, 1))).toBeTrue();
      expect(playfield.cellInBounds(new Block(5, 6))).toBeTrue();
      expect(playfield.cellInBounds(new Block(9, 19))).toBeTrue();

      expect(playfield.cellInBounds(new Block(9, 20))).toBeFalse();
      expect(playfield.cellInBounds(new Block(10, 19))).toBeFalse();
      expect(playfield.cellInBounds(new Block(10, 20))).toBeFalse();
      expect(playfield.cellInBounds(new Block(11, 20))).toBeFalse();
      expect(playfield.cellInBounds(new Block(10, 21))).toBeFalse();
      expect(playfield.cellInBounds(new Block(11, 21))).toBeFalse();
      expect(playfield.cellInBounds(new Block(50, 50))).toBeFalse();
      expect(playfield.cellInBounds(new Block(1000, 1000))).toBeFalse();
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
    
      expect(playfield.grid[0][0]).toBeUndefined();
      expect(playfield.grid[1][0]).toBeUndefined();
      expect(playfield.grid[2][0]).toBeUndefined();

      expect(playfield.grid[3][0]).toEqual(0);
      expect(playfield.grid[4][0]).toEqual(1);
      expect(playfield.grid[5][0]).toEqual(2);

      expect(playfield.grid.length).toEqual(ROW_COUNT);
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
    
      expect(playfield.grid[0][0]).toBeUndefined();
      expect(playfield.grid[1][0]).toBeUndefined();
      expect(playfield.grid[2][0]).toBeUndefined();

      expect(playfield.grid[3][0]).toEqual(0);
      expect(playfield.grid[4][0]).toEqual(2);
      expect(playfield.grid[5][0]).toEqual(4);
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
    
      expect(playfield.grid[0][0]).toBeUndefined();
      expect(playfield.grid[1][0]).toBeUndefined();
      expect(playfield.grid[2][0]).toBeUndefined();
      expect(playfield.grid[3][0]).toEqual(0);
      expect(playfield.grid[4][0]).toEqual(2);
      expect(playfield.grid[5][0]).toEqual(4);
    });
  });

  describe('#clearRowAt', function() {
    it('should clear top row', function() {

      playfield.grid[0] = [1,2,3,4,5];
      playfield.clearRowAt(0);

      expect(playfield.grid[0][0]).toBeUndefined();
    });
  });

  describe('#clearRowAt', function() {
    it('should clear bottom row', function() {

      const lastRowIndex = playfield.grid.length - 1;
      const row = [1,2,3,4,5];

      playfield.grid[lastRowIndex] = row;

      // verify before clearing
      expect(playfield.grid.length).toEqual(ROW_COUNT);
      expect(playfield.grid[lastRowIndex].length).toEqual(5);
      
      const result = playfield.clearRowAt(lastRowIndex);
      
      // after clearing
      expect(result).toEqual(row);
      expect(playfield.grid.length).toEqual(ROW_COUNT);
      expect(playfield.grid[lastRowIndex].length).toEqual(COL_COUNT);
      expect(playfield.grid[lastRowIndex][0]).toBeUndefined();
    });
  });

  describe('#clearRowAt', function() {
    it('should insert new empty row', function() {

      playfield.grid[0] = [1,2,3,4,5];
      playfield.clearRowAt(10);
    
      expect(playfield.grid[0][0]).toBeUndefined();
      expect(playfield.grid[1].length).toEqual(5);
    });
  });

  describe('#clearRowAt', function() {
    it('should remove row and insert new empty row at top of playfield', function() {

      playfield.grid[0] = [1,2,3,4,5];
      playfield.clearRowAt(10);
    
      expect(playfield.grid[0][0]).toBeUndefined();
      expect(playfield.grid[1].length).toEqual(5);
      expect(playfield.grid.length).toEqual(ROW_COUNT);
      expect(playfield.yCount).toEqual(playfield.grid.length);
    });
  });

  describe('#clearRowAt', function() {
    it('should remove row', function() {

      playfield.grid[10] = [0,1,2,3,4,5];

      expect(playfield.grid[10].length).toEqual(6);
      playfield.clearRowAt(10);

      expect(playfield.grid[10].length).toEqual(COL_COUNT);
      expect(playfield.grid[10][0]).toBeUndefined();
    });
  });

  describe('#clearRowAt', function() {
    it('should move top row down', function() {
      const row = [1,2,3,4,5];
      playfield.grid[9] = row;
      playfield.clearRowAt(10);

      expect(playfield.grid[10]).toEqual(row);
    });
  });

  describe('#clearRowAt', function() {
    it('should return removed row', function() {
      const row = [1,2,3,4,5];
      playfield.grid[10] = row;
      const result = playfield.clearRowAt(10);

      expect(result).toEqual(row);
    });
  });

  describe('#clearRowAt', function() {
    it('should not alter grid if row is out of bounds', function() {
      playfield.grid[0] = [1,2,3,4,5];
      var row = playfield.clearRowAt(100);

      expect(row).toBeUndefined();
      // ensure row 0 is not altered
      expect(playfield.grid[0].length).toEqual(5);
    });
  });

  describe('#settleRows', function() {
    it('should settle two compatible rows', function() {

      let n; // undefined

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

      expect(result).toBeTrue();
      expect(playfield.grid[5].length).toEqual(COL_COUNT);
      expect(playfield.grid[19][0]).toEqual(0);
      expect(playfield.grid[19][1]).toEqual(1);
      expect(playfield.grid[19][2]).toEqual(2);
      expect(playfield.grid[19][3]).toEqual(3);
      expect(playfield.grid[19][4]).toEqual(4);
      expect(playfield.grid[19][5]).toEqual(5);
      expect(playfield.grid[19][6]).toEqual(6);
      expect(playfield.grid[19][7]).toEqual(7);
      expect(playfield.grid[19][8]).toEqual(8);
      expect(playfield.grid[19][9]).toEqual(9);
      expect(ROW_COUNT).toEqual(playfield.grid.length);
    });

    it('should settle two compatible rows', function() {

      var n; // undefined

      playfield.grid[4] = [0,1,2,n,n,n];
      playfield.grid[5] = [n,n,n,3,4,5];

      var result = playfield.settleRows();

      expect(result).toBeTrue();
      expect(playfield.grid[5].length).toEqual(COL_COUNT);
      expect(playfield.grid[5][0]).toEqual(0);
      expect(playfield.grid[5][1]).toEqual(1);
      expect(playfield.grid[5][2]).toEqual(2);
      expect(playfield.grid[5][3]).toEqual(3);
      expect(playfield.grid[5][4]).toEqual(4);
      expect(playfield.grid[5][5]).toEqual(5);
      expect(playfield.grid.length).toEqual(ROW_COUNT);
    });

    // it('should not settle undefined rows', function() {

    //   var n; // undefined

    //   playfield.grid[4] = [0,1,2,n,n,n];
    //   playfield.grid[5] = undefined;

    //   var result = playfield.settleRows();

    //   expect(false === result);
    // });

    it('should settle two+ compatible rows', function() {

      var n; // undefined

      playfield.grid[4] = [n,1,2,n,n,n];
      playfield.grid[5] = [n,n,n,3,4,n];
      playfield.grid[6] = [n,n,n,n,n,5];
      playfield.grid[7] = [0,n,n,n,n,n];

      var result = playfield.settleRows();

      expect(result).toBeTrue();
      expect(playfield.grid[7].length).toEqual(COL_COUNT);
      expect(playfield.grid[7][0]).toEqual(0);
      expect(playfield.grid[7][1]).toEqual(1);
      expect(playfield.grid[7][2]).toEqual(2);
      expect(playfield.grid[7][3]).toEqual(3);
      expect(playfield.grid[7][4]).toEqual(4);
      expect(playfield.grid[7][5]).toEqual(5);
      expect(playfield.grid.length).toEqual(ROW_COUNT);
    });

    it('should not settle incompatible rows', function() {

      var n; // undefined

      playfield.grid[4] = [1,1,1,n,n,n];
      playfield.grid[5] = [2,n,n,2,2,2];

      var result = playfield.settleRows();

      expect(result).toBeFalse();
      expect(playfield.grid[5][0]).toEqual(2);
      expect(playfield.grid[5][1]).toEqual(n);
      expect(playfield.grid[5][2]).toEqual(n);
      expect(playfield.grid[5][3]).toEqual(2);
      expect(playfield.grid[5][4]).toEqual(2);
      expect(playfield.grid[5][5]).toEqual(2);
      expect(playfield.grid.length).toEqual(ROW_COUNT);
    });

    // it('should not merge incompatible rows', function() {

    //   var n = undefined;

    //   playfield.grid[4] = [1,1,1,n,n,n];
    //   playfield.grid[5] = [2,n,n,2,2,2];
    //   playfield.grid[6] = [n,n,n,n,n,n];
    //   playfield.grid[7] = [n,n,n,n,n,n];

    //   var result = playfield.settleRows();

    //   expect(result);
    //   expect(playfield.grid[7][0]).toEqual(2);
    //   expect(playfield.grid[7][1]).toEqual(n);
    //   expect(playfield.grid[7][2]).toEqual(n);
    //   expect(playfield.grid[7][3]).toEqual(2);
    //   expect(playfield.grid[7][4]).toEqual(2);
    //   expect(playfield.grid[7][5]).toEqual(2);
    // });
  });

  describe('#rowsAreMergable', function() {
    it('should check if rows can be merged', function() {

      var n = undefined,
        r2 = [n,2,2,n,n,n,2,2,n,n],
        r1 = [1,n,n,1,1,1,n,n,1,1],
        result = playfield.rowsAreMergable(r1, r2);

      expect(result).toBeTrue();
    });
  });

  describe('#rowsAreMergable', function() {
    it('should check if rows cannot be merged', function() {

      var n = undefined,
        r2 = [2,2,2,2,2,n,2,2,n,n],
        r1 = [1,n,n,1,1,1,n,1,1,1],
        result = playfield.rowsAreMergable(r1, r2);

      expect(result).toBeFalse();
    });
  });

  describe('#rowsAreMergable', function() {
    it('should verify that empty bottom row cannot be merged', function() {

      var n = undefined,
        r2 = [2,2,2,2,2,n,2,2,n,n],
        r1 = [n,n,n,n,n,n,n,n,n,n],
        result = playfield.rowsAreMergable(r1, r2);

      expect(result).toBeFalse();
    });
  });

  describe('#rowsAreMergable', function() {
    it('should verify that empty top row cannot be merged', function() {

      var n = undefined,
        r2 = [n,n,n,n,n,n,n,n,n,n],
        r1 = [2,2,2,2,2,n,2,2,n,n],
        result = playfield.rowsAreMergable(r1, r2);

      expect(result).toBeFalse();
    });
  });

  describe('#rowsAreMergable', function() {
    it('should return false if both rows are empty', function() {

      var n, // undefined
        r2 = [n,n,n,n,n,n,n,n,n,n],
        r1 = [n,n,n,n,n,n,n,n,n,n],
        result = playfield.rowsAreMergable(r1, r2);

        expect(result).toBeFalse();
    });

    // it('should return false if any rows are undefined', function() {

    //   var r1 = [2,2,2,2,2],
    //     result;

    //   result = playfield.rowsAreMergable(undefined, r1);
    //   expect(result).toBeFalse();

    //   result = playfield.rowsAreMergable(r1, undefined);
    //   expect(result).toBeFalse();

    //   result = playfield.rowsAreMergable(undefined, undefined);
    //   expect(result).toBeFalse();

    //   result = playfield.rowsAreMergable();
    //   expect(result).toBeFalse();
    // });
  });

  describe('#mergeRows', function() {
    it('should merge compatible rows', function() {

      var n, // undefined
        r2 = [1,n,n,3,4,5,n,n,8,9],
        r1 = [0,1,2,n,n,n,6,7,n,n],
        result = playfield.mergeRows(r1, r2);

      expect(result.length).toEqual(10);
      expect(result[0]).toEqual(0);
      expect(result[1]).toEqual(1);
      expect(result[2]).toEqual(2);
      expect(result[3]).toEqual(3);
      expect(result[4]).toEqual(4);
      expect(result[5]).toEqual(5);
      expect(result[6]).toEqual(6);
      expect(result[7]).toEqual(7);
      expect(result[8]).toEqual(8);
      expect(result[9]).toEqual(9);
    });
  });

  describe('#mergeRows', function() {
    it('should merge compatible rows', function() {

      var n, // undefined
        r2 = [1,2,3,3,4,5,7,8,8,9],
        r1 = [0,1,2,n,n,n,6,7,n,n],
        result = playfield.mergeRows(r1, r2);

      expect(result.length).toEqual(10);
      expect(result[0]).toEqual(0);
      expect(result[1]).toEqual(1);
      expect(result[2]).toEqual(2);
      expect(result[3]).toEqual(3);
      expect(result[4]).toEqual(4);
      expect(result[5]).toEqual(5);
      expect(result[6]).toEqual(6);
      expect(result[7]).toEqual(7);
      expect(result[8]).toEqual(8);
      expect(result[9]).toEqual(9);
    });
  });

  describe('#mergeRows', function() {
    it('should merge compatible rows', function() {

      var n, // undefined
        r2 = [n,1,n,3,n,5,n,7,n,9],
        r1 = [0,n,2,n,4,n,6,n,8,n],
        result = playfield.mergeRows(r1, r2);

      expect(result.length).toEqual(10);
      expect(result[0]).toEqual(0);
      expect(result[1]).toEqual(1);
      expect(result[2]).toEqual(2);
      expect(result[3]).toEqual(3);
      expect(result[4]).toEqual(4);
      expect(result[5]).toEqual(5);
      expect(result[6]).toEqual(6);
      expect(result[7]).toEqual(7);
      expect(result[8]).toEqual(8);
      expect(result[9]).toEqual(9);
    });
  });

  describe('#mergeRows', function() {
    it('should merge into empty target row', function() {

      var n, // undefined
        r2 = [0,1,2,3,4,5,6,7,8,9],
        r1 = [n,n,n,n,n,n,n,n,n,n],
        result = playfield.mergeRows(r1, r2);

      expect(result.length).toEqual(10);
      expect(result[0]).toEqual(0);
      expect(result[1]).toEqual(1);
      expect(result[2]).toEqual(2);
      expect(result[3]).toEqual(3);
      expect(result[4]).toEqual(4);
      expect(result[5]).toEqual(5);
      expect(result[6]).toEqual(6);
      expect(result[7]).toEqual(7);
      expect(result[8]).toEqual(8);
      expect(result[9]).toEqual(9);
    });
  });

  describe('#mergeRows', function() {
    it('should not merge empty values into target row', function() {

      var n, // undefined
        r2 = [n,n,n,n,n,n,n,n,n,n],
        r1 = [0,1,2,3,4,5,6,7,8,9],
        result = playfield.mergeRows(r1, r2);

      expect(result.length).toEqual(10);
      expect(result[0]).toEqual(0);
      expect(result[1]).toEqual(1);
      expect(result[2]).toEqual(2);
      expect(result[3]).toEqual(3);
      expect(result[4]).toEqual(4);
      expect(result[5]).toEqual(5);
      expect(result[6]).toEqual(6);
      expect(result[7]).toEqual(7);
      expect(result[8]).toEqual(8);
      expect(result[9]).toEqual(9);
    });
  });

  describe('#rowIsComplete', function() {
    it('should return true if all columns are filled', function() {
        playfield.grid[10] = [0,1,2,3,4,5,6,7,8,9];
        expect(playfield.rowIsComplete(10)).toBeTrue();
    });

    it('should return false if all columns are not filled', function() {
      expect(playfield.rowIsComplete(10)).toBeFalse();
    });

    it('should return false if row is empty', function() {
      playfield.grid[10] = [];
      expect(playfield.rowIsComplete(10)).toBeFalse();
    });

    it('should return false if row is incomplete', function() {
      playfield.grid[10] = [1,2,3,4,5,6,7,8,9];
      expect(playfield.rowIsComplete(10)).toBeFalse();
    });

    it('should return false if row is out of bounds', function() {
      expect(playfield.rowIsComplete(ROW_COUNT + 10)).toBeFalse();
    });
  });

  describe('#getCompletedRows', function() {
    it('should return array of rows', function() {
      playfield.grid[1] = [0,1,2,3,4,5,6,7,8,9];
      playfield.grid[2] = [1,2,3,4,5,6,7,8,9];
      playfield.grid[3] = [0,1,2,3,4,5,6,7,8,9];
      playfield.grid[5] = [0,1,2,3,4,5,6,7,8,9];

      const completedRows = playfield.getCompletedRows();

      expect(completedRows[0]).toEqual(5);
      expect(completedRows[1]).toEqual(3);
      expect(completedRows[2]).toEqual(1);
      expect(completedRows.length).toEqual(3);
    });

    it('should return empty array', function() {
      var completedRows = playfield.getCompletedRows();
      expect(completedRows.length).toEqual(0);
    });
  });

  describe('#cellEmpty', function() {
    it('should return true when cell is empty', function() {
      expect(playfield.cellEmpty(new Block(0, 0))).toBeTrue();
      expect(playfield.cellEmpty(new Block(5, 6))).toBeTrue();
    });

    it('should return false when cell exists', function() {
      playfield.grid[0] = [0,1,2,3,4];
      expect(playfield.cellEmpty(new Block(0, 0))).toBeFalse();
      expect(playfield.cellEmpty(new Block(4, 0))).toBeFalse();
    });

    it('should return false when out of bounds', function() {
      expect(playfield.cellEmpty(new Block(COL_COUNT + 10, ROW_COUNT + 10))).toBeFalse();
    });
  });

  describe('#cellInBounds', function() {
    it('should return true when cell is in bounds', function() {
      expect(playfield.cellInBounds(new Block(0, 0))).toBeTrue();
      expect(playfield.cellInBounds(new Block(COL_COUNT - 1, ROW_COUNT - 1))).toBeTrue();
    });

    it('should return false when cell is out of bounds', function() {
      expect(playfield.cellInBounds(new Block(COL_COUNT, ROW_COUNT))).toBeFalse();
      expect(playfield.cellInBounds(new Block(COL_COUNT + 1, ROW_COUNT + 1))).toBeFalse();
      expect(playfield.cellInBounds(new Block(-1, -1))).toBeFalse();
    });
  });

  describe('#validateBlock', function() {
    it('should return true for valid block dimensions', function() {
      expect(playfield.validateBlock(new Block(0, 0))).toBeTrue();
    });

    it('should return false for out of bound block dimensions', function() {
      expect(playfield.validateBlock(new Block(-1, -1))).toBeFalse();
    });

    it('should return false when block is not empty', function() {
      playfield.grid[0] = [1];
      expect(playfield.validateBlock(new Block(0, 0))).toBeFalse();
    });
  });

  describe('#validateBlockPlacement', function() {
    it('should return true when blocks are valid for placement', function() {
      const blocks = [
        new Block(0, 0),
        new Block(1, 0),
        new Block(2, 0)
      ];
      expect(playfield.validateBlockPlacement(blocks)).toBeTrue();
    });

    it('should return false when one or more blocks are out of bounds', function() {
      var blocks = [
        new Block(-1, -1),
        new Block(1, 0),
        new Block(2, 0)
      ];
      expect(playfield.validateBlockPlacement(blocks)).toBeFalse();
    });

    it('should return false when one or more blocks are not empty', function() {
      playfield.grid[0] = [1];
      var blocks = [
        new Block(0, 0),
        new Block(1, 0),
        new Block(2, 0)
      ];
      expect(playfield.validateBlockPlacement(blocks)).toBeFalse();
    });
  });

  describe('#placeBlock', function() {
    it('should insert block at the correct coordinates', function() {
      const block = new Block(0, 0);
      playfield.placeBlock(block);
      
      expect(playfield.grid[0][0]).toEqual(block);
      expect(playfield.grid.length).toEqual(ROW_COUNT);
    });
  });

  describe('#placeBlocks', function() {
    it('should insert array of blocks at the correct coordinates', function() {
      const block1 = new Block(0, 0);
      const block2 = new Block(1, 0);
      const block3 = new Block(2, 0);
      const blocks = [block1, block2, block3];
      playfield.placeBlocks(blocks);

      expect(playfield.grid[0][0]).toEqual(block1);
      expect(playfield.grid[0][1]).toEqual(block2);
      expect(playfield.grid[0][2]).toEqual(block3);
      expect(playfield.grid.length).toEqual(ROW_COUNT);
    });

    it('should validate all blocks before placing them');
  });

});