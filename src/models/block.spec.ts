import { Block } from "./block";

describe('Block', function() {

  describe('#constructor', function() {
    it('should create valid block', function() {
      const block = new Block(10, 11);
      expect(block.x).toEqual(10);
      expect(block.y).toEqual(11);
      expect(block.width).toEqual(1);
      expect(block.height).toEqual(1);
    });
  });

  describe('#collidesWith', function() {
    it('should determine if blocks collide', function() {

      const testData = [
        {
          aX: 1,
          aY: 1,
          bX: 1,
          bY: 1,
          result: true
        },
        {
          aX: 10,
          aY: 11,
          bX: 10,
          bY: 11,
          result: true
        },
        {
          aX: 1,
          aY: 1,
          bX: 1,
          bY: 2,
          result: false
        },
        {
          aX: 1,
          aY: 1,
          bX: 2,
          bY: 1,
          result: false
        },
        {
          aX: 1,
          aY: 1,
          bX: 2,
          bY: 2,
          result: false
        }
      ];

      for (let i = 0; i < testData.length; i++) {
        const data = testData[i];
        const blockA = new Block(data.aX, data.aY);
        const blockB = new Block(data.bX, data.bY);

        expect(blockA.collidesWith(blockB)).toEqual(data.result);
        expect(blockB.collidesWith(blockA)).toEqual(data.result);
        expect(Block.collides(blockA, blockB)).toEqual(data.result);
        expect(Block.collides(blockB, blockA)).toEqual(data.result);
      }
    });
  });
});
