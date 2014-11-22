'use strict';

var eventDispatcher = require('../eventDispatcher'),
    Runner = require('./runner'),
    resultAggregator = require('./resultAggregator');

module.exports = {

    _tests: null,

    init: function(tests) {
        this._tests = tests;
        resultAggregator.bindEvents(eventDispatcher);
    },

    onLoad: function(callback) {
        this.runner = new Runner(this.instantiateTests());
        callback();
    },

    instantiateTests: function() {
        var testInstances = [];

        for (var i = 0, iMax = this._tests.length; i < iMax; i++) {
            if (typeof this._tests[i] === 'function') {
                testInstances.push(new this._tests[i]());
            }
        }

        return testInstances;
    },

    run: function() {
        this.runner.dispatcher = eventDispatcher;
        this.runner.runTests();
    }
};