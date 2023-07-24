import { Playfield } from "./models/playfield";
import { Tetromino } from "./models/tetromino";
import { ThemeLoader } from "./theme/theme-loader";
import { ThemeConfig } from "./config/theme-config";
import { Features } from "./config/features";
import { EventDispatcher } from "./events/event-dispatcher";
import { Event } from "./events/event.enum";
import { Direction } from "./models/direction.enum";
import { Debug } from "./util/debug";
import { iCoordinates } from "./models/coordinates.interface";
import { ActiveTheme } from "./theme/active-theme";
import { GameState, STATE } from "./state/game-state";
import { TetrominoType } from "./models/tetromino-types";

/**
 * Puts all the pieces together
 */
export class GameEngine {
  static readonly QUEUE_MINIMUM = 3;
  static readonly STARTING_GRAVITY = 0.05;
  static readonly ACCELERATED_GRAVITY = 0.5;
  static readonly GRAVITY_INCREMENT = 0.02;
  static readonly ROW_COUNT_TO_ADVANCE = 10;
  static readonly STATE = STATE;

  activeTheme: ActiveTheme;
  themeLoader: ThemeLoader;
  eventDispatcher: EventDispatcher;
  gameState: GameState;

  activeTetromino: Tetromino = Tetromino.create(TetrominoType.o);
  pieceQueue: TetrominoType[] = [];
  pieceHistory: TetrominoType[] = [];
  level = 0;
  completedRowCount = 0;
  score = 0;
  gravity = GameEngine.STARTING_GRAVITY;
  accelerateGravity = false;
  playfield: Playfield;
  frameCounter = 0;

  constructor(
    activeTheme: ActiveTheme,
    eventDispatcher: EventDispatcher,
    gameState: GameState
  ) {
    this.activeTheme = activeTheme;
    this.eventDispatcher = eventDispatcher;
    this.gameState = gameState;
  
    this.playfield = new Playfield();
    // this.soundEffects = new SoundEffects();
    this.themeLoader = new ThemeLoader(ThemeConfig);
    this.activeTheme.theme = this.themeLoader.getTheme();

    this.init();
  }

  init() {
    this.advanceNextPiece();
    this.bindEvents();
    // this.soundEffects.enabled = Features.enabled('soundEffects');
    this.initDebug();
  }

  initDebug() {
    if (Features.enabled('initWithRemnants')) {
      this.playfield.distributeRandomBlocks(10);
    } else if (Features.enabled('initWithTetris')) {
      this.activeTetromino = Tetromino.create(TetrominoType.i);
      this.playfield.debugRowClear();
    }
  }

  /**
   * Binds to global events
   */
  bindEvents() {
  
    this.eventDispatcher.subscribe(Event.moveActivePiece, (direction: Direction) => {
      if (this.gameState.currentState !== STATE.PAUSE) {
        this.moveActivePiece(direction);
      }
    });
  
    this.eventDispatcher.subscribe(Event.rotateActivePiece, (direction: Direction) => {
      if (this.gameState.currentState !== STATE.PAUSE) {
        this.rotateActivePiece(direction);
      }
    });
  
    this.eventDispatcher.subscribe(Event.accelerateActivePiece, () => {
      this.accelerateGravity = true;
    });
  
    this.eventDispatcher.subscribe(Event.deccelerateActivePiece, () => {
      this.accelerateGravity = false;
    });
  
    this.eventDispatcher.subscribe(Event.pause, () => {
      this.gameState.togglePause();
    });

    this.gameState.events.subscribe(STATE.ROW_COMPLETE, (rows: number[]) => {
      this.completedRowCount += rows.length;
      this.incrementScore(rows.length);
      this.determineLevel();
    });

    // Manually switch themes using number keys when `testThemeMode` feature is enabled
    this.eventDispatcher.subscribe(Event.changeTheme, (themeIndex: number) => {
      this.activeTheme.theme = this.themeLoader.getTheme(themeIndex);
    });
  }

  /**
   * Called from main update loop.
   * Calls update on all game assets.
   */
  update() {

    if (this.gameState.currentState !== STATE.PLAY) {
      return;
    }

    if (this.shouldMoveDownOnCurrentFrame()) {

      // Move down if able, else trigger final position events

      const blocks = this.activeTetromino.getBlockCoordinatesForDrop();
      if (blocks && this.playfield.validateBlockPlacement(blocks)) {
        this.activeTetromino.drop();
      } else { // Can't move down any farther, lock piece in final position
  
        // Check for end of game - tetromino hasn't moved, and can't drop
        if (this.activeTetromino.atOrigin()) {
          this.topOut();
          return;
        }
  
        this.eventDispatcher.publish(Event.activePiecePositioned);
  
        // Convert tetromino into component blocks
        this.playfield.placeBlocks(this.activeTetromino.releaseBlocks());
        
        // Set the next tetromino
        this.advanceNextPiece();
  
        // Check for completed rows and process them
        this.settleBlocks();
      }
    }
  }

  /**
   * Only move the tetromino down on specific intervals,
   * timed by counting the number of game loops.
   */
  shouldMoveDownOnCurrentFrame() : boolean {
    this.frameCounter += this.getGravity();
    if (this.frameCounter >= 1) {
      this.frameCounter = 0;
      return true;
    }

    return false;
  }

