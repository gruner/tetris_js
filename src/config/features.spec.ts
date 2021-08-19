import { Features } from "./features";

describe('Features', function() {

  beforeEach(function() {
    Features.set('testEnabledTrue', {desc: '', enabled: true});
    Features.set('testEnabledFalse', {desc: '', enabled: false});
  });

  describe('#enable', function() {
    it('should enable feature', function() {
      expect(Features.enabled('testEnabledFalse')).toBeFalse();
      Features.enable('testEnabledFalse');
      expect(Features.enabled('testEnabledFalse')).toBeTrue();
    });

    it('should check that feature is disabled', function() {
      expect(Features.enabled('NO_EXIST')).toBeFalse();
    });

    it('should check that feature is enabled', function() {
      expect(Features.enabled('testEnabledFalse')).toBeFalse();
      expect(Features.enabled('testEnabledTrue')).toBeTrue();
    });
  });

  describe('#set', function() {
    it('should check that feature is enabled', function() {
      Features.set('testSet', {desc: '', enabled: true});
      expect(Features.enabled('testSet')).toBeTrue();
    });
  });
});
