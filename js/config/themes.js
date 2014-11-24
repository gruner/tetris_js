'use strict';

/**
 * Config for different themes
 */
module.exports = {
    default: {
        playfield: {color: "#000000"},
        ghostPiece: {color: "#cccccc"},
        tetrominos: {
            i: {color: "#dd5b4d"}, // red
            o: {color: "#4f718b"}, // blue
            t: {color: "#4ab18f"}, // green
            j: {color: "purple"},
            l: {color: "#eec857"}, // yellow
            s: {color: "#e07a46"}, // orange
            z: {color: "#e07a46"}  // orange
        }
    },
    level1: {
        parent: 'default'
    }
};


