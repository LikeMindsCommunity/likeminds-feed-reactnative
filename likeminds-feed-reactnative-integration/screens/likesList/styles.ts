import STYLES from "../../constants/Styles";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    flex: 1,
  },
  loaderView: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 30,
  },
});
