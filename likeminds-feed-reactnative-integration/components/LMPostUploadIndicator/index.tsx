import { View, Text, Platform, TouchableOpacity } from "react-native";
import React from "react";
import LMLoader from "../LMLoader";
import STYLES from "../../constants/Styles";
import { styles } from "../../screens/universalFeed/styles";
import { POST_UPLOAD_RETRY, POST_UPLOADING } from "../../constants/Strings";
import {
  UniversalFeedContextValues,
  useUniversalFeedContext,
} from "../../context";
import { LMButton, LMIcon } from "../../uiComponents";

const LMPostUploadIndicator = () => {
  const { postUploading, addTemporaryPost, temporaryPost, abortRetry }: UniversalFeedContextValues =
    useUniversalFeedContext();

  const isUploadingFailed = !!temporaryPost && !postUploading;

  console.log("", temporaryPost)


  if (postUploading || isUploadingFailed) {
    return (
      <View>
        {/* post uploading section */}
        <View style={styles.postUploadingView}>
          <View style={styles.uploadingPostContentView}>
            <Text style={[
              styles.postUploadingText,
              isUploadingFailed ? {color: STYLES.$COLORS.RED} : null
              ]}>
              {isUploadingFailed ? POST_UPLOAD_RETRY : POST_UPLOADING}
            </Text>
          </View>
          {/* progress loader */}
          <View style={{ flexDirection: 'row', gap: 18 }}>
            {isUploadingFailed ?
              <View style={{ flexDirection: 'row', gap: 18 }}>
                <LMButton onTap={addTemporaryPost} icon={{
                  assetPath: require("../../assets/images/retry_icon3x.png"),
                  height: 20,
                  width: 20,
                }} buttonStyle={{ borderWidth: 0 }} />
                <LMButton onTap={abortRetry} icon={{
                  assetPath: require("../../assets/images/abort_retry_icon3x.png"),
                  height: 18,
                  width: 18,
                }} buttonStyle={{ borderWidth: 0 }} />
              </View> :
              null}
            {postUploading && <LMLoader
              size={
                Platform.OS === "ios"
                  ? STYLES.$LMLoaderSizeiOS
                  : STYLES.$LMLoaderSizeAndroid
              }
            />}
          </View>
        </View>
      </View>
    );
  }
  return null
};

export default LMPostUploadIndicator;
