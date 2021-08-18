import { Animation } from "./animation.abstract";

/**
 * Manages a queue of animation objects so that they draw in sequence
 */
export class AnimationQueue {
  private animations: Animation[] = [];

  push(animation: Animation): number {
    return this.animations.push(animation);
  }

  clear() {
    this.animations = [];
  }

  /**
   * Draws the next frame in the animation stack
   * @return bool - whether or not a frame was drawn
   */
  draw(): boolean {
    if (this.animations.length) {
      this.animations[0].draw();
      if (this.animations[0].complete) {
        this.animations.shift();
      }
      return true;
    } else {
      return false;
    }
  }
}
