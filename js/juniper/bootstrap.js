'use strict';

var eventDispatcher = require('../eventDispatcher'),
    Runner = require('./runner'),
    resultAggregator = require('./resultAggregator');

module.exports = {

    _config: null,

    init: function(config) {
        this._config = config;
        resultAggregator.bindEvents(eventDispatcher);
    },

    onLoad: function(callback) {
        var self = this;
        this.loadTestModules(function(testInstances) {
            self.runner = new Runner(testInstances);
            callback();
        });
    },

    loadTestModules: function(callback) {
        require(this._config.testModules, function() {
            testInstances = [];
            for (var i = 0, iMax = arguments.length; i < iMax; i++) {
                testInstances.push(new arguments[i]());
            }

            callback(testInstances);
        });
    },

    run: function() {
        this.runner.dispatcher = eventDispatcher;
        this.runner.runTests();
    }
};