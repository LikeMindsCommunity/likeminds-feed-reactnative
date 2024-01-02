import {View, StyleSheet} from 'react-native';
import React from 'react';
import {LMPostMediaProps} from './types';
import {
  LMCarousel,
  LMDocument,
  LMImage,
  LMLinkPreview,
  LMVideo,
} from '../../LMMedia';
import { ATTACHMENT_TYPE } from '../../../constants/strings';

const LMPostMedia = ({
  attachments,
  postMediaStyle,
  imageProps,
  videoProps,
  documentProps,
  carouselProps,
  linkPreviewProps,
}: LMPostMediaProps) => {
  // this handles the rendering of posts with single attachment
  const renderSingleAttachment = () => {
    switch (attachments[0]?.attachmentType) {
      case ATTACHMENT_TYPE.IMAGE: {
        return (
          <LMImage
            imageUrl={
              attachments[0]?.attachmentMeta.url
                ? attachments[0]?.attachmentMeta.url
                : ''
            }
            imageStyle={imageProps?.imageStyle}
            height={imageProps?.height}
            width={imageProps?.width}
            boxStyle={imageProps?.boxStyle}
            boxFit={imageProps?.boxFit}
            aspectRatio={imageProps?.aspectRatio}
            loaderWidget={imageProps?.loaderWidget}
            errorWidget={imageProps?.errorWidget}
          />
        );
      }
      case ATTACHMENT_TYPE.VIDEO: {
        return (
          <LMVideo
            videoUrl={
              attachments[0]?.attachmentMeta.url
                ? attachments[0]?.attachmentMeta.url
                : ''
            }
            height={videoProps?.height}
            width={videoProps?.width}
            videoStyle={videoProps?.videoStyle}
            boxFit={videoProps?.boxFit}
            boxStyle={videoProps?.boxStyle}
            aspectRatio={videoProps?.aspectRatio}
            showControls={videoProps?.showControls}
            playButton={videoProps?.playButton}
            pauseButton={videoProps?.pauseButton}
            autoPlay={videoProps?.autoPlay}
            looping={videoProps?.looping}
            loaderWidget={videoProps?.loaderWidget}
            errorWidget={videoProps?.errorWidget}
            currentVideoUrl={videoProps?.currentVideoUrl}
          />
        );
      }
      case ATTACHMENT_TYPE.DOCUMENT: {
        return (
          <LMDocument
            attachments={attachments}
            documentIcon={documentProps?.documentIcon}
            showPageCount={documentProps?.showPageCount}
            showDocumentFormat={documentProps?.showDocumentFormat}
            showDocumentSize={documentProps?.showDocumentSize}
            onTap={documentProps?.onTap}
            documentTitleStyle={documentProps?.documentTitleStyle}
            documentDetailStyle={documentProps?.documentDetailStyle}
            documentViewStyle={documentProps?.documentViewStyle}
            defaultIconSize={documentProps?.defaultIconSize}
          />
        );
      }
      case ATTACHMENT_TYPE.LINK: {
        return (
          <LMLinkPreview
            attachments={attachments}
            onTap={linkPreviewProps?.onTap}
            showLinkUrl={linkPreviewProps?.showLinkUrl}
            linkPreviewBoxStyle={linkPreviewProps?.linkPreviewBoxStyle}
            linkImageStyle={linkPreviewProps?.linkImageStyle}
            linkTitleStyle={linkPreviewProps?.linkTitleStyle}
            linkDescriptionStyle={linkPreviewProps?.linkDescriptionStyle}
            linkUrlStyle={linkPreviewProps?.linkUrlStyle}
            showDescription={linkPreviewProps?.showDescription}
            showImage={linkPreviewProps?.showImage}
            showTitle={linkPreviewProps?.showTitle}
          />
        );
      }
      default: {
        break;
      }
    }
  };

  // this functions gets the url of image and video for rendering in its components
  const getUrl = (type: number) => {
    const url = attachments?.find(item => item?.attachmentType === type);
    return url?.attachmentMeta.url ? url?.attachmentMeta.url : '';
  };

  // this gets the required attachment type data to render in its component
  const getData = (type: number, type2?: number) => {
    const data = attachments.filter(
      item => item.attachmentType === type || item.attachmentType === type2,
    );
    return data;
  };

  return (
    <View
      style={StyleSheet.flatten([
        {paddingBottom: 5, paddingTop: 15},
        postMediaStyle,
      ])}>
      {attachments?.length > 1 ? (
        // this section renders if there are multiple attachments
        attachments?.filter(
          item =>
            item?.attachmentType === ATTACHMENT_TYPE.IMAGE ||
            item?.attachmentType === ATTACHMENT_TYPE.VIDEO,
        ).length >= 2 ? (
          <LMCarousel
            attachments={getData(ATTACHMENT_TYPE.IMAGE, ATTACHMENT_TYPE.VIDEO)}
            carouselStyle={carouselProps?.carouselStyle}
            paginationBoxStyle={carouselProps?.paginationBoxStyle}
            activeIndicatorStyle={carouselProps?.activeIndicatorStyle}
            inactiveIndicatorStyle={carouselProps?.inactiveIndicatorStyle}
            imageItem={carouselProps?.imageItem}
            videoItem={carouselProps?.videoItem}
          />
        ) : (
          // this section renders if there are multiple attachments but the image or video attachments are less than 2
          <>
            {attachments?.find(
              item => item?.attachmentType === ATTACHMENT_TYPE.IMAGE,
            ) && (
              <LMImage
                imageUrl={getUrl(ATTACHMENT_TYPE.IMAGE)}
                imageStyle={imageProps?.imageStyle}
                height={imageProps?.height}
                width={imageProps?.width}
                boxStyle={imageProps?.boxStyle}
                boxFit={imageProps?.boxFit}
                aspectRatio={imageProps?.aspectRatio}
                loaderWidget={imageProps?.loaderWidget}
                errorWidget={imageProps?.errorWidget}
              />
            )}
            {attachments?.find(
              item => item?.attachmentType === ATTACHMENT_TYPE.VIDEO,
            ) && (
              <LMVideo
                videoUrl={getUrl(ATTACHMENT_TYPE.VIDEO)}
                height={videoProps?.height}
                width={videoProps?.width}
                videoStyle={videoProps?.videoStyle}
                boxFit={videoProps?.boxFit}
                boxStyle={videoProps?.boxStyle}
                aspectRatio={videoProps?.aspectRatio}
                showControls={videoProps?.showControls}
                playButton={videoProps?.playButton}
                pauseButton={videoProps?.pauseButton}
                autoPlay={videoProps?.autoPlay}
                looping={videoProps?.looping}
                loaderWidget={videoProps?.loaderWidget}
                errorWidget={videoProps?.errorWidget}
                currentVideoUrl={videoProps?.currentVideoUrl}
              />
            )}
            {attachments?.find(
              item => item?.attachmentType === ATTACHMENT_TYPE.DOCUMENT,
            ) && (
              <LMDocument
                attachments={getData(ATTACHMENT_TYPE.DOCUMENT)}
                documentIcon={documentProps?.documentIcon}
                showPageCount={documentProps?.showPageCount}
                showDocumentFormat={documentProps?.showDocumentFormat}
                showDocumentSize={documentProps?.showDocumentSize}
                onTap={documentProps?.onTap}
                documentTitleStyle={documentProps?.documentTitleStyle}
                documentDetailStyle={documentProps?.documentDetailStyle}
                documentViewStyle={documentProps?.documentViewStyle}
                defaultIconSize={documentProps?.defaultIconSize}
              />
            )}
            {attachments?.every(
              item => item?.attachmentType === ATTACHMENT_TYPE.LINK,
            ) && (
              <LMLinkPreview
                attachments={attachments}
                onTap={linkPreviewProps?.onTap}
                showLinkUrl={linkPreviewProps?.showLinkUrl}
                linkPreviewBoxStyle={linkPreviewProps?.linkPreviewBoxStyle}
                linkImageStyle={linkPreviewProps?.linkImageStyle}
                linkTitleStyle={linkPreviewProps?.linkTitleStyle}
                linkDescriptionStyle={linkPreviewProps?.linkDescriptionStyle}
                linkUrlStyle={linkPreviewProps?.linkUrlStyle}
                showDescription={linkPreviewProps?.showDescription}
                showImage={linkPreviewProps?.showImage}
                showTitle={linkPreviewProps?.showTitle}
              />
            )}
          </>
        )
      ) : (
        // this section renders if there is a single attachment
        <>{renderSingleAttachment()}</>
      )}
    </View>
  );
};

export default LMPostMedia;
