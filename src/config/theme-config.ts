import { iTheme } from "../theme/theme";

/**
 * Config for different themes
 */
export const ThemeConfig: { [index:string] : iTheme } = {
  default: {
    playfield: {color: "#000000"},
    ghostPiece: {color: "#333333"},
    tetrominos: {
      i: {color: "#dd5b4d"}, // red
      o: {color: "#4f718b"}, // blue
      t: {color: "#4ab18f"}, // green
      j: {color: "purple"},
      l: {color: "#eec857"}, // yellow
      s: {color: "#e07a46"}, // orange
      z: {color: "#e07a46"}  // orange
    },
    tetrominoBorder: {color: "#000000"}
  },
//   level1: {
//     parent: ThemeConfig.default
//   }
};