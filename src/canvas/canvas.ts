import { AnimationQueue } from "../animation/animation-queue";
import { RowCompleteAnimation } from "../animation/row-complete.animation";
import { CanvasDimensions } from "../config/canvas-dimensions";
import { Features } from "../config/features";
import { GameEngine } from "../game-engine";
import { Block } from "../models/block";
import { Tetromino } from "../models/tetromino";
import { ActiveTheme } from "../theme/active-theme";

/**
 * Renders the view according to GameEngine state.
 * Encapsulates canvas draw commands.
 * TODO: Hide first two rows where tetrominos spawn
 */
export class Canvas {

  activeTheme: ActiveTheme;
  gameEngine: GameEngine;
  context: CanvasRenderingContext2D;
  animationQueue: AnimationQueue;

  constructor(
    activeTheme: ActiveTheme,
    animationQueue: AnimationQueue,
    canvasElement: HTMLCanvasElement,
    gameEngine: GameEngine,
  ) {
    this.activeTheme = activeTheme;
    this.animationQueue = animationQueue;
    this.gameEngine = gameEngine;
    this.context = canvasElement.getContext('2d')!;

    this.bindEvents();
  }

  bindEvents() {
    this.gameEngine.gameState.events.subscribe(GameEngine.STATE.ROW_CLEARED, () => {
      this.gameEngine.gameState.resume();
    });

    // TODO: This isn't the best place to define these state behaviors,
    // but it's the only class that can bind gameEngine events to animationQueue
    this.gameEngine.gameState.events.subscribe(GameEngine.STATE.ROW_COMPLETE, (completedRows: any[]) => {
      this.animationQueue.push(new RowCompleteAnimation(this.context, completedRows, () => {
        this.gameEngine.gameState.rowCleared();
      }));
    });
  }

  /**
   * Draws entire game on each update loop
   */
  draw() {
    this.drawPlayfield(this.activeTheme.theme.playfield!.color);
    this.drawRemnantBlocks();
  
    // If animations are in-progress, draw the next frame,
    // otherwise resume normal drawing
    if (!this.animationQueue.draw()) {
      if (Features.enabled('displayGhostPiece')) {
        this.drawGhostPiece(); // has to draw before tetromino, so that it renders behind it
      }
      this.drawTetromino(
        this.gameEngine.activeTetromino,
        this.activeTheme.getTetrominoStyle(this.gameEngine.activeTetromino.type).color,
        this.activeTheme.theme.tetrominoBorder.color
      );
    }
  }

  // Uncomment to debug animations
  // draw() {
  //     this.drawPlayfield();
  //     this.animationQueue.draw()
  // };

  /**
   * Draws the playfield - the background rectangle
   * @TODO cache this as an image after the first draw
   */
  drawPlayfield(fillStyle: string) {
    this.context.fillStyle = fillStyle;
    this.context.fillRect(
      CanvasDimensions.playfieldOrigin.x,
      CanvasDimensions.playfieldOrigin.y,
      CanvasDimensions.transpose(this.gameEngine.playfield.xCount),
      CanvasDimensions.transpose(this.gameEngine.playfield.yCount)
    );
  }

  /**
   * Draws all blocks from previously dropped tetrominos
   */
  drawRemnantBlocks() {
    this.gameEngine.playfield.traverseGrid((block: Block) => {
      if (typeof block !== 'undefined') {
        this.drawBlock(
          CanvasDimensions.transpose(block.x),
          CanvasDimensions.transpose(block.y),
          this.activeTheme.getTetrominoStyle(block.type).color,
          this.activeTheme.theme.tetrominoBorder.color
        );
      }
    });
  }

  /**
   * Draws a single block. All game elements are made of blocks.
   */
  drawBlock(x: number, y: number, fillColor: string, borderColor?: string) {
    this.context.beginPath();
    this.context.fillStyle = fillColor;
    this.context.fillRect(x, y, CanvasDimensions.gridSize, CanvasDimensions.gridSize);
  
    if (borderColor) {
      this.context.lineWidth = CanvasDimensions.blockBorderWidth;
      this.context.strokeStyle = borderColor;
      this.context.strokeRect(x, y, CanvasDimensions.gridSize, CanvasDimensions.gridSize);
    }
  }

  /**
   * Draws a tetromino by drawing each of its blocks
   */
  drawTetromino(tetromino: Tetromino, fillColor: string, borderColor?: string) {
    const originX = CanvasDimensions.transpose(tetromino.x);
    const originY = CanvasDimensions.transpose(tetromino.y);
    
    tetromino.traverseBlocks((i: number, block: Block) => {
      this.drawBlock(
        originX + CanvasDimensions.transpose(block.x),
        originY + CanvasDimensions.transpose(block.y),
        fillColor,
        borderColor
      );
    });
  }

  /**
   * Draws the ghost piece - the shadow showing where the active piece will come to rest
   */
  drawGhostPiece() {
    this.drawTetromino(
      this.gameEngine.getGhostPiece(),
      this.activeTheme.theme.ghostPiece.color
    );
  }

  /**
   * When a row is complete, save everything above it in order to animate it moving down
   * Not implemented yet
   */
  // spliceTop() {}
}
