import { DeepExtend } from "../util/extend";

export interface iThemedElement {
  color: string;
}

export interface iTheme {
  name?: string;
  playfield?: iThemedElement;
  ghostPiece?: iThemedElement;
  tetrominos?: { [index:string] : iThemedElement };
  tetrominoBorder?: iThemedElement;
  parent?: iTheme;
}

export class Theme implements iTheme {
  static readonly Default = 'default';

  name: string;
  playfield: iThemedElement;
  ghostPiece: iThemedElement;
  tetrominos: { [index:string] : iThemedElement };
  tetrominoBorder: iThemedElement;
  parent?: iTheme;

  constructor(config?: iTheme) {
    this.name = Theme.Default;
    this.playfield = {color: "black"};
    this.ghostPiece = {color: "darkgray"};
    this.tetrominos = {
      i: {color: "red"},
      o: {color: "blue"},
      t: {color: "green"},
      j: {color: "purple"},
      l: {color: "yellow"},
      s: {color: "orange"},
      z: {color: "magenta"}
    };
    this.tetrominoBorder = {color: 'black'};

    if (config) {
      DeepExtend(this, config);
    }
  }
}
