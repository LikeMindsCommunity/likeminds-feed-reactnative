import { StyleSheet } from "react-native";
import STYLES from "../../../constants/Styles";
import layout from "../../../constants/Layout";

// default LMDocument style
export const styles = StyleSheet.create({
  postMedia: {
    width: "100%",
  },
  docView: {
    flexDirection: "row",
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    borderWidth: 1,
    marginHorizontal: 15,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 5,
    height: 70,
    alignItems: "center",
  },
  pdfIcon: {
    width: 28,
    height: 36,
  },
  alignRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  docTitle: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontSize: 16,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    fontWeight: "500",
  },
  docDetail: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontSize: 13,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  dotImageSize: {
    width: layout.normalize(5),
    height: layout.normalize(5),
    marginHorizontal: 5,
    tintColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
  },
  showMoreText: {
    fontSize: 16,
    color: STYLES.$COLORS.PRIMARY,
  },
  documentDetailView: {
    marginLeft: 12,
    width: "90%",
    height: 36,
  },
  detailViewWithCancelOption: {
    marginLeft: 12,
    width: "72%",
    height: 36,
  },
  cancelButton: {
    marginLeft: 30,
    borderWidth: 0,
  },
  showMoreView: { paddingHorizontal: 15, marginTop: 8 },
});
