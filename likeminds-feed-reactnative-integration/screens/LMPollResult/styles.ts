import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

const styles = StyleSheet.create({
  page: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    flex: 1,
  },
  avatar: {
    width: Layout.normalize(50),
    height: Layout.normalize(50),
    borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
    marginRight: STYLES.$MARGINS.SMALL,
  },
  font: {
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    textTransform: "none",
  },
  participants: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Layout.normalize(15),
    paddingVertical: Layout.normalize(10),
    flex: 1,
  },
  infoContainer: {
    flex: 1,
  },
  backOptionalBtn: {
    height: Layout.normalize(20),
    width: Layout.normalize(24),
    resizeMode: "contain",
    tintColor: "black",
  },
  messageCustomTitle: {
    color: STYLES.$COLORS.PRIMARY,
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
  },
  title: {
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
  },
  secondaryTitle: {
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.MSG,
  },
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(15),
  },
  backBtn: {
    height: Layout.normalize(40),
    width: Layout.normalize(40),
    resizeMode: "contain",
  },
  search: {
    height: Layout.normalize(20),
    width: Layout.normalize(20),
    resizeMode: "contain",
  },
  chatRoomInfo: { gap: Layout.normalize(5) },
  nothingImg: {
    height: Layout.normalize(100),
    width: Layout.normalize(100),
    resizeMode: "contain",
  },
  nothingDM: { display: "flex", flexGrow: 1 },
  justifyCenter: {
    padding: STYLES.$PADDINGS.MEDIUM,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: STYLES.$COLORS.TERTIARY,
    flex: 1,
    gap: Layout.normalize(10),
  },
  subTitle: {
    fontSize: STYLES.$FONT_SIZES.SMALL,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.MSG,
    textAlign: "center",
  },
  gap: { gap: Layout.normalize(5) },
});

export default styles;
