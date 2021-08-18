export abstract class Animation {
  ctx: any;
  complete: boolean;

  constructor(ctx: any) {
    this.ctx = ctx;
    this.complete = false;
  }

  draw(): void {}
}
