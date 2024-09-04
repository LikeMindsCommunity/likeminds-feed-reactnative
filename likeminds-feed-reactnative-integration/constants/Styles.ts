import { Platform } from "react-native";
import { PollStyles } from "./types";

interface FontTypes {
  fontFamilyLight?: string;
  fontFamilyMedium?: string;
  fontFamilySemiBold?: string;
  fontFamilyBold?: string;
  fontFamilyBlack?: string;
}

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
  fontTypes?: FontTypes;
  shouldHideSeparator?: boolean;
}

interface LMFeedStylesProps {
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
  fontTypes?: {
    LIGHT?: string;
    MEDIUM?: string;
    SEMI_BOLD?: string;
    BOLD?: string;
    BLACK?: string;
  };
  shouldHideSeparator?: boolean;
}

const isIOS = Platform.OS === "ios";

export class LMFeedStyles {
  public $IS_DARK_THEME: boolean;
  public $SHOULD_HIDE_SEPARATOR: boolean;
  public $HUE: number;
  public $COLORS: {
    PRIMARY: string;
    SECONDARY: string;
    TERTIARY: string;
    MSG: string;
    FONT_PRIMARY: string;
    JOINED_BTN: string;
    WHITE: string;
    BLACK: string;
    THEME: string;
    TEXT_COLOR: string;
    LIGHT_GREY: string;
    RED: string;
    REPORT_RED: string;
    whiteTextColor: string;
    darkTextColor: string;
    lightGreyTextColor: string;
    darkGreyTextColor: string;
  };
  public $FONT_SIZES: Record<string, number>;
  public $FONT_WEIGHT: Record<string, string>;
  public $FONT_TYPES: {
    LIGHT?: string;
    MEDIUM?: string;
    SEMI_BOLD?: string;
    BOLD?: string;
    BLACK?: string;
  };
  public $BACKGROUND_COLORS: Record<string, string>;
  public $TEXT_COLOR: Record<string, string>;
  public $SHADOWS: Record<string, string>;
  public $MARGINS: Record<string, number>;
  public $PADDINGS: Record<string, number>;
  public $AVATAR: { WIDTH: number; HEIGHT: number; BORDER_RADIUS: number };
  public $ALIGN_ROW: Record<string, any>;
  public $TEXTVIEW_WIDTH: Record<string, number>;
  public $STATUS_BAR_STYLE: Record<string, string>;
  public $LMLoaderSizeiOS: number;
  public $LMLoaderSizeAndroid: number;
  public $POLL_STYLES: PollStyles;

  constructor({
    hue = 244,
    fontColor = "hsl(244, 75%, 59%)",
    primaryColor = "hsl(244, 75%, 59%)",
    secondaryColor = "hsl(240, 64%, 91%)",
    lightBackgroundColor = "#ffffff",
    isDarkTheme = false,
    primaryDarkTextColor = "#ffffff",
    secondaryDarkTextColor = "grey",
    primaryLightTextColor = "#000000",
    secondaryLightTextColor = "grey",
    fontTypes = {
      LIGHT: isIOS ? "Helvetica" : "Roboto",
      MEDIUM: isIOS ? "Helvetica" : "Roboto",
      SEMI_BOLD: isIOS ? "Helvetica" : "Roboto",
      BOLD: isIOS ? "Helvetica" : "Roboto",
      BLACK: isIOS ? "Helvetica" : "Roboto",
    },
    shouldHideSeparator = false,
  }: LMFeedStylesProps = {}) {
    this.$IS_DARK_THEME = isDarkTheme;
    this.$SHOULD_HIDE_SEPARATOR = shouldHideSeparator;
    this.$HUE = hue;
    this.$COLORS = {
      PRIMARY: primaryColor,
      SECONDARY: secondaryColor,
      TERTIARY: "#ffffff",
      MSG: "#777e8e",
      FONT_PRIMARY: fontColor,
      JOINED_BTN: lightBackgroundColor,
      WHITE: "#ffffff",
      BLACK: "#000000",
      THEME: "#5046E5",
      TEXT_COLOR: "#484F67",
      LIGHT_GREY: "#e0e0e0",
      RED: "#ff0000",
      REPORT_RED: "#FB1609",
      whiteTextColor: "#ffffff",
      darkTextColor: "#000000",
      lightGreyTextColor: "#00000077",
      darkGreyTextColor: "#00000099",
    };
    this.$FONT_SIZES = {
      XS: 10,
      SMALL: 12,
      REGULAR: 13,
      MEDIUM: 14,
      LARGE: 16,
      XL: 18,
      XXL: 20,
    };
    this.$FONT_WEIGHT = {
      LIGHT: "300",
      REGULAR: "400",
      MEDIUM: "500",
      BOLD: "600",
      BOLDER: "700",
    };
    this.$FONT_TYPES = fontTypes;
    this.$BACKGROUND_COLORS = {
      LIGHT: "#ffffff",
      DARK: "#000000",
      DARKTRANSPARENT: "#00000088",
    };
    this.$TEXT_COLOR = {
      PRIMARY_TEXT_LIGHT: primaryLightTextColor,
      SECONDARY_TEXT_LIGHT: secondaryLightTextColor,
      PRIMARY_TEXT_DARK: primaryDarkTextColor,
      SECONDARY_TEXT_DARK: secondaryDarkTextColor,
    };
    this.$SHADOWS = {
      LIGHT: "0 5px 10px rgba(0, 0, 0, 0.1)",
      MEDIUM: "0 8px 30px rgba(0, 0, 0, 0.3)",
      HEAVY: "0 30px 60px rgba(0, 0, 0, 0.6)",
    };
    this.$MARGINS = {
      XS: 5,
      SMALL: 10,
      MEDIUM: 15,
      LARGE: 20,
      XL: 25,
    };
    this.$PADDINGS = {
      XS: 5,
      SMALL: 10,
      MEDIUM: 15,
      LARGE: 20,
      XL: 25,
    };
    this.$AVATAR = {
      WIDTH: 50,
      HEIGHT: 50,
      BORDER_RADIUS: 25,
    };
    this.$ALIGN_ROW = {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    };
    this.$TEXTVIEW_WIDTH = {
      REGULAR: 240,
    };
    this.$STATUS_BAR_STYLE = {
      default: "default",
      "dark-content": "dark-content",
      "light-content": "light-content",
    };
    this.$LMLoaderSizeiOS = 10;
    this.$LMLoaderSizeAndroid = 25;
    this.$POLL_STYLES = {};
  }

