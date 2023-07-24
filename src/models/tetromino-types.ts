import { iCoordinates } from "./coordinates.interface"

export enum TetrominoType {
  i = 'i',
  j = 'j',
  l = 'l',
  o = 'o',
  s = 's',
  t = 't',
  z = 'z'
}

/**
 * Define the different tetrominos shapes by their block coordinates.
 */
const blockMap: Map<TetrominoType, iCoordinates[][]> = new Map([
  [
    TetrominoType.i, [
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
  ],
  [
    TetrominoType.j, [
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
  ],
  [
    TetrominoType.l, [
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
  ],
  [
    TetrominoType.o, [
      [
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 1}
      ]
    ]
  ],
  [
    TetrominoType.s, [
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
  ],
  [
    TetrominoType.t, [
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
  ],
  [
    TetrominoType.z, [
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
  ]
]);

export const TetrominoTypes = {
  getBlocksForType: function(type: TetrominoType): iCoordinates[][] | undefined {
    return blockMap.get(type);
  },

  getTypeKeys: function(): TetrominoType[] {
    return [
      TetrominoType.i,
      TetrominoType.j,
      TetrominoType.l,
      TetrominoType.o,
      TetrominoType.s,
      TetrominoType.t,
      TetrominoType.z
    ];
  }
};
