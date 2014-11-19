define(['debug'], function(debug) {

  var eventSubscriptions = {};
 
  return {
 
    subscribe: function (eventName, callback) {

        if (typeof callback !== 'function') {
            return;
        }

        // Retrieve a list of current subscribers for eventName (if any)
        var subscribers = eventSubscriptions[eventName];
   
        if (typeof subscribers === 'undefined') {
            // If no subscribers for this event were found,
            // initialize a new empty array
            subscribers = eventSubscriptions[eventName] = [];
        }
   
        // Add the given callback function to the end of the array with
        // eventSubscriptions for this event.
        subscribers.push(callback);
    },
 
    trigger: function (eventName, data, context) {
 
        var
            // Retrieve a list of subscribers for the event being triggered
            subscribers = eventSubscriptions[eventName],
            i, iMax;
 
        if (typeof subscribers === 'undefined') {
            // No list found for this event, return early to abort execution
            return;
        }
 
        // Ensure data is an array or is wrapped in an array,
        // for Function.prototype.apply use
        data = (data instanceof Array) ? data : [data];
 
        // Set a default value for `this` in the callback
        // TODO: fix this!!!
        context = context || APP;

        for (i = 0; i < subscribers.length; i++) {
            subscribers[i].apply(context, data);
        }
    }
  };
});