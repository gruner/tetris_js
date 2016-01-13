'use strict';

var extend = require('../util/extend');

var Theme = function(config) {
    this.parent = null;
    this.name = Theme.DEFAULT;
    this.playfield = {color: "black"};
    this.ghostPiece = {color: "darkgray"};
    this.tetrominos = {
        i: {color: "red"},
        o: {color: "blue"},
        t: {color: "green"},
        j: {color: "purple"},
        l: {color: "yellow"},
        s: {color: "orange"},
        z: {color: "magenta"}
    };

    if (config) {
        extend.deepExtend(this, config);
    }
};

Theme.DEFAULT = 'default';

module.exports = Theme;