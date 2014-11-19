define([
    'eventDispatcher',
    'juniper/runner',
    'juniper/resultAggregator'
    ],
    function(eventDispatcher, Runner, resultAggregator) {

        return {

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
    }
);