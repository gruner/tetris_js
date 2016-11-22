'use strict';

var Animation = require('./animation'),
    dimensions = require('../config/canvasDimensions'),
    eventDispatcher = require('../eventDispatcher'),
    events = require('../config/events'),
    debug = require('../debug');

var OPACITY_CHANGE_RATE = 0.1,
    ENDING_OPACITY = 0.05;

/**
 * Animates the completed row(s) turning white, then disappearing
 */
var RowCompleteAnimation = function(ctx, rows) {
    this.ctx = ctx;
    this.rows = rows;
    this.complete = false;
    this.opacity = 1;
    this.finalFillColor = '#000000';//this.gameEngine.theme.playfield.color;

    console.info('rows', rows);
};

//RowCompleteAnimation.prototype = new Animation();

RowCompleteAnimation.prototype.draw = function() {
	var width = dimensions.transpose(10), //this.gameEngine.playfield.xCount
        height = dimensions.transpose(this.rows.length);

    this.ctx.beginPath();
    this.ctx.fillStyle = this.getFill();
    this.ctx.fillRect(dimensions.playfieldOrigin.x, dimensions.transpose(this.rows[this.rows.length - 1]), width, height);

    if (this.opacity <= ENDING_OPACITY) {
        eventDispatcher.trigger(events.rowCleared);
        //eventDispatcher.trigger(events.animationEnd, 'RowCompleteAnimation');
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

module.exports = RowCompleteAnimation;