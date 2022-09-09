export abstract class Animation {
  ctx: CanvasRenderingContext2D;
  complete: boolean;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.complete = false;
  }

  draw(): void {}
}
