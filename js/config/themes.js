define(['jquery'], function($) {
    /**
     * Config for different themes
     */
    var themes = {
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

    function getTheme(themeName) {
        if (typeof themes[themeName] !== undefined) {
            return expand(themes[themeName]);
        }
    }

    function expand(theme) {
        if (theme.hasOwnProperty('parent')) {
            theme = $.expand(theme, getTheme(themes[theme.parent]));
        }

        return theme;
    }

    return {
        getTheme: function(themeName) {
            var theme = getTheme(themeName);
            if (typeof theme === undefined) {
                theme = themes.default;
            }

            return theme;
        },
        THEME_DEFAULT: 'default'
    };
});