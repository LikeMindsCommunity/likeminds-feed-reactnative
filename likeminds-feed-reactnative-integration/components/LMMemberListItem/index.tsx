import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React from "react";
import { LMMemberListItemProps } from "./types";
import { LMIcon, LMProfilePicture, LMText } from "../../uiComponents";
import { styles } from "./styles";
import { nameInitials } from "../../utils";
import STYLES from "../../constants/Styles";

const LMMemberListItem = React.memo(
  ({
    likes,
    profilePictureProps,
    nameProps,
    customTitleProps,
    boxStyle,
    onTap,
  }: LMMemberListItemProps) => {
    //creating profile picture props as per customization
    const updatedProfilePictureProps = {
      fallbackText: {
        textStyle: profilePictureProps?.fallbackTextStyle,
        children: (
          <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
            {nameInitials(likes.user.name)}
          </Text>
        ),
      },
      size: profilePictureProps?.size ? profilePictureProps.size : 50,
      imageUrl: likes.user.imageUrl,
      onTap: profilePictureProps?.onTap,
      fallbackTextBoxStyle: profilePictureProps?.fallbackTextBoxStyle,
      profilePictureStyle: profilePictureProps?.profilePictureStyle,
    };
    //creating user name props as per customization
    const updatedNameProps = {
      children: (
        <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
          {likes.user.name}
        </Text>
      ),
      textStyle: nameProps?.textStyle,
    };
    //creating custom title props as per customization
    const updatedCustomTitleProps = {
      children: (
        <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
          {likes.user.customTitle}
        </Text>
      ),
      textStyle: customTitleProps?.textStyle,
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => (onTap ? onTap(likes.user) : null)}
      >
        <View style={StyleSheet.flatten([styles.container, boxStyle])}>
          {/* avatar view */}
          <LMProfilePicture {...updatedProfilePictureProps} />
          {/* member name */}
          <LMText
            {...updatedNameProps}
            textStyle={StyleSheet.flatten([
              styles.memberName,
              nameProps?.textStyle,
            ])}
          />
          {/* member title */}
          {likes.user.customTitle && (
            <>
              <LMIcon
                assetPath={require("../../assets/images/single_dot3x.png")}
                width={styles.dotImageSize.width}
                height={styles.dotImageSize.height}
                iconStyle={styles.dotImageSize}
              />
              <LMText
                {...updatedCustomTitleProps}
                textStyle={StyleSheet.flatten([
                  styles.memberTitleText,
                  customTitleProps?.textStyle,
                ])}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

export default LMMemberListItem;
