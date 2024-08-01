import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";

// default header style
export const defaultStyles = StyleSheet.create({
  headerViewStyle: {
    flexDirection: "row",
    borderBottomColor: "#00000011",
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  },
  backArrowSize: {
    width: 25,
    height: 25,
    tintColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.LIGHT
      : STYLES.$BACKGROUND_COLORS.DARK,
  },
  headingStyle: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 8,
    flex: 1,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  subHeadingStyle: {
    fontSize: 12,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
});
