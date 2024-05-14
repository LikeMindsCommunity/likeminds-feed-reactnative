import { Platform, StyleSheet } from "react-native";
import Layout from "../../constants/Layout";
import STYLES from "../../constants/Styles";

export const styles = StyleSheet.create({
  // alert Modal design
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: Layout.normalize(25),
    paddingBottom: Layout.normalize(20),
    width: "80%",
  },
  title: {
    fontSize: STYLES.$FONT_SIZES.XXL,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.FONT_PRIMARY,
    marginBottom: Layout.normalize(20),
  },
  message: {
    fontSize: Layout.normalize(15),
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.FONT_PRIMARY,
    marginBottom: Layout.normalize(20),
    lineHeight: Layout.normalize(20),
    fontWeight: "400",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  rejectButtonContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: Layout.normalize(15),
  },
  button: {
    padding: Layout.normalize(10),
    alignItems: "flex-end",
    width: Layout.normalize(90),
  },
  rejectButton: {
    padding: Layout.normalize(10),
    alignItems: "flex-end",
  },
  buttonText: {
    fontSize: STYLES.$FONT_SIZES.REGULAR,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.SECONDARY,
    textTransform: "uppercase",
  },
  cancelButton: {
    borderBottomLeftRadius: Layout.normalize(10),
  },
  cancelButtonText: {
    color: STYLES.$COLORS.MSG,
  },
  okButton: {
    borderBottomRightRadius: Layout.normalize(10),
  },
});
