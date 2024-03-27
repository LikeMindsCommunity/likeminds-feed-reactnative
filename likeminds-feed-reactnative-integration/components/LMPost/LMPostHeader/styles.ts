import { StyleSheet } from "react-native";
import STYLES from "../../../constants/Styles";
import layout from "../../../constants/Layout";

// default post header style
export const styles = StyleSheet.create({
  postHeader: {
    width: "100%",
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alignRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  postAuthorName: {
    color: "#222020",
    fontSize: 16.5,
    fontWeight: "500",
    lineHeight: 20,
  },
  postedDetail: {
    color: "#0F1E3D66",
    fontSize: 14,
    fontWeight: "400",
  },
  labelText: {
    color: STYLES.$COLORS.WHITE,
    fontSize: 14,
    fontWeight: "500",
  },
  labelView: {
    backgroundColor: "#5046E5",
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
  },
  iconSize: {
    width: layout.normalize(22),
    height: layout.normalize(22),
    resizeMode: "contain",
  },
  dotImageSize: {
    width: layout.normalize(5),
    height: layout.normalize(5),
    marginHorizontal: 5,
    resizeMode: "contain",
  },
  topRightView: {
    width: "16%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  topRightViewIfPinned: {
    width: "16%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  autherDetailView: {
    marginLeft: 12,
  },
});
