import { iTheme } from "../theme/theme";

/**
 * Config for different themes
 * TODO: Don't use same color for s and z
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
};

ThemeConfig['level0'] = {
  parent: ThemeConfig.default
};

ThemeConfig['level1'] = {
  name: 'Global 19.3',
  tetrominos: {
    i: {color: "#C0B988"}, // tan
    o: {color: "#587D74"}, // green
    t: {color: "#224745"}, // cool grey
    j: {color: "#793C33"}, // brown
    l: {color: "#9C7A5D"}, // dark tan
    s: {color: "#11417F"}, // blue
    z: {color: "#32576B"}  // blue-green
  },
  parent: ThemeConfig.default
};

ThemeConfig['level2'] = {
  name: 'Global 18.5',
  tetrominos: {
    i: {color: "#02585B"}, // dark green
    o: {color: "#C3C403"}, // yellow
    t: {color: "#816FA1"}, // lavender
    j: {color: "#046095"}, // teal
    l: {color: "#619961"}, // light green
    s: {color: "#B3026C"}, // dark pink
    z: {color: "#C57FAA"}  // light pink
  },
  parent: ThemeConfig.default
};
