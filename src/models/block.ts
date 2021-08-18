import { iCoordinates } from "./coordinates.interface";

export class Block implements iCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  type: any;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 1;
    this.height = 1;
    this.type = null;
  }

  /**
   * Detects collision with another block
   */
  collidesWith(block: Block): boolean {
    return this.x < block.x + block.width &&
      this.x + this.width > block.x &&
      this.y < block.y + block.height &&
      this.y + this.height > block.y;
  }

  /**
   * Detects collision between two blocks
   */
  static collides(blockA: Block, blockB: Block): boolean {
    return blockA.collidesWith(blockB);
  }
}
