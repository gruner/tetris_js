'use strict';

// Service for sharing the active theme

var activeTheme;

module.exports = {
    set: function(theme) {
        activeTheme = theme;
    },
    get: function() {
        return activeTheme;
    }
};