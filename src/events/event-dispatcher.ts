export class EventDispatcher {
  private eventSubscriptions: { [index:string] : Function[] } = {};
 
  subscribe(eventName: string, callback: Function) {

    if (typeof callback !== 'function') {
      return;
    }

    if (!this.eventSubscriptions.hasOwnProperty(eventName)) {
      this.eventSubscriptions[eventName] = [];
    }

    return this.eventSubscriptions[eventName].push(callback);
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

  publish(eventName: string, data = {}) {

    if(!this.eventSubscriptions.hasOwnProperty(eventName)) {
      return [];
    }
  
    return this.eventSubscriptions[eventName].map(callback => callback(data));
  }

  hasSubscriber(eventName: string, callback: Function): boolean {
    return this.eventSubscriptions[eventName]
      && this.eventSubscriptions[eventName].indexOf(callback) !== - 1;
  }
}