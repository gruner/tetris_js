'use strict';

var _ = require('underscore'),
    dispatcher = require('../eventDispatcher'),
    events = require('./events');
    

var toString = function(value) {
    if (value === true || value === false) {
        return (value === true) ? 'true' : 'false';
    }

    return value;
};

var currentTestCase = '',
    currentTestMethod = '';

var assertions = {

    bindEvents: function() {
        dispatcher.subscribe(events.TEST_CASE_BEGIN_EVENT, function(data) {
            currentTestCase = data.testCase;
        });

        dispatcher.subscribe(events.TEST_METHOD_BEGIN_EVENT, function(data) {
            currentTestMethod = data.testMethod;
        });
    },

    /**
     * Executes an assertion passed as a callback and dispatches the result.
     * All asserts are passes as callbacks so that we can execute in a try/catch wrapper
     */
    assert: function(assertType, callback) {

        var report;

        try {
            var result = callback();

            if (result === true) {
                report = this.packageResult(
                    'pass',
                    'passed'
                );
            } else if (result === false) {
                report = this.packageResult(
                    'fail',
                    this.getErrorMsg(assertType, arguments.callee.caller.arguments)
                );
            }
        } catch(e) {
            report = this.packageResult(
                'error',
                e.message
            );
        }

        this.dispatchResult(report);
    },

    assertTrue: function(result) {
        this.assert('assertTrue', function() {
            return (true === result);
        });
    },

    assertFalse: function(result) {
        this.assert('assertFalse', function() {
            return (false === result);
        });
    },

    assertEquals: function(expected, result) {
        this.assert('assertEquals', function() {
            return (expected === result);
        });
    },

    assertTypeof: function(type, result) {
        this.assert('assertTypeof', function() {
            return (typeof result === type.toLowerCase());
        });
    },

    assertUndefined: function(result) {
        this.assert('assertUndefined', function() {
            return (typeof result === 'undefined');
        });
    },

    getErrorMsg:  function(assertType, assertionArguments) {
        var msg = '';
        if (typeof this[assertType].errorMessage !== 'undefined') {

            var actual = assertionArguments[1] | assertionArguments[0];

            msg = _.template(this[assertType].errorMessage, {
                expected: toString(assertionArguments[0]),
                actual: toString(actual)
            });
        }

        return msg;
    },

    packageResult: function(status, message) {
        return {
            testClass: currentTestCase,
            testMethod: currentTestMethod,
            status: status,
            message: message
        };
    },

    dispatchResult: function(report) {
        if (typeof dispatcher !== 'undefined') {
            dispatcher.trigger(events.ASSERTION_COMPLETE_EVENT, report, this);
        }
    }
};

assertions.assertTrue.errorMessage = 'expected value to be true, instead saw <%= actual %>';
assertions.assertFalse.errorMessage = 'expected value to be false, instead saw <%= actual %>';
assertions.assertEquals.errorMessage = 'expected <%= expected %> to equal <%= actual %>';
assertions.assertTypeof.errorMessage = 'expected value to be typeof <%= expected %>, instead saw <%= actual %>';
assertions.assertUndefined.errorMessage = 'expected value to be undefined, instead saw <%= actual %>';

assertions.bindEvents();

module.exports = assertions;