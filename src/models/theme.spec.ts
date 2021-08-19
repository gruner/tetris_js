import { iTheme, Theme } from "./theme";

describe('Theme', function() {
  const themeConfig: iTheme = {
    playfield: {color: "-PLAYFIELD-"},
    ghostPiece: {color: "-GHOST-"},
    tetrominos: {
      i: {color: "-TI-"},
      j: {color: "-TJ-"}
    }
  };

  describe('#constructor', function() {
    it('should create theme by merging given config options', function() {
      var theme = new Theme(themeConfig);
      expect(theme.playfield.color).toEqual('-PLAYFIELD-');
      expect(theme.ghostPiece.color).toEqual('-GHOST-');
      expect(theme.name).toEqual(Theme.Default);
      expect(theme.tetrominos.i.color).toEqual('-TI-');
      expect(theme.tetrominos.j.color).toEqual('-TJ-');
      expect(theme.tetrominos.z.color).toEqual('magenta');
    });
  });
});
