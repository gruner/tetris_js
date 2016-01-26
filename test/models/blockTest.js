'use strict';

var assert = require('assert'),
    Block = require('../../js/models/block');

describe('Block', function() {

    describe('#constructor', function() {
        it('should create valid block', function() {
            var block = new Block(10, 11);
            assert.strictEqual(block.x, 10);
            assert.strictEqual(block.y, 11);
            assert.strictEqual(block.width, 1);
            assert.strictEqual(block.height, 1);
        });
    });

    describe('#collidesWith', function() {
        it('should determine if blocks collide', function() {

            var testData = [
                {
                    aX: 1,
                    aY: 1,
                    bX: 1,
                    bY: 1,
                    result: true
                },
                {
                    aX: 10,
                    aY: 11,
                    bX: 10,
                    bY: 11,
                    result: true
                },
                {
                    aX: 1,
                    aY: 1,
                    bX: 1,
                    bY: 2,
                    result: false
                },
                {
                    aX: 1,
                    aY: 1,
                    bX: 2,
                    bY: 1,
                    result: false
                },
                {
                    aX: 1,
                    aY: 1,
                    bX: 2,
                    bY: 2,
                    result: false
                }
            ];

            for (var i = 0; i < testData.length; i++) {
                var data = testData[i],
                    blockA = new Block(data.aX, data.aY),
                    blockB = new Block(data.bX, data.bY);

                assert.equal(blockA.collidesWith(blockB), data.result);
                assert.equal(blockB.collidesWith(blockA), data.result);
                assert.equal(Block.collides(blockA, blockB), data.result);
                assert.equal(Block.collides(blockB, blockA), data.result);
            }
        });
    });
});
