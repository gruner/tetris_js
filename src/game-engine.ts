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
import { Block } from "./models/block";

/**
 * Puts all the pieces together
 */
export class GameEngine {
  static readonly QUEUE_MINIMUM = 3;
  static readonly  ACCELERATED_GRAVITY = 0.5;

  activeTheme: ActiveTheme;
  eventDispatcher: EventDispatcher;
  fsm: any;

  activeTetromino: Tetromino = Tetromino.create('o');
  pieceQueue: string[] = [];
  pieceHistory: string[] = [];
  level = 0;
  gravity = 0.05;
  accelerateGravity = false;
  playfield: Playfield;
  frameCounter = 0;

  constructor(
    activeTheme: ActiveTheme,
    eventDispatcher: EventDispatcher
  ) {
    this.activeTheme = activeTheme;
    this.eventDispatcher = eventDispatcher;
  
    this.playfield = new Playfield();
    // this.soundEffects = new SoundEffects();
    // this.fsm = this.initStates();
    this.initThemes();
    this.init();
  }

  init() {
    this.advanceNextPiece();
    this.bindEvents();
    // this.soundEffects.enabled = Features.enabled('soundEffects');
    this.initDebug();
  }

  initThemes() {
    const themeLoader = new ThemeLoader(ThemeConfig);
    // activeTheme.set(themeLoader.getTheme());
  }

  // TODO: make this a separate service
  // initStates() {
  //   return StateMachine.create({
  //     initial: 'play',
  //     events: [
  //       { name: 'rowComplete', from: 'play',       to: 'suspended' },
  //       { name: 'rowCleared',  from: 'suspended',  to: 'suspended' },
  //       //{ name: 'rowCollapse', from: 'animatingRowClear',  to: 'animatingRowCollapse' },
  //       { name: 'suspend',     from: 'play',       to: 'suspended' },
  //       { name: 'pause',       from: 'play',       to: 'paused' },
  //       { name: 'resume',      from: ['play', 'paused', 'suspended'], to: 'play' }
  //     ]
  //   });
  // }

  initDebug() {
    if (Features.enabled('initWithRemnants')) {
      this.playfield.distributeRandomBlocks(10);
    } else if (Features.enabled('initWithTetris')) {
      this.activeTetromino = Tetromino.create('i');
      this.playfield.debugRowClear();
    }
  }

  /**
   * Binds to global events
   */
  bindEvents() {
  
    this.eventDispatcher.subscribe(Event.moveActivePiece, (direction: Direction) => {
      this.moveActivePiece(direction);
    });
  
    this.eventDispatcher.subscribe(Event.rotateActivePiece, (direction: Direction) => {
      this.rotateActivePiece(direction);
    });
  
    this.eventDispatcher.subscribe(Event.accelerateActivePiece, () => {
      this.accelerateGravity = true;
    });
  
    this.eventDispatcher.subscribe(Event.deccelerateActivePiece, () => {
      this.accelerateGravity = false;
    });
  
    this.eventDispatcher.subscribe(Event.pause, () => {
      this.togglePause();
    });
  }

  /**
   * Called from main update loop.
   * Calls update on all game assets.
   */
  update() {

    if (!this.fsm.is('play')) {
      return;
    }
    
    if (this.shouldMoveDownOnCurrentFrame()) {
      
      // Move down if able, else trigger final position events
  
      // TODO: refactor methods that take block vs just needing coordinates
      const blocks = this.activeTetromino.getBlockCoordinatesForDrop()?.map((coor: iCoordinates) => new Block(coor.x, coor.y));
      if (blocks && this.playfield.validateBlockPlacement(blocks)) {
        this.activeTetromino?.drop();
      } else { // Can't move down any farther, lock piece in final position
  
        // Check for end of game - tetromino hasn't moved, and can't drop
        if (this.activeTetromino?.atOrigin()) {
          this.topOut();
          return;
        }
  
        this.eventDispatcher.trigger(Event.activePiecePositioned);
  
        // Convert tetromino into component blocks
        this.playfield.placeBlocks(this.activeTetromino!.releaseBlocks());
        
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
        this.fsm.resume();
        return;
      }
    }
    
    const completedRows = this.playfield.getCompletedRows();
  
    if (completedRows.length) {
  
      // Update the model
      this.playfield.clearRows(completedRows);
  
      // triggered when rowComplete animation completes
      // After row is cleared, settle blocks again
      this.fsm.onrowCleared = () => {
        this.settleBlocks(iteration + 1); // recursively check if settling completes any rows
      };
  
      // Trigger rowComplete - suspends update and starts rowComplete animation
      this.fsm.rowComplete(completedRows);
    } else {
      // After blocks are settled, resume updates
      this.fsm.resume();
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

    const nextPiece = this.pieceQueue.shift();
    if (nextPiece) {
      this.activeTetromino = Tetromino.create(nextPiece);
    }
  }

  /**
   * Returns the type of the next tetromino in the queue
   */
  getNextPiece(): string {
    return this.pieceQueue[1];
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
   * Pauses or resumes the game
   */
  togglePause() {
    if (this.fsm.is('paused')) {
      this.fsm.resume();
    } else {
      this.fsm.pause();
    }
  }

  /**
   * Ends the game.
   */
  topOut() {
    this.fsm.suspend();
    this.eventDispatcher.trigger(Event.topOut);
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
      this.eventDispatcher.trigger(Event.invalidMove, {});
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

  /**
   * Sets a delay after a tetromino has been placed
   * before the next piece is spawned
   */
  // spawnDelay() {
  // }
}