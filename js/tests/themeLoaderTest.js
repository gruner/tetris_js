'use strict';

var TestCase = require('../juniper/testCase'),
    ThemeLoader = require('../themeLoader');

var ThemeLoaderTest = function() {};

ThemeLoaderTest.prototype = new TestCase();

ThemeLoaderTest.prototype.setup = function() {
    
    var config = {
        default: {
            playfield: {color: "#000"},
            ghostPiece: {color: "#111"},
            tetrominos: {
                i: {color: "#222"},
                j: {color: "#333"}
            }
        },
        foo: {
            parent: 'default',
            ghostPiece: {color: "#444"},
            tetrominos: {
                i: {color: "#555"}
            }
        }
    };

    this.fixture = new ThemeLoader(config);
};

ThemeLoaderTest.prototype.testGetTheme = function() {
    var theme = this.fixture.getTheme('default');
    this.assertEquals('#000', theme.playfield.color);
    this.assertEquals("#111", theme.ghostPiece.color);
    this.assertEquals('#222', theme.tetrominos.i.color);
};

ThemeLoaderTest.prototype.testExtendedTheme = function() {
    var theme = this.fixture.getTheme('foo');
    this.assertEquals('#000', theme.playfield.color);
    this.assertEquals('#555', theme.tetrominos.i.color);
    this.assertEquals('#333', theme.tetrominos.j.color);
    this.assertEquals('#444', theme.ghostPiece.color);
};

ThemeLoaderTest.prototype.testDefaultFallback = function() {
    var theme = this.fixture.getTheme();
    this.assertEquals('#000', theme.playfield.color);
    this.assertEquals("#111", theme.ghostPiece.color);
    this.assertEquals('#222', theme.tetrominos.i.color);
};

module.exports = ThemeLoaderTest;