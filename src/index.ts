import { Tetris } from "./tetris";

declare global {
  interface Window {
    Tetris: any;
  }
}

// Make Tetris a global object
window.Tetris = Tetris;
