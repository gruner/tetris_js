import { ThemeLoader } from "./theme-loader";
import { iTheme } from "./theme";

describe('ThemeLoader', function() {

  let themeLoader: ThemeLoader;

  beforeEach(function() {
    const config: iTheme[] = [
      {
        playfield: {color: "#001"},
        ghostPiece: {color: "#112"},
        tetrominos: {
          i: {color: "#223"},
          j: {color: "#334"}
        }
      }
    ];

    // extended
    config.push({
      parent: config[0],
      ghostPiece: {color: "#445"},
      tetrominos: {
        i: {color: "#556"}
      }
    });

    themeLoader = new ThemeLoader(config);
  });

  describe('#getTheme', function() {
    it('should return default theme', function() {
      const theme = themeLoader.getTheme(0);
      expect(theme.playfield.color).toEqual('#001');
      expect(theme.ghostPiece.color).toEqual("#112");
      expect(theme.tetrominos.i.color).toEqual('#223');
    });
  });

  describe('#getTheme with no arguments', function() {
    it('should return first theme', function() {
      const theme = themeLoader.getTheme();
      expect(theme.playfield.color).toEqual('#001');
      expect(theme.ghostPiece.color).toEqual("#112");
      expect(theme.tetrominos.i.color).toEqual('#223');
    });
  });

  describe('#getTheme with non-existing index', function() {
    it('should return hard-coded defaults', function() {
      const theme = themeLoader.getTheme(100);
      expect(theme.playfield.color).toEqual('#001');
      expect(theme.tetrominos.i.color).toEqual('#223');
    });
  });

  describe('#extendThemeConfig', function() {
    it('should return extended theme', function() {
      const theme = themeLoader.getTheme(1);
      expect(theme.playfield.color).toEqual('#001');
      expect(theme.tetrominos.i.color).toEqual('#556');
      expect(theme.tetrominos.j.color).toEqual('#334');
      expect(theme.ghostPiece.color).toEqual('#445');
    });
  });
});