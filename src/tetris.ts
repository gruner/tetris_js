import { ActiveTheme } from "./theme/active-theme";
import { AnimationQueue } from "./animation/animation-queue";
import { Canvas } from "./canvas/canvas";
import { Event } from "./events/event.enum";
import { EventBinding } from "./events/event-binding";
import { EventDispatcher } from "./events/event-dispatcher";
import { GameEngine } from "./game-engine";
import { Theme } from "./theme/theme";
import { GameState } from "./state/game-state";

/**
 * Bootstraps all game components together
 * TODO: use a DI service container instead of manually doing all instantiation here
 */
export class Tetris {

  gameEngine: GameEngine;
  canvas: Canvas;
  frameId: number = 0;
  eventBinding: EventBinding;

  constructor(canvasElement: HTMLCanvasElement) {
    // canvasElement = canvasElement || this.createCanvasElement();

    const defaultTheme = new Theme();
    const activeTheme = new ActiveTheme(defaultTheme);
    const eventDispatcher = new EventDispatcher();
    const stateEventDispatcher = new EventDispatcher();
    const animationQueue = new AnimationQueue();
    const gameState = new GameState(stateEventDispatcher);

    this.gameEngine = new GameEngine(activeTheme, eventDispatcher, gameState);
    this.canvas = new Canvas(activeTheme, animationQueue, canvasElement, this.gameEngine);
    this.eventBinding = new EventBinding(eventDispatcher);

    this.eventBinding.init();

    // Stop the event loop when the game ends
    eventDispatcher.subscribe(Event.topOut, () => {
      cancelAnimationFrame(this.frameId);
    });
  }

  /**
   * Creates canvas tag on the DOM if one wasn't passed in.
   * TODO: consider preferring this approach as we can dynamically
   * size the element in line with existing configs.
   */
  createCanvasElement(): HTMLCanvasElement {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;

    // TODO add to DOM
  
    return canvas;
  }

  run() {
    this.frameId = requestAnimationFrame(this.run);
    this.gameEngine.update();
    this.canvas.draw();
  }
}
