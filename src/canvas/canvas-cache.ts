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
  private cache: {[index:string]: HTMLCanvasElement} = {};

  set(key: string, image: HTMLImageElement) {
    const canvasCache = document.createElement('canvas') as HTMLCanvasElement;
    const context = canvasCache.getContext('2d')!;

    canvasCache.setAttribute('width', image.width.toString());
    canvasCache.setAttribute('height', image.height.toString());

    context.drawImage(image, 0, 0);

    this.cache[key] = canvasCache;
  }

  /**
   * Retrieves a cached image.
   * To draw a cached image:
   * otherCtx.drawImage(canvasCache.get(name), 0, 0)
   */
  get(key: string) {
    return this.cache[key] ? this.cache[key] : null;
  }
}
