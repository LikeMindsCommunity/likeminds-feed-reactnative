import { View, Text, Platform, TouchableOpacity } from "react-native";
import React from "react";
import LMLoader from "../LMLoader";
import STYLES from "../../constants/Styles";
import { styles } from "../../screens/universalFeed/styles";
import { POST_UPLOADING } from "../../constants/Strings";
import {
  UniversalFeedContextValues,
  useUniversalFeedContext,
} from "../../context";

const LMPostUploadIndicator = () => {
  const { postUploading, addTemporaryPost, temporaryPost }: UniversalFeedContextValues =
    useUniversalFeedContext();


  if (postUploading || temporaryPost) {
    return (
      <View>
        {/* post uploading section */}
        <View style={styles.postUploadingView}>
          <View style={styles.uploadingPostContentView}>
            <Text style={styles.postUploadingText}>{POST_UPLOADING}</Text>
          </View>
          {/* progress loader */}
          <View style={{ flexDirection: 'row', gap: 18 }}>
            {temporaryPost && !postUploading && <TouchableOpacity onPress={addTemporaryPost}>
              <Text style={{ color: STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK }}>Retry</Text>
            </TouchableOpacity>}
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
