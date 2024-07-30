import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: STYLES.$IS_DARK_THEME
      ? STYLES.$BACKGROUND_COLORS.DARK
      : STYLES.$BACKGROUND_COLORS.LIGHT,
    elevation: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginHorizontal: STYLES.$MARGINS.XL,
  },
  textHeading: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontWeight: STYLES.$FONT_WEIGHT.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    marginVertical: STYLES.$MARGINS.SMALL,
  },
  text: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  reasonText: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  reasonsSelectionView: {
    borderWidth: 0.5,
    borderRadius: 8,
    marginTop: STYLES.$MARGINS.XL,
    borderColor: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
    padding: STYLES.$PADDINGS.SMALL,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownIcon: {
    width: Layout.normalize(30),
    height: Layout.normalize(30),
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: STYLES.$MARGINS.XL,
    paddingBottom: STYLES.$PADDINGS.XS,
  },
  deleteTextBtn: {
    color: STYLES.$COLORS.PRIMARY,
    fontWeight: STYLES.$FONT_WEIGHT.MEDIUM,
    fontSize: 15,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
  },
  cancelTextBtn: {
    color: STYLES.$IS_DARK_THEME
      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
    fontWeight: STYLES.$FONT_WEIGHT.MEDIUM,
    fontSize: 15,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    marginRight: 40,
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
  asteriskTextStyle: {
    color: "red",
  },
});

export default styles;
