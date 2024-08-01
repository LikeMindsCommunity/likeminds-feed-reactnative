import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";

export const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
  },
});
