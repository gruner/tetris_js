'use strict';

// Modified version of http://www.html5rocks.com/en/tutorials/webaudio/intro/js/buffer-loader.js

function BufferLoader(context, urlList, callback) {
    this.context = context;
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
        loader.context.decodeAudioData(
          request.response,
          function(buffer) {
            if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
            }
            loader.bufferList[key] = buffer;

            // When all buffers are loaded, call the callback
            if (++loader.loadCount === Object.keys(loader.urlList).length) {
                loader.onload(loader.bufferList);
            }
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }
  
    request.onerror = function() {
        //alert('BufferLoader: XHR error');
    }
  
    request.send();
}

BufferLoader.prototype.load = function() {
    for (var key in this.urlList) {
        this.loadBuffer(key, this.urlList[i]);
    };
}

module.exports = BufferLoader;