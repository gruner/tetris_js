import { Debug } from "./debug";

describe('Debug', function() {
  describe('#enable', function() {
    it('should have a single shared instance', function() {
      Debug.enable();
      // var debug2 = require('../js/debug');

      expect(Debug.enabled()).toBeTrue();
      // assert(debug2.enabled());

      Debug.disable();

      // assert(false === debug.enabled());
      // assert(false === debug2.enabled());

      expect(Debug.enabled()).toBeFalse();
    });
  });
});
