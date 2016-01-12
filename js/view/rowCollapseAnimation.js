'use strict';

var Animation = require('./animation');

var RowCollapseAnimation = function(ctx, rows) {
    this.ctx = ctx;
    this.rows = rows;
    this.complete = false;
};

//RowCollapseAnimation.prototype = new Animation();

RowCollapseAnimation.prototype.draw = function() {
    // spliceTop() - save state of everything above completed rows,
    // animate the saved top moving down
};

module.export = RowCollapseAnimation;