import { Platform, StyleSheet } from "react-native";
import Layout from "../../constants/Layout";
import STYLES from "../../constants/Styles";

export const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
  },
  mainContainer: {
    flex: 1,
    height: Layout.window.height - Layout.normalize(64),
  },
  commentCountText: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 5,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    fontWeight: "500",
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
  },
  textContainer: {
    margin: 0,
    width: "100%",
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT, // Light gray background to indicate disabled state
    padding: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  disabledText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontFamily: STYLES.$FONT_TYPES.BOLD,
    fontWeight: "bold",
    fontSize: 14,
  },
  viewMoreText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    fontWeight: "500",
    marginVertical: 24,
  },
  noCommentSection: {
    alignItems: "center",
    marginTop: 10,
    paddingBottom: Layout.window.height / 6.2,
  },
  noCommentText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    fontSize: 16,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    fontWeight: "500",
  },
  loaderView: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 30,
  },
  replyCommentSection: {
    position: "absolute",
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : "#EFEFEF",
    paddingHorizontal: 15,
    width: Layout.window.width,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2000,
  },
  crossIconStyle: {
    width: 15,
    height: 15,
    tintColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
  },
  textInputStyle: {
    margin: 0,
    borderRadius: 0,
    paddingVertical: 0,
    borderColor: STYLES?.$IS_DARK_THEME ? STYLES.$SEPARATOR_COLORS.DARK : STYLES.$SEPARATOR_COLORS.LIGHT,
    borderWidth: 1,
    height: Layout.normalize(64),
    paddingHorizontal: 15,
    fontSize: 14,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  lightGreyColorText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : "#9B9B9B",
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
  },
  taggingListView: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    borderTopWidth: 0.5,
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
  },
  taggingListItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    borderBottomWidth: 1,
  },
  taggingListProfileBoxStyle: {
    borderRadius: 50,
    marginRight: 10,
  },
  taggingListItemTextView: {
    flex: 1,
    paddingVertical: 15,
    gap: Platform.OS === "ios" ? 5 : 0,
  },
  taggingListText: {
    fontSize: 14,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  taggingLoaderView: { paddingVertical: 20 },
});
