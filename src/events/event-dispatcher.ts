export class EventDispatcher {
  private subscribers: { [index:string] : Function[] } = {};
 
  subscribe(eventName: string, callback: Function) {

    if (typeof callback !== 'function') {
      return;
    }

    if (!this.subscribers.hasOwnProperty(eventName)) {
      this.subscribers[eventName] = [];
    }

    return this.subscribers[eventName].push(callback);
  }

  unsubscribe(eventName: string, callback: Function) {
    const subscribers = this.subscribers[eventName];
 
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

    if(!this.subscribers.hasOwnProperty(eventName)) {
      return [];
    }
  
    return this.subscribers[eventName].map(callback => callback(data));
  }

  hasSubscriber(eventName: string, callback: Function): boolean {
    return this.subscribers[eventName]
      && this.subscribers[eventName].indexOf(callback) !== - 1;
  }
}