import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import LMProfilePicture from '../LMProfilePicture';
import LMText from '../LMText';
import layout from '../../utils/layout';
import {LMMemberListItemProps} from './types';
import STYLES from '../../constants/constants';
import LMIcon from '../LMIcon';

const LMMemberListItem = ({
  likes,
  profilePictureProps,
  nameProps,
  customTitleProps,
  boxStyle,
  onTap,
}: LMMemberListItemProps) => {
  //creating profile picture props as per customization
  const updatedProfilePictureProps = {
    fallbackText: {textStyle: profilePictureProps?.fallbackText?.textStyle, children:<Text>{likes.user.name}</Text>},
    size: profilePictureProps?.size ? profilePictureProps.size : 50,
    imageUrl: likes.user.imageUrl,
    onTap: profilePictureProps?.onTap,
    fallbackTextBoxStyle: profilePictureProps?.fallbackTextBoxStyle,
    profilePictureStyle: profilePictureProps?.profilePictureStyle,
  };
  //creating user name props as per customization
  const updatedNameProps = {
    text: likes.user.name,
    textStyle: nameProps?.textStyle,
  };
  //creating custom title props as per customization
  const updatedCustomTitleProps = {
    text: likes.user.customTitle,
    textStyle: customTitleProps?.textStyle,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => (onTap ? onTap(likes.user) : null)}>
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
              assetPath={require('../../assets/images/single_dot3x.png')}
              type="png"
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
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  dotImageSize: {
    width: layout.normalize(6),
    height: layout.normalize(6),
    marginHorizontal: 5,
    resizeMode: 'contain',
  },
  memberName: {
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
  },
  memberTitleText: {
    color: STYLES.$COLORS.THEME,
    fontWeight: '400',
    fontSize: 14,
  },
});

export default LMMemberListItem;
