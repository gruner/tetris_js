
import { TetrominoType } from "../models/tetromino-types";
import { ActiveTheme } from "./active-theme";
import { Theme } from "./theme";

describe('ActiveTheme', function() {
  let activeTheme: ActiveTheme;

  beforeEach(() => {
    activeTheme = new ActiveTheme(new Theme());
  });

  describe('#getTetrominoStyle', function() {
    it('should return valid object', function() {
      const style = activeTheme.getTetrominoStyle(TetrominoType.o);
      expect(style.color).toBeTruthy();
    });
  });
});
