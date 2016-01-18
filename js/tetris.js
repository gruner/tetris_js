var GameEngine = require('./gameEngine'),
    Canvas = require('./view/canvas'),
    events = require('./config/events'),
    eventBinding = require('./eventBinding'),
    eventDispatcher = require('./eventDispatcher');

/**
 * Bootstraps all game components together
 */
var Tetris = function(canvasElement) {
    
    canvasElement = canvasElement || Tetris.createCanvasElement();

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

/**
 * Creates canvas tag on the DOM if one wasn't passed in.
 * TODO: consider preferring this approach as we can dynamically
 * size the element in line with existing configs.
 */
Tetris.createCanvasElement = function() {
}

module.exports = Tetris;