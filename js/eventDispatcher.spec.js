'use strict';

var assert = require('assert'),
    eventDispatcher = require('../js/eventDispatcher');

describe('eventDispatcher', function() {

    describe('#subscribe', function() {
        it('should add an event subscriber', function() {
            var cb = function() { return "TEST_SUBSCRIBE"};
            eventDispatcher.subscribe('TEST_SUBSCRIBE', cb);
            assert(eventDispatcher.hasSubscriber('TEST_SUBSCRIBE', cb));
        });
    });

    describe('#unsubscribe', function() {
        it('should remove an event subscriber', function() {
            var cb = function() { return "TEST_UNSUBSCRIBE"};

            eventDispatcher.subscribe('TEST_UNSUBSCRIBE', cb);
            assert(eventDispatcher.hasSubscriber('TEST_UNSUBSCRIBE', cb));

            eventDispatcher.unsubscribe('TEST_UNSUBSCRIBE', cb);
            assert(!eventDispatcher.hasSubscriber('TEST_UNSUBSCRIBE', cb));
        });
    });

    describe('#trigger', function() {
        it('should trigger an event', function() {
            var cb = function(appliedData) { appliedData.text = "TEST_TRIGGER"},
                data = {};
            eventDispatcher.subscribe('TEST_TRIGGER', cb);
            eventDispatcher.trigger('TEST_TRIGGER', data);

            assert.equal(data.text, "TEST_TRIGGER");
            assert(eventDispatcher.hasSubscriber('TEST_TRIGGER', cb));
        });
    });

    describe('#trigger', function() {
        it('should pass an array to a subscriber', function() {
            var cb = function(appliedData) { appliedData.text = "TEST_TRIGGER2"},
                data = {};
            eventDispatcher.subscribe('TEST_TRIGGER2', cb);
            eventDispatcher.trigger('TEST_TRIGGER2', data);

            assert.equal(data.text, "TEST_TRIGGER2");
            assert(eventDispatcher.hasSubscriber('TEST_TRIGGER2', cb));
        });
    });

    describe('#trigger', function() {
        it('should pass multiple args to a subscriber', function() {
            var cb = function(args) {
                assert(args[0]);
                assert(args[1]);
                assert(args[2]);
            },
            data1 = {},
            data2 = {},
            data3 = {};

            eventDispatcher.subscribe('TEST_TRIGGER3', cb);
            eventDispatcher.trigger('TEST_TRIGGER3', [data1, data2, data3]);
            assert(eventDispatcher.hasSubscriber('TEST_TRIGGER3', cb));
        });
    });

    describe('#once', function() {
        it('should remove a subscriber after one event occurrence', function() {
            var cb = function(appliedData) { appliedData.text = "TEST_ONCE"},
                data = {};
            eventDispatcher.once('TEST_ONCE', cb);
            eventDispatcher.trigger('TEST_ONCE', data);

            assert.equal(data.text, "TEST_ONCE");
            assert(!eventDispatcher.hasSubscriber('TEST_ONCE', cb));
        });
    });
});
