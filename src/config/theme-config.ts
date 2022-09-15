import { iTheme } from "../theme/theme";

// RR Colors
const canton = "#386a6b";
const citrine = "#777b39";
const coral = "#cc6633";
const gold = "#dbb349";
const graphite = " #727d8c";
const magnolia = "#e8d5bb";
const marineBlue = "#2f3747"; // too dark
const mocha = "#5a3e27";
const paleLime = "#c3c463";
const polarBlue = "#7eabb6";
const shrimpPink = "#e4a473";

/**
 * Config for different themes
 */
export const ThemeConfig: { [index:string] : iTheme } = {
  default: {
    playfield: {color: "#000000"},
    ghostPiece: {color: "#333333"},
    tetrominos: {
      i: {color: "#dd5b4d"}, // red
      o: {color: "#4f718b"}, // blue-green
      t: {color: "#4ab18f"}, // green
      j: {color: "purple"},
      l: {color: "#eec857"}, // yellow
      s: {color: "#e07a46"}, // orange
      z: {color: "#7A74A9"}  // blue-grey
    },
    tetrominoBorder: {color: "#000000"}
  },
};

ThemeConfig['level0'] = {
  parent: ThemeConfig.default
};

ThemeConfig['level1'] = {
  name: 'Robot Roundup',
  tetrominos: {
    i: {color: canton},
    o: {color: citrine},
    t: {color: shrimpPink},
    j: {color: coral},
    l: {color: graphite},
    s: {color: paleLime},
    z: {color: polarBlue}
  },
  parent: ThemeConfig.default
};

ThemeConfig['level2'] = {
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

ThemeConfig['level3'] = {
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

ThemeConfig['level4'] = {
  parent: ThemeConfig.default
};

ThemeConfig['leve5'] = {
  parent: ThemeConfig.default
};

ThemeConfig['level6'] = {
  parent: ThemeConfig.default
};

ThemeConfig['level7'] = {
  parent: ThemeConfig.default
};

ThemeConfig['level8'] = {
  parent: ThemeConfig.default
};

ThemeConfig['level9'] = {
  parent: ThemeConfig.default
};
