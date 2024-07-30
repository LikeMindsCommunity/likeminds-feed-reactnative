import { PollStyles } from "./types";

interface StylesProps {
  hue?: number;
  fontColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  lightBackgroundColor?: string;
  isDarkTheme?: boolean;
  primaryDarkTextColor?: string;
  secondaryDarkTextColor?: string;
  primaryLightTextColor?: string;
  secondaryLightTextColor?: string;
}

export class STYLES {
  static $IS_DARK_THEME = false;
  static $HUE = 244;
  static $COLORS = {
    PRIMARY: "hsl(244, 75%, 59%)",
    SECONDARY: "hsl(240, 64%, 91%)",
    TERTIARY: "#ffffff",
    MSG: "#777e8e",
    FONT_PRIMARY: "hsl(244, 75%, 59%)",
    JOINED_BTN: "hsl(222, 22%, 93%)",
    WHITE: "#ffffff",
    BLACK: "#000000",
    THEME: "#5046E5",
    TEXT_COLOR: "#484F67",
    LIGHT_GREY: "#e0e0e0",
    RED: "#ff0000",
    whiteTextColor: "#ffffff",
    darkTextColor: "#000000",
    lightGreyTextColor: "#00000077",
    darkGreyTextColor: "#00000099",
  };
  static $FONT_SIZES = {
    XS: 10,
    SMALL: 12,
    REGULAR: 13,
    MEDIUM: 14,
    LARGE: 16,
    XL: 18,
    XXL: 20,
  };
  static $FONT_WEIGHT = {
    LIGHT: "300" as const,
    REGULAR: "400" as const,
    MEDIUM: "500" as const,
    BOLD: "600" as const,
    BOLDER: "700" as const,
  };
  static $FONT_TYPES = {
    LIGHT: "SofiaPro-Light",
    MEDIUM: "SofiaPro-Medium",
    SEMI_BOLD: "SofiaPro-SemiBold",
    BOLD: "SofiaPro-Bold",
    BLACK: "SofiaPro-Black",
  };

  static $BACKGROUND_COLORS = {
    LIGHT: "#ffffff",
    DARK: "#000000",
    DARKTRANSPARENT: "#00000088",
  };

  static $TEXT_COLOR = {
    PRIMARY_TEXT_LIGHT: "#000000",
    SECONDARY_TEXT_LIGHT: "grey",
    PRIMARY_TEXT_DARK: "#ffffff",
    SECONDARY_TEXT_DARK: "grey",
  };

  static $SHADOWS = {
    LIGHT: "0 5px 10px rgba(0, 0, 0, 0.1)",
    MEDIUM: "0 8px 30px rgba(0, 0, 0, 0.3)",
    HEAVY: "0 30px 60px rgba(0, 0, 0, 0.6)",
  };
  static $MARGINS = {
    XS: 5,
    SMALL: 10,
    MEDIUM: 15,
    LARGE: 20,
    XL: 25,
  };
  static $PADDINGS = {
    XS: 5,
    SMALL: 10,
    MEDIUM: 15,
    LARGE: 20,
    XL: 25,
  };
  static $AVATAR = {
    WIDTH: 50,
    HEIGHT: 50,
    BORDER_RADIUS: 25,
  };
  static $ALIGN_ROW = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  };
  static $TEXTVIEW_WIDTH = {
    REGULAR: 240,
  };
  static $STATUS_BAR_STYLE = {
    default: "default",
    "dark-content": "dark-content",
    "light-content": "light-content",
  };
  static $LMLoaderSizeiOS: 10;
  static $LMLoaderSizeAndroid: 25;
  static $POLL_STYLES: PollStyles = {};
  static setTheme({
    hue,
    fontColor,
    primaryColor,
    secondaryColor,
    lightBackgroundColor,
    isDarkTheme,
    primaryDarkTextColor,
    secondaryDarkTextColor,
    primaryLightTextColor,
    secondaryLightTextColor,
  }: StylesProps) {
    STYLES.$COLORS = {
      ...STYLES.$COLORS,
      PRIMARY: primaryColor
        ? primaryColor
        : `hsl( ${hue ? hue : 222}, 53%, 15%)`,
      SECONDARY: secondaryColor
        ? secondaryColor
        : `hsl(${hue ? hue : 222}, 47%, 31%)`,
      FONT_PRIMARY: fontColor
        ? fontColor
        : primaryColor
        ? primaryColor
        : `hsl(${hue ? hue : 222}, 53%, 15%)`,
      JOINED_BTN: lightBackgroundColor
        ? lightBackgroundColor
        : `hsl(${hue ? hue : 222}, 22%, 93%)`,
    };
    STYLES.$IS_DARK_THEME = isDarkTheme ? isDarkTheme : false;
    STYLES.$HUE = hue ? hue : 244;
    STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK = primaryDarkTextColor
      ? primaryDarkTextColor
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK;
    STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT = primaryLightTextColor
      ? primaryLightTextColor
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT;
    STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK = secondaryDarkTextColor
      ? secondaryDarkTextColor
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK;
    STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT = secondaryLightTextColor
      ? secondaryLightTextColor
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT;
  }
}

export default STYLES;
