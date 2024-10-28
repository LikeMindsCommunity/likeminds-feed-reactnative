import React from "react"
import { Text, View, TouchableOpacity } from "react-native"
import LMIcon from "../../uiComponents/LMIcon"
import STYLES from "../../constants/Styles"
import Layout from "../../constants/Layout"
import LMCheckboxProps from "../../uiComponents/LMCheckBox/types"

function LMCheckbox({ isChecked, onPress, label }: LMCheckboxProps) {
    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
                borderWidth: 1, borderColor: isChecked ? STYLES.$COLORS.PRIMARY : "#D0D5DD",
                height: 18, width: 18, justifyContent: 'center',
                alignItems: 'center', borderRadius: 3,
                backgroundColor: isChecked ? "#D0D5DD" : STYLES.$COLORS.WHITE
            }}>

                {isChecked ? <LMIcon
                    assetPath={require("../../assets/images/white_tick3x.png")}
                    color={STYLES.$COLORS.PRIMARY}
                    height={12}
                    width={12}
                /> : <></>}

            </View>
            <Text numberOfLines={2} style={{
                maxWidth: Layout.normalize(320),
                color: STYLES.$IS_DARK_THEME ? STYLES.$COLORS.WHITE_TEXT_COLOR : STYLES.$COLORS.BLACK
            }}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default LMCheckbox