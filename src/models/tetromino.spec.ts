import { Direction } from "./direction.enum";
import { Tetromino } from "./tetromino";

describe('Tetromino', function() {
  const TYPE = 'o';
  let tetromino: Tetromino;

  beforeEach(function() {
    tetromino = Tetromino.create(TYPE);
  });   

  describe('#moveByOffset', function() {
    it('should move dimensions by given offset', function() {
      tetromino.x = 10;
      tetromino.y = 10;
      tetromino.moveByOffset({x:10, y:10});

      expect(tetromino.x).toEqual(20);
      expect(tetromino.y).toEqual(20);
    });
  });

  describe('#getBlockCoordinates', function() {
    it('should return array of block coordinates', function() {
      tetromino.x = 10;
      tetromino.y = 10;
      var blocks = tetromino.getBlockCoordinates();

      expect(blocks.length).toEqual(4);
      expect(blocks[0].x).toEqual(11);
      expect(blocks[0].y).toEqual(10);
      expect(blocks[1].x).toEqual(12);
      expect(blocks[1].y).toEqual(10);
    });
  });

  describe('#getBlockCoordinatesForOffset', function() {
    it('should return array of block coordinates', function() {
      tetromino.x = 10;
      tetromino.y = 10;
      var coordinates = tetromino.getBlockCoordinatesForOffset({x:1, y:1});

      expect(coordinates!.length).toEqual(4);
      // expect(coordinates[0].x).toEqual(11);
      // expect(coordinates[0].y).toEqual(11);

      // expect(coordinates[1].x).toEqual(12);
      // expect(coordinates[1].y).toEqual(11);

      // expect(coordinates[2].x).toEqual(11);
      // expect(coordinates[2].y).toEqual(12);

      // expect(coordinates[3].x).toEqual(12);
      // expect(coordinates[3].y).toEqual(12);
    });
  });

  describe('#getBlockCoordinatesForOffset', function() {
    it('should return array of block coordinates', function() {
      tetromino = Tetromino.create('i');
      tetromino.x = 10;
      tetromino.y = 11;
      const coordinates = tetromino.getBlockCoordinatesForOffset({x:0, y:1})!;

      expect(coordinates.length).toEqual(4);
      expect(coordinates[0].x).toEqual(10);
      expect(coordinates[0].y).toEqual(13);

      expect(coordinates[1].x).toEqual(11);
      expect(coordinates[1].y).toEqual(13);

      expect(coordinates[2].x).toEqual(12);
      expect(coordinates[2].y).toEqual(13);

      expect(coordinates[3].x).toEqual(13);
      expect(coordinates[3].y).toEqual(13);
    });
  });

  describe('#getBlockCoordinatesForRotation', function() {
    it('should return array of block coordinates', function() {
      tetromino.x = 10;
      tetromino.y = 10;
      
      const coordinates = tetromino.getBlockCoordinatesForRotation(Direction.Left);

      expect(coordinates.length).toEqual(4);
    });
  });

  describe('#releaseBlocks', function() {
    it('should return blocks with the type property', function() {
      const blocks = tetromino.releaseBlocks();

      expect(blocks.length).toEqual(4);
      expect(blocks[0].type).toEqual(TYPE);
    });
  });

});