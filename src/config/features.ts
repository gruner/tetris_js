interface iFeature {
  desc: string;
  enabled: boolean;
  public?: boolean;
}

// export interface iFeature {
//   [index: string] : Foo
// }

const featureConfig: { [index: string] : iFeature} = {
  testMovementMode: {
    desc: "Allows free movement of a single tetromino without it falling",
    enabled: false
  },
  initWithRemnants: {
    desc: "Starts the game with remnant blocks already on the playfield",
    enabled: false
  },
  initWithTetris: {
    desc: "Starts the game with blocks ready for a Tetris",
    enabled: false
  },
  displayGhostPiece: {
    desc: "Highlights where the current piece will land",
    enabled: true,
    public: true
  },
  soundEffects: {
    desc: "Play sound effects",
    enabled: false,
    public: true
  }
};

export const Features = {
  enable: function(featureKey: string) {
    if (featureConfig.hasOwnProperty(featureKey)) {
        featureConfig[featureKey].enabled = true;
    }
  },
  enabled: function(featureKey: string) {
    return featureConfig.hasOwnProperty(featureKey) && featureConfig[featureKey].enabled === true;
  },
  set: function(featureKey: string, config: iFeature) {
    if (config.hasOwnProperty('enabled')) {
      featureConfig[featureKey] = config;
    }
  },
  getPublic: function() {
    const publicFeatures: { [index: string] : iFeature} = {};
    for (let feature in featureConfig) {
      if (featureConfig[feature].public === true) {
        publicFeatures[feature] = featureConfig[feature];
      }
    }

    return publicFeatures;
  }
};