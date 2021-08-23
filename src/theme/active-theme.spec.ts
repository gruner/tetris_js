import { ActiveTheme } from "./active-theme";
import { Theme } from "./theme";

describe('ActiveTheme', function() {
  let activeTheme: ActiveTheme;

  beforeEach(() => {
    activeTheme = new ActiveTheme(new Theme());
  });

  describe('#getTetrominoStyle', function() {
    it('should return valid object', function() {
      const style = activeTheme.getTetrominoStyle('o');
      expect(style.color).toBeTruthy();
    });

    it('should return valid object from bad input', function() {
        const style = activeTheme.getTetrominoStyle('NO_EXIST');
        expect(style.color).toBeTruthy();
      });
  });
});
