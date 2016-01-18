'use strict';

var Animation = require('./animation'),
    dimensions = require('../config/canvasDimensions');

var OPACITY_CHANGE_RATE = 0.5,
    ENDING_OPACITY = 0.05;

/**
 * Animates the completed row(s) turning white, then disappearing
 */
var RowCompleteAnimation = function(ctx, rows) {
    this.ctx = ctx;
    this.rows = rows;
    this.complete = false;
    this.opacity = 1;
    this.finalFillColor = this.gameEngine.theme.playfield.color;
};

//RowCompleteAnimation.prototype = new Animation();

RowCompleteAnimation.prototype.draw = function() {
	var width = dimensions.transpose(this.gameEngine.playfield.xCount),
        height = dimensions.transpose(this.rows.length);

    this.ctx.fillStyle = this.getFill();
    this.ctx.fillRect(dimensions.playfield.x, dimensions.transpose(this.rows[0]), width, height);

    if (this.opacity <= ENDING_OPACITY) {
    	this.complete = true;
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

module.export = RowCompleteAnimation;