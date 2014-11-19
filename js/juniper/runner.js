'use strict';

var events = require('./events');

var Runner = function(tests) {
    this.tests = tests;
};

Runner.prototype.runTests = function() {
    
    // todo: start timer

    for (var i = 0, iMax = this.tests.length; i < iMax; i++) {
        // this.dispatchTestCaseBegin(this.tests[i].constructor); // this isn't working yet
        this.runTestCase(this.tests[i]);
    }

    // todo: stop timer, pass in elapsed time

    this.dispatchAllTestsComplete(500);
};

Runner.prototype.runTestCase = function(testCase) {
    var testMethods = testCase.getTestMethods();
    for (var i = 0, iMax = testMethods.length; i < iMax; i++) {
        var method = testMethods[i];
        this.dispatchTestMethodBegin(method);
        this.runTestMethod(testCase, method);
        this.dispatchTestMethodComplete(method);
    }
};

Runner.prototype.runTestMethod = function(testCase, methodName) {
    testCase.setup();
    testCase[methodName]();
    testCase.teardown();
};

Runner.prototype.dispatchTestCaseBegin = function(testCase) {
    if (typeof this.dispatcher !== 'undefined') {
        this.dispatcher.trigger(events.TEST_CASE_BEGIN_EVENT, {testCase: testCase}, this);
    }
};

Runner.prototype.dispatchTestMethodBegin = function(testMethod) {
    if (typeof this.dispatcher !== 'undefined') {
        this.dispatcher.trigger(events.TEST_METHOD_BEGIN_EVENT, {testMethod: testMethod}, this);
    }
};

Runner.prototype.dispatchTestMethodComplete = function(testMethod) {
    if (typeof this.dispatcher !== 'undefined') {
        this.dispatcher.trigger(events.TEST_METHOD_COMPLETE_EVENT, {testMethod: testMethod}, this);
    }
};

Runner.prototype.dispatchAllTestsComplete = function(elapsedTime) {
    if (typeof this.dispatcher !== 'undefined') {
        this.dispatcher.trigger(events.ALL_TESTS_COMPLETE_EVENT, {elapsedTime: elapsedTime}, this);
    }
};

module.exports = Runner;