'use strict';

/**
 * Define the different types (shapes) of tetrominos
 */
var types = {
    i: {
        blocks: [
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0},
            {x: 3, y: 0}
        ]
    },
    o: {
        blocks: [
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ]
    },
    t: {
        blocks: [
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1},
            {x: 2, y: 1}
        ]
    },
    j: {
        blocks: [
            {x: 1, y: 0},
            {x: 1, y: 1},
            {x: 1, y: 2},
            {x: 0, y: 2}
        ]
    },
    l: {
        blocks: [
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: 0, y: 2},
            {x: 1, y: 2}
        ]
    },
    s: {
        blocks: [
            {x: 0, y: 1},
            {x: 1, y: 1},
            {x: 1, y: 0},
            {x: 2, y: 0},
        ]
    },
    z: {
        blocks: [
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 1, y: 1},
            {x: 2, y: 1},
        ]
    }
};

module.exports = {
    types: types,

    getType: function(typeKey) {
        if (typeof types[typeKey] !== 'undefined') {
            return types[typeKey];
        }
    },

    getTypeKeys: function() {
        return Object.keys(types);
    }
};