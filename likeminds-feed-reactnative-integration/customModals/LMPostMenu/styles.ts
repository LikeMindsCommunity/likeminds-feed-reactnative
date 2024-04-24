import { Platform, StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";

// default post menu style
export const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: STYLES.$BACKGROUND_COLORS.LIGHT,
    elevation:  8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: "55%",
    position: "absolute",
    right: 15,
    shadowOffset: { width: 2, height: 2 },
    shadowColor:'black',
    shadowOpacity: 0.2,
    borderRadius: 5,
  },
  listText: {
    fontSize: 16,
    fontWeight: "400",
    color: STYLES.$COLORS.TEXT_COLOR,
    marginVertical: 12,
  },
});
