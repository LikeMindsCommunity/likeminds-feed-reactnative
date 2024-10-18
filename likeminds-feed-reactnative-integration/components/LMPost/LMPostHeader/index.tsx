import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import { timeStamp } from "../../../utils";
import { LMIcon, LMText, LMProfilePicture } from "../../../uiComponents";
import { nameInitials } from "../../../utils";
import { styles } from "./styles";
import { LMPostContextValues, useLMPostContext } from "../../../context";
import { useAppSelector } from "../../../store/store";
import STYLES from "../../../constants/Styles";

const LMPostHeader = React.memo(() => {
  const { post, headerProps }: any = useLMPostContext();
  const postListStyle = STYLES.$POST_LIST_STYLE;
  const customPostHeaderStyle: any = postListStyle?.header;
  const memberData = useAppSelector((state) => state.login.member);

  const showMenuIcon =
    customPostHeaderStyle?.showMenuIcon != undefined
      ? customPostHeaderStyle?.showMenuIcon
      : true;
  const showMemberStateLabel =
    customPostHeaderStyle?.showMemberStateLabel != undefined
      ? customPostHeaderStyle?.showMemberStateLabel
      : true;

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
        style={{flex:0.9}}
      >
        <View style={{...styles.alignRow}}>
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
          <View style={{...styles.autherDetailView, flexWrap: 'wrap', flex: 1}}>
            {/* author heading */}
            <View style={{...styles.alignRow, flexWrap: 'wrap' }}>
              <LMText
                selectable={false}
                textStyle={StyleSheet.flatten([
                  styles.postAuthorName,
                  customPostHeaderStyle?.titleText,
                  [{marginRight: 10}]
                ])}
              >
                {post?.user?.name}
              </LMText>
              {/* member state label view */}
              {showMemberStateLabel && post?.user?.customTitle != "" && (
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
                  >
                    {post?.user?.customTitle}
                  </LMText>
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
                    color={
                      STYLES.$IS_DARK_THEME
                        ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                        : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
                    }
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
          [{gap: 3}]
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
                color={
                  customPostHeaderStyle?.pinIcon?.color
                    ? customPostHeaderStyle?.pinIcon?.color
                    : STYLES.$IS_DARK_THEME
                    ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                    : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT
                }
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
                color={
                  customPostHeaderStyle?.menuIcon?.color
                    ? customPostHeaderStyle?.menuIcon?.color
                    : STYLES.$IS_DARK_THEME
                    ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                    : STYLES.$COLORS.TEXT_COLOR
                }
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
    </View>
  );
});

export default LMPostHeader;
