import { Platform, StyleSheet } from "react-native";
import Layout from "../../constants/Layout";

export const styles = StyleSheet.create({
  flexView: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    height: Layout.window.height - Layout.normalize(64),
  },
  commentCountText: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 5,
    fontWeight: "500",
    color: "#222020",
    backgroundColor: "#fff",
  },
  textContainer: {
    margin: 0,
    width: "100%",
    backgroundColor: "#d3d3d3", // Light gray background to indicate disabled state
    padding: 15,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  disabledText: {
    color: "#808080", // Gray text color
    fontWeight: "bold",
    fontSize: 14,
  },
  viewMoreText: {
    color: "#484F67",
    fontWeight: "500",
    marginVertical: 24,
  },
  noCommentSection: {
    alignItems: "center",
    marginTop: 10,
    paddingBottom: Layout.window.height / 6.2,
  },
  noCommentText: { color: "#333333", fontSize: 16, fontWeight: "500" },
  loaderView: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 30,
  },
  replyCommentSection: {
    position: "absolute",
    backgroundColor: "#e9e9e9",
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
    tintColor: "#000",
  },
  textInputStyle: {
    margin: 0,
    borderRadius: 0,
    paddingVertical: 0,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    height: Layout.normalize(64),
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#222020",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  lightGreyColorText: { color: "#666666" },
  taggingListView: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderColor: "grey",
    borderTopWidth: 0.5,
    backgroundColor: "#fff",
  },
  taggingListItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomColor: "#e0e0e0",
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
  taggingListText: { fontSize: 14, color: "#000" },
  taggingLoaderView: { paddingVertical: 20 },
});
