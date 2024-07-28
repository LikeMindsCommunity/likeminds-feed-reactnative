import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";

// default button style
export const defaultStyles = StyleSheet.create({
  buttonViewStyle: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.LIGHT
      : STYLES.$BACKGROUND_COLORS.DARK,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonTextStyle: {
    fontSize: 16,
  },
});
