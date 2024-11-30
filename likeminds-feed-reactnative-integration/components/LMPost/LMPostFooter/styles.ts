import { StyleSheet } from "react-native";
import STYLES from "../../../constants/Styles";
import layout from "../../../constants/Layout";

// default post footer style
export const styles = StyleSheet.create({
  postFooter: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 10,
  },
  alignRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  postFooterText: {
    fontSize: 16,
    fontWeight: "400",
    color: STYLES.$COLORS.BLACK,
    marginLeft: 8,
  },
  likeIconSize: {
    width: layout.normalize(21),
    height: layout.normalize(21),
  },
  commentIconSize: {
    width: layout.normalize(21),
    height: layout.normalize(21),
  },
  iconSize: {
    width: layout.normalize(19),
    height: layout.normalize(19),
  },
  defaultLikeIconView: {
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  defaultLikeTextView: {
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginLeft: 0,
    maxWidth: layout.normalize(100),
  },
  defaultCommentView: {
    borderWidth: 0,
    alignItems: "center",
    marginLeft: 5,
    maxWidth: layout.normalize(150),
  },
  buttonWithoutBorder: {
    borderWidth: 0,
  },
});
