import { Platform, StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flex: 1,
    top: Platform.OS === "ios" ? 50 : 20,
    justifyContent: "center",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1,
    opacity: 0.8,
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
    backgroundColor: "black",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: Layout.normalize(10),
    marginTop: Layout.normalize(40),
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
    position: "absolute",
    left: 0,
    zIndex: 1,
    flex: 1,
  },
  backBtn: {
    height: Layout.normalize(20),
    width: Layout.normalize(20),
    resizeMode: "contain",
    tintColor: STYLES.$COLORS.TERTIARY,
    padding: Layout.normalize(5),
  },
  chatRoomInfo: { gap: Layout.normalize(5) },
});

export default styles;
