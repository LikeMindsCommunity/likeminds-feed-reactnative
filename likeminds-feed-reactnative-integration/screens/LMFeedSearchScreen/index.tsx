import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import STYLES from "../../constants/Styles"
import { LMHeader } from '@likeminds.community/feed-rn-core/components'
import { LMIcon, LMInputText } from '@likeminds.community/feed-rn-core/uiComponents'
import { SearchPostContextProvider } from '../../context'
import { useSearchScreenContext } from '../../context/searchScreenContext'

const LMFeedSearchScreen = ({navigation, route}) => {
    return(
        <SearchPostContextProvider navigation={navigation} route={route}>
            <LMFeedSearchScreenComponent navigation={navigation} route={route} />
        </SearchPostContextProvider>
    )
}

const LMFeedSearchScreenComponent = ({ navigation, route }) => {
    const {searchPostQuery, setSearchPostQuery, onBackArrowPress, onCrossPress} = useSearchScreenContext();
    console.log("refresh search screen")
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.borderBottomView}>
                <View style={styles.innerView}>
                    <TouchableOpacity onPress={onBackArrowPress} style={styles.touchableOpacity}>
                        <LMIcon
                            height={24}
                            width={24}
                            assetPath={require("../../assets/images/backArrow_icon3x.png")}
                        />
                    </TouchableOpacity>
                    <View style={styles.flexView}>
                        <LMInputText textValueStyle={styles.textValueStyle}
                            rightIcon={{
                                icon: {
                                    assetPath: require("../../assets/images/cross_icon3x.png"),
                                    height: 18,
                                    width: 18
                                },
                                onTap: onCrossPress,
                            }}
                            inputTextStyle={styles.inputTextStyle} 
                            inputText={searchPostQuery} 
                            onType={setSearchPostQuery} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LMFeedSearchScreen

const styles = StyleSheet.create({
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
        flex: 1
    },
    textValueStyle: {
        fontSize: 16
    },
    inputTextStyle: {
        height: 40,
        elevation: 0,
        paddingVertical: 0,
        borderRadius: 0,
        fontSize: 16,
    }
})