'use strict';

var assert = require('assert'),
    extend = require('../../js/util/extend');

describe('Extend', function() {

    describe('#extend', function() {
        it('should extend an empty object', function() {
            var parent = {},
                child = {one: 'one', two: 'two'};
            assert.deepEqual(parent, extend.deepExtend(parent, child));
        });
    });

    describe('#extend', function() {
        it('should extend an empty object', function() {
            var parent = {zero: 'zero'},
                child = {one: 'one', two: 'two'},
                result = extend.deepExtend(parent, child);

            assert.deepEqual({zero: 'zero', one: 'one', two: 'two'}, result);
        });
    });

    describe('#extend', function() {
        it('should overwrite parent values', function() {
            var parent = {zero: 'zero'},
                child = {one: 'one', two: 'two', zero: 'xero'},
                result = extend.deepExtend(parent, child);

            assert.deepEqual({zero: 'xero', one: 'one', two: 'two'}, result);
        });
    });

    describe('#extend', function() {
        it('should overwrite deep parent values', function() {
            var parent = {zero: 'zero', deep: {foo: 'foo', bar: 'bar'}},
                child = {one: 'one', two: 'two', zero: 'xero', deep: {foo: 'bar'}},
                result = extend.deepExtend(parent, child);

            assert.deepEqual({zero: 'xero', one: 'one', two: 'two', deep: {foo: 'bar', bar: 'bar'}}, result);
        });
    });
});
