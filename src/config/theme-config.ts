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

const defaultTheme = <iTheme> {
  name: 'Default',
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
};

/**
 * Config for different themes
 */
export const ThemeConfig: Array<iTheme> = [
  // 0
  defaultTheme,
  // 1
  {
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
    parent: defaultTheme
  },
  // 2
  {
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
    parent: defaultTheme
  },
  // 3
  {
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
    parent: defaultTheme
  },
  // 4
  {
    name: 'NES 00',
    tetrominos: {
      i: {color: "#CBEEFF"}, // very light blue
      o: {color: "#CBEEFF"}, // very light blue
      t: {color: "#CBEEFF"}, // very light blue
      j: {color: "#1F38EA"}, // dark blue
      l: {color: "#3EBBFD"}, // light blue
      s: {color: "#1F38EA"}, // dark blue
      z: {color: "#3EBBFD"}  // light blue
    },
    parent: defaultTheme,
  },
  // 5
  {
    name: 'NES 02',
    tetrominos: {
      i: {color: "#FFBDFE"}, // light pink
      o: {color: "#FFBDFE"}, // light pink
      t: {color: "#FFBDFE"}, // light pink
      j: {color: "#9E0B93"}, // raspberry
      l: {color: "#F14BF5"}, // pink
      s: {color: "#9E0B93"}, // raspberry
      z: {color: "#F14BF5"}  // pink
    },
    parent: defaultTheme,
  },
  // 6
  {
    name: 'NES 07',
    tetrominos: {
      i: {color: "#E0D1FF"}, // very light purple
      o: {color: "#E0D1FF"}, // very light purple
      t: {color: "#E0D1FF"}, // very light purple
      j: {color: "#7125FF"}, // purple
      l: {color: "#890163"}, // raspberry
      s: {color: "#7125FF"}, // purple
      z: {color: "#890163"}  // raspberry
    },
    parent: defaultTheme,
  },
  // 7
  {
    parent: defaultTheme
  },
  // 8
  {
    parent: defaultTheme
  },
  //9
  {
    parent: defaultTheme
  },
];