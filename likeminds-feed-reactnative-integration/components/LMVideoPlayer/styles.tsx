import { Platform, StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    width: Layout.window.width,
    height:
      Platform.OS === "ios"
        ? Layout.window.height - Layout.normalize(100)
        : Layout.window.height,
  },
  videoPlayer: {
    width: Layout.window.width,
    height:
      Platform.OS === "ios"
        ? Layout.window.height - Layout.normalize(100)
        : Layout.window.height,
  },
});

export default styles;
