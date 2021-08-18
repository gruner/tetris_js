import { CanvasDimensions } from "../config/canvas-dimensions";
import { Tetromino } from "../models/tetromino";
import { Sprite } from "./sprite.interface";

/**
 * Maintains state of a Tetromino on the canvas,
 * converting canvas coordinates to the playfield grid.
 */
export class TetrominoSprite implements Sprite {
  x: number;
  y: number;
  color: string;
  model: Tetromino;

  constructor(tetromino: Tetromino) {
    this.model = tetromino;
    this.x = CanvasDimensions.transpose(tetromino.x);
    this.y = CanvasDimensions.transpose(tetromino.y);
    this.color = '';
  }

  getRow(): number {
    return this.model.x;
  }

  getColumn(): number {
    return this.model.y;
  }

// This is weird b/c it references destinationY, which isn't set anywhere
//   update(yOffset: number) {
//     const newY = this.y + yOffset;
//     if (newY <= this.model.destinationY) {
//       this.y = newY;
//       this.updateModel();
//     } else {
//       this.y = this.model.destinationY;
//       this.model.y = this.model.destinationY;
//     }
//   }

  /**
   * As the sprite's coordinates change, update the model's
   * playfield grid coordinates
   */
  updateModel() {
    if (this.y > CanvasDimensions.transpose(this.model.y)) {
      this.model.y++;
    }
  }
}
