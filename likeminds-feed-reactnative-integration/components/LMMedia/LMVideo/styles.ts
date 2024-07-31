import { StyleSheet } from "react-native";
import STYLES from "../../../constants/Styles";
import layout from "../../../constants/Layout";

// default LMVideo style
export const defaultStyles = StyleSheet.create({
  videoContainer: {
    width: layout.window.width,
    backgroundColor: STYLES.$BACKGROUND_COLORS.DARK,
  },
  videoStyle: {
    width: layout.window.width,
    height: 325,
    resizeMode: "contain",
  },
  loaderView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  errorView: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  errorText: {
    color: STYLES.$COLORS.RED,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  cancelVideoView: { position: "absolute", right: 15, top: 15, zIndex: 7000 },
  cancelButtonStyle: {
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  muteUnmuteVideoView: {
    position: "absolute",
    right: 15,
    bottom: 15,
    zIndex: 7000,
  },
  videoControllerView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  controllerZIndex: {
    zIndex: 5000,
  },
  playPauseIconSize: { width: 35, height: 35 },
});
