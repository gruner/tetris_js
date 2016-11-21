'use strict';

var assert = require('assert'),
    Validate = require('../../js/util/validate');

describe('Validate', function() {

    describe('#coordinates', function() {
        it('should validate that coordinates have x and y integers', function() {

            var testSets = [
                {
                    coordinates: {x: 0, y: 0},
                    expected: true
                },
                {
                    coordinates: {x: 1, y: 0},
                    expected: true
                },
                {
                    coordinates: {x: 0, y: 1},
                    expected: true
                },
                {
                    coordinates: {x: 1.1, y: 1},
                    expected: false
                },
                {
                    coordinates: {x: '1', y: 1},
                    expected: false
                },
                {
                    coordinates: {x: 1.1, y: 1},
                    expected: false
                },
                {
                    coordinates: {y: 1},
                    expected: false
                }
            ];
            for (var i = 0; i < testSets.length; i++) {
                var set = testSets[i];
                assert(set.expected === Validate.coordinates(set.coordinates));
            };
        });
    }); 
});
