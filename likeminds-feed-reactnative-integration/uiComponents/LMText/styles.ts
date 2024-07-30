import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";

// default text style
export const defaultStyles = StyleSheet.create({
  textStyle: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    fontSize: 14,
    textAlign: "auto",
    fontStyle: "normal",
  },
});
