'use strict';
    
var debug = require('./debug'),
    eventSubscriptions = {};
 
module.exports = {
 
    subscribe: function (eventName, callback) {

        if (typeof callback !== 'function') {
            return;
        }

        // Retrieve a list of current subscribers for eventName (if any)
        var subscribers = eventSubscriptions[eventName];
   
        if (subscribers === undefined) {
            subscribers = eventSubscriptions[eventName] = [];
        }
   
        // Add the given callback function to the end of the array with
        // eventSubscriptions for this event.
        subscribers.push(callback);
    },

    unsubscribe: function(eventName, callback) {
        var subscribers = eventSubscriptions[eventName];
 
        if (subscribers === undefined) { return; }

        var index = subscribers.indexOf(callback);

        if (index !== -1) {
            subscribers.splice(index, 1);
        }
    },

    once: function(eventName, callback) {
        var self = this;
        this.subscribe(eventName, function() {
            callback.apply(this, arguments);
            self.unsubscribe(eventName, callback);
        });
    },
 
    trigger: function (eventName, data, context) {
 
        var subscribers = eventSubscriptions[eventName],
            i;
 
        if (typeof subscribers === 'undefined') {
            return;
        }
 
        // Ensure data is an array or is wrapped in an array,
        // for Function.prototype.apply use
        data = [data];
 
        // Set a default value for `this` in the callback
        var window = window || global;
        context = context || window;

        for (i = 0; i < subscribers.length; i++) {
            subscribers[i].apply(context, data);
        }
    },

    hasSubscriber: function (eventName, callback) {
        if (eventSubscriptions[eventName] !== undefined && eventSubscriptions[eventName].indexOf(callback) !== - 1 ) {
            return true;
        }

        return false;
    },
};