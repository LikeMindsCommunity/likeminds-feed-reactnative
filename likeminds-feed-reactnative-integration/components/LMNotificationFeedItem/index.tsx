import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import React from "react";
import STYLES from "../../constants/Styles";
import { LMNotificationFeedItemProps } from "./types";
import { LMIcon, LMText, LMProfilePicture } from "../../uiComponents";
import {
  DOCUMENT_ATTACHMENT_TYPE,
  IMAGE_ATTACHMENT_TYPE,
  VIDEO_ATTACHMENT_TYPE,
} from "../../constants/Strings";
import { styles } from "./styles";
import { nameInitials, timeStamp } from "../../utils";
import { useLMFeedStyles } from "../../lmFeedProvider";

const LMNotificationFeedItem = React.memo(
  ({ activity, onTap }: LMNotificationFeedItemProps) => {
    const LMFeedContextStyles = useLMFeedStyles();
    const { notificationFeedStyle } = LMFeedContextStyles;
    // storing the attachments if present
    const activityAttachments = activity.activityEntityData?.attachments;
    // storing the value of attachment type of the attachment if present
    const activityAttachmentType = activityAttachments
      ? activityAttachments[0]?.attachmentType
      : "";
    //creating profile picture props as per customization
    const profilePictureStyle = notificationFeedStyle?.userImageStyles
    const updatedProfilePictureProps = {
      fallbackText: {
        children: <Text>{nameInitials(activity.activityByUser.name)}</Text>,
        textStyle: profilePictureStyle?.fallbackTextStyle
      },
      size: 50,
      imageUrl: activity.activityByUser.imageUrl,
      ...profilePictureStyle,
    };
    const readBackgroundColor = notificationFeedStyle?.backgroundColor;
    const unreadBackgroundColor = notificationFeedStyle?.unreadBackgroundColor;
    const attachmentIconStyle =
      notificationFeedStyle?.activityAttachmentImageStyle;

      const BOLD_STYLE = "BOLD_STYLE"
      const NORMAL_STYLE = "NORMAL_STYLE"
      const routeRegex = /<<(.*?)>>/g;
      const activityTextArray = [{
        content: '',
        styleType: ''
      }];

      const segments = activity.activityText.split(routeRegex);
      segments.forEach(segment => {
        const match = segment.match(/(.*?)\|.*?/);
        if (match) {
          const matchedContent = match[1];
          activityTextArray.push({content: matchedContent, styleType: BOLD_STYLE})
        }else {
          activityTextArray.push({content: segment, styleType: NORMAL_STYLE})
        }
      })      

    return (
      <View
        style={StyleSheet.flatten([
          styles.container,
          {
            backgroundColor: activity.isRead
              ? readBackgroundColor
                ? readBackgroundColor
                : STYLES.$COLORS.WHITE
              : unreadBackgroundColor
              ? unreadBackgroundColor
              : STYLES.$COLORS.LIGHT_GREY,
          },
        ])}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onTap}
          style={styles.flexView}
        >
          {/* profile avatar view */}
          <View>
            {/* profile picture section */}
            <LMProfilePicture {...updatedProfilePictureProps} />
            {/* handles the gallery and document icon on profile picture */}
            {activityAttachments &&
              // show gallery icon
              (activityAttachmentType === IMAGE_ATTACHMENT_TYPE ||
              activityAttachmentType === VIDEO_ATTACHMENT_TYPE ? (
                <LMIcon
                  {...attachmentIconStyle}
                  assetPath={
                    attachmentIconStyle?.assetPath
                      ? attachmentIconStyle?.assetPath
                      : require("../../assets/images/notification_image3x.png")
                  }
                  boxStyle={
                    attachmentIconStyle?.boxStyle
                      ? attachmentIconStyle?.boxStyle
                      : styles.notificationTypeIcon
                  }
                  height={
                    attachmentIconStyle?.height
                      ? attachmentIconStyle?.height
                      : 35
                  }
                  width={
                    attachmentIconStyle?.width ? attachmentIconStyle?.width : 35
                  }
                />
              ) : // show document icon
              activityAttachmentType === DOCUMENT_ATTACHMENT_TYPE ? (
                <LMIcon
                  {...attachmentIconStyle}
                  assetPath={
                    attachmentIconStyle?.assetPath
                      ? attachmentIconStyle?.assetPath
                      : require("../../assets/images/notification_doc3x.png")
                  }
                  boxStyle={
                    attachmentIconStyle?.boxStyle
                      ? attachmentIconStyle?.boxStyle
                      : styles.notificationTypeIcon
                  }
                  height={
                    attachmentIconStyle?.height
                      ? attachmentIconStyle?.height
                      : 35
                  }
                  width={
                    attachmentIconStyle?.width ? attachmentIconStyle?.width : 35
                  }
                />
              ) : null)}
          </View>

          {/* activity content text */}
          <View style={styles.contentView}>
            <LMText
              textStyle={StyleSheet.flatten([
                styles.activityText,
                notificationFeedStyle?.activityTextStyles,
              ])}
              maxLines={2}
            >
              {activityTextArray.map((item) => (
                item?.styleType === BOLD_STYLE ? <Text style={{fontWeight:'500'}}>{item?.content}</Text> : <Text>{item?.content}</Text>
              ))}
            </LMText>
            <LMText
              textStyle={StyleSheet.flatten([
                styles.notificationTimeStamp, notificationFeedStyle?.timestampTextStyles
              ])}
            >
              {timeStamp(Number(activity.updatedAt))} ago
            </LMText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
);

export default LMNotificationFeedItem;
