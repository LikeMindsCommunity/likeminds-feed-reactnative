import { Platform, StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

const styles = StyleSheet.create({
  header: {
    display: "flex",
    justifyContent: "center",
    position: Platform.OS === "ios" ? "relative" : "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
    opacity: 0.8,
    backgroundColor: "black",
  },
  activityIndicatorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  headerElement: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Layout.normalize(10),
    paddingHorizontal: Layout.normalize(10),
    width: "100%",
  },
  image: {
    width: Layout.window.width,
    height:
      Platform.OS === "ios"
        ? Layout.window.height - Layout.normalize(100)
        : Layout.window.height,
    resizeMode: "contain",
  },
  video: {
    display: "flex",
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
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    height: Layout.normalize(20),
    width: Layout.normalize(20),
    resizeMode: "contain",
    tintColor: STYLES.$COLORS.TERTIARY,
  },
  chatRoomInfo: { gap: Layout.normalize(5) },
});

export default styles;
