import { Direction } from "../models/direction.enum";
import { Event } from "./event.enum";
import { EventDispatcher } from "./event-dispatcher";
import { Features } from "../config/features";

const keyCodes = {
  left:  37,
  up:    38,
  right: 39,
  down:  40,
  spacebar: 32
};

export class EventBinding {

  private dispatcher: EventDispatcher;

  constructor(dispatcher: EventDispatcher) {
    this.dispatcher = dispatcher;
  }

  init() {
    this.bindKeydown();
  }

  private bindKeydown() {
    document.addEventListener('keydown', (e) => {
      const code = e.keyCode || e.which;
      if (code === keyCodes.left) {
        this.dispatcher.trigger(Event.moveActivePiece, {direction: Direction.Left}, this);
      } else if (code === keyCodes.right) {
        this.dispatcher.trigger(Event.moveActivePiece, {direction: Direction.Right}, this);
      } else if (code === keyCodes.down) {
        this.dispatcher.trigger(Event.moveActivePiece, {direction: Direction.Down}, this);
      } else if (code === keyCodes.up) {
        if (Features.enabled('testMovementMode')) {
          this.dispatcher.trigger(Event.moveActivePiece, {direction: Direction.Up}, this);
        } else {
          this.dispatcher.trigger(Event.rotateActivePiece, {direction: Direction.Left}, this);
        }
      } else if (code === keyCodes.spacebar) {
        this.dispatcher.trigger(Event.pause);
      }
    });
  }
};
