import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import { timeStamp } from "../../../utils";
import LMPostMenu from "../LMPostMenu";
import { LMIcon, LMText, LMProfilePicture } from "../../../uiComponents";
import { nameInitials } from "../../../utils";
import { styles } from "./styles";
import { LMPostContextValues, useLMPostContext } from "../../../context";
import { useLMFeedStyles } from "../../../lmFeedProvider";
import { STATE_ADMIN } from "../../../constants/Strings";
import { useAppSelector } from "../../../store/store";

const LMPostHeader = React.memo(() => {
  const { post, headerProps }: any = useLMPostContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const { postListStyle } = LMFeedContextStyles;
  const customPostHeaderStyle: any = postListStyle?.header;
  const memberData = useAppSelector((state) => state.login.member);

  const [modalPosition, setModalPosition] = useState(
    headerProps?.postMenu?.modalPosition
  );
  const [showPostMenuModal, setShowPostMenuModal] = useState(
    headerProps?.postMenu?.modalVisible
  );
  const showMenuIcon =
    customPostHeaderStyle?.showMenuIcon != undefined
      ? customPostHeaderStyle?.showMenuIcon
      : true;
  const showMemberStateLabel =
    customPostHeaderStyle?.showMemberStateLabel != undefined
      ? customPostHeaderStyle?.showMemberStateLabel
      : true;

  // this function closes the menu list modal
  const closePostMenuModal = () => {
    headerProps?.postMenu?.onCloseModal();
  };

  // this function is executed on the click of menu icon & handles the position and visibility of the modal
  const onThreedotsClick = (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => {
    headerProps?.onOverlayMenuClick(event);
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.postHeader,
        customPostHeaderStyle?.postHeaderViewStyle,
      ])}
    >
      {/* author detail section */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => customPostHeaderStyle?.onTap(post?.user)}
      >
        <View style={styles.alignRow}>
          <LMProfilePicture
            fallbackText={{
              children: nameInitials(post?.user?.name),
              textStyle:
                customPostHeaderStyle?.profilePicture?.fallbackTextStyle,
            }}
            imageUrl={post?.user?.imageUrl}
            onTap={customPostHeaderStyle?.profilePicture?.onTap}
            size={customPostHeaderStyle?.profilePicture?.size}
            fallbackTextBoxStyle={
              customPostHeaderStyle?.profilePicture?.fallbackTextBoxStyle
            }
            profilePictureStyle={
              customPostHeaderStyle?.profilePicture?.profilePictureStyle
            }
          />
          {/* author details */}
          <View style={styles.autherDetailView}>
            {/* author heading */}
            <View style={styles.alignRow}>
              <LMText
                selectable={false}
                textStyle={StyleSheet.flatten([
                  styles.postAuthorName,
                  customPostHeaderStyle?.titleText,
                ])}
              >
                {post?.user?.name}
              </LMText>
              {/* member state label view */}
              {showMemberStateLabel && memberData?.state === STATE_ADMIN && (
                <View
                  style={StyleSheet.flatten([
                    styles.labelView,
                    customPostHeaderStyle?.memberStateViewStyle,
                  ])}
                >
                  <LMText
                    textStyle={StyleSheet.flatten([
                      styles.labelText,
                      customPostHeaderStyle?.memberStateTextStyle,
                    ])}
                  >{`Admin`}</LMText>
                </View>
              )}
            </View>

            {/* author subHeading */}
            <View style={styles.alignRow}>
              <LMText
                selectable={false}
                textStyle={StyleSheet.flatten([
                  styles.postedDetail,
                  customPostHeaderStyle?.createdAt,
                ])}
              >
                {timeStamp(Number(post?.createdAt)) === undefined
                  ? "now"
                  : `${timeStamp(Number(post?.createdAt))}`}
              </LMText>
              {/* checks if the post is edited or not */}
              {post?.isEdited && (
                <>
                  <LMIcon
                    assetPath={require("../../../assets/images/single_dot3x.png")}
                    width={styles.dotImageSize.width}
                    height={styles.dotImageSize.height}
                    iconStyle={styles.dotImageSize}
                    color="#0F1E3D66"
                  />
                  <LMText
                    textStyle={StyleSheet.flatten([
                      styles.postedDetail,
                      customPostHeaderStyle?.createdAt,
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
        ]}
      >
        {/* pin icon section */}
        {post?.isPinned && (
          <>
            {
              <LMIcon
                assetPath={
                  customPostHeaderStyle?.pinIcon?.assetPath
                    ? customPostHeaderStyle?.pinIcon?.assetPath
                    : require("../../../assets/images/pin_icon3x.png")
                }
                iconStyle={
                  customPostHeaderStyle?.pinIcon?.iconStyle
                    ? customPostHeaderStyle?.pinIcon?.iconStyle
                    : styles.iconSize
                }
                iconUrl={customPostHeaderStyle?.pinIcon?.iconUrl}
                color={customPostHeaderStyle?.pinIcon?.color}
                width={
                  customPostHeaderStyle?.pinIcon?.width
                    ? customPostHeaderStyle?.pinIcon?.width
                    : 20
                }
                height={
                  customPostHeaderStyle?.pinIcon?.height
                    ? customPostHeaderStyle?.pinIcon?.height
                    : 20
                }
                boxFit={customPostHeaderStyle?.pinIcon?.boxFit}
                boxStyle={customPostHeaderStyle?.pinIcon?.boxStyle}
              />
            }
          </>
        )}
        {/* menu icon section */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onThreedotsClick}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <>
            {showMenuIcon && (
              <LMIcon
                assetPath={
                  customPostHeaderStyle?.menuIcon?.assetPath
                    ? customPostHeaderStyle?.menuIcon?.assetPath
                    : require("../../../assets/images/three_dots3x.png")
                }
                iconStyle={
                  customPostHeaderStyle?.menuIcon?.iconStyle
                    ? customPostHeaderStyle?.menuIcon?.iconStyle
                    : styles.iconSize
                }
                iconUrl={customPostHeaderStyle?.menuIcon?.iconUrl}
                color={customPostHeaderStyle?.menuIcon?.color}
                width={
                  customPostHeaderStyle?.menuIcon?.width
                    ? customPostHeaderStyle?.menuIcon.width
                    : 20
                }
                height={
                  customPostHeaderStyle?.menuIcon?.height
                    ? customPostHeaderStyle?.menuIcon.height
                    : 20
                }
                boxFit={customPostHeaderStyle?.menuIcon?.boxFit}
                boxStyle={customPostHeaderStyle?.menuIcon?.boxStyle}
              />
            )}
          </>
        </TouchableOpacity>
      </View>

      {/* menu list modal */}
      <LMPostMenu
        postId={post?.id}
        menuItems={post?.menuItems}
        onSelected={headerProps?.postMenu?.onSelected}
        modalPosition={headerProps?.postMenu?.modalPosition}
        modalVisible={headerProps?.postMenu?.modalVisible}
        onCloseModal={closePostMenuModal}
        menuItemTextStyle={customPostHeaderStyle?.postMenu?.menuItemTextStyle}
        menuViewStyle={customPostHeaderStyle?.postMenu?.menuViewStyle}
        backdropColor={customPostHeaderStyle?.postMenu?.backdropColor}
      />
    </View>
  );
});

export default LMPostHeader;
