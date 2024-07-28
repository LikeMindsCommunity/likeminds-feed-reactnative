import { StyleSheet } from "react-native";
import STYLES from "../../../constants/Styles";
import layout from "../../../constants/Layout";

// default LMPost style
export const styles = StyleSheet.create({
  mainContainer: {
    width: layout.window.width,
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    marginBottom: 10,
    paddingTop: 10,
  },
});
