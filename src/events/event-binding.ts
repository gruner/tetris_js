import { Direction } from "../models/direction.enum";
import { Event } from "./event.enum";
import { EventDispatcher } from "./event-dispatcher";
import { Features } from "../config/features";

/**
 * Maps keyboard keys to game events.
 */
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
          e.preventDefault;
          this.dispatcher.publish(Event.moveActivePiece,  Direction.Left);
          break;
        case 'ArrowRight':
          e.preventDefault;
          this.dispatcher.publish(Event.moveActivePiece, Direction.Right);
          break;
        case 'ArrowDown':
          e.preventDefault;
          this.dispatcher.publish(Event.moveActivePiece, Direction.Down);
          break;
        case 'ArrowUp':
          e.preventDefault;
          if (Features.enabled('testMovementMode')) {
            this.dispatcher.publish(Event.moveActivePiece, Direction.Up);
          } else {
            this.dispatcher.publish(Event.rotateActivePiece, Direction.Left);
          }
          break;
        case 'Space':
          e.preventDefault;
          this.dispatcher.publish(Event.pause);
          break;
        case 'Digit0':
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
        case 'Minus':
          this.debugThemeChange(e.code);
          break;
        default:
          break;
      }
    });
  }

  private debugThemeChange(keyCode: string) {
    if (Features.enabled('testThemeMode')) {
      const themeIndex = (keyCode === 'Minus')
        ? 99
        : parseInt(keyCode.slice(-1));
      this.dispatcher.publish(Event.changeTheme, themeIndex);
    }
  }
};
