import { AnimationQueue } from "./animation-queue";
import { Animation } from "./animation.abstract";

class AnimationMock extends Animation {
  draw() {
    this.complete = true;
  }
}

describe('AnimationQueue', function() {

  let animationQueue: AnimationQueue;
  let ctx: any;

  beforeEach(function() {
    animationQueue = new AnimationQueue();
    ctx = '';
  });

  describe('#push', function() {
    it('should have queue of animations', function() {
      let length = animationQueue.push(new AnimationMock(ctx));
      expect(length).toEqual(1);
      length = animationQueue.push(new AnimationMock(ctx));
      expect(length).toEqual(2);
    });
  });

  describe('#draw', function() {
    it('should draw each animation in sequence', function() {
      animationQueue.push(new AnimationMock(ctx));
      animationQueue.push(new AnimationMock(ctx));
      animationQueue.push(new AnimationMock(ctx));
      expect(animationQueue.draw()).toBeTrue();
      expect(animationQueue.draw()).toBeTrue();
      expect(animationQueue.draw()).toBeTrue();
      expect(animationQueue.draw()).toBeFalse();
    });
  });
});