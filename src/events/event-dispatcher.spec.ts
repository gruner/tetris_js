import { EventDispatcher } from "./event-dispatcher";

describe('EventDispatcher', function() {

  let eventDispatcher: EventDispatcher;

  beforeEach(() => {
    eventDispatcher = new EventDispatcher();
  });

  describe('#subscribe', function() {
    it('should add an event subscriber', function() {
      const cb = () => {"BOOM!"};
      eventDispatcher.subscribe('TEST_SUBSCRIBE', cb);
      expect(eventDispatcher.hasSubscriber('TEST_SUBSCRIBE', cb)).toBeTrue();
    });
  });

  describe('#unsubscribe', function() {
    it('should remove an event subscriber', function() {
      const cb = () => {"BOOM!"};
      eventDispatcher.subscribe('TEST_UNSUBSCRIBE', cb);
      expect(eventDispatcher.hasSubscriber('TEST_UNSUBSCRIBE', cb)).toBeTrue();

      eventDispatcher.unsubscribe('TEST_UNSUBSCRIBE', cb);
      expect(eventDispatcher.hasSubscriber('TEST_UNSUBSCRIBE', cb)).toBeFalse();
    });
  });

  describe('#trigger', function() {
    it('should trigger an event', function() {
      const cb = (appliedData: any) => { appliedData.text = "TEXT_MODIFIED_IN_CB"};
      const data = {
        text: ''
      };
      eventDispatcher.subscribe('TEST_TRIGGER', cb);
      eventDispatcher.trigger('TEST_TRIGGER', data);

      expect(data.text).toEqual('TEXT_MODIFIED_IN_CB');
      expect(eventDispatcher.hasSubscriber('TEST_TRIGGER', cb)).toBeTrue();
    });

    xit('should pass an array to a subscriber', function() {
      const cb = (appliedData: any) => { appliedData.text = "TEXT_MODIFIED_IN_CB"};
      const data = {
        text: ''
      };
      eventDispatcher.subscribe('TEST_TRIGGER2', cb);
      eventDispatcher.trigger('TEST_TRIGGER2', data);

      expect(data.text).toEqual('TEXT_MODIFIED_IN_CB');
      expect(eventDispatcher.hasSubscriber('TEST_TRIGGER2', cb)).toBeTrue();
    });

    it('should pass multiple args to a subscriber', function() {
      const data1 = {};
      const data2 = {};
      const data3 = {};

      const cb = function(args: any[]) {
        expect(args[0]).toEqual(data1);
        expect(args[1]).toEqual(data2);
        expect(args[2]).toEqual(data3);
      };

      eventDispatcher.subscribe('TEST_TRIGGER3', cb);
      eventDispatcher.trigger('TEST_TRIGGER3', [data1, data2, data3]);
      expect(eventDispatcher.hasSubscriber('TEST_TRIGGER3', cb)).toBeTrue();
    });
  });

  describe('#once', function() {
    it('should remove a subscriber after one event occurrence', function() {
      const cb = (appliedData: any) => { appliedData.text = 'TEXT_MODIFIED_IN_CB'};
      const data = {
        text: ''
      };
      eventDispatcher.once('TEST_ONCE', cb);
      eventDispatcher.trigger('TEST_ONCE', data);

      expect(data.text).toEqual('TEXT_MODIFIED_IN_CB');
      expect(eventDispatcher.hasSubscriber('TEST_ONCE', cb)).toBeFalse();
    });
  });
});
