import { StyleSheet } from "react-native";
import layout from "../../constants/Layout";

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
    color: "#222020",
    paddingTop: 12,
    paddingBottom: 4,
  },
  defaultTimeStyle: {
    color: "#0F1E3D66",
    fontSize: 13,
  },
  parentLevelCommentView: {
    paddingHorizontal: 15,
    width: layout.window.width,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#D0D8E266",
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
  replyTextStyle: { color: "#0F1E3D66", marginRight: 4 },
  replyTextButton: { borderWidth: 0 },
  repliesCountTextButton: { borderWidth: 0 },
  repliesView: { marginLeft: 30 },
  showMoreView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentPageNumberText: { fontSize: 12, color: "#9B9B9B" },
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
    color: "#9B9B9B",
  },
});
