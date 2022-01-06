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
        this.dispatcher.publish(Event.moveActivePiece,  Direction.Left);
      } else if (code === keyCodes.right) {
        this.dispatcher.publish(Event.moveActivePiece, Direction.Right);
      } else if (code === keyCodes.down) {
        this.dispatcher.publish(Event.moveActivePiece, Direction.Down);
      } else if (code === keyCodes.up) {
        if (Features.enabled('testMovementMode')) {
          this.dispatcher.publish(Event.moveActivePiece, Direction.Up);
        } else {
          this.dispatcher.publish(Event.rotateActivePiece, Direction.Left);
        }
      } else if (code === keyCodes.spacebar) {
        this.dispatcher.publish(Event.pause);
      }
    });
  }
};
