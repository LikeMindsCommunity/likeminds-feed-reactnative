import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  uploadingPostContentView: { flexDirection: "row", alignItems: "center" },
  uploadingVideoStyle: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
  },
  uploadingImageStyle: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
  },
  uploadingDocumentStyle: { marginRight: 2, resizeMode: "contain" },
  postUploadingText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    marginLeft: 10,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    fontWeight: 'bold'
  },
  newPostButtonView: {
    backgroundColor: STYLES.$COLORS.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    padding: STYLES.$PADDINGS.SMALL,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 25,
    position: "absolute",
    bottom: Layout.normalize(40),
    right: 20,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2.5,
      height: 2.5,
    },
  },
  newPostText: {
    fontSize: 14,
    fontWeight: STYLES.$FONT_WEIGHT.MEDIUM,
    color: STYLES.$COLORS.WHITE_TEXT_COLOR,
    fontFamily: STYLES.$FONT_TYPES.BOLD,
    marginLeft: STYLES.$MARGINS.SMALL,
  },
  postUploadingView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    alignItems: "center",
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    borderBottomWidth: 11,
    borderBottomColor: STYLES.$IS_DARK_THEME
      ? STYLES.$SEPARATOR_COLORS.DARK
      : STYLES.$SEPARATOR_COLORS.LIGHT,
      paddingVertical: 10
  },
  justifyCenter: {
    flexDirection: "row",
    padding: STYLES.$PADDINGS.MEDIUM,
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  uploadingImageVideoBox: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    width: 49,
    height: 42,
    marginRight: 10,
  },
  uploadingPdfIconSize: {
    width: 45,
    height: 32,
  },
  loaderView: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 30,
  },
  noDataView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  newPostButtonEnable: {
    opacity: 1,
  },
  newPostButtonDisable: {
    opacity: 0.8,
  },
  newPostButtonIcon: {
    width: 30,
    height: 30,
  },
});
