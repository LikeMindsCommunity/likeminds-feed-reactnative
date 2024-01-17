import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { LMHeaderProps } from "./types";
import { defaultStyles } from "./styles";
import LMIcon from "../LMIcon";

const LMHeader = ({
  heading,
  rightComponent,
  showBackArrow,
  onBackPress,
  subHeading,
  backIcon,
  subHeadingTextStyle,
  headingTextStyle,
  headingViewStyle
}: LMHeaderProps) => {
  return (
    <View style={[defaultStyles.headerViewStyle, headingViewStyle]}>
      {showBackArrow && (
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={onBackPress}
        >
          {backIcon ? (
            <LMIcon {...backIcon} />
          ) : (
            <Image
              source={require("../../assets/images/backArrow_icon3x.png")}
              style={defaultStyles.backArrowSize}
            />
          )}
        </TouchableOpacity>
      )}
      <Text style={StyleSheet.flatten([defaultStyles.headingStyle, headingTextStyle])}>
        {heading}
        {subHeading && (
          <>
            {"\n"}
            <Text style={StyleSheet.flatten([defaultStyles.subHeadingStyle,subHeadingTextStyle])}>{subHeading}</Text>
          </>
        )}
      </Text>
      {rightComponent}
    </View>
  );
};

export default LMHeader;
