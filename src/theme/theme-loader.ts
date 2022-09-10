import { iTheme, Theme } from "./theme";
import { DeepExtend } from "../util/extend";

export class ThemeLoader {
  config: { [index:string] : iTheme };

  constructor(config: { [index:string] : iTheme }) {
    this.config = config;
  }

  /**
   * Returns config object for the named theme if it exists
   */
  getThemeConfig(themeName: string) {
    if (this.config.hasOwnProperty(themeName)) {
      return this.extendThemeConfig(this.config[themeName]);
    } else {
      return {};
    }
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
  getTheme(themeName: string = Theme.Default) {
    return new Theme(this.getThemeConfig(themeName));
  }
}
