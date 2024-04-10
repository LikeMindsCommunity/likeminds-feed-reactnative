import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import layout from "../../constants/Layout";

// default notification feed item style
export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  iconSize: {
    width: layout.normalize(22),
    height: layout.normalize(22),
    resizeMode: "contain",
  },
  postedDetail: {
    color: STYLES.$COLORS.BLACK,
    fontSize: 14,
  },
  flexView: {
    flexDirection: "row",
  },
  notificationTypeIcon: {
    position: "absolute",
    bottom: -10,
    right: -8,
  },
  contentView: { width: "82%", marginLeft: 10 },
  activityText:{fontSize: 15}
});
