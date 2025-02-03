import { View, Text, Platform } from "react-native";
import React from "react";
import LMLoader from "../LMLoader";
import STYLES from "../../constants/Styles";
import { styles } from "../../screens/feed/styles";
import { POST_UPLOADING } from "../../constants/Strings";
import {
  FeedContextValues,
  useFeedContext,
} from "../../context";

const LMPostUploadIndicator = () => {
  const { postUploading }: FeedContextValues =
    useFeedContext();
  return (
    <View>
      {/* post uploading section */}
      {postUploading && (
        <View style={styles.postUploadingView}>
          <View style={styles.uploadingPostContentView}>
            <Text style={styles.postUploadingText}>{POST_UPLOADING}</Text>
          </View>
          {/* progress loader */}
          <LMLoader
            size={
              Platform.OS === "ios"
                ? STYLES.$LMLoaderSizeiOS
                : STYLES.$LMLoaderSizeAndroid
            }
          />
        </View>
      )}
    </View>
  );
};

export default LMPostUploadIndicator;
