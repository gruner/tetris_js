import { Block } from './block';
import { TetrominoType, TetrominoTypes as Tetrominos } from './tetromino-types';
import { ValidCoordinates } from '../util/validate';
import { Debug } from '../util/debug';
import { iCoordinates } from './coordinates.interface';
import { Direction } from './direction.enum';

/**
 * Models a Tetromino tile, composed of Block models
 * All x and y dimensions are based on the playfield grid, NOT the canvas
 */
export class Tetromino implements iCoordinates {
  x: number;
  y: number;
  type: TetrominoType;
  blocks: Block[][];
  origin: iCoordinates;

  constructor(type: TetrominoType, blocks: Block[][]) {
    this.x = 3;
    this.y = 0;
    this.type = type;
    this.blocks = blocks;
    this.origin = {x:3, y:0};
  }

  /**
   * Factory for creating a tetromino based on the given type
   */
  static create(type: TetrominoType): Tetromino {
    const blocksCoords = Tetrominos.getBlocksForType(type);

    if (blocksCoords) {
      const blockRotations: Block[][] = [];

      for (let i = 0; i < blocksCoords.length; i++) {
        const blocks: Block[] = [];
        for (let j = 0; j < blocksCoords[i].length; j++) {
          const coordinates = blocksCoords[i][j];
          if (ValidCoordinates(coordinates)) {
            blocks.push(new Block(coordinates.x, coordinates.y));
          } else {
            throw new Error('Invalid block coordinates');
          }
        }

        blockRotations.push(blocks);
      }

      return new Tetromino(type, blockRotations);
    } else {
      throw new Error('Cannot create tetromino of type ' + type.toString());
    }
  }

  /**
   * Generates the random order of the next seven pieces
   */
  static randomizeNextBag(): TetrominoType[] {
    // FisherYates shuffle - http://bost.ocks.org/mike/shuffle/
    function shuffle(array: Array<any>) {
      let currentIndex = array.length;
      let temporaryValue;
      let randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    return shuffle(Tetrominos.getTypeKeys());
  }


  /**
   * Increments the x and y coordinates by the given offsets
   */
  moveByOffset(coordinates: iCoordinates) {
    if (ValidCoordinates(coordinates)) {
      this.x += coordinates.x;
      this.y += coordinates.y;
    }
  }

  /**
   * Replaces the tetromino coordinates with the given coordinates
   * e.g. tetromino.move({x:3, y:7});
   */
  move(coordinates: iCoordinates) {
    if (ValidCoordinates(coordinates)) {
      this.x = coordinates.x;
      this.y = coordinates.y;
    }
  }

  /**
   * Moves tetromino down by one grid unit
   */
  drop() {
    this.move({x:this.x, y:this.y+1});
  }

  /**
   * Checks that tetromino is at its original coordinates
   */
  atOrigin(): boolean {
    return (this.x === this.origin.x && this.y === this.origin.y);
  }

  /**
   * Iterates over blocks array passing each block to the given callback
   */
  traverseBlocks(callback: Function) {
    const iMax = this.blocks[0].length;
    for (let i = 0; i < iMax; i++) {
      callback(i, this.blocks[0][i]);
    }
  }

  /**
   * Returns array of absolute block coordinates
   * for the current orientation
   */
  getBlockCoordinates(): iCoordinates[] {
    const coordinates: iCoordinates[] = [];

    this.traverseBlocks((i: number, block: Block) => {
      coordinates.push({
        x: this.x + block.x,
        y: this.y + block.y
      });
    });

    return coordinates;
  }

  /**
   * Blocks are saved with relative coordinates.
   * This converts the coordinates to absolute values, returning a new array.
   * Used to convert a discrete tetromino into blocks on the playfield
   */
  releaseBlocks(): Block[] {
    const blocks: Block[] = [];

    this.traverseBlocks((i: number, block: Block) => {
      var absoluteBlock = new Block(
        block.x += this.x,
        block.y += this.y
      );
      absoluteBlock.type = this.type; // released blocks reference their original type for styling

      blocks.push(absoluteBlock);
    });

    return blocks;
  }

  /**
   * Returns array of coordinates for each block in the current orientation,
   * calculated from offset x and y
   */
  getBlockCoordinatesForOffset(coordinates: iCoordinates): iCoordinates[] {

    const offsetX = this.x + coordinates.x;
    const offsetY = this.y + coordinates.y;
    const offsetCoordinates: iCoordinates[] = [];

    if (!ValidCoordinates(coordinates)) {
      return offsetCoordinates;
    }

    this.traverseBlocks((i: number, block: Block) => {
      offsetCoordinates.push({
        x: offsetX + block.x,
        y: offsetY + block.y
      });
    });

    return offsetCoordinates;
  }

  getBlockCoordinatesForDrop(): iCoordinates[] {
    return this.getBlockCoordinatesForOffset({x:0, y:1});
  }

  /**
   * Rotates tetromino left or right by cycling through block orientation configurations
   */
  private rotate(direction: Direction) {
    direction = direction || Direction.Left;
  
    if (direction === Direction.Right) {
      // The first becomes last
      this.blocks.push(this.blocks.shift()!);
    } else if (direction === Direction.Left) {
      // The last becomes first
      this.blocks.unshift(this.blocks.pop()!);
    }
  }

  rotateLeft() {
    this.rotate(Direction.Left);
  }

  rotateRight() {
    this.rotate(Direction.Right);
  }

  /**
   * Returns array of absolute coordinates for the given rotation
   */
  getBlockCoordinatesForRotation(direction: Direction): iCoordinates[] {
    const coordinates = [];
    let rotatedBlocks = this.blocks.length > 1 ? this.blocks[1] : this.blocks[0];

    rotatedBlocks = direction === Direction.Right
      ? rotatedBlocks
      : this.blocks[this.blocks.length - 1];

    for (let i = 0; i < rotatedBlocks.length; i++) {
      coordinates.push({
        x: this.x + rotatedBlocks[i].x,
        y: this.y + rotatedBlocks[i].y
      });
      
    }

    return coordinates;
  }
}
