import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

const styles = StyleSheet.create({
  page: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    flex: 1,
    paddingTop: STYLES.$PADDINGS.SMALL,
  },
  textHeading: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontWeight: STYLES.$FONT_WEIGHT.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  text: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  btnText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  reasonsBtn: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: STYLES.$PADDINGS.MEDIUM,
    margin: 8,
    borderWidth: 1,
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
  },
  reportBtnParent: {
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
  },
  reportBtn: {
    backgroundColor: STYLES.$COLORS.reportRed,
    borderRadius: 25,
    paddingHorizontal: 50,
    paddingVertical: STYLES.$PADDINGS.MEDIUM,
  },
  reportBtnText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK,
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontWeight: STYLES.$FONT_WEIGHT.BOLD,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  disabledReportBtn: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    borderRadius: 25,
    paddingHorizontal: 50,
    paddingVertical: STYLES.$PADDINGS.MEDIUM,
  },
  titleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    borderBottomWidth: 1,
    paddingHorizontal: STYLES.$PADDINGS.LARGE,
    paddingVertical: STYLES.$PADDINGS.SMALL,
    alignItems: "center",
  },
  titleText: {
    color: STYLES.$COLORS.reportRed,
    fontSize: STYLES.$FONT_SIZES.XXL,
    fontWeight: STYLES.$FONT_WEIGHT.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  contentView: {
    gap: 15,
    paddingHorizontal: STYLES.$PADDINGS.LARGE,
    paddingTop: STYLES.$PADDINGS.SMALL,
  },
  tagView: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: STYLES.$MARGINS.MEDIUM,
    paddingHorizontal: STYLES.$PADDINGS.LARGE,
  },
  otherSection: {
    marginTop: STYLES.$MARGINS.XL,
    paddingHorizontal: STYLES.$PADDINGS.LARGE,
  },
  otherTextInput: {
    margin: 12,
    borderBottomWidth: 1,
    padding: STYLES.$PADDINGS.SMALL,
    paddingLeft: 0,
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
  },
  dropdownIcon: {
    width: Layout.normalize(18),
    height: Layout.normalize(18),
  },
  modalView: {
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: STYLES.$BACKGROUND_COLORS.DARK,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  filterText: {
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
  },
  toastViewStyle: { zIndex: 4000 },
  contentBox: { flex: 1 },
  selectedReasonItemView: {
    backgroundColor: STYLES.$COLORS.PRIMARY,
    borderColor: STYLES.$COLORS.PRIMARY,
  },
  defaultReasonItemView: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
  },
  selectedReasonText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
  },
  defaultReasonText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
  },
  loaderView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
