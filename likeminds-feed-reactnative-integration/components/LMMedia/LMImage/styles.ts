import { StyleSheet } from "react-native";
import STYLES from "../../../constants/Styles";
import layout from "../../../constants/Layout";

// default LMImage style
export const defaultStyles = StyleSheet.create({
  imageStyle: {
    height: 325,
    width: layout.window.width,
    resizeMode: "contain",
  },
  imageContainer: {
    backgroundColor: STYLES.$COLORS.BLACK,
    width: layout.window.width,
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
    backgroundColor: STYLES.$COLORS.LIGHT_GREY,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  errorText: {
    color: STYLES.$COLORS.RED,
  },
  cancelButtonView: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 2000,
  },
  cancelButton: {
    borderWidth: 0,
    backgroundColor: "transparent",
  },
});
