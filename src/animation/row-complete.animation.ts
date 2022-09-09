import { Animation } from "./animation.abstract";
import { CanvasDimensions } from "../config/canvas-dimensions";

const OPACITY_CHANGE_RATE = 0.1;
const ENDING_OPACITY = 0.05;

/**
 * Animates the completed row(s) turning white, then disappearing
 */
export class RowCompleteAnimation extends Animation {

  opacity: number;
  rows: any[];
  onComplete: Function;

  constructor(ctx: CanvasRenderingContext2D, rows: any[], onCompleteCallback: Function) {
    super(ctx);

    this.rows = rows;
    this.onComplete = onCompleteCallback;
    this.complete = false;
    this.opacity = 1;
  }

  draw() {
    const width = CanvasDimensions.transpose(10); //this.gameEngine.playfield.xCount
    const height = CanvasDimensions.transpose(this.rows.length);

    this.ctx.beginPath();
    this.ctx.fillStyle = this.getFill();
    this.ctx.fillRect(
      CanvasDimensions.playfieldOrigin.x,
      CanvasDimensions.transpose(this.rows[this.rows.length - 1]),
      width,
      height
    );

    if (this.opacity <= ENDING_OPACITY) {
      this.complete = true;
      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }
  }

  /**
   * Calculates fill color for the current animation frame
   */
  getFill(): string {
    return `rgba(255, 255, 255, ${this.getOpacity()})`;
  }

  /**
   * Calculates opacity for the current animation frame
   */
  getOpacity(): number {
    this.opacity -= this.opacity * OPACITY_CHANGE_RATE;

    return this.opacity;
  }
}
