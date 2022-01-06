import { EventDispatcher } from "../events/event-dispatcher";

type GameStateData = {
  level: number
}

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
    this.change(STATE.SUSPEND);
  }

  rowComplete(completedRows: number[]) {
    this.change(STATE.SUSPEND, completedRows);
    this.change(STATE.SUSPEND);
  }
}
