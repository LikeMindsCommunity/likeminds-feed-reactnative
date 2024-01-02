import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import STYLES from '../../../constants/constants';
import layout from '../../../utils/layout';
import {LMPostHeaderProps} from './types';
import {timeStamp} from '../../../utils';
import LMPostMenu from '../LMPostMenu';
import LMProfilePicture from '../../LMProfilePicture'
import LMText from '../../LMText';
import LMIcon from '../../LMIcon';

const LMPostHeader = ({
  post,
  profilePicture,
  titleText,
  createdAt,
  showMemberStateLabel,
  memberState,
  memberStateTextStyle,
  memberStateViewStyle,
  postHeaderViewStyle,
  pinIcon,
  menuIcon,
  postMenu,
  onTap,
  showMenuIcon,
}: LMPostHeaderProps) => {
  const [modalPosition, setModalPosition] = useState(postMenu?.modalPosition);
  const [showPostMenuModal, setShowPostMenuModal] = useState(
    postMenu?.modalVisible,
  );

  // this function closes the menu list modal
  const closePostMenuModal = () => {
    postMenu?.onCloseModal();
    setShowPostMenuModal(false);
  };

  // this function is executed on the click of menu icon & handles the position and visibility of the modal
  const onThreedotsClick = (event: {
    nativeEvent: {pageX: number; pageY: number};
  }) => {
    const {pageX, pageY} = event.nativeEvent;
    setShowPostMenuModal(true);
    setModalPosition({x: pageX, y: pageY});
  };

  return (
    <View style={StyleSheet.flatten([styles.postHeader, postHeaderViewStyle])}>
      {/* author detail section */}
      <TouchableOpacity activeOpacity={0.8} onPress={() => onTap(post?.user)}>
        <View style={styles.alignRow}>
          <LMProfilePicture
            fallbackText={{children:post?.user?.name}}
            imageUrl={post?.user?.imageUrl}
            onTap={profilePicture?.onTap}
            size={profilePicture?.size}
            fallbackTextBoxStyle={profilePicture?.fallbackTextBoxStyle}
            profilePictureStyle={profilePicture?.profilePictureStyle}
          />
          {/* author details */}
          <View style={styles.autherDetailView}>
            {/* author heading */}
            <View style={styles.alignRow}>
              <LMText
                maxLines={titleText?.maxLines}
                selectable={false}
                textStyle={StyleSheet.flatten([
                  styles.postAuthorName,
                  titleText?.textStyle,
                ])}
              >{titleText?.children ? titleText.children : ''}</LMText>
              {/* member state label view */}
              {showMemberStateLabel && memberState === 1 && (
                <View
                  style={StyleSheet.flatten([
                    styles.labelView,
                    memberStateViewStyle,
                  ])}>
                  <LMText
                    textStyle={StyleSheet.flatten([
                      styles.labelText,
                      memberStateTextStyle,
                    ])}
                  >{`Admin`}</LMText>
                </View>
              )}
            </View>

            {/* author subHeading */}
            <View style={styles.alignRow}>
              <LMText
                selectable={false}
                maxLines={createdAt?.maxLines}
                textStyle={StyleSheet.flatten([
                  styles.postedDetail,
                  createdAt?.textStyle,
                ])}
              >{
                timeStamp(Number(createdAt?.children)) === undefined
                  ? 'now'
                  : `${timeStamp(Number(createdAt?.children))}`
              }</LMText>
              {/* checks if the post is edited or not */}
              {post?.isEdited && (
                <>
                  <LMIcon
                    assetPath={require('../../../assets/images/single_dot3x.png')}
                    type="png"
                    width={styles.dotImageSize.width}
                    height={styles.dotImageSize.height}
                    iconStyle={styles.dotImageSize}
                    color="#0F1E3D66"
                  />
                  <LMText
                    textStyle={StyleSheet.flatten([
                      styles.postedDetail,
                      createdAt?.textStyle,
                    ])}
                  >{`Edited`}</LMText>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Top right action buttons */}
      <View
        style={[
          styles.topRightView,
          post?.isPinned && styles.topRightViewIfPinned,
        ]}>
        {/* pin icon section */}
        {post?.isPinned && (
          <>
            {
              <LMIcon
                assetPath={
                  pinIcon?.assetPath
                    ? pinIcon.assetPath
                    : require('../../../assets/images/pin_icon3x.png')
                }
                type="png"
                iconStyle={styles.iconSize}
                iconUrl={pinIcon?.iconUrl}
                color={pinIcon?.color}
                width={pinIcon?.width ? pinIcon.width : 20}
                height={pinIcon?.height ? pinIcon.height : 20}
                boxFit={pinIcon?.boxFit}
                boxStyle={pinIcon?.boxStyle}
              />
            }
          </>
        )}
        {/* menu icon section */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onThreedotsClick}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <>
            {showMenuIcon && (
              <LMIcon
                assetPath={
                  menuIcon?.assetPath
                    ? menuIcon.assetPath
                    : require('../../../assets/images/three_dots3x.png')
                }
                type="png"
                iconStyle={styles.iconSize}
                iconUrl={menuIcon?.iconUrl}
                color={menuIcon?.color}
                width={menuIcon?.width ? menuIcon.width : 20}
                height={menuIcon?.height ? menuIcon.height : 20}
                boxFit={menuIcon?.boxFit}
                boxStyle={menuIcon?.boxStyle}
              />
            )}
          </>
        </TouchableOpacity>
      </View>

      {/* menu list modal */}
      <LMPostMenu
        postId={post?.id}
        menuItems={post?.menuItems}
        onSelected={postMenu?.onSelected}
        modalPosition={modalPosition}
        modalVisible={showPostMenuModal}
        onCloseModal={closePostMenuModal}
        menuItemTextStyle={postMenu?.menuItemTextStyle}
        menuViewStyle={postMenu?.menuViewStyle}
        backdropColor={postMenu?.backdropColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    width: '100%',
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alignRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorName: {
    color: '#222020',
    fontSize: 16.5,
    fontWeight: '500',
    lineHeight: 20,
  },
  postedDetail: {
    color: '#0F1E3D66',
    fontSize: 14,
    fontWeight: '400',
  },
  labelText: {
    color: STYLES.$COLORS.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  labelView: {
    backgroundColor: '#5046E5',
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 5,
  },
  iconSize: {
    width: layout.normalize(22),
    height: layout.normalize(22),
    resizeMode: 'contain',
  },
  dotImageSize: {
    width: layout.normalize(5),
    height: layout.normalize(5),
    marginHorizontal: 5,
    resizeMode: 'contain',
  },
  topRightView: {
    width: '16%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  topRightViewIfPinned: {
    width: '16%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  autherDetailView: {
    marginLeft: 12,
  },
});

export default LMPostHeader;
