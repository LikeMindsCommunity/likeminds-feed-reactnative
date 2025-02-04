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
                    uploadingHeaderStyle?.retryButtonStyle?.textStyle
                  ])
                }} onTap={addTemporaryPost} icon={{
                  assetPath: require("../../assets/images/retry_icon3x.png"),
                  height: 14,
                  width: 14,
                  color: STYLES.$COLORS.RED,
                  iconStyle: { marginRight: 5 },
                  ...uploadingHeaderStyle?.retryButtonStyle?.iconStyle
                  }} buttonStyle={StyleSheet.flatten([
                    {
                      borderWidth: 1, backgroundColor: '#FEE4E2', borderColor: '#FEE4E2',
                      paddingHorizontal: 8, paddingVertical: 6, borderRadius: 20
                    },
                  uploadingHeaderStyle?.retryButtonStyle?.buttonStyle
                ])} />
                <LMButton onTap={abortRetry}
                  text={{
                    children: "Cancel",
                    textStyle: StyleSheet.flatten([
                      {
                        color: "#344054"
                      },
                      uploadingHeaderStyle?.cancelButtonStyle?.textStyle
                    ])
                  }}
                  buttonStyle={StyleSheet.flatten([
                    { borderWidth: 1, backgroundColor: '#F2F4F7', borderColor: '#F2F4F7', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 20 },
                    uploadingHeaderStyle?.cancelButtonStyle?.buttonStyle
                  ])}
                />
              </View> :
              null}
            {postUploading && uploadProgress == 0 && <LMLoader size={
              Platform.OS === "ios"
                ? STYLES.$LMLoaderSizeiOS
                : STYLES.$LMLoaderSizeAndroid
            } />}
            {postUploading && uploadProgress > 0 && <AnimatedCircularProgress
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
