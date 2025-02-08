import STYLES from "../../constants/Styles"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: STYLES.$IS_DARK_THEME ? STYLES.$BACKGROUND_COLORS.DARK : STYLES.$BACKGROUND_COLORS.LIGHT
    },
    borderBottomView: {
        borderBottomColor: "#00000011",
        borderBottomWidth: 2
    },
    innerView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    touchableOpacity: {
        marginLeft: 12
    },
    flexView: {
        flex: 1,
    },
    textValueStyle: {
        fontSize: 16,
    },
    inputTextStyle: {
        height: 40,
        elevation: 0,
        paddingVertical: 0,
        borderRadius: 0,
        fontSize: 16,
    }
})