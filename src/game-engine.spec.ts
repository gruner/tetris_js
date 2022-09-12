import { EventDispatcher } from "./events/event-dispatcher";
import { GameEngine } from "./game-engine";
import { Tetromino } from "./models/tetromino";
import { GameState } from "./state/game-state";
import { ActiveTheme } from "./theme/active-theme";
import { Theme } from "./theme/theme";

describe('GameEngine', function() {
  let gameEngine: GameEngine;

  beforeEach(function() {
    const activeTheme = new ActiveTheme(new Theme());
    const eventDispatcher = new EventDispatcher();
    const gameState = new GameState(eventDispatcher);
    gameEngine = new GameEngine(activeTheme, eventDispatcher, gameState);
  });

  // describe('#initThemes', function() {
  //     it('should initialize with default theme', function() {
  //         assert.ok(gameEngine.theme);
  //     });
  // });

  describe('#update', function() {
    it('should update all game assets');
  });

  describe('#getGravity', function() {
    it('should determine gravity rate', function() {
      gameEngine.gravity = 50;
      expect(gameEngine.getGravity()).toEqual(50);
    });

    it('should determine if gravity rate is accelerated', function() {
      gameEngine.accelerateGravity = true;
      expect(gameEngine.getGravity()).toEqual(GameEngine.ACCELERATED_GRAVITY);
    });
  });

  describe('#getProjectedDestination', function() {
    it('should project the destination of a tetromino', function() {

      const data = [
        {
          type: 'i',
          x: 5,
          y: 2,
          expectedX: 5,
          expectedY: 20
        },
        {
          type: 'o',
          x: 6,
          y: 2,
          expectedX: 6,
          expectedY: 20
        }
      ];

      expect(gameEngine.playfield.yCount).toEqual(22);
      expect(gameEngine.playfield.grid.length).toEqual(22);

      for (let i = 0; i < data.length; i++) {
        const testData = data[i];

        gameEngine.activeTetromino = Tetromino.create(testData.type);
        gameEngine.activeTetromino.move({x: testData.x, y: testData.y});
    
        const dest = gameEngine.getProjectedDestination(gameEngine.activeTetromino);

        expect(testData.expectedX).toEqual(dest.x);
        expect(testData.expectedY).toEqual(dest.y);
      }
    });
  });

  describe('#advanceNextPiece', function() {
    it('should determine the next tetromino', function() {
      const originalTetromino = gameEngine.activeTetromino;
      gameEngine.advanceNextPiece();

      expect(gameEngine.activeTetromino).not.toEqual(originalTetromino);
    });
  });

  describe('#getNextPiece', () => {
    it('should return first queued tetromino', () => {
      gameEngine.pieceQueue = ['t', 'o', 'l', 'z'];

      const nextPiece = gameEngine.getNextPiece();

      expect(nextPiece.type).toEqual('t');
    });
  });

  describe('#moveActivePiece', function() {
    it('should change the coordinates ');
  });

  describe('#rotateActivePiece', function() {
    it('should determine the next tetromino');
  });
});