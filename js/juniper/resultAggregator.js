define(['juniper/events'], function(events) {

    // Subscribes to events and collects test results

    var results = {
        testCount: 0,
        assertCount: 0,
        passes: [],
        fails: [],
        errors: [],

        bindEvents: function(eventDispatcher) {
            var self = this;

            eventDispatcher.subscribe(events.TEST_METHOD_COMPLETE_EVENT, function() {
                self.testCount++;
            });

            eventDispatcher.subscribe(events.ASSERTION_COMPLETE_EVENT, function(report) {
                self.assertCount++;
                if (report.status === 'pass') {
                    self.passes = self.passes.concat(testResults.passes);
                } else if (report.status === 'fail') {
                    self.fails = self.fails.concat(testResults.fails);
                } else if (report.status === 'error') {
                    self.errors = self.errors.concat(testResults.errors);
                }
            });

            eventDispatcher.subscribe(events.ALL_TESTS_COMPLETE_EVENT, function() {
                eventDispatcher.trigger(events.ALL_TESTS_COMPILED_EVENT, self, this);
            });
        }
    };

    return results;
});