  /**
   * Recursively check if rows are completed after completed rows are cleared and blocks are settled
   */
  settleBlocks(iteration: number = 0) {
  
    // Don't need to make this call on the first iteration
    if (iteration > 0) {
      // Resume if the playfield has nothing to settle
      if (! this.playfield.settleRows()) {
        this.gameState.resume();
        return;
      }
    }
    
    const completedRows = this.playfield.getCompletedRows();
  
    if (completedRows.length) {

      // Update the model
      this.playfield.clearRows(completedRows);

      // triggered when rowComplete animation completes
      // After row is cleared, settle blocks again
      this.gameState.events.once(GameEngine.STATE.ROW_CLEARED, () => {
        this.settleBlocks(iteration + 1); // recursively check if settling completes any rows
      });
  
      // Trigger rowComplete - suspends update and starts rowComplete animation
      this.gameState.rowComplete(completedRows);
    } else {
      // After blocks are settled, resume updates
      this.gameState.resume();
    }
  }

  /**
   * Returns the gravity for the current state,
   * checking if in "soft drop" mode (i.e. down button being pressed)
   */
  getGravity(): number {
    return (this.accelerateGravity)
      ? GameEngine.ACCELERATED_GRAVITY
      : this.gravity;
  }

  /**
   * Sets the active tetromino to the next one in the queue
   */
  advanceNextPiece() {
    if (this.activeTetromino) {
      this.pieceHistory.push(this.activeTetromino.type);
    }
    this.refreshPieceQueue();

    const nextPieceType = this.pieceQueue.shift();
    if (nextPieceType) {
      this.activeTetromino = Tetromino.create(nextPieceType);
    }
  }

  /**
   * Returns an instance of the type of the next tetromino in the queue
   */
  getNextPiece(): Tetromino {
    return Tetromino.create(this.pieceQueue[0]);
  }

  /**
   * Ensures that there is a minimum number of pieces in the queue,
   * adding more when necessary.
   */
  refreshPieceQueue() {
    if (this.pieceQueue.length <= GameEngine.QUEUE_MINIMUM) {
      this.pieceQueue = this.pieceQueue.concat(Tetromino.randomizeNextBag());
    }
  }

  /**
   * Ends the game.
   */
  topOut() {
    this.gameState.suspend();

    // TODO: consolidate these events
    this.gameState.change(STATE.GAME_OVER);
    this.eventDispatcher.publish(Event.topOut);
  }

  /**
   * Moves the active piece by 1 grid unit in the specified direction
   * after verifying that the move is valid.
   */
  moveActivePiece(direction: Direction) {
    let offsetCoordinates = {x:0, y:0};
  
    if (direction === Direction.Left) {
      offsetCoordinates.x = -1;
    } else if (direction === Direction.Right) {
      offsetCoordinates.x = 1;
    } else if (direction === Direction.Down) {
      offsetCoordinates.y = 1;
    } else if (direction === Direction.Up && Features.enabled('testMovementMode')) {
      offsetCoordinates.y = -1;
    } else {
      Debug.log('moveActivePiece: invalid move');
      return;
    }
  
    const blockOffsetCoordinates = this.activeTetromino.getBlockCoordinatesForOffset(offsetCoordinates);
    
    if (blockOffsetCoordinates && this.playfield.validateBlockPlacement(blockOffsetCoordinates)) {
      this.activeTetromino.moveByOffset(offsetCoordinates);
    } else {
      this.eventDispatcher.publish(Event.invalidMove);
    }
  }

  /**
   * Rotates active tetromino in the specified direction
   */
  rotateActivePiece(direction: Direction) {

    const coordinates = this.activeTetromino.getBlockCoordinatesForRotation(direction);
    const valid = this.playfield.validateBlockPlacement(coordinates);
  
    if (valid && direction === Direction.Left) {
      this.activeTetromino.rotateLeft();
    } else if (valid && direction === Direction.Right) {
      this.activeTetromino.rotateRight();
    }
  }

  /**
   * Returns destination coordinates for the given tetromino based on its current position
   * by projecting it down the y axis until it collides with a block or the playfield edge
   */
  getProjectedDestination(tetromino: Tetromino): iCoordinates {
    var offsetY = 0,
      valid = true
      ;
  
    while(valid) {
      const coordinates = tetromino.getBlockCoordinatesForOffset({x:0, y:offsetY + 1});
      if (coordinates) {
        valid = this.playfield.validateBlockPlacement(
          coordinates
        );
      } else {
        valid = false;
      }
      if (valid) {
        offsetY++;
      }
    }
  
    return {
      x: tetromino.x,
      y: tetromino.y + offsetY
    };
  }

  /**
   * Returns a tetromino instance for a tetromino at the projected destination of the active tetromino,
   * for displaying a "ghost piece" where the active tetromino will land
   */
  getGhostPiece(): Tetromino {
    const ghostPiece = Tetromino.create(this.activeTetromino.type);
    const dest = this.getProjectedDestination(this.activeTetromino);
  
    ghostPiece.blocks = this.activeTetromino.blocks;
    ghostPiece.x = dest.x;
    ghostPiece.y = dest.y;
  
    return ghostPiece;
  }

  determineLevel() {
    this.level = Math.floor(this.completedRowCount/GameEngine.ROW_COUNT_TO_ADVANCE);
    this.gravity = GameEngine.STARTING_GRAVITY + (this.level * GameEngine.GRAVITY_INCREMENT);

    // If level is greater than the number of configured themes, use the remainder
    let themeIndex = this.level;
    if (this.level > this.themeLoader.config.length) {
      themeIndex = this.level % this.themeLoader.config.length;
    }
    this.activeTheme.theme = this.themeLoader.getTheme(themeIndex);
  }

  incrementScore(completedRowCount: number) {
    // Map completed rows to points
    const scoreMap = new Map([
      [1, 100],
      [2, 300],
      [3, 500],
      [4, 800]
    ]);

    const scoreIncrease = scoreMap.get(completedRowCount);

    if (scoreIncrease) {
      this.score += scoreIncrease * (this.level + 1);
    }
  }
}
