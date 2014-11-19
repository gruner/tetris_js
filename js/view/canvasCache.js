define(function () {

    // * Create a canvas element
    // * Get its context
    // * Write pixels to that context
    // * Use the canvas in a drawImage() call on another canvas context
    // * (You don't add the cached canvas to the DOM)
    return {
        imageCache: {},

        // to retrive a cached image:
        // otherCtx.drawImage(imageCache[name], 0, 0)

        cache: function(name, image) {
            var canvasCache = document.createElement('canvas'),
                cacheCtx;

            canvasCache.setAttribute('width', image.width);
            canvasCache.setAttribute('height', image.height);

            cacheCtx = canvasCache.getContext('2d');
            cacheCtx.drawImage(image, 0, 0);

            imageCache[name] = canvasCache;
        }
    };
});