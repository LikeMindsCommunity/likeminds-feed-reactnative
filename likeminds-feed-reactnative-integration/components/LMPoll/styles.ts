import Layout from "../../constants/Layout";
import { Platform, StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";

export const styles = StyleSheet.create({
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(20),
    marginTop: Platform.OS === "ios" ? Layout.normalize(-5) : 0,
  },
  selectedHeadingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(25),
  },
  backBtn: {
    height: Layout.normalize(40),
    width: Layout.normalize(40),
    borderRadius: Layout.normalize(10),
    resizeMode: "contain",
  },
  lightGreyBackground: {
    color: "#c5c5c5",
  },
  lightGreyThumb: {
    color: "#f4f3f4",
  },
  greyColor: {
    color: "grey",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  primaryColor: {
    color: STYLES.$COLORS.PRIMARY,
  },
  lightPrimaryColor: {
    color: STYLES.$COLORS.SECONDARY,
  },
  whiteColor: {
    color: STYLES.$COLORS.TERTIARY,
  },
  blackColor: {
    color: "#000000",
  },
  padding20: {
    padding: Layout.normalize(20),
  },
  paddingHorizontal15: {
    paddingHorizontal: Layout.normalize(15),
  },
  paddingVertical5: {
    paddingVertical: Layout.normalize(5),
  },
  paddingVertical10: {
    paddingVertical: Layout.normalize(10),
  },
  marginSpace: {
    marginTop: Layout.normalize(10),
  },
  mediumMarginSpace: {
    marginTop: Layout.normalize(15),
  },
  extraMarginSpace: {
    marginTop: Layout.normalize(20),
  },
  gap: {
    gap: Layout.normalize(5),
  },
  gap10: {
    gap: Layout.normalize(10),
  },
  gap15: {
    gap: Layout.normalize(15),
  },
  centeredView: {
    flexGrow: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalViewParent: {
    position: "absolute",
    top: Layout.normalize(50),
    flexGrow: 1,
    width: Layout.window.width,
    height: Layout.window.height,
  },
  addOptionsModalViewParent: {
    position: "absolute",
    bottom: 0,
    flexGrow: 1,
    width: Layout.window.width,
    height: Layout.window.height / 3,
  },
  modalView: {
    backgroundColor: "#e8ebf0",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: Layout.normalize(2),
    },
    paddingVertical: Layout.normalize(5),
    shadowOpacity: Layout.normalize(0.25),
    shadowRadius: Layout.normalize(4),
    elevation: Layout.normalize(5),
    height: "100%",
  },
  alignModalElements: {
    display: "flex",
    flexGrow: 1,
  },
  font: {
    fontSize: Layout.normalize(16),
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  text: {
    fontSize: Layout.normalize(16),
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  mediumText: {
    fontSize: Layout.normalize(13),
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  boldText: {
    fontSize: Layout.normalize(16),
    fontFamily: STYLES.$FONT_TYPES.BOLD,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  mediumBoldText: {
    fontSize: Layout.normalize(16),
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  smallText: {
    fontSize: Layout.normalize(12),
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  smallTextMedium: {
    fontSize: Layout.normalize(12),
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  newPollText: {
    color: "black",
  },
  alignRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  justifySpace: {
    justifyContent: "space-between",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  viewStyle: {
    width: Layout.window.width / 3,
  },
  header: {
    marginLeft: Layout.normalize(-10),
    paddingVertical: Layout.normalize(15),
  },
  pollQuestion: {
    padding: Layout.normalize(15),
    backgroundColor: STYLES.$COLORS.TERTIARY,
  },
  question: {
    marginTop: Layout.normalize(10),
  },
  answerOptions: {
    paddingVertical: Layout.normalize(10),
    paddingHorizontal: 0,
    backgroundColor: STYLES.$COLORS.TERTIARY,
    marginTop: Layout.normalize(10),
  },
  advancedOptions: {
    paddingHorizontal: 0,
    backgroundColor: STYLES.$COLORS.TERTIARY,
    marginTop: Layout.normalize(15),
    paddingBottom: Layout.normalize(10),
  },
  option: {
    paddingVertical: Layout.normalize(10),
  },
  addOptionText: {
    marginTop: Layout.normalize(4),
  },
  optionIcon: {
    height: Layout.normalize(25),
    width: Layout.normalize(25),
    resizeMode: "contain",
    marginRight: Layout.normalize(5),
    marginLeft: Layout.normalize(-5),
    tintColor: STYLES.$COLORS.PRIMARY,
  },
  pollIconParent: {
    height: Layout.normalize(30),
    width: Layout.normalize(30),
    borderRadius: Layout.normalize(50),
    backgroundColor: STYLES.$COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  pollEndedTime: {
    borderRadius: Layout.normalize(50),
    backgroundColor: STYLES.$COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Layout.normalize(10),
    paddingVertical: Layout.normalize(5),
  },
  pollIcon: {
    height: Layout.normalize(15),
    width: Layout.normalize(15),
    resizeMode: "contain",
  },
  placeHolder: {
    color: "#D3D3D3",
  },
  postButton: {
    padding: Layout.normalize(10),
    paddingHorizontal: Layout.normalize(50),
    borderRadius: Layout.normalize(50),
    backgroundColor: STYLES.$COLORS.PRIMARY,
    alignSelf: "center",
  },
  pollButton: {
    borderRadius: Layout.normalize(8),
    borderColor: STYLES.$COLORS.SECONDARY,
    borderWidth: Layout.normalize(1),
  },
  greyPollButton: {
    borderRadius: Layout.normalize(8),
    borderColor: "grey",
    borderWidth: Layout.normalize(0.5),
  },
  pollButtonBackground: {
    margin: Layout.normalize(2),
    padding: Layout.normalize(13),
    borderRadius: Layout.normalize(5),
  },
  pollButtonPadding: {
    paddingVertical: Layout.normalize(20),
    paddingHorizontal: 0,
  },
  submitButton: {
    borderRadius: Layout.normalize(50),
    width: Layout.normalize(150),
    backgroundColor: STYLES.$COLORS.PRIMARY,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: Layout.normalize(2),
    },
    shadowOpacity: Layout.normalize(0.25),
    shadowRadius: Layout.normalize(4),
    elevation: Layout.normalize(5),
    alignSelf: "center",
    padding: Layout.normalize(12),
  },
  submitVoteButton: {
    borderRadius: Layout.normalize(50),
    width: Layout.normalize(140),
    backgroundColor: STYLES.$COLORS.TERTIARY,
    paddingHorizontal: Layout.normalize(12),
    paddingVertical: Layout.normalize(6),
    borderColor: STYLES.$COLORS.PRIMARY,
    borderWidth: Layout.normalize(1),
    gap: Layout.normalize(5),
  },
  textInput: {
    padding: Layout.normalize(12),
    borderRadius: Layout.normalize(8),
    borderColor: "#c5c5c5",
    borderWidth: Layout.normalize(1),
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    fontSize: Layout.normalize(14),
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  borderBottom: {
    borderBottomColor: "#c5c5c5",
    borderBottomWidth: Layout.normalize(1),
  },
  greyBorder: { borderColor: "#c5c5c5" },
  messageInfo: {
    color: "green",
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.BOLD,
    marginBottom: STYLES.$MARGINS.XS,
  },
  messageCustomTitle: {
    color: STYLES.$COLORS.MSG,
    fontSize: STYLES.$FONT_SIZES.SMALL,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
  },
  messageDate: {
    fontSize: Layout.normalize(10),
    color: "#aaa",
    textAlign: "right",
  },
  alignTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: Layout.normalize(3),
  },
  downArrow: {
    height: Layout.normalize(20),
    width: Layout.normalize(20),
    resizeMode: "contain",
    tintColor: "#c5c5c5",
    marginTop: Platform.OS === "ios" ? Layout.normalize(-3) : 0,
  },
  selectedItem: {
    height: "100%",
    width: "100%",
    backgroundColor: STYLES.$COLORS.PRIMARY,
    position: "absolute",
    opacity: 0,
    zIndex: 1,
  },
  selected: {
    backgroundColor: STYLES.$COLORS.PRIMARY,
    height: Layout.normalize(25),
    width: Layout.normalize(25),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Layout.normalize(15),
    position: "absolute",
    right: Layout.normalize(10),
    top: "25%",
    zIndex: 1,
  },
  smallIcon: {
    width: Layout.normalize(15),
    height: Layout.normalize(15),
    resizeMode: "contain",
  },
  editIcon: {
    height: Layout.normalize(25),
    width: Layout.normalize(25),
    resizeMode: "contain",
    tintColor: STYLES.$COLORS.PRIMARY,
  },
  optionText: {
    position: "absolute",
    zIndex: 1,
    alignItems: "center",
    left: Layout.normalize(5),
    top: Platform.OS === "ios" ? "30%" : "30%",
  },
});
