'use strict';

var Animation = require('./animation'),
    dimensions = require('../config/canvasDimensions'),
    activeTheme = require('../services/activeThemeService'),
    debug = require('../debug');

var OPACITY_CHANGE_RATE = 0.1,
    ENDING_OPACITY = 0.05;

/**
 * Animates the completed row(s) turning white, then disappearing
 */
var RowCompleteAnimation = function(ctx, rows, onCompleteCallback) {
    this.ctx = ctx;
    this.rows = rows;
    this.onComplete = onCompleteCallback;
    this.complete = false;
    this.opacity = 1;
    this.theme = activeTheme.get();
    this.finalFillColor = this.theme.playfield.color;
};

//RowCompleteAnimation.prototype = new Animation();

RowCompleteAnimation.prototype.draw = function() {
	var width = dimensions.transpose(10), //this.gameEngine.playfield.xCount
        height = dimensions.transpose(this.rows.length);

    this.ctx.beginPath();
    this.ctx.fillStyle = this.getFill();
    this.ctx.fillRect(dimensions.playfieldOrigin.x, dimensions.transpose(this.rows[this.rows.length - 1]), width, height);

    if (this.opacity <= ENDING_OPACITY) {
        this.complete = true;
        if (typeof this.onComplete === 'function') {
            this.onComplete();
        }
    }
};

/**
 * Calculates fill color for the current animation frame
 */
RowCompleteAnimation.prototype.getFill = function() {
	return "rgba(255, 255, 255, " + this.getOpacity() + ")";
};

/**
 * Calculates opacity for the current animation frame
 */
RowCompleteAnimation.prototype.getOpacity = function() {
	this.opacity -= this.opacity * OPACITY_CHANGE_RATE;

	return this.opacity;
};

module.exports = RowCompleteAnimation;