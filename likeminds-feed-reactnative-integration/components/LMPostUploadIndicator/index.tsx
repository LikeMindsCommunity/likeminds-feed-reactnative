import { View, Text, Platform, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import LMLoader from "../LMLoader";
import STYLES from "../../constants/Styles";
import { styles } from "../../screens/universalFeed/styles";
import { POST_UPLOAD_RETRY, POST_UPLOADING } from "../../constants/Strings";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {
  UniversalFeedContextValues,
  useUniversalFeedContext,
} from "../../context";
import { LMButton, LMIcon } from "../../uiComponents";

const LMPostUploadIndicator = () => {
  const { postUploading, addTemporaryPost, temporaryPost, abortRetry, uploadProgress }: UniversalFeedContextValues =
    useUniversalFeedContext();

  const isUploadingFailed = !!temporaryPost && !postUploading;

  const uploadingHeaderStyle = STYLES.$UPLOADING_HEADER_STYLES


  if (isUploadingFailed || postUploading) {
    return (
      <View>
        {/* post uploading section */}
        <View style={styles.postUploadingView}>
          <View style={styles.uploadingPostContentView}>
            <Text style={StyleSheet.flatten([
              styles.postUploadingText,
              uploadingHeaderStyle?.uploadingTextStyle
            ])}>
              {isUploadingFailed ? POST_UPLOAD_RETRY : POST_UPLOADING}
            </Text>
          </View>
          {/* progress loader */}
          <View style={{ flexDirection: 'row', gap: 18 }}>
            {isUploadingFailed ?
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <LMButton text={{
                  children: "Retry",
                  textStyle: StyleSheet.flatten([
                    {
                      color: STYLES.$COLORS.RED,
                      fontWeight: '600'
                    },
                    uploadingHeaderStyle?.retryButtonStyle?.text?.textStyle
                  ])
                }} onTap={addTemporaryPost} icon={{
                  assetPath: require("../../assets/images/retry_icon3x.png"),
                  height: 14,
                  width: 14,
                  color: STYLES.$COLORS.RED,
                  iconStyle: { marginRight: 5 },
                  ...uploadingHeaderStyle?.retryButtonStyle?.icon
                }} buttonStyle={StyleSheet.flatten([
                  { borderWidth: 1, backgroundColor: '#FEE4E2', borderColor: '#FEE4E2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
                  uploadingHeaderStyle?.retryButtonStyle?.buttonStyle
                ])} />
                <LMButton onTap={abortRetry}
                  text={{
                    children: "Cancel",
                  }}
                  buttonStyle={{ borderWidth: 1, backgroundColor: '#F2F4F7', borderColor: '#F2F4F7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }}
                  {...uploadingHeaderStyle?.cancelButtonStyle}
                />
              </View> :
              null}
            {postUploading && <AnimatedCircularProgress
              size={22}
              width={2}
              fill={Math.round(uploadProgress)}
              tintColor={STYLES.$COLORS.PRIMARY}
              {...uploadingHeaderStyle?.progressBarStyle}
            />}
          </View>
        </View>
      </View>
    );
  }
  return null
};

export default LMPostUploadIndicator;
