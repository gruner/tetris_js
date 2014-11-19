'use strict';

var Animation = function(ctx) {
    this.ctx = ctx;
    this.complete = false;
};

Animation.prototype.draw = function() {};

module.export.Animation = Animation;