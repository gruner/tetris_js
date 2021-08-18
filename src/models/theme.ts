export interface ThemedElement {
  color: string;
}

export class Theme {
  static DEFAULT = 'default';

  name: string;
  playfield: ThemedElement;
  ghostPiece: ThemedElement;
  tetrominos: { [index:string] : ThemedElement };
  tetrominoBorder: ThemedElement;

  constructor(config: any) {
    this.name = Theme.DEFAULT;
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

    // if (config) {
    //     extend.deepExtend(this, config);
    // }
  }
}
