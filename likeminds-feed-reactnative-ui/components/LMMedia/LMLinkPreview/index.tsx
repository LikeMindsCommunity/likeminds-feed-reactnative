import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import React from 'react';
import {LMLinkPreviewProps} from './types';
import STYLES from '../../../constants/constants';
import LMImage from '../LMImage';
import LMButton from '../../LMButton';

const LMLinkPreview = ({
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
}: LMLinkPreviewProps) => {
  const previewAttachmentData = attachments[0].attachmentMeta?.ogTags;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.postMedia}
      onPress={() => {
        Linking.openURL(
          previewAttachmentData?.url
            ? previewAttachmentData.url.includes('https://')
              ? previewAttachmentData.url
              : `https://${previewAttachmentData.url}`
            : '',
        );
        onTap;
      }}>
      {/* link preview image */}
      <View
        style={StyleSheet.flatten([
          styles.previewContainer,
          linkPreviewBoxStyle,
        ])}>
        {attachments && previewAttachmentData?.image && (
          <LMImage
            imageUrl={previewAttachmentData?.image}
            imageStyle={StyleSheet.flatten([
              styles.previewImage,
              linkImageStyle,
              {
                display:
                  showImage !== undefined
                    ? showImage
                      ? 'flex'
                      : 'none'
                    : 'flex',
              },
            ])}
            height={220}
            boxStyle={styles.previewImageView}
            boxFit="contain"
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
                      ? 'flex'
                      : 'none'
                    : 'flex',
                width: showCancel ? '92%' : '100%',
              },
            ])}>
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
                      ? 'flex'
                      : 'none'
                    : 'flex',
              },
            ])}>
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
                      ? 'flex'
                      : 'none'
                    : 'flex',
                textTransform: 'lowercase',
              },
            ])}>
            {previewAttachmentData?.url}
          </Text>
        </View>
        {/* this renders the cancel button */}
        {showCancel && (
          <View style={styles.cancelButtonView}>
            <LMButton
              onTap={onCancel ? () => onCancel() : () => null}
              buttonStyle={styles.cancelButton}
              icon={{
                assetPath: require('../../../assets/images/crossCircle_icon3x.png'),
                type: 'png',
                height: 22,
                width: 22,
              }}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postMedia: {
    width: '100%',
    paddingHorizontal: 15,
  },
  previewContainer: {
    borderColor: STYLES.$COLORS.LIGHT_GREY,
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  previewTitle: {
    fontWeight: '500',
    color: STYLES.$COLORS.TEXT_COLOR,
    fontSize: 16,
  },
  previewDescription: {
    color: STYLES.$COLORS.TEXT_COLOR,
    paddingVertical: 2,
    opacity: 0.8,
  },
  previewLink: {
    color: STYLES.$COLORS.TEXT_COLOR,
    fontSize: 12,
    opacity: 0.7,
  },
  previewDetailView: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  cancelButtonView: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  previewImageView: {
    borderRadius: 8,
    width: '100%',
  },
  cancelButton: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});

export default LMLinkPreview;
