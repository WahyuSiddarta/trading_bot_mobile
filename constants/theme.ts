/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColor = "#22C986";
const backgroundColor = "#030712";
const secondaryBackgroundColor = "#0b1729";
const surfaceColor = "#07111f";
const elevatedSurfaceColor = "#0b1729";
const textColor = "#e5fff0";
const mutedColor = "#7d93a5";
const borderColor = "#123047";
const dangerColor = "#F66F89";
const dangerSurfaceColor = "#3A0B18";
const dangerForegroundColor = "#FFE4E9";
const warningColor = "#F4B740";
const warningSurfaceColor = "#251B0A";
const warningForegroundColor = "#FFF3C4";

export const Colors = {
  light: {
    text: textColor,
    background: backgroundColor,
    secondaryBackgroundColor: secondaryBackgroundColor,
    tint: tintColor,
    icon: mutedColor,
    tabIconDefault: mutedColor,
    tabIconSelected: tintColor,
    surface: surfaceColor,
    surfaceElevated: elevatedSurfaceColor,
    border: borderColor,
    danger: dangerColor,
    dangerSurface: dangerSurfaceColor,
    dangerForeground: dangerForegroundColor,
    warning: warningColor,
    warningSurface: warningSurfaceColor,
    warningForeground: warningForegroundColor,
  },
  dark: {
    text: textColor,
    background: backgroundColor,
    secondaryBackgroundColor: secondaryBackgroundColor,
    tint: tintColor,
    icon: mutedColor,
    tabIconDefault: mutedColor,
    tabIconSelected: tintColor,
    surface: surfaceColor,
    surfaceElevated: elevatedSurfaceColor,
    border: borderColor,
    danger: dangerColor,
    dangerSurface: dangerSurfaceColor,
    dangerForeground: dangerForegroundColor,
    warning: warningColor,
    warningSurface: warningSurfaceColor,
    warningForeground: warningForegroundColor,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
