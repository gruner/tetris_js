define(function () {
    var Animation = function(ctx) {
        this.ctx = ctx;
        this.complete = false;
    };

    Animation.prototype.draw = function() {};

    return Animation;
});