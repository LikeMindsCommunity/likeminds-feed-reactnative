interface StylesProps {
  hue?: number;
  fontColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  lightBackgroundColor?: string;
}

export class STYLES {
  static $COLORS = {
    PRIMARY: "hsl(222, 53%, 15%)",
    SECONDARY: "hsl(222, 47%, 31%)",
    TERTIARY: "#ffffff",
    MSG: "#777e8e",
    FONT_PRIMARY: "hsl(222, 53%, 15%)",
    JOINED_BTN: "hsl(222, 22%, 93%)",
    LIGHT_BLUE: "#0276fa",
    SELECTED_BLUE: "hsl(222, 64%, 95%)",
    SELECTED_CHAT_BUBBLE: "hsl(222, 67%, 91%)",
    RED: "red",
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
  static $FONT_WEIGHTS = {
    LIGHT: "200" as const,
    MEDIUM: "500" as const,
    BOLD: "700" as const,
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
  };
  static $PADDINGS = {
    SMALL: 10,
    MEDIUM: 15,
    LARGE: 20,
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
  static setTheme({
    hue,
    fontColor,
    primaryColor,
    secondaryColor,
    lightBackgroundColor,
  }: StylesProps) {
    STYLES.$COLORS = {
      ...STYLES.$COLORS,
      PRIMARY: primaryColor
        ? primaryColor
        : `hsl( ${hue ? hue : 222}, 53%, 15%)`,
      SECONDARY: secondaryColor
        ? secondaryColor
        : `hsl(${hue ? hue : 222}, 47%, 31%)`,
      FONT_PRIMARY: fontColor ? fontColor : `hsl(${hue ? hue : 222}, 53%, 15%)`,
      JOINED_BTN: lightBackgroundColor
        ? lightBackgroundColor
        : `hsl(${hue ? hue : 222}, 22%, 93%)`,
      SELECTED_BLUE: `hsl(${hue ? hue : 222}, 64%, 95%)`,
    };
  }
}

export default STYLES;
