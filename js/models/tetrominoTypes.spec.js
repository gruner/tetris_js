'use strict';

var assert = require('assert'),
    tTypes = require('../../js/models/tetrominoTypes');

describe('TetrominoTypes', function() {


    describe('#getType', function() {
        it('should return object with array of blocks', function() {
            var typeZ = tTypes.getType('z');
            assert(typeZ.blocks[0].length);
            assert.strictEqual(0, typeZ.blocks[0][0].x);
            assert.strictEqual(0, typeZ.blocks[0][0].y);
            assert.strictEqual(1, typeZ.blocks[0][1].x);
        });
    });

    describe('#getTypeKeys', function() {
        it('should return array of stings', function() {
            var keys = tTypes.getTypeKeys();
            assert(keys.length);
            assert.strictEqual('i', keys[0]);
            assert.strictEqual('o', keys[1]);
            assert.strictEqual('z', keys[6]);
        });
    });

});