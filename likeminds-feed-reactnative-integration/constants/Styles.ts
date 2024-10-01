import { Platform } from "react-native";
import { PollStyles } from "./types";
import {
  CarouselScreenStyle,
  CreatePollStyle,
  CreatePostStyleProps,
  LoaderStyleProps,
  NotificationFeedStyleProps,
  PollStyle,
  PostDetailStyleProps,
  PostLikesListStyleProps,
  PostListStyleProps,
  TopicsStyle,
  UniversalFeedStyleProps,
} from "../lmFeedProvider/types";

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
  isDarkTheme?: boolean;
  primaryDarkTextColor?: string;
  secondaryDarkTextColor?: string;
  primaryLightTextColor?: string;
  secondaryLightTextColor?: string;
  fontTypes?: FontTypes;
  lightThemeBackgroundColor?: string;
  darkThemeBackgroundColor?: string;
  darkTransparentBackgroundColor?: string;
  lightThemeSeparatorColor?: string;
  darkThemeSeparatorColor?: string;
}

interface LMFeedStylesProps {
  hue?: number;
  fontColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
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
  lightThemeBackgroundColor?: string;
  darkThemeBackgroundColor?: string;
}

const isIOS = Platform.OS === "ios";

export class LMFeedTheme {
  public $IS_DARK_THEME: boolean;
  public $HUE: number;
  public $COLORS: {
    PRIMARY: string;
    SECONDARY: string;
    TERTIARY: string;
    MSG: string;
    FONT_PRIMARY: string;
    WHITE: string;
    BLACK: string;
    TEXT_COLOR: string;
    LIGHT_GREY: string;
    RED: string;
    REPORT_RED: string;
    WHITE_TEXT_COLOR: string;
  };
  public $FONT_SIZES: {
    XS?: number;
    SMALL?: number;
    REGULAR?: number;
    MEDIUM?: number;
    LARGE?: number;
    XL?: number;
    XXL?: number;
  };
  public $FONT_WEIGHT: {
    LIGHT?: "100" | "200" | "300" | "light" | "ultralight";
    REGULAR?: "400" | "normal";
    MEDIUM?: "500" | "medium";
    BOLD?: "600" | "700" | "bold";
    BOLDER?: "800" | "900" | "bolder";
  };
  public $FONT_TYPES: {
    LIGHT?: string;
    MEDIUM?: string;
    SEMI_BOLD?: string;
    BOLD?: string;
    BLACK?: string;
  };
  public $BACKGROUND_COLORS: {
    LIGHT?: string;
    DARK?: string;
    DARK_TRANSPARENT?: string;
  };
  public $SEPARATOR_COLORS: {
    LIGHT?: string;
    DARK?: string;
  };
  public $TEXT_COLOR: {
    PRIMARY_TEXT_LIGHT?: string;
    SECONDARY_TEXT_LIGHT?: string;
    PRIMARY_TEXT_DARK?: string;
    SECONDARY_TEXT_DARK?: string;
  };
  public $SHADOWS: {
    LIGHT?: string;
    MEDIUM?: string;
    HEAVY?: string;
  };
  public $MARGINS: {
    XS?: number;
    SMALL?: number;
    MEDIUM?: number;
    LARGE?: number;
    XL?: number;
  };
  public $PADDINGS: {
    XS?: number;
    SMALL?: number;
    MEDIUM?: number;
    LARGE?: number;
    XL?: number;
  };
  public $AVATAR: {
    WIDTH: number;
    HEIGHT: number;
    BORDER_RADIUS: number;
  };
  public $ALIGN_ROW: {
    display?: string;
    flexDirection?: string;
    alignItems?: string;
  };
  public $TEXTVIEW_WIDTH: {
    REGULAR?: number;
  };
  public $STATUS_BAR_STYLE: {
    default?: string;
    "dark-content"?: string;
    "light-content"?: string;
  };
  public $LMLoaderSizeiOS: number;
  public $LMLoaderSizeAndroid: number;

  public $POLL_STYLE: PollStyle;
  public $UNIVERSAL_FEED_STYLE: UniversalFeedStyleProps;
  public $POST_LIST_STYLE: PostListStyleProps;
  public $LOADER_STYLE: LoaderStyleProps;
  public $POST_DETAIL_STYLE: PostDetailStyleProps;
  public $CREATE_POST_STYLE: CreatePostStyleProps;
  public $POST_LIKES_LIST_STYLE: PostLikesListStyleProps;
  public $NOTIFICATION_FEED_STYLE: NotificationFeedStyleProps;
  public $TOPICS_STYLE: TopicsStyle;
  public $CAROUSEL_SCREEN_STYLE: CarouselScreenStyle;
  public $CREATE_POLL_STYLE: CreatePollStyle;

