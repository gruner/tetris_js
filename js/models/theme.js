'use strict';

var $ = require('jquery');

var Theme = function(config) {
    this.parent = null;
    this.name = Theme.DEFAULT;
    this.playfield = {color: "#000000"};
    this.ghostPiece = {color: "#cccccc"};
    this.tetrominos = {
        i: {color: "red"},
        o: {color: "blue"},
        t: {color: "green"},
        j: {color: "purple"},
        l: {color: "yellow"},
        s: {color: "orange"},
        z: {color: "red"}
    };

    $.extend(true, this, config);
};

Theme.DEFAULT = 'default';

module.exports = Theme;