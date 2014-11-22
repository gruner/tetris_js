'use strict';

var $ = require('jquery'),
    Theme = require('./models/theme');

var ThemeLoader = function(config) {
    this.config = config;
};

/**
 * If a theme config specifies a parent, get the parent config and merge the values
 * @return object
 */
ThemeLoader.prototype.extendThemeConfig = function(themeConfig) {
    if (themeConfig && themeConfig.hasOwnProperty('parent')) {
        var parentConfig = this.getThemeConfig(themeConfig.parent);
        if (parentConfig) {
            themeConfig = $.extend(true, {}, parentConfig, themeConfig);
        }
    }

    return themeConfig;
};

/**
 * Returns config object for the named theme if it exists
 * @return object
 */
ThemeLoader.prototype.getThemeConfig = function(themeName) {
    if (this.config.hasOwnProperty(themeName)) {
        return this.extendThemeConfig(this.config[themeName]);
    } else {
        return {};
    }
};

/**
 * Returns a fully configured theme instance
 */
ThemeLoader.prototype.getTheme = function(themeName) {
    themeName = themeName || Theme.DEFAULT;
    return new Theme(this.getThemeConfig(themeName));
};

module.exports = ThemeLoader;