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
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    fontSize: 16.5,
    fontWeight: "500",
    lineHeight: 20,
  },
  postedDetail: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    fontSize: 14,
    fontWeight: "400",
  },
  labelText: {
    color: STYLES.$COLORS.WHITE,
    fontSize: 14,
    fontWeight: "500",
  },
  labelView: {
    backgroundColor: STYLES.$COLORS.PRIMARY,
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
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
