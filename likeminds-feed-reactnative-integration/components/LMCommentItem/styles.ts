import { StyleSheet } from "react-native";
import layout from "../../constants/Layout";
import STYLES from "../../constants/Styles";

// default commentItem style
export const styles = StyleSheet.create({
  iconSize: {
    width: layout.normalize(22),
    height: layout.normalize(22),
    resizeMode: "contain",
  },
  alignRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dotImageSize: {
    width: layout.normalize(5),
    height: layout.normalize(5),
    marginHorizontal: 7,
    resizeMode: "contain",
  },
  commentUserName: {
    fontWeight: "500",
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    paddingTop: 12,
    paddingBottom: 4,
  },
  defaultTimeStyle: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontSize: 13,
  },
  parentLevelCommentView: {
    paddingHorizontal: 15,
    width: layout.window.width,
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    borderBottomWidth: 1,
    marginVertical: 1,
    borderBottomColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
  },
  commentContentView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentTextView: { width: "85%" },
  threeDotButton: { borderWidth: 0 },
  commentFooterView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    paddingTop: 6,
    alignItems: "center",
  },
  likeTextButton: { borderWidth: 0, marginRight: 4 },
  likeIconButton: { borderWidth: 0, marginRight: 4 },
  replyTextStyle: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    marginRight: 4,
  },
  replyTextButton: { borderWidth: 0 },
  repliesCountTextButton: { borderWidth: 0 },
  repliesView: { marginLeft: 30 },
  showMoreView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentPageNumberText: {
    fontSize: 12,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  loaderView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    marginBottom: 20,
  },
  viewMoreButton: {
    borderWidth: 0,
    alignSelf: "flex-start",
  },
  rowAlignment: { flexDirection: "row", alignItems: "center" },
  showMoreText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
});
