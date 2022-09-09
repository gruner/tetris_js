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
  getTetrominoStyle(type: string): iThemedElement {
    return this._theme.tetrominos[type]
      ? this._theme.tetrominos[type]
      : {color: 'magenta'};
  }
};