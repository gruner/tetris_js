import { AnimationQueue } from "../animation/animation-queue";
import { RowCompleteAnimation } from "../animation/row-complete.animation";
import { CanvasDimensions } from "../config/canvas-dimensions";
import { Features } from "../config/features";
import { GameEngine } from "../game-engine";
import { Block } from "../models/block";
import { Tetromino } from "../models/tetromino";
import { ActiveTheme } from "../theme/active-theme";
import { CanvasCache } from "./canvas-cache";

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
  cache: CanvasCache;

  static readonly cacheKeyPlayfield = 'playfield';
  static readonly cacheKeyPauseOverlay = 'pauseOverlay';
  static readonly font = '"futura-pt", "Futura", "Futura Medium", "FuturaMedium", "Helvetica Neue", Arial, sans-serif';

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
    this.cache = new CanvasCache();

    this.bindEvents();
  }

  bindEvents() {
    // TODO: This may not be the best place to define these state behaviors,
    // but it's the only class that can bind gameEngine events to animationQueue
    this.gameEngine.gameState.events.subscribe(GameEngine.STATE.ROW_COMPLETE, (completedRows: any[]) => {
      this.animationQueue.push(new RowCompleteAnimation(this.context, completedRows, () => {
        this.gameEngine.gameState.rowCleared();
        this.gameEngine.gameState.resume();
      }));
    });
  }

  /**
   * Draws entire game on each update loop
   */
  draw() {
    // Clear everything
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.drawPlayfield(this.activeTheme.theme.playfield.color);
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

    this.drawInfoBox();

    switch (this.gameEngine.gameState.currentState) {
      case GameEngine.STATE.PAUSE:
        this.drawPauseOverlay(this.activeTheme.theme.playfield.color);
        break;
      case GameEngine.STATE.GAME_OVER:
        this.drawGameOverOverlay(this.activeTheme.theme.playfield.color);
        break;
      default:
        break;
    }
  }

  // Uncomment to debug animations
  // draw() {
  //     this.drawPlayfield();
  //     this.animationQueue.draw()
  // };

  /**
   * Draws the playfield - the background rectangle
   */
  drawPlayfield(fillStyle: string) {
    let cachedCtx = this.cache.get(Canvas.cacheKeyPauseOverlay);
    if (!cachedCtx) {
      const width = CanvasDimensions.transpose(this.gameEngine.playfield.xCount);
      const height = CanvasDimensions.transpose(this.gameEngine.playfield.yCount);
      cachedCtx = this.cache.createAndSetNewContext(Canvas.cacheKeyPauseOverlay, width, height);
      cachedCtx.fillStyle = fillStyle;
      cachedCtx.fillRect(
        CanvasDimensions.playfieldOrigin.x,
        CanvasDimensions.playfieldOrigin.y,
        width,
        height
      );
    }

    this.context.drawImage(cachedCtx.canvas, 0, 0);
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
  drawBlock(x: number, y: number, fillColor: string, borderColor?: string, scale?: number) {
    const size = scale ? CanvasDimensions.gridSize * scale : CanvasDimensions.gridSize;
    this.context.beginPath();
    this.context.fillStyle = fillColor;
    this.context.fillRect(x, y, size, size);
  
    if (borderColor) {
      this.context.lineWidth = CanvasDimensions.blockBorderWidth;
      this.context.strokeStyle = borderColor;
      this.context.strokeRect(x, y, size, size);
    }
  }

  /**
   * Draws a tetromino by drawing each of its blocks
   */
  drawTetromino(tetromino: Tetromino, fillColor: string, borderColor?: string, scale?: number) {
    const originX = CanvasDimensions.transpose(tetromino.x);
    const originY = CanvasDimensions.transpose(tetromino.y);
    const scaleMultiplier = scale ? scale : 1;
    
    tetromino.traverseBlocks((i: number, block: Block) => {
      this.drawBlock(
        originX + CanvasDimensions.transpose(block.x) * scaleMultiplier,
        originY + CanvasDimensions.transpose(block.y) * scaleMultiplier,
        fillColor,
        borderColor,
        scale
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
   * Draws "Paused" over the Playfield when the game is in paused state
   */
  drawPauseOverlay(fillStyle: string) {
    this.drawOverlayWithText('PAUSED', fillStyle, '50px');
  }

  /**
   * Draws "GAME OVER" over the Playfield when the game is ended
   */
  drawGameOverOverlay(fillStyle: string) {
    this.drawOverlayWithText('GAME OVER', fillStyle, '35px');
  }

  /**
   * Draws a large text label over the Playfield
   */
  drawOverlayWithText(text: string, fillStyle: string, fontSize: string) {
    let cachedCtx = this.cache.get('overlay' + text);
    if (!cachedCtx) {
      const width = CanvasDimensions.transpose(this.gameEngine.playfield.xCount);
      const height = CanvasDimensions.transpose(this.gameEngine.playfield.yCount);
      cachedCtx = this.cache.createAndSetNewContext(Canvas.cacheKeyPlayfield, width, height);
      cachedCtx.fillStyle = fillStyle;
      cachedCtx.globalAlpha = 0.7;
      cachedCtx.fillRect(
        CanvasDimensions.playfieldOrigin.x,
        CanvasDimensions.playfieldOrigin.y,
        width,
        height
      );

      cachedCtx.font = `${fontSize} ${Canvas.font}`;
      cachedCtx.textAlign = 'center';
      cachedCtx.fillStyle = "#FFFFFF";
      cachedCtx.fillText(text, Math.floor(width/2), Math.floor(height/2));
    }

    this.context.drawImage(cachedCtx.canvas, 0, 0);
  }

  /**
   * Draws score info and status
   */
  drawInfoBox() {
    this.context.font = '20px ' + Canvas.font;
    this.context.textAlign = 'left';
    this.context.fillStyle = "#FFFFFF";

    const playfieldWidth = CanvasDimensions.transpose(this.gameEngine.playfield.xCount);
    const highScore = ''; // TODO
    const spacing = 35;
    const xDim = playfieldWidth + 30;
    const yDim = 30;

    this.context.fillText(`Score: ${this.gameEngine.score}`, xDim, yDim);
    this.context.fillText(`Level: ${this.gameEngine.level + 1}`, xDim, yDim + spacing);
    this.context.fillText(`Lines: ${this.gameEngine.completedRowCount}`, xDim, yDim + (spacing * 2));
    // this.context.fillText(`High Score: ${highScore}`, xDim, yDim + (spacing * 3));
    this.context.fillText('Next:', xDim, yDim + (spacing * 4));

    this.drawNextTetrominoPreview(xDim, yDim + (spacing * 5));
  }

  /**
   * Draws the preview for the next Tetromino
   */
  drawNextTetrominoPreview(x: number, y: number) {
    const nextPiece = this.gameEngine.getNextPiece();
    nextPiece.x = CanvasDimensions.transposeFrom(x);
    nextPiece.y = CanvasDimensions.transposeFrom(y);
    this.drawTetromino(
      nextPiece,
      this.activeTheme.getTetrominoStyle(nextPiece.type).color,
      this.activeTheme.theme.tetrominoBorder.color,
      0.7
    );
  }
}
