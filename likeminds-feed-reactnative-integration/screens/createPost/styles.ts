import { Platform, StyleSheet } from "react-native";
import layout from "../../constants/Layout";
import Layout from "../../constants/Layout";
import STYLES from "../../constants/Styles";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    height: layout.window.height,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 12,
  },
  userNameText: {
    fontSize: 16,
    fontWeight: "500",
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    marginLeft: 8,
    textTransform: "capitalize",
  },
  textInputView: {
    marginHorizontal: 15,
    marginVertical: 8,
    fontSize: 16,
    elevation: 0,
    maxHeight: 220,
  },
  addMoreButtonView: {
    width: "35%",
    borderColor: STYLES.$COLORS.PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: "center",
    paddingVertical: 8,
    marginVertical: 20,
  },
  selectionOptionsView: {
    position: "absolute",
    bottom: 0,
    width: layout.window.width,
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
  },
  optionItemView: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  addMoreButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: STYLES.$COLORS.PRIMARY,
    marginLeft: 5,
  },
  selectionOptionstext: {
    marginLeft: 8,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonEnable: {
    opacity: 1,
  },
  postTextStyle: {
    color: STYLES.$COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: "500",
  },
  scrollViewStyleWithOptions: {
    flex: 1,
    marginBottom: 125,
  },
  scrollViewStyleWithoutOptions: {
    flex: 1,
    marginBottom: 0,
  },
  selectingMediaView: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    height: Layout.normalize(34),
    width: Layout.normalize(25),
    resizeMode: "contain",
    tintColor: STYLES.$COLORS.PRIMARY,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  selectingMediaText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    marginTop: 12,
  },
  rowAlignMent: { flex: 1, justifyContent: "center" },
  headerRightComponentText: {
    color: STYLES.$COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: "500",
  },
  enabledOpacity: { opacity: 1 },
  disabledOpacity: { opacity: 0.5 },
  taggingListView: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: "100%",
    position: "relative",
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    overflow: "hidden",
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
  },
  taggingLoaderView: { paddingVertical: 20 },
});
