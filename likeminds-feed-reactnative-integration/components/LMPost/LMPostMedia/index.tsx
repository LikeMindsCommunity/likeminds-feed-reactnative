import { View, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import LMCarousel from "../../LMMedia/LMCarousel";
import LMDocument from "../../LMMedia/LMDocument";
import LMImage from "../../LMMedia/LMImage";
import LMLinkPreview from "../../LMMedia/LMLinkPreview";
import LMVideo from "../../LMMedia/LMVideo";
import {
  DOCUMENT_ATTACHMENT_TYPE,
  IMAGE_ATTACHMENT_TYPE,
  LINK_ATTACHMENT_TYPE,
  POLL_ATTACHMENT_TYPE,
  VIDEO_ATTACHMENT_TYPE,
} from "../../../constants/Strings";
import { LMPostContextValues, useLMPostContext } from "../../../context";
import { useAppDispatch } from "../../../store/store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SET_FLOW_TO_CAROUSEL_SCREEN,
  STATUS_BAR_STYLE,
} from "../../../store/types/types";
import {
  CAROUSEL_SCREEN,
  UNIVERSAL_FEED,
} from "../../../constants/screenNames";
import STYLES from "../../../constants/Styles";
import LMPostPollView from "../../LMPoll/LMPostPollView";
import { AttachmentType } from "@likeminds.community/feed-rn";

const LMPostMedia = React.memo(() => {
  const { post, mediaProps }: LMPostContextValues = useLMPostContext();
  const postListStyle = STYLES.$POST_LIST_STYLE;
  const customPostMediaStyle: any = postListStyle?.media;

  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  let routes = navigation.getState()?.routes;
  let previousRoute = routes[routes?.length - 2];
  // this handles the rendering of posts with single attachment
  const renderSingleAttachment = () => {
    switch (post?.attachments && post?.attachments[0]?.type) {
      case AttachmentType.IMAGE: {
        return (
          <Pressable
            onPress={() => {
              navigation.navigate(CAROUSEL_SCREEN, {
                dataObject: post,
                index: 0,
              });
              dispatch({
                type: STATUS_BAR_STYLE,
                body: { color: STYLES.$STATUS_BAR_STYLE["light-content"] },
              });
              dispatch({
                type: SET_FLOW_TO_CAROUSEL_SCREEN,
                body: { flowToCarouselScreen: true },
              });
            }}
          >
            <LMImage
              height={post?.attachments[0]?.metaData?.height}
              width={post?.attachments[0]?.metaData?.width}
              imageUrl={
                post?.attachments
                  ? post?.attachments[0]?.metaData.url
                    ? post?.attachments[0]?.metaData.url
                    : ""
                  : ""
              }
              {...customPostMediaStyle?.image}
            />
          </Pressable>
        );
      }
      case AttachmentType.VIDEO: {
        return (
          <Pressable
            onPress={() => {
              navigation.navigate(CAROUSEL_SCREEN, {
                dataObject: post,
                index: 0,
              });
              dispatch({
                type: STATUS_BAR_STYLE,
                body: { color: STYLES.$STATUS_BAR_STYLE["light-content"] },
              });
              dispatch({
                type: SET_FLOW_TO_CAROUSEL_SCREEN,
                body: { flowToCarouselScreen: true },
              });
            }}
          >
            <LMVideo
              height={post?.attachments[0]?.metaData?.height}
              width={post?.attachments[0]?.metaData?.width}
              videoUrl={
                post?.attachments
                  ? post?.attachments[0]?.metaData.url
                    ? post?.attachments[0]?.metaData.url
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
              // videoInFeed={mediaProps?.videoProps?.videoInFeed}
              videoInFeed={
                previousRoute?.name === UNIVERSAL_FEED ? false : true
              }
              videoInCarousel={false}
              showMuteUnmute={true}
            />
          </Pressable>
        );
      }
      case AttachmentType.DOCUMENT: {
        return (
          /* @ts-ignore */
          <LMDocument
            /* @ts-ignore */
            attachments={post?.attachments}
            {...customPostMediaStyle?.document}
          />
        );
      }
      case AttachmentType.LINK: {
        return (
          /* @ts-ignore */
          <LMLinkPreview
            /* @ts-ignore */
            attachments={post?.attachments}
            {...customPostMediaStyle?.linkPreview}
          />
        );
      }
      case AttachmentType.POLL: {
        return (
          /* @ts-ignore */
          <View style={{ paddingHorizontal: 20 }}>
            <LMPostPollView
              item={post?.attachments && post?.attachments[0]?.metaData}
              post={post}
            />
          </View>
        );
      }
      default: {
        break;
      }
    }
  };

  // this functions gets the url of image and video for rendering in its components
  const getUrl = (type: AttachmentType) => {
    const url = post?.attachments?.find(
      (item) => item?.type === type
    );
    return url
  };

  // this gets the required attachment type data to render in its component
  const getData = (type: AttachmentType, type2?: AttachmentType) => {
    const data =
      post?.attachments &&
      post?.attachments.filter(
        (item) => item.type === type || item.type === type2
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
            item?.type === AttachmentType.IMAGE ||
            item?.type === AttachmentType.VIDEO
        ).length >= 2 ? (
          <LMCarousel
            post={post}
            attachments={getData(AttachmentType.IMAGE, AttachmentType.VIDEO)}
            {...customPostMediaStyle?.carousel}
            imageItem={customPostMediaStyle?.image}
            videoItem={{
              ...customPostMediaStyle?.video,
              autoPlay:
                mediaProps?.videoProps?.autoPlay != undefined
                  ? mediaProps?.videoProps?.autoPlay
                  : true,
              videoInFeed:
                previousRoute?.name === UNIVERSAL_FEED ? false : true,
              postId: post?.id,
            }}
          />
        ) : (
          // this section renders if there are multiple attachments but the image or video attachments are less than 2
          <>
            {post?.attachments?.find(
              (item) => item?.type === AttachmentType.IMAGE
            ) && (
              <LMImage
                imageUrl={getUrl(AttachmentType.IMAGE)?.metaData?.url}
                height={getUrl(AttachmentType.IMAGE)?.metaData?.height ?? 400}
                width={getUrl(AttachmentType.IMAGE)?.metaData?.width ?? 800}
                {...customPostMediaStyle?.image}
              />
            )}
            {post?.attachments?.find(
              (item) => item?.type === AttachmentType.VIDEO
            ) && (
              <LMVideo
                videoUrl={getUrl(AttachmentType.VIDEO)?.metaData?.url}
                height={getUrl(AttachmentType.VIDEO)?.metaData?.height ?? 400}
                width={getUrl(AttachmentType.VIDEO)?.metaData?.width ?? 800}
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
              (item) => item?.type === AttachmentType.DOCUMENT
            ) && (
              <LMDocument
                attachments={getData(AttachmentType.DOCUMENT)}
                {...customPostMediaStyle?.document}
              />
            )}
            {post?.attachments?.every(
              (item) => item?.type === AttachmentType.LINK
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
