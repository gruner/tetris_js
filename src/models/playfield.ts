import { ValidCoordinates } from "../util/validate";
import { Block } from "./block";
import { iCoordinates } from "./coordinates.interface";
import { TetrominoTypes } from "./tetromino-types";

export class Playfield {
  xCount: number;
  yCount: number;
  grid: any[][];

  constructor(xCount: number = 10, yCount: number = 22) {
    this.xCount = xCount;
    this.yCount = yCount;
    this.grid = this.buildGrid();
  }

  /**
   * Returns a multidimensional array of undefined values
   * in the dimensions of the grid
   */
  buildGrid(): any[][] {
    let grid = new Array(this.yCount);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = this.createEmptyRow();
    }
    return grid;
  }

  /**
   * Returns an array of undefined values for each column in a row
   */
  createEmptyRow(): any[] {
    return new Array(this.xCount);
  }

  /**
   * Executes a callback for each row in the grid (bottom to top)
   * passing the contents of the row to the callback
   */
  traverseRows(callback: Function) {
    for (let i = this.yCount - 1; i >= 0; i--) {
      const row = this.grid[i];
      callback(i, row);
    }
  }

  /**
   * Executes a callback for each cell in the grid, passing the contents
   * of the cell to the callback
   */
  traverseGrid(callback: Function) {
    for (let i = 0; i < this.yCount; i++) {
      for (let j = 0; j < this.xCount; j++) {
        let cell;
        if (this.grid[i] && this.grid[i][j]) {
          cell = this.grid[i][j];
          cell.x = j;
          cell.y = i;
        }
        callback(cell);
      }
    }
  }

  /**
   * Removes an array of rows
   */
  clearRows(rowIndices: Array<number>) {
    const rowCount = rowIndices.length;
    const clearedRows = [];

    // make sure rows are in descending order
    // so that we splice from biggest to smallest and avoid scrambling the indices
    rowIndices.sort((a, b) => b - a);

    for (let i = 0; i < rowCount; i++) {
      if (rowIndices[i] < this.grid.length) {
        clearedRows.push(this.grid.splice(rowIndices[i], 1)[0]);
      }
    }

    // add empty rows to the top
    while (this.grid.length < this.yCount) {
      this.grid.unshift(this.createEmptyRow());
    }

    return clearedRows;
  }

  /**
   * Removes a row at the given index and adds
   * a new empty row to the top
   */
  clearRowAt(y: number) {
    const rows = this.clearRows([y]);
    if (rows && rows.length) {
      return rows[0];
    }
  };

  /**
   * Settle any remaining blocks after a row is cleared.
   *
   * For each occupied cell in a row, check if the cell below it is empty
   * And merge them
   *
   *        A
   *   BB
   * CC  CCC CC => CCBBCCCACC
   * ------
   *   xxxx
   * xx  xxxxxx => no change, treat line as a whole
   */
  settleRows() {
    let merges = false;

    // For each row, find empty places
    // that the above row can fill
    this.traverseRows((i: number, targetRow: Array<any>) => {
      const topNeighboringRow = this.grid[i-1]; // traversing bottom to top

      if (this.rowsAreMergable(targetRow, topNeighboringRow)) {
        this.grid[i] = this.mergeRows(targetRow, topNeighboringRow);
        this.clearRowAt(i-1);
        merges = true;
      }
    });

    // Recurse until all rows are settled
    if (merges) {
      this.settleRows();
    }

    return merges;
  }

  /**
   * Checks if topNeighboringRow can be merged into targetRow
   */
  rowsAreMergable(targetRow: Array<any>, topNeighboringRow: Array<any>): boolean {
    let mergable = false;
    let targetRowChecksum = 0;
    let topNeighboringRowChecksum = 0;

    if (!targetRow || !topNeighboringRow) {
      return false;
    }

    for (let i = 0; i < topNeighboringRow.length; i++) {
      if (targetRow[i] !== undefined) {
        targetRowChecksum++;
      }
      if (topNeighboringRow[i] !== undefined) {
        topNeighboringRowChecksum++;
      }
      if (targetRow[i] !== undefined && topNeighboringRow[i] !== undefined) {
        mergable = false;
        break;
      } else if (targetRow[i] !== undefined || topNeighboringRow[i] !== undefined) {
        mergable = true;
      }
    }

    return (mergable && targetRowChecksum !== 0 && topNeighboringRowChecksum !== 0);
  }

  /**
   * Returns a merged array of topNeighboringRow into targetRow
   */
  mergeRows(targetRow: Array<any>, topNeighboringRow: Array<any>): Array<any> {
    const merged = this.createEmptyRow();
    const mergedLength = merged.length;
    let topColumnValue;

    for (let i = 0; i < mergedLength; i++) {
      topColumnValue = (topNeighboringRow && topNeighboringRow[i] !== undefined) ? topNeighboringRow[i] : undefined;
      merged[i] = (targetRow[i] === undefined) ? topColumnValue : targetRow[i];
    }

    return merged;
  }

  /**
   * Checks that a row is complete, i.e. filled with blocks.
   * If any cells are undefined they are empty
   */
  rowComplete(yIndex: number): boolean {
    let complete = false;

    if (this.grid[yIndex]) {
      complete = true;
      for (let i = 0; i < this.xCount; i++) {
        if (typeof this.grid[yIndex][i] === 'undefined') {
          complete = false;
          break;
        }
      }
    }

    return complete;
  }

  /**
   * Returns array of y indexes for all completed rows
   * TODO: pass in optional rows to check (i.e. only check the rows that a newly placed tetromino is touching)
   */
  getCompletedRows(): Array<number> {
    const completedRows: Array<number> = [];

    this.traverseRows((i: number) => {
      if (this.rowComplete(i)) {
        completedRows.push(i);
      }
    });

    return completedRows;
  }

  /**
   * Checks that a cell is empty
   */
  cellEmpty(cell: iCoordinates): boolean {
    let empty = false;

    if (this.cellInBounds(cell)) {
      if (typeof this.grid[cell.y] === 'undefined' || typeof this.grid[cell.y][cell.x] === 'undefined') {
        empty = true;
      }
    }

    return empty;
  }

  /**
   * Checks that a cell is in the bounds of the playfield
   */
  cellInBounds(cell: iCoordinates): boolean {
    return (cell.y >= 0 && cell.y < this.yCount && cell.x >= 0 && cell.x < this.xCount);
  }

  /**
   * Checks that an array of blocks are valid for placement at their given coordinates
   */
  // validateBlockPlacement(blocks: Array<Block>): boolean {
  //   let valid = Array.isArray(blocks);
  //   for (let i = 0; i < blocks.length; i++) {
  //     if (!this.validateBlock(blocks[i])) {
  //       valid = false;
  //       break;
  //     }
  //   }

  //   return valid;
  // }
  validateBlockPlacement(blocks: Array<iCoordinates>): boolean {
    let valid = Array.isArray(blocks);
    for (let i = 0; i < blocks.length; i++) {
      if (!this.validateBlock(blocks[i])) {
        valid = false;
        break;
      }
    }

    return valid;
  }

  /**
   * Checks that a block's coordinates are within the bounds of the playfield,
   * and that the block's cell is available
   */
  validateBlock(block: iCoordinates): boolean {
    return (
        ValidCoordinates(block) && 
        this.cellInBounds(block) && 
        this.cellEmpty(block)
    );
  }

  /**
   * Adds a block to the playfield at the block's coordinates
   */
  placeBlock(block: Block) {
    if (this.validateBlock(block)) {
      if (typeof this.grid[block.y] === 'undefined') {
        this.grid[block.y] = this.createEmptyRow();
      }
      this.grid[block.y][block.x] = block;
    } else {
      // debug.log('invalid block placement at ' + block.x + ', ' + block.y);
    }
  }

  /**
   * Adds an array of blocks to the playfield
   */
  placeBlocks(blocks: Array<Block>) {
    for (let i = 0, iMax = blocks.length; i < iMax; i++) {
      this.placeBlock(blocks[i]);
    }
  }

  /**
   * Adds random blocks to the playfield for debugging
   */
  distributeRandomBlocks(blockCount: number) {
    const blockTypes = TetrominoTypes.getTypeKeys();

    // While there remain blocks to distribute...
    while (0 !== blockCount) {
      const block = new Block(
        Math.floor(Math.random() * this.xCount),
        Math.floor(Math.random() * this.yCount)
      );
      block.type = blockTypes[Math.floor(Math.random() * blockTypes.length)];

      if (this.validateBlock(block)) {
        this.placeBlock(block);
        blockCount--;
      }
    }
  }

  /**
   * Adds blocks to the playfield for debugging a row clearing
   */
  debugRowClear() {
    let rows = 4;
    const columns = this.xCount - 1;

    this.traverseRows((y: number) => {
      if (rows > 0) {
        for (let x = 0; x < columns; x++) {
          const block = new Block(x,y);
          block.type = 'i';
          this.placeBlock(block);
        }
      }
      rows--;
    });
  }
}