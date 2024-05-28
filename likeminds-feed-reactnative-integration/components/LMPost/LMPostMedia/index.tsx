import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
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
import { useAppDispatch } from "../../../store/store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { STATUS_BAR_STYLE } from "../../../store/types/types";
import { CAROUSEL_SCREEN } from "../../../constants/screenNames";
import STYLES from "../../../constants/Styles";

const LMPostMedia = React.memo(() => {
  const { post, mediaProps }: LMPostContextValues = useLMPostContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const { postListStyle } = LMFeedContextStyles;
  const customPostMediaStyle: any = postListStyle?.media;

  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  // this handles the rendering of posts with single attachment
  const renderSingleAttachment = () => {
    switch (post?.attachments && post?.attachments[0]?.attachmentType) {
      case IMAGE_ATTACHMENT_TYPE: {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(CAROUSEL_SCREEN, {
                dataObject: post,
                index: 0,
              });
              dispatch({
                type: STATUS_BAR_STYLE,
                body: { color: STYLES.$STATUS_BAR_STYLE["light-content"] },
              });
            }}
          >
            <LMImage
              imageUrl={
                post?.attachments
                  ? post?.attachments[0]?.attachmentMeta.url
                    ? post?.attachments[0]?.attachmentMeta.url
                    : ""
                  : ""
              }
              {...customPostMediaStyle?.image}
            />
          </TouchableOpacity>
        );
      }
      case VIDEO_ATTACHMENT_TYPE: {
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(CAROUSEL_SCREEN, {
                dataObject: post,
                index: 0,
              });
              dispatch({
                type: STATUS_BAR_STYLE,
                body: { color: STYLES.$STATUS_BAR_STYLE["light-content"] },
              });
            }}
          >
            <LMVideo
              videoUrl={
                post?.attachments
                  ? post?.attachments[0]?.attachmentMeta.url
                    ? post?.attachments[0]?.attachmentMeta.url
                    : ""
                  : ""
              }
              postId={post?.id}
              {...customPostMediaStyle?.video}
              autoPlay={
                mediaProps?.videoProps?.autoPlay != undefined
                  ? mediaProps?.videoProps?.autoPlay
                  : true
              }
              videoInFeed={mediaProps?.videoProps?.videoInFeed}
              showMuteUnmute={true}
            />
          </TouchableOpacity>
        );
      }
      case DOCUMENT_ATTACHMENT_TYPE: {
        return (
          /* @ts-ignore */
          <LMDocument
            /* @ts-ignore */
            attachments={post?.attachments}
            {...customPostMediaStyle?.document}
          />
        );
      }
      case LINK_ATTACHMENT_TYPE: {
        return (
          /* @ts-ignore */
          <LMLinkPreview
            /* @ts-ignore */
            attachments={post?.attachments}
            {...customPostMediaStyle?.linkPreview}
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
        customPostMediaStyle?.postMediaStyle,
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
            post={post}
            attachments={getData(IMAGE_ATTACHMENT_TYPE, VIDEO_ATTACHMENT_TYPE)}
            {...customPostMediaStyle?.carousel}
            imageItem={customPostMediaStyle?.image}
            videoItem={{
              ...customPostMediaStyle?.video,
              autoPlay:
                mediaProps?.videoProps?.autoPlay != undefined
                  ? mediaProps?.videoProps?.autoPlay
                  : true,
              videoInFeed: mediaProps?.videoProps?.videoInFeed,
              postId: post?.id,
            }}
          />
        ) : (
          // this section renders if there are multiple attachments but the image or video attachments are less than 2
          <>
            {post?.attachments?.find(
              (item) => item?.attachmentType === IMAGE_ATTACHMENT_TYPE
            ) && (
              <LMImage
                imageUrl={getUrl(IMAGE_ATTACHMENT_TYPE)}
                {...customPostMediaStyle?.image}
              />
            )}
            {post?.attachments?.find(
              (item) => item?.attachmentType === VIDEO_ATTACHMENT_TYPE
            ) && (
              <LMVideo
                videoUrl={getUrl(VIDEO_ATTACHMENT_TYPE)}
                postId={post?.id}
                {...customPostMediaStyle?.video}
                autoPlay={
                  mediaProps?.videoProps?.autoPlay != undefined
                    ? mediaProps?.videoProps?.autoPlay
                    : true
                }
                videoInFeed={mediaProps?.videoProps?.videoInFeed}
              />
            )}
            {post?.attachments?.find(
              (item) => item?.attachmentType === DOCUMENT_ATTACHMENT_TYPE
            ) && (
              <LMDocument
                attachments={getData(DOCUMENT_ATTACHMENT_TYPE)}
                {...customPostMediaStyle?.document}
              />
            )}
            {post?.attachments?.every(
              (item) => item?.attachmentType === LINK_ATTACHMENT_TYPE
            ) && (
              <LMLinkPreview
                attachments={post?.attachments}
                {...customPostMediaStyle?.linkPreview}
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
