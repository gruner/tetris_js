/**
 * Caches the parts of the canvas that don't need to be updated on each animation frame
 * 
 * Creates a new canvas element
 * Get its context
 * Write pixels to that context
 * Use the canvas in a drawImage() call on another canvas context
 * (Don't add the cached canvas to the DOM)
 */
export class CanvasCache {
  private cache: {[index:string]: CanvasRenderingContext2D} = {};

  createAndSetNewContext(key: string, width: number, height: number) {
    const canvasCache = document.createElement('canvas') as HTMLCanvasElement;
    const context = canvasCache.getContext('2d')!;
    canvasCache.width = width;
    canvasCache.height = height;

    return this.set(key, context);
  }

  set(key: string, context: CanvasRenderingContext2D): CanvasRenderingContext2D {
    this.cache[key] = context;
    return context;
  }

  /**
   * Retrieves a cached image.
   * To draw a cached image:
   * otherCtx.drawImage(canvasCache.get(name), 0, 0)
   */
  get(key: string) {
    return this.cache.hasOwnProperty(key) ? this.cache[key] : null;
  }
}
