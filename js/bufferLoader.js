'use strict';

var debug = require('./debug');

// Modified version of http://www.html5rocks.com/en/tutorials/webaudio/intro/js/buffer-loader.js

function BufferLoader(ctx, urlList, callback) {
    this.ctx = ctx;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = {};
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(key, url) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
  
    var loader = this;
  
    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.ctx.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    debug.log('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[key] = buffer;

                // When all buffers are loaded, call the callback
                if (++loader.loadCount === Object.keys(loader.urlList).length) {
                    loader.onload(loader.bufferList);
                }
            },
            function(error) {
                debug.log('decodeAudioData error', error);
            }
        );
    };
  
    request.onerror = function() {
        debug.log('BufferLoader: XHR error');
    };
  
    request.send();
};

BufferLoader.prototype.load = function() {
    for (var key in this.urlList) {
        this.loadBuffer(key, this.urlList[key]);
    }
};

module.exports = BufferLoader;