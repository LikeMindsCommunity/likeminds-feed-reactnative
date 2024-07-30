import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    elevation: 8,
    paddingVertical: STYLES.$PADDINGS.SMALL,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  textHeading: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontWeight: STYLES.$FONT_WEIGHT.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    marginVertical: STYLES.$MARGINS.SMALL,
    paddingHorizontal: STYLES.$PADDINGS.MEDIUM,
  },
  btnText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  reasonsBtn: {
    borderRadius: 16,
    padding: 8,
    borderWidth: 2,
    width: 12,
    height: 12,
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedReasonBtn: {
    borderRadius: 16,
    width: 10,
    height: 10,
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  radioBtnView: {
    width: "15%",
    alignItems: "center",
  },
  reasonTextView: {
    borderBottomWidth: 1,
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    width: "84%",
    paddingVertical: 18,
  },
  selectedReasonView: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
  },
  defaultReasonView: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
  },
});

export default styles;
