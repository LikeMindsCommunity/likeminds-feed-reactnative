import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { LMPostMediaProps } from "./types";
import {
  LMCarousel,
  LMDocument,
  LMImage,
  LMLinkPreview,
  LMVideo,
} from "../../LMMedia";
import {
  DOCUMENT_ATTACHMENT_TYPE,
  IMAGE_ATTACHMENT_TYPE,
  LINK_ATTACHMENT_TYPE,
  VIDEO_ATTACHMENT_TYPE,
} from "../../../constants/Strings";
import { LMPostContextValues, useLMPostContext } from "../../../context";
import { useLMFeedStyles } from "../../../lmFeedProvider";

const LMPostMedia = React.memo(() => {
  const { post }: LMPostContextValues = useLMPostContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const { postListStyle } = LMFeedContextStyles;
  // this handles the rendering of posts with single attachment
  const renderSingleAttachment = () => {
    switch (post?.attachments && post?.attachments[0]?.attachmentType) {
      case IMAGE_ATTACHMENT_TYPE: {
        return (
          <LMImage
            imageUrl={
              post?.attachments
                ? post?.attachments[0]?.attachmentMeta.url
                  ? post?.attachments[0]?.attachmentMeta.url
                  : ""
                : ""
            }
            {...postListStyle?.media?.image}
          />
        );
      }
      case VIDEO_ATTACHMENT_TYPE: {
        return (
          <LMVideo
            videoUrl={
              post?.attachments
                ? post?.attachments[0]?.attachmentMeta.url
                  ? post?.attachments[0]?.attachmentMeta.url
                  : ""
                : ""
            }
            {...postListStyle?.media?.video}
          />
        );
      }
      case DOCUMENT_ATTACHMENT_TYPE: {
        return (
          <LMDocument
            attachments={post?.attachments}
            {...postListStyle?.media?.document}
          />
        );
      }
      case LINK_ATTACHMENT_TYPE: {
        return (
          <LMLinkPreview
            attachments={post?.attachments}
            {...postListStyle?.media?.linkPreview}
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
    const url = post?.attachments?.find(
      (item) => item?.attachmentType === type
    );
    return url?.attachmentMeta.url ? url?.attachmentMeta.url : "";
  };

  // this gets the required attachment type data to render in its component
  const getData = (type: number, type2?: number) => {
    const data =
      post?.attachments &&
      post?.attachments.filter(
        (item) => item.attachmentType === type || item.attachmentType === type2
      );
    return data;
  };

  return (
    <View
      style={StyleSheet.flatten([
        { paddingBottom: 5, paddingTop: 15 },
        postListStyle?.media?.postMediaStyle,
      ])}
    >
      {post?.attachments && post?.attachments?.length > 1 ? (
        // this section renders if there are multiple attachments
        post?.attachments?.filter(
          (item) =>
            item?.attachmentType === IMAGE_ATTACHMENT_TYPE ||
            item?.attachmentType === VIDEO_ATTACHMENT_TYPE
        ).length >= 2 ? (
          <LMCarousel
            attachments={getData(IMAGE_ATTACHMENT_TYPE, VIDEO_ATTACHMENT_TYPE)}
            {...postListStyle?.media?.carousel}
            imageItem={postListStyle?.media?.image}
            videoItem={postListStyle?.media?.video}
          />
        ) : (
          // this section renders if there are multiple attachments but the image or video attachments are less than 2
          <>
            {post?.attachments?.find(
              (item) => item?.attachmentType === IMAGE_ATTACHMENT_TYPE
            ) && (
              <LMImage
                imageUrl={getUrl(IMAGE_ATTACHMENT_TYPE)}
                {...postListStyle?.media?.image}
              />
            )}
            {post?.attachments?.find(
              (item) => item?.attachmentType === VIDEO_ATTACHMENT_TYPE
            ) && (
              <LMVideo
                videoUrl={getUrl(VIDEO_ATTACHMENT_TYPE)}
                {...postListStyle?.media?.video}
              />
            )}
            {post?.attachments?.find(
              (item) => item?.attachmentType === DOCUMENT_ATTACHMENT_TYPE
            ) && (
              <LMDocument
                attachments={getData(DOCUMENT_ATTACHMENT_TYPE)}
                {...postListStyle?.media?.document}
              />
            )}
            {post?.attachments?.every(
              (item) => item?.attachmentType === LINK_ATTACHMENT_TYPE
            ) && (
              <LMLinkPreview
                attachments={post?.attachments}
                {...postListStyle?.media?.linkPreview}
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
});

export default LMPostMedia;