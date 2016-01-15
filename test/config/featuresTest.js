'use strict';

var assert = require('assert'),
    features = require('../../js/config/features');

describe('Features', function() {

    beforeEach(function() {
        features.set('testEnabledTrue', {enabled: true});
        features.set('testEnabledFalse', {enabled: false});
    });

    describe('#enable', function() {
        it('should enable feature', function() {
            assert(false === features.enabled('testEnabledFalse'));
            features.enable('testEnabledFalse');
            assert(true === features.enabled('testEnabledFalse'));
        });
    });

    describe('#enabled', function() {
        it('should check that feature is disabled', function() {
            assert(false === features.enabled('NO_EXIST'));
        });
    });

    describe('#enabled', function() {
        it('should check that feature is enabled', function() {
            assert(false === features.enabled('testEnabledFalse'));
            assert(true === features.enabled('testEnabledTrue'));
        });
    });

    describe('#set', function() {
        it('should check that feature is enabled', function() {
            features.set('testSet', {enabled: true});
            assert(true === features.enabled('testSet'));
        });
    });
});
