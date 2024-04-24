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
    top: 27,
    left:22
  },
  contentView: { width: "82%", marginLeft: 10 },
  activityText:{fontSize: 15,
    color: "black",
    textAlign: "auto",
    fontStyle: "normal",
  },
  notificationTimeStamp: {
    color: '#9b9b9b',
    marginTop:5
  }
});
