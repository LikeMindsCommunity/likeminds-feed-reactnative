import { StyleSheet } from "react-native";
import STYLES from "../../../constants/Styles";

// default link preview style
export const styles = StyleSheet.create({
  postMedia: {
    width: "100%",
    paddingHorizontal: 15,
  },
  previewContainer: {
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  previewTitle: {
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    fontWeight: "500",
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontSize: 16,
  },
  previewDescription: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    paddingVertical: 2,
    opacity: 0.8,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  previewLink: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontSize: 12,
    opacity: 0.7,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  previewDetailView: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  cancelButtonView: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  previewImageView: {
    borderRadius: 8,
    width: "100%",
  },
  cancelButton: {
    borderWidth: 0,
    backgroundColor: "transparent",
  },
});
