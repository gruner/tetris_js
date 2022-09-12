/**
 * Caches canvas pices that don't change and shouldn't be redrawn on each animation frame.
 * 
 * It Creates a new in-memory canvas element and returns its context. This canvas is never added to the DOM.
 *  
 * To render from the cache, use the canvas in a drawImage() call on another canvas context.
 * `otherCtx.drawImage(canvasCache.get('name'), 0, 0);`
 */
export class CanvasCache {
  private cache: {[index:string]: CanvasRenderingContext2D} = {};

  /**
   * Creates a new in-memory canvas element and returns its context after caching it
   */
  createAndSetNewContext(key: string, width: number, height: number): CanvasRenderingContext2D {
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
   * Retrieves a cached canvas context.
   */
  get(key: string) {
    return this.cache.hasOwnProperty(key) ? this.cache[key] : null;
  }
}
