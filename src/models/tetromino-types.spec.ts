import { TetrominoType, TetrominoTypes } from "./tetromino-types";

describe('TetrominoTypes', function() {

  describe('#getType', function() {
    it('should return object with array of blocks', function() {
      const blocks = TetrominoTypes.getBlocksForType(TetrominoType.z)!;
      expect(blocks[0].length).toBeTruthy();
      expect(blocks[0][0].x).toEqual(0);
      expect(blocks[0][0].y).toEqual(0);
      expect(blocks[0][1].x).toEqual(1);
    });
  });

  describe('#getTypeKeys', function() {
    it('should return array of stings', function() {
      const keys = TetrominoTypes.getTypeKeys();
      expect(keys.length).toBeTruthy();
      expect(keys[0]).toEqual(TetrominoType.i);
      expect(keys[1]).toEqual(TetrominoType.j);
      expect(keys[6]).toEqual(TetrominoType.z);
    });
  });

});