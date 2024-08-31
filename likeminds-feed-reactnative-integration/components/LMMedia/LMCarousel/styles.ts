import { StyleSheet } from "react-native";
import STYLES from "../../../constants/Styles";
import layout from "../../../constants/Layout";

// default carousel style
export const styles = StyleSheet.create({
  mediaDimensions: {
    width: layout.window.width,
    height: 325,
    backgroundColor: STYLES.$BACKGROUND_COLORS.DARK,
  },
  swiperView: {
    marginBottom: 30,
    backgroundColor: STYLES.$BACKGROUND_COLORS.DARK,
  },
  paginationView: {
    position: "absolute",
    bottom: -5,
  },
  paginationItemStyle: {
    width: 8,
    height: 8,
    marginHorizontal: 4,
  },
  swiperListMediaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
