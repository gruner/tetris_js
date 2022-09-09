import { Tetris } from "./tetris";
import { Debug } from "./util/debug";

declare global {
  interface Window {
    Tetris: any;
  }
}

Debug.enable();

// Make Tetris a global object
window.Tetris = Tetris;
