import { StyleSheet } from "react-native";
import STYLES from "../../../constants/Styles";

// default post content style
export const styles = StyleSheet.create({
  contentText: {
    fontSize: 16,
    fontWeight: "400",
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    lineHeight: 20,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#007AFF",
    lineHeight: 20,
  },
  showMoreText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
  },
});
