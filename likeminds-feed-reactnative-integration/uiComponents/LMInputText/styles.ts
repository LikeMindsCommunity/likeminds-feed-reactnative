import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";

// default inputText style
export const defaultStyles = StyleSheet.create({
  textInput: {
    margin: 10,
    shadowRadius: 5,
    elevation: 8,
    borderRadius: 10,
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInputWithRightIcon: {
    width: "90%",
    fontSize: 14,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
  },
  textInputWithoutRightIcon: {
    width: "100%",
    fontSize: 14,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
  },
  rightIconButton: {
    borderWidth: 0,
  },
});
