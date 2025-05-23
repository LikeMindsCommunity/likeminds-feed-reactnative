import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import React from "react";
import { LMLinkPreviewProps } from "./types";
import LMImage from "../LMImage";
import { LMButton } from "../../../uiComponents";
import { styles } from "./styles";

const LMLinkPreview = React.memo(
  ({
    attachments,
    onTap,
    showLinkUrl,
    linkPreviewBoxStyle,
    linkImageStyle,
    linkTitleStyle,
    linkDescriptionStyle,
    linkUrlStyle,
    showDescription,
    showImage,
    showTitle,
    showCancel,
    onCancel,
    cancelButton,
  }: LMLinkPreviewProps) => {
    const previewAttachmentData = attachments[0]?.metaData?.ogTags;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.postMedia}
        onPress={() => {
          Linking.openURL(
            previewAttachmentData?.url
              ? previewAttachmentData.url.includes("https://")
                ? previewAttachmentData.url
                : `https://${previewAttachmentData.url}`
              : ""
          );
          onTap && onTap();
        }}
      >
        {/* link preview image */}
        <View
          style={StyleSheet.flatten([
            styles.previewContainer,
            linkPreviewBoxStyle,
          ])}
        >
          {attachments && previewAttachmentData?.image && (
            <Image
              source={{ uri: previewAttachmentData?.image }}
              style={StyleSheet.flatten([
                styles.previewImage,
                linkImageStyle,
                {
                  display:
                    showImage !== undefined
                      ? showImage
                        ? "flex"
                        : "none"
                      : "flex",
                },
              ])}
            />
          )}
          {/* link preview data */}
          <View style={styles.previewDetailView}>
            {/* preview title */}
            <Text
              style={StyleSheet.flatten([
                styles.previewTitle,
                linkTitleStyle,
                {
                  display:
                    showTitle !== undefined
                      ? showTitle
                        ? "flex"
                        : "none"
                      : "flex",
                  width: showCancel ? "92%" : "100%",
                },
              ])}
            >
              {previewAttachmentData?.title}
            </Text>
            {/* preview description */}
            <Text
              style={StyleSheet.flatten([
                styles.previewDescription,
                linkDescriptionStyle,
                {
                  display:
                    showDescription !== undefined
                      ? showDescription
                        ? "flex"
                        : "none"
                      : "flex",
                },
              ])}
            >
              {previewAttachmentData?.description}
            </Text>
            {/* preview url */}
            <Text
              style={StyleSheet.flatten([
                styles.previewLink,
                linkUrlStyle,
                {
                  display:
                    showLinkUrl !== undefined
                      ? showLinkUrl
                        ? "flex"
                        : "none"
                      : "flex",
                  textTransform: "lowercase",
                },
              ])}
            >
              {previewAttachmentData?.url}
            </Text>
          </View>
          {/* this renders the cancel button */}
          {showCancel && (
            <View style={styles.cancelButtonView}>
              {cancelButton ? (
                <LMButton
                  {...cancelButton}
                  onTap={
                    onCancel
                      ? () => {
                          onCancel();
                          cancelButton?.onTap();
                        }
                      : () => null
                  }
                />
              ) : (
                <LMButton
                  onTap={onCancel ? () => onCancel() : () => null}
                  buttonStyle={styles.cancelButton}
                  icon={{
                    assetPath: require("../../../assets/images/crossCircle_icon3x.png"),
                    height: 22,
                    width: 22,
                  }}
                />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

export default LMLinkPreview;