  public setTheme(themeProps: StylesProps) {
    this.$SHOULD_HIDE_SEPARATOR =
      themeProps.shouldHideSeparator ?? this.$SHOULD_HIDE_SEPARATOR;
    this.$COLORS = {
      ...this.$COLORS,
      PRIMARY: themeProps.primaryColor ?? this.$COLORS.PRIMARY,
      SECONDARY: themeProps.secondaryColor ?? this.$COLORS.SECONDARY,
      FONT_PRIMARY: themeProps.fontColor ?? this.$COLORS.FONT_PRIMARY,
      JOINED_BTN: themeProps.lightBackgroundColor ?? this.$COLORS.JOINED_BTN,
    };
    this.$FONT_TYPES = {
      ...this.$FONT_TYPES,
      LIGHT: themeProps.fontTypes?.fontFamilyLight ?? this.$FONT_TYPES.LIGHT,
      MEDIUM: themeProps.fontTypes?.fontFamilyMedium ?? this.$FONT_TYPES.MEDIUM,
      SEMI_BOLD:
        themeProps.fontTypes?.fontFamilySemiBold ?? this.$FONT_TYPES.SEMI_BOLD,
      BOLD: themeProps.fontTypes?.fontFamilyBold ?? this.$FONT_TYPES.BOLD,
      BLACK: themeProps.fontTypes?.fontFamilyBlack ?? this.$FONT_TYPES.BLACK,
    };
    this.$IS_DARK_THEME = themeProps.isDarkTheme ?? this.$IS_DARK_THEME;
    this.$HUE = themeProps.hue ?? this.$HUE;
    this.$TEXT_COLOR.PRIMARY_TEXT_DARK =
      themeProps.primaryDarkTextColor ?? this.$TEXT_COLOR.PRIMARY_TEXT_DARK;
    this.$TEXT_COLOR.SECONDARY_TEXT_DARK =
      themeProps.secondaryDarkTextColor ?? this.$TEXT_COLOR.SECONDARY_TEXT_DARK;
    this.$TEXT_COLOR.PRIMARY_TEXT_LIGHT =
      themeProps.primaryLightTextColor ?? this.$TEXT_COLOR.PRIMARY_TEXT_LIGHT;
    this.$TEXT_COLOR.SECONDARY_TEXT_LIGHT =
      themeProps.secondaryLightTextColor ??
      this.$TEXT_COLOR.SECONDARY_TEXT_LIGHT;
  }

  public setPollStyles(pollStyles: PollStyles) {
    this.$POLL_STYLES = {
      ...pollStyles,
    };
  }
}

export const STYLES = new LMFeedStyles();

export default STYLES;
