import { iCoordinates } from "./coordinates.interface"

/**
 * Define the different types (shapes) of tetrominos
 */
const types:{ [index:string] : {blocks: iCoordinates[][]} } = {
  i: {
    blocks: [
      [
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 3, y: 1}
      ],
      [
        {x: 2, y: 0},
        {x: 2, y: 1},
        {x: 2, y: 2},
        {x: 2, y: 3}
      ],
      [
        {x: 0, y: 2},
        {x: 1, y: 2},
        {x: 2, y: 2},
        {x: 3, y: 2}
      ],
      [
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 2},
        {x: 1, y: 3}
      ]
    ]
  },
  o: {
    blocks: [
      [
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 1}
      ]
    ],
  },
  t: {
    blocks: [
      [
        {x: 1, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1}            
      ],
      [
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 2},
        {x: 2, y: 1}
      ],
      [
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 1, y: 2}
      ],
      [
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 2},
        {x: 0, y: 1}
      ]
    ]
  },
  j: {
    blocks: [
      [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1}
      ],
      [
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 2}
      ],    
      [
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 2, y: 2}
      ],            
      [
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 2},
        {x: 0, y: 2}
      ]
    ]
  },
  l: {
    blocks: [
      [
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 2, y: 0}
      ],
      [
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 2},
        {x: 2, y: 2}
      ],
      [
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 0, y: 2}
      ],
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 1, y: 2}
      ]            
    ]
  },
  s: {
    blocks: [
      [
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1}
      ],
      [
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 2, y: 2}
      ],
      [
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 0, y: 2},
        {x: 1, y: 2}
      ],
      [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 1, y: 2}
      ]
    ]
  },
  z: {
    blocks: [
      [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 1}
      ],
      [
        {x: 2, y: 0},
        {x: 2, y: 1},
        {x: 1, y: 1},
        {x: 1, y: 2}
      ],
      [
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 1, y: 2},
        {x: 2, y: 2}
      ],
      [
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 0, y: 1},
        {x: 0, y: 2}
      ]
    ]
  }
};

export const TetrominoTypes = {
  types: types,

  getType: function(typeKey: string) {
    if (types.hasOwnProperty(typeKey)) {
      return types[typeKey];
    }
  },

  getTypeKeys: function() {
    return Object.keys(types);
  }
};
