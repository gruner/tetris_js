import { EventDispatcher } from "../events/event-dispatcher";

type GameStateData = {
  level: number
}

// Use a string enum so that value can be used for event name
export enum STATE {
    PLAY = 'PLAY',
    PAUSE = 'PAUSE',
    SUSPEND = 'SUSPEND',
    ROW_COMPLETE = 'ROW_COMPLETE',
    ROW_CLEARED = 'ROW_CLEARED'
}

export class GameState {
  currentState: STATE;
  events: EventDispatcher;
  store: GameStateData;

  constructor(events: EventDispatcher) {
    this.events = events;
    this.currentState = STATE.PLAY;
    this.store = {
      level: 0
    }
  }

  /**
   * Changes to new provided state and publishes the change event
   */
  change(newState: STATE, data = {}) {
    this.currentState = newState;
    this.events.publish(newState, data);
  }

  /**
   * Pauses or resumes the game
   */
  togglePause() {
    if (this.currentState === STATE.PAUSE) {
      this.resume();
    } else {
      this.change(STATE.PAUSE);
    }
  }

  suspend() {
    this.change(STATE.SUSPEND);
  }

  resume() {
    this.change(STATE.PLAY);
  }

  rowCleared() {
    this.change(STATE.ROW_CLEARED);
  }

  rowComplete(completedRows: number[]) {
    this.change(STATE.SUSPEND); // suspends state for animation to complete
    this.change(STATE.ROW_COMPLETE, completedRows); // broadcast the completed rows array
  }
}
