export class EventDispatcher {
  private eventSubscriptions: { [index:string] : Function[] } = {};
 
  subscribe(eventName: string, callback: Function) {

    if (typeof callback !== 'function') {
      return;
    }

    if (!this.eventSubscriptions.hasOwnProperty(eventName)) {
      this.eventSubscriptions[eventName] = [];
    }

    this.eventSubscriptions[eventName].push(callback);
  }

  unsubscribe(eventName: string, callback: Function) {
    const subscribers = this.eventSubscriptions[eventName];
 
    if (subscribers === undefined) { return; }

    const index = subscribers.indexOf(callback);

    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  }

  once(eventName: string, callback: Function) {
    const self = this;
    this.subscribe(eventName, function() {
      callback.apply(self, arguments);
      self.unsubscribe(eventName, callback);
    });
  }
 
  trigger(eventName: string, data?: any, context?: any) {
 
    const subscribers = this.eventSubscriptions[eventName];
 
    if (typeof subscribers === 'undefined') {
      return;
    }
 
    // Ensure data is an array or is wrapped in an array,
    // for Function.prototype.apply use
    data = [data];
 
    // Set a default value for `this` in the callback
    // const window = window || global;
    // context = context || window;

    for (let i = 0; i < subscribers.length; i++) {
      subscribers[i].apply(context, data);
    }
  }

  hasSubscriber(eventName: string, callback: Function): boolean {
    return this.eventSubscriptions[eventName]
      && this.eventSubscriptions[eventName].indexOf(callback) !== - 1;
  }
}