'use strict';

var assertions = require('./assertions');


var TestCase = function() {
    this.init();
};

/**
 * Called after instantiation
 */
TestCase.prototype.init = function() {};

/**
 * Called before each test method
 */
TestCase.prototype.setup = function() {};

/**
 * Called after each test method
 */
TestCase.prototype.teardown = function() {};


/**************************************************
 *   ASSERTIONS - deferred to assertions object
 **************************************************/

TestCase.prototype.assertTrue = function(result) {
    assertions.assertTrue(result);
};

TestCase.prototype.assertFalse = function(result) {
    assertions.assertFalse(result);
};

TestCase.prototype.assertEquals = function(expected, result) {
    assertions.assertEquals(expected, result);
};

// Alias of assertEquals
TestCase.prototype.assertEqual = function(expected, result) {
    assertions.assertEquals(expected, result);
};

TestCase.prototype.assertTypeof = function(type, result) {
    assertions.assertTypeof(type, result);
};

TestCase.prototype.assertUndefined = function(result) {
    assertions.assertUndefined(result);
};

TestCase.prototype.assertNull = function(result) {
    assertions.assertNull(result);
};

TestCase.prototype.assertNotNull = function(result) {
    assertions.assertNotNull(result);
};

/***********************
 *   Introspection 
 ***********************/

/**
 * Returns array of valid test methods
 */
TestCase.prototype.getTestMethods = function() {
    var testMethods = [];
    for (var key in this) {
        if (typeof this[key] === 'function' && TestCase.isTestMethod(key)) {
            testMethods.push(key);
        }
    }

    return testMethods;
};

/**
 * Checks that method name begins with 'test';
 */
TestCase.isTestMethod = function(methodName) {
    var TEST = 'test';
    return (methodName.substring(0, TEST.length) === TEST);
};

module.exports = TestCase;