import { View, Text, Platform } from "react-native";
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
  const { postUploading }: UniversalFeedContextValues =
    useUniversalFeedContext();
  return (
    <View>
      {/* post uploading section */}
      {postUploading && (
        <View style={styles.postUploadingView}>
          <View style={styles.uploadingPostContentView}>
            {/* post uploading media preview */}
            {/* {uploadingMediaAttachmentType === IMAGE_ATTACHMENT_TYPE && (
              <LMImage
                imageUrl={uploadingMediaAttachment}
                imageStyle={styles.uploadingImageStyle}
                boxStyle={styles.uploadingImageVideoBox}
                width={styles.uploadingImageVideoBox.width}
                height={styles.uploadingImageVideoBox.height}
              />
            )}
            {uploadingMediaAttachmentType === VIDEO_ATTACHMENT_TYPE && (
              <LMVideo
                videoUrl={uploadingMediaAttachment}
                videoStyle={styles.uploadingVideoStyle}
                boxStyle={styles.uploadingImageVideoBox}
                width={styles.uploadingImageVideoBox.width}
                height={styles.uploadingImageVideoBox.height}
                showControls={false}
                boxFit="contain"
                autoPlay={false}
              />
            )}
            {uploadingMediaAttachmentType === DOCUMENT_ATTACHMENT_TYPE && (
              <LMIcon
                assetPath={require("../../assets/images/pdf_icon3x.png")}
                iconStyle={styles.uploadingDocumentStyle}
                height={styles.uploadingPdfIconSize.height}
                width={styles.uploadingPdfIconSize.width}
              />
            )} */}
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
