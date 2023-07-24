import { TetrominoType } from "@tetris/models/tetromino-types";
import { iThemedElement, Theme } from "./theme";

/**
 * Service for sharing the active theme
 */
export class ActiveTheme {

  private _theme: Theme;

  set theme(theme: Theme) {
    this._theme = theme;
  }

  get theme(): Theme {
    return this._theme;
  }

  constructor(theme: Theme) {
    this._theme = theme;
  }

  /**
   * Returns the configured theme style for the given tetromino type
   */
  getTetrominoStyle(type: TetrominoType): iThemedElement {
    return this._theme.tetrominos[type.toString()]
      ? this._theme.tetrominos[type.toString()]
      : {color: 'magenta'};
  }
};