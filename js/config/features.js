'use strict';

var features = {
    testMovementMode: {
        desc: "Allows free movement of a single tetromino without it falling",
        enabled: true
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
    }
};