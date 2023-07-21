import { iTheme, Theme } from "./theme";
import { DeepExtend } from "../util/extend";

export class ThemeLoader {
  config: iTheme[];

  constructor(config: iTheme[]) {
    this.config = config;
  }

  /**
   * Returns config object for the named theme if it exists
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
  getTheme(themeIndex: number = 0) {
    return new Theme(this.getThemeConfig(themeIndex));
  }
}
