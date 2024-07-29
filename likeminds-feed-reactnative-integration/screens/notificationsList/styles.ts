import STYLES from "../../constants/Styles";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  loaderView: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 30,
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
  },
});
