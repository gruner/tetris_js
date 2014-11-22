'use strict';

/**
 * Config for different themes
 */
module.exports = {
    default: {
        playfield: {color: "#000000"},
        ghostPiece: {color: "#cccccc"},
        tetrominos: {
            i: {color: "red"},
            o: {color: "blue"},
            t: {color: "green"},
            j: {color: "purple"},
            l: {color: "yellow"},
            s: {color: "orange"},
            z: {color: "red"}
        }
    },
    level1: {
        parent: 'default'
    }
};