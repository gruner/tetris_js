var GameEngine = require('./gameEngine'),
    Canvas = require('./view/canvas'),
    eventBinding = require('./eventBinding'),
    eventDispatcher = require('./eventDispatcher'),
    debug = require('./debug');

/**
 * Wrapper that ties all game components together
 */
var Tetris = function(canvasElement) {
    this.gameEngine = new GameEngine();
    this.canvas = new Canvas(canvasElement, this.gameEngine);
    this.frameId = null;
    eventBinding.init();
    eventDispatcher.subscribe('tetris.topOut', this.stopLoop);

    var self = this;

    // this has to be defined this way or it won't work
    this.run = function() {
        requestAnimationFrame(self.run);
        self.gameEngine.update();
        self.canvas.draw();
    };
};

Tetris.prototype.stopLoop = function() {
    window.cancelAnimationFrame(this.frameId);
};

module.exports = Tetris;