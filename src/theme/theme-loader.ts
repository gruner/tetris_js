import { iTheme, Theme } from "./theme";
import { DeepExtend } from "../util/extend";

export class ThemeLoader {
  config: iTheme[];

  private themeIndex = 0;

  constructor(config: iTheme[]) {
    this.config = config;
  }

  /**
   * Returns config object for the indexed theme if it exists
   */
  getThemeConfig(themeIndex: number): iTheme {
    if (themeIndex > this.config.length) {
      themeIndex = 0;
    }

    return this.extendThemeConfig(this.config[themeIndex]);
  }

  /**
   * If a theme config specifies a parent, get the parent config and merge the values
   */
  extendThemeConfig(themeConfig: iTheme): iTheme {
    if (themeConfig && themeConfig.parent) {
      themeConfig = DeepExtend(DeepExtend({}, themeConfig.parent), themeConfig);
    }
  
    return themeConfig;
  }

  /**
   * Returns a fully configured theme instance
   */
  getTheme(themeIndex: number = 0): Theme {
    this.themeIndex = themeIndex;
    return new Theme(this.getThemeConfig(themeIndex));
  }

  getNextTheme(): Theme {
    this.themeIndex++;
    if (this.themeIndex > this.config.length) {
      this.themeIndex = 0;
    }
    return this.getTheme(this.themeIndex);
  }
}
