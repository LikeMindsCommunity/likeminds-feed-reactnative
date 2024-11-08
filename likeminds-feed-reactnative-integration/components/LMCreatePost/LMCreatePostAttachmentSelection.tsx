import { View, Text, Alert, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import {
  CreatePostContextValues,
  useCreatePostContext,
  useCreatePostCustomisableMethodsContext,
} from "../../context";
import {
  ADD_SELECTED_TOPICS,
  CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
  SET_DISABLED_TOPICS,
  SET_FLOW_TO_CREATE_POST_SCREEN,
  SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
} from "../../store/types/types";
import { LMFeedAnalytics } from "../../analytics/LMFeedAnalytics";
import { Events } from "../../enums/Events";
import { userTaggingDecoder } from "../../utils/decodeMentions";
import { Keys } from "../../enums/Keys";
import { useRoute } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Client } from "../../client";
import STYLES from "../../constants/Styles";
import {
  ADD_FILES,
  ADD_IMAGES,
  ADD_POLL,
  ADD_POST_TEXT,
  ADD_VIDEOS,
  DOCUMENT_ATTACHMENT_TYPE,
  IMAGE_ATTACHMENT_TYPE,
  SAVE_POST_TEXT,
  SELECT_FILE,
  SELECT_IMAGE,
  SELECT_VIDEO,
  VIDEO_ATTACHMENT_TYPE,
} from "../../constants/Strings";
import LMHeader from "../LMHeader";
import { styles } from "../../screens/createPost/styles";
import { LMIcon, LMText } from "../../uiComponents";

const LMCreatePostAttachmentSelection = () => {
  const dispatch = useAppDispatch();
  const createPostStyle = STYLES.$CREATE_POST_STYLE;
  const customAttachmentOptionsStyle: any =
    createPostStyle?.attachmentOptionsStyle;
  let {
    postToEdit,
    showOptions,
    handleDocument,
    handlePoll,
    handleGallery,
  }: CreatePostContextValues = useCreatePostContext();
  const myClient = Client.myClient;
  const [showTopics, setShowTopics] = useState(false);
  const route: any = useRoute();
  const hidePoll = route?.params?.hidePoll || STYLES.$POLL_STYLE?.hidePoll;

  const getTopics = async () => {
    const apiRes = await myClient?.getTopics({
      isEnabled: null,
      search: "",
      searchType: "name",
      page: 1,
      pageSize: 10,
    } as any);
    const topics: any = apiRes?.data?.topics;
    if (topics?.length > 0) {
      setShowTopics(true);
    }
  };

  useEffect(() => {
    getTopics();
  }, [showTopics]);

  const { handleDocumentProp, handlePollProp, handleGalleryProp } =
    useCreatePostCustomisableMethodsContext();
  return (
    <View>
      {!postToEdit && showOptions && (
        <View
          style={[
            styles.selectionOptionsView,
            customAttachmentOptionsStyle?.attachmentOptionsView,
          ]}
        >
          {/* add photos button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionItemView,
              customAttachmentOptionsStyle?.photoAttachmentView,
            ]}
            onPress={() => {
              handleGalleryProp
                ? handleGalleryProp(SELECT_IMAGE)
                : handleGallery(SELECT_IMAGE);

              LMFeedAnalytics.track(
                Events.CLICKED_ON_ATTACHMENT,
                new Map<string, string>([[Keys.TYPE, SELECT_IMAGE]])
              );
            }}
          >
            <LMIcon
              assetPath={require("../../assets/images/gallery_icon3x.png")}
              {...customAttachmentOptionsStyle?.photoAttachmentIcon}
            />
            <LMText
              children={
                <Text style={{ fontFamily: STYLES.$FONT_TYPES.LIGHT }}>
                  {ADD_IMAGES}
                </Text>
              }
              textStyle={styles.selectionOptionstext}
              {...customAttachmentOptionsStyle?.photoAttachmentTextStyle}
            />
          </TouchableOpacity>
          {/* add video button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionItemView,
              customAttachmentOptionsStyle?.videoAttachmentView,
            ]}
            onPress={() => {
              handleGalleryProp
                ? handleGalleryProp(SELECT_VIDEO)
                : handleGallery(SELECT_VIDEO);

              dispatch({
                type: SET_FLOW_TO_CREATE_POST_SCREEN,
                body: { flowToCreatePostScreen: false },
              });

              dispatch({
                type: SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
                body: { reportModalStatus: true },
              });

              LMFeedAnalytics.track(
                Events.CLICKED_ON_ATTACHMENT,
                new Map<string, string>([[Keys.TYPE, SELECT_VIDEO]])
              );
            }}
          >
            <LMIcon
              assetPath={require("../../assets/images/video_icon3x.png")}
              {...customAttachmentOptionsStyle?.videoAttachmentIcon}
            />
            <LMText
              children={
                <Text style={{ fontFamily: STYLES.$FONT_TYPES.LIGHT }}>
                  {ADD_VIDEOS}
                </Text>
              }
              textStyle={styles.selectionOptionstext}
              {...customAttachmentOptionsStyle?.videoAttachmentTextStyle}
            />
          </TouchableOpacity>
          {/* add files button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionItemView,
              customAttachmentOptionsStyle?.filesAttachmentView,
            ]}
            onPress={() => {
              handleDocumentProp ? handleDocumentProp() : handleDocument();

              LMFeedAnalytics.track(
                Events.CLICKED_ON_ATTACHMENT,
                new Map<string, string>([[Keys.TYPE, SELECT_FILE]])
              );
            }}
          >
            <LMIcon
              assetPath={require("../../assets/images/paperClip_icon3x.png")}
              {...customAttachmentOptionsStyle?.filesAttachmentIcon}
            />
            <LMText
              children={
                <Text style={{ fontFamily: STYLES.$FONT_TYPES.LIGHT }}>
                  {ADD_FILES}
                </Text>
              }
              textStyle={styles.selectionOptionstext}
              {...customAttachmentOptionsStyle?.filesAttachmentTextStyle}
            />
          </TouchableOpacity>

          {/* poll option */}
          {!hidePoll ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                {
                  ...styles.optionItemView,
                  ...(Platform.OS === "ios" && { marginBottom: 10 }),
                },
                {
                  ...customAttachmentOptionsStyle?.filesAttachmentView,
                  ...(Platform.OS === "ios" && { marginBottom: 10 }),
                },
              ]}
              onPress={() => {
                handlePollProp ? handlePollProp() : handlePoll();

                // LMFeedAnalytics.track(
                //   Events.CLICKED_ON_ATTACHMENT,
                //   new Map<string, string>([[Keys.TYPE, SELECT_FILE]])
                // );
              }}
            >
              <LMIcon
                assetPath={require("../../assets/images/poll_icon3x.png")}
                color={STYLES.$COLORS.PRIMARY}
                height={15}
                widht={15}
                {...customAttachmentOptionsStyle?.pollAttachmentIcon}
              />
              <LMText
                children={
                  <Text style={{ fontFamily: STYLES.$FONT_TYPES.LIGHT }}>
                    {ADD_POLL}
                  </Text>
                }
                textStyle={styles.selectionOptionstext}
                {...customAttachmentOptionsStyle?.pollAttachmentTextStyle}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default LMCreatePostAttachmentSelection;
