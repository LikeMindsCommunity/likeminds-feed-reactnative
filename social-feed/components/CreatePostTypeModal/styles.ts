import Layout from "@likeminds.community/feed-rn-core/constants/Layout";
import STYLES from "@likeminds.community/feed-rn-core/constants/Styles";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: Layout.normalize(8),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    opacity: 1,
    maxHeight: Layout.normalize(250),
    paddingVertical: 10
  },
  filtersView: {
    paddingHorizontal: Layout.normalize(10),
    paddingVertical: Layout.normalize(15),
  },
  filterText: {
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.BLACK,
  },
});
