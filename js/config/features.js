'use strict';

var features = {
    testMovementMode: {
        desc: "Allows free movement of a single tetromino without it falling",
        enabled: false
    },
    initWithRemnants: {
        desc: "Starts the game with remnant blocks already on the playfield",
        enabled: false
    },
    displayGhostPiece: {
        desc: "Highlights where the current piece will land",
        enabled: true,
        public: true
    }
};

module.exports = {
    enable: function(featureKey) {
        if (features.hasOwnProperty(featureKey)) {
            features[featureKey].enabled = true;
        }
    },
    enabled: function(featureKey) {
        return features.hasOwnProperty(featureKey) && features[featureKey].enabled === true;
    },
    set: function(featureKey, featureConfig) {
        if (featureConfig.hasOwnProperty('enabled')) {
            features[featureKey] = featureConfig;
        }
    },
    getPublic: function() {
        var publicFeatures = {};
        for (var feature in features) {
            if (features[feature].public === true) {
                publicFeatures[feature] = features[feature];
            }
        }

        return publicFeatures;
    }
};