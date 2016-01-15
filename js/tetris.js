var GameEngine = require('./gameEngine'),
    Canvas = require('./view/canvas'),
    events = require('./config/events'),
    eventBinding = require('./eventBinding'),
    eventDispatcher = require('./eventDispatcher');

/**
 * Bootstraps all game components together
 */
var Tetris = function(canvasElement) {
    var self = this;

    this.gameEngine = new GameEngine();
    this.canvas = new Canvas(canvasElement, this.gameEngine);
    this.frameId = null;
    eventBinding.init();


    // this has to be defined this way or it won't work
    this.run = function() {
        self.frameId = requestAnimationFrame(self.run);
        self.gameEngine.update();
        self.canvas.draw();
    };

    // self.frameId = requestAnimationFrame(self.run);

    eventDispatcher.subscribe(events.topOut, function() {
        window.cancelAnimationFrame(self.frameId);
    });
};

module.exports = Tetris;