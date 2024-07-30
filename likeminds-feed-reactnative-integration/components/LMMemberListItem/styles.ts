import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import layout from "../../constants/Layout";

// default member list item style
export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
  },
  dotImageSize: {
    width: layout.normalize(6),
    height: layout.normalize(6),
    marginHorizontal: 5,
    resizeMode: "contain",
  },
  memberName: {
    fontWeight: "500",
    fontSize: 16,
    marginLeft: 10,
  },
  memberTitleText: {
    color: STYLES.$COLORS.PRIMARY,
    fontWeight: "400",
    fontSize: 14,
  },
});
