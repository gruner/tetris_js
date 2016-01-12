'use strict';

var $ = require('jquery');

var Theme = function(config) {
    this.parent = null;
    this.name = Theme.DEFAULT;
    this.playfield = {color: "#000000"};
    this.ghostPiece = {color: "#cccccc"};
    this.tetrominos = {
        i: {color: "#dd5b4d"}, // red
        o: {color: "#4f718b"}, // blue
        t: {color: "#4ab18f"}, // green
        j: {color: "purple"},
        l: {color: "#eec857"}, // yellow
        s: {color: "#e07a46"}, // orange
        z: {color: "#e07a46"}  // orange
    };

    //This throws an error in tests
    //$.extend(true, this, config);
};

Theme.DEFAULT = 'default';

module.exports = Theme;