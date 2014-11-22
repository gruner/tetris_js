'use strict';

var TestCase = require('../../juniper/testCase'),
    Theme = require('../../models/theme'),
    themeConfig = {
        playfield: {color: "-PLAYFIELD-"},
        ghostPiece: {color: "-GHOST-"},
        tetrominos: {
            i: {color: "-TI-"},
            j: {color: "-TJ-"}
        }
    };

var ThemeTest = function() {};

ThemeTest.prototype = new TestCase();

ThemeTest.prototype.testConstructor = function() {
    var theme = new Theme(themeConfig);
    this.assertEquals('-PLAYFIELD-', theme.playfield.color);
    this.assertEquals('-GHOST-', theme.ghostPiece.color);
    this.assertEquals(Theme.DEFAULT, theme.name);
    this.assertEquals('-TI-', theme.tetrominos.i.color);
    this.assertEquals('-TJ-', theme.tetrominos.j.color);
    this.assertEquals('red', theme.tetrominos.z.color);
};

module.exports = ThemeTest;