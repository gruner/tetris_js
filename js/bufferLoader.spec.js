'use strict';

var assert = require('assert'),
    BufferLoader = require('../js/bufferLoader'),
    bufferLoader;

describe('BufferLoader', function() {

    beforeEach(function() {

        var ctxMock = {
            decodeAudioData: function() {}
        },
        urlList = {
            foo: 'bar',
            bas: 'bam'
        };

        bufferLoader = new BufferLoader(ctxMock, urlList, function() {
            return "CALLBACK";
        });
    });

    describe('#load', function() {
        it('should load each url', function() {

            // mock loadBuffer method
            bufferLoader.loadBuffer = function() {
                ++bufferLoader.loadCount
            };

            bufferLoader.load();

            assert.equal(bufferLoader.loadCount, 2);
        });
    });
});
