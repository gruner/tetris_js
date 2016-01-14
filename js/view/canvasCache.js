'use strict';

/**
 * Caches the parts of the canvas that don't need to be updated on each animation frame
 * 
 * Creates a new canvas element
 * Get its context
 * Write pixels to that context
 * Use the canvas in a drawImage() call on another canvas context
 * (Don't add the cached canvas to the DOM)
 */
module.exports = {
    imageCache: {},

    // to retrive a cached image:
    // otherCtx.drawImage(imageCache.retrieve(name), 0, 0)

    addToCache: function(name, image) {
        var canvasCache = document.createElement('canvas'),
            cacheCtx;

        canvasCache.setAttribute('width', image.width);
        canvasCache.setAttribute('height', image.height);

        cacheCtx = canvasCache.getContext('2d');
        cacheCtx.drawImage(image, 0, 0);

        this.imageCache[name] = canvasCache;
    },

    retrive: function(name) {
        return this.imageCache[name] ? this.imageCache[name] : null;
    }
};