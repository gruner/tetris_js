'use strict';

var assert = require('assert'),
    ThemeLoader = require('../js/themeLoader'),
    themeLoader;

describe('ThemeLoader', function() {

    before(function() {
        var config = {
            default: {
                playfield: {color: "#001"},
                ghostPiece: {color: "#112"},
                tetrominos: {
                    i: {color: "#223"},
                    j: {color: "#334"}
                }
            },
            extended: {
                parent: 'default',
                ghostPiece: {color: "#445"},
                tetrominos: {
                    i: {color: "#556"}
                }
            }
        };

        themeLoader = new ThemeLoader(config);
    });

    describe('#getTheme', function() {
        it('should return default theme', function() {
            var theme = themeLoader.getTheme('default');
            assert.equal('#001', theme.playfield.color);
            assert.equal("#112", theme.ghostPiece.color);
            assert.equal('#223', theme.tetrominos.i.color);
        });
    });

    describe('#getTheme with no arguments', function() {
        it('should return default theme', function() {
            var theme = themeLoader.getTheme();
            assert.equal('#001', theme.playfield.color);
            assert.equal("#112", theme.ghostPiece.color);
            assert.equal('#223', theme.tetrominos.i.color);
        });
    });

    describe('#getTheme with non-existing name', function() {
        it('should return hard-coded defaults', function() {
            var theme = themeLoader.getTheme('NO_EXIST');
            assert.equal('black', theme.playfield.color);
            assert.equal('blue', theme.tetrominos.o.color);
        });
    });

    describe('#extendThemeConfig', function() {
        it('should return extended theme', function() {
            var theme = themeLoader.getTheme('extended');
            assert.equal('#001', theme.playfield.color);
            assert.equal('#556', theme.tetrominos.i.color);
            assert.equal('#334', theme.tetrominos.j.color);
            assert.equal('#445', theme.ghostPiece.color);
        });
    });
});