  constructor({
    hue = 244,
    fontColor = "hsl(244, 75%, 59%)",
    primaryColor = "hsl(244, 75%, 59%)",
    secondaryColor = "hsl(240, 64%, 91%)",
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
    lightThemeBackgroundColor = "#ffffff",
    darkThemeBackgroundColor = "#000000",
  }: LMFeedStylesProps = {}) {
    this.$IS_DARK_THEME = isDarkTheme;
    this.$HUE = hue;
    this.$COLORS = {
      PRIMARY: primaryColor,
      SECONDARY: secondaryColor,
      TERTIARY: "#ffffff",
      MSG: "#777e8e",
      FONT_PRIMARY: fontColor,
      WHITE: "#ffffff",
      BLACK: "#000000",
      TEXT_COLOR: "#484F67",
      LIGHT_GREY: "#e0e0e0",
      RED: "#ff0000",
      REPORT_RED: "#FB1609",
      WHITE_TEXT_COLOR: "#ffffff",
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
      BOLD: "bold",
      BOLDER: "800",
    };
    this.$FONT_TYPES = fontTypes;
    this.$BACKGROUND_COLORS = {
      LIGHT: lightThemeBackgroundColor,
      DARK: darkThemeBackgroundColor,
      DARK_TRANSPARENT: "#00000088",
    };
    this.$SEPARATOR_COLORS = {
      LIGHT: "#f3f5fa",
      DARK: "#121212",
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
    this.$POLL_STYLE = {};
    this.$UNIVERSAL_FEED_STYLE = {};
    this.$POST_LIST_STYLE = {};
    this.$LOADER_STYLE = {};
    this.$POST_DETAIL_STYLE = {};
    this.$CREATE_POST_STYLE = {};
    this.$POST_LIKES_LIST_STYLE = {};
    this.$NOTIFICATION_FEED_STYLE = {};
    this.$TOPICS_STYLE = {};
    this.$CAROUSEL_SCREEN_STYLE = {};
    this.$CREATE_POLL_STYLE = {};
  }

  public setTheme(themeProps: StylesProps) {
    this.$COLORS = {
      ...this.$COLORS,
      PRIMARY: themeProps.primaryColor ?? this.$COLORS.PRIMARY,
      SECONDARY: themeProps.secondaryColor ?? this.$COLORS.SECONDARY,
      FONT_PRIMARY: themeProps.fontColor ?? this.$COLORS.FONT_PRIMARY,
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
    this.$BACKGROUND_COLORS.LIGHT =
      themeProps.lightThemeBackgroundColor ?? this.$BACKGROUND_COLORS.LIGHT;
    this.$BACKGROUND_COLORS.DARK =
      themeProps.darkThemeBackgroundColor ?? this.$BACKGROUND_COLORS.DARK;
    this.$SEPARATOR_COLORS.LIGHT =
      themeProps.lightThemeSeparatorColor ?? this.$SEPARATOR_COLORS.LIGHT;
    this.$SEPARATOR_COLORS.DARK =
      themeProps.darkThemeSeparatorColor ?? this.$SEPARATOR_COLORS.DARK;
    this.$BACKGROUND_COLORS.DARK_TRANSPARENT =
      themeProps?.darkTransparentBackgroundColor ??
      this.$BACKGROUND_COLORS.DARK_TRANSPARENT;
  }

  public setPollStyle(pollStyles: PollStyle) {
    this.$POLL_STYLE = {
      ...pollStyles,
    };
  }

  public setUniversalFeedStyles(universalFeedStyles: UniversalFeedStyleProps) {
    this.$UNIVERSAL_FEED_STYLE = {
      ...universalFeedStyles,
    };
  }

  public setPostListStyles(postListStyles: PostListStyleProps) {
    this.$POST_LIST_STYLE = {
      ...postListStyles,
    };
  }

  public setLoaderStyles(loaderStyles: LoaderStyleProps) {
    this.$LOADER_STYLE = {
      ...loaderStyles,
    };
  }

  public setPostDetailStyles(postDetailStyles: PostDetailStyleProps) {
    this.$POST_DETAIL_STYLE = {
      ...postDetailStyles,
    };
  }

  public setCreatePostStyles(createPostStyles: CreatePostStyleProps) {
    this.$CREATE_POST_STYLE = {
      ...createPostStyles,
    };
  }

  public setPostLikesListStyles(postLikesListStyles: PostLikesListStyleProps) {
    this.$POST_LIKES_LIST_STYLE = {
      ...postLikesListStyles,
    };
  }

  public setNotificationFeedStyles(
    notificationFeedStyles: NotificationFeedStyleProps
  ) {
    this.$NOTIFICATION_FEED_STYLE = {
      ...notificationFeedStyles,
    };
  }

  public setTopicsStyles(topicsStyles: TopicsStyle) {
    this.$TOPICS_STYLE = {
      ...topicsStyles,
    };
  }

  public setCarouselScreenStyles(carouselScreenStyles: CarouselScreenStyle) {
    this.$CAROUSEL_SCREEN_STYLE = {
      ...carouselScreenStyles,
    };
  }

  public setCreatePollStyles(createPollStyles: CreatePollStyle) {
    this.$CREATE_POLL_STYLE = {
      ...createPollStyles,
    };
  }
}

export const STYLES = new LMFeedTheme();

export default STYLES;
