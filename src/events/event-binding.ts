import { Direction } from "../models/direction.enum";
import { Event } from "./event.enum";
import { EventDispatcher } from "./event-dispatcher";
import { Features } from "../config/features";

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
      switch (e.code) {
        case 'ArrowLeft':
          this.dispatcher.publish(Event.moveActivePiece,  Direction.Left);
          break;
        case 'ArrowRight':
          this.dispatcher.publish(Event.moveActivePiece, Direction.Right);
          break;
        case 'ArrowDown':
          this.dispatcher.publish(Event.moveActivePiece, Direction.Down);
          break;
        case 'ArrowUp':
          if (Features.enabled('testMovementMode')) {
            this.dispatcher.publish(Event.moveActivePiece, Direction.Up);
          } else {
            this.dispatcher.publish(Event.rotateActivePiece, Direction.Left);
          }
          break;
        case 'Space':
          this.dispatcher.publish(Event.pause);
          break;
        default:
          break;
      }
    });
  }
};
