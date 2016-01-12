'use strict';

var assert = require('assert'),
    Theme = require('../../js/models/theme'),
    theme,
    themeConfig = {
        playfield: {color: "-PLAYFIELD-"},
        ghostPiece: {color: "-GHOST-"},
        tetrominos: {
            i: {color: "-TI-"},
            j: {color: "-TJ-"}
        }
    };

describe('Theme', function() {

    describe('#constructor', function() {
        it('should create theme by merging given config options', function() {
            var theme = new Theme(themeConfig);
            assert.strictEqual('-PLAYFIELD-', theme.playfield.color);
            assert.strictEqual('-GHOST-', theme.ghostPiece.color);
            assert.strictEqual(Theme.DEFAULT, theme.name);
            assert.strictEqual('-TI-', theme.tetrominos.i.color);
            assert.strictEqual('-TJ-', theme.tetrominos.j.color);
            assert.strictEqual('red', theme.tetrominos.z.color);
        });
    });
});
