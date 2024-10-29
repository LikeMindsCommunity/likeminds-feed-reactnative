import { View, Text, Alert, TouchableOpacity } from "react-native";
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
  ADD_POST_TEXT,
  DOCUMENT_ATTACHMENT_TYPE,
  IMAGE_ATTACHMENT_TYPE,
  SAVE_POST_TEXT,
  VIDEO_ATTACHMENT_TYPE,
} from "../../constants/Strings";
import LMHeader from "../LMHeader";
import { styles } from "../../screens/createPost/styles";
import { CommunityConfigs } from "../../communityConfigs";
import pluralizeOrCapitalize from "../../utils/variables";
import { WordAction } from "../../enums/Variables";

const LMCreatePostHeader = () => {
  const dispatch = useAppDispatch();
  const predefinedTopics = useAppSelector(
    (state) => state.createPost.predefinedTopics
  );
  const createPostStyle = STYLES.$CREATE_POST_STYLE;
  createPostStyle?.addMoreAttachmentsButton;
  const customCreatePostScreenHeader = createPostStyle?.createPostScreenHeader;
  let {
    postToEdit,
    postContentText,
    heading,
    allAttachment,
    formattedLinkAttachments,
    onPostClick,
    handleScreenBackPress,
    disbaledTopicsGlobal,
    showTopics,
    mappedTopics,
    anonymousPost
  }: CreatePostContextValues = useCreatePostContext();
  const poll = useAppSelector((state) => state.createPost.pollAttachment);

  const handleAcceptedOnPress = () => {
    const idValuesArray = mappedTopics.map((topic) => topic.id);
    onPostClickProp
    ? onPostClickProp(
        allAttachment,
        formattedLinkAttachments,
        postContentText,
        heading,
        predefinedTopics?.length > 0 ? [...predefinedTopics] : idValuesArray,
        poll,
        anonymousPost
      )
    : onPostClick(
        allAttachment,
        formattedLinkAttachments,
        postContentText,
        heading,
        predefinedTopics?.length > 0 ? [...predefinedTopics] : idValuesArray,
        poll,
        anonymousPost,
        {},
      );
    if (!postToEdit) {
      const map: Map<string | undefined, string | undefined> = new Map();
      const taggedUsers: any = userTaggingDecoder(postContentText);

      const ogTags = formattedLinkAttachments[0]?.attachmentMeta?.ogTags;

      // To fire user tagged analytics event
      if (taggedUsers?.length > 0) {
        map.set(Keys.USER_TAGGED, Keys.YES);
        map.set(Keys.TAGGED_USER_COUNT, taggedUsers?.length.toString());
        const taggedUserIds = taggedUsers.map((user) => user.route).join(", ");
        map.set(Keys.TAGGED_USER_UUID, taggedUserIds);
      } else {
        map.set(Keys.USER_TAGGED, Keys.NO);
      }

      // To fire link analytics event
      if (ogTags) {
        map.set(Keys.LINK_ATTACHED, Keys.YES);
        map.set(Keys.LINK, ogTags?.url ?? "");
      } else {
        map.set(Keys.LINK_ATTACHED, Keys.NO);
      }

      // To fire media analytics event
      let imageCount = 0;
      let videoCount = 0;
      let documentCount = 0;
      for (let i = 0; i < allAttachment.length; i++) {
        if (allAttachment[i].attachmentType === IMAGE_ATTACHMENT_TYPE) {
          imageCount++;
        } else if (allAttachment[i].attachmentType === VIDEO_ATTACHMENT_TYPE) {
          videoCount++;
        } else if (
          allAttachment[i].attachmentType === DOCUMENT_ATTACHMENT_TYPE
        ) {
          documentCount++;
        }
      }

      // sends image attached event if imageCount > 0
      if (imageCount > 0) {
        map.set(Keys.IMAGE_ATTACHED, Keys.YES);
        map.set(Keys.IMAGE_COUNT, `${imageCount}`);
      } else {
        map.set(Keys.IMAGE_ATTACHED, Keys.NO);
      }
      // sends video attached event if videoCount > 0
      if (videoCount > 0) {
        map.set(Keys.VIDEO_ATTACHED, Keys.YES);
        map.set(Keys.VIDEO_COUNT, `${videoCount}`);
      } else {
        map.set(Keys.VIDEO_ATTACHED, Keys.NO);
      }

      // sends document attached event if documentCount > 0
      if (documentCount > 0) {
        map.set(Keys.DOCUMENT_ATTACHED, Keys.YES);
        map.set(Keys.DOCUMENT_COUNT, `${documentCount}`);
      } else {
        map.set(Keys.DOCUMENT_ATTACHED, Keys.NO);
      }

      if (showTopics) {
        map.set(
          Keys.TOPICS,
          predefinedTopics ? predefinedTopics : mappedTopics
        );
      } else {
        map.set(Keys.TOPICS, "");
      }

      LMFeedAnalytics.track(Events.POST_CREATION_COMPLETED, map);
    }

    dispatch({
      type: CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
    });
  };

  const handleOnPress = () => {
    const disabledTopicNames = disbaledTopicsGlobal.map((topic) => topic.name);

    // Joining the names together with commas
    const selectedTopicsString = disabledTopicNames.join(", ");

    const isPlural = disabledTopicNames.length > 1 ? "are" : "is";

    if (disbaledTopicsGlobal.length > 0) {
      Alert.alert(
        "Disabled Topics Alert",
        `The selected topics ${selectedTopicsString} ${isPlural} disabled. Do you want to continue?`,
        [
          {
            text: "Yes",
            onPress: () => handleAcceptedOnPress(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } else {
      handleAcceptedOnPress();
    }
  };

  const { onPostClickProp, handleScreenBackPressProp, isHeadingEnabled } =
    useCreatePostCustomisableMethodsContext();
  return (
    <>
      <LMHeader
        {...customCreatePostScreenHeader}
        showBackArrow={
          customCreatePostScreenHeader?.showBackArrow != undefined
            ? customCreatePostScreenHeader?.showBackArrow
            : true
        }
        onBackPress={() => {
          handleScreenBackPressProp
            ? handleScreenBackPressProp()
            : handleScreenBackPress();
        }}
        heading={
          postToEdit
            ? customCreatePostScreenHeader?.editPostHeading
              ? customCreatePostScreenHeader?.editPostHeading
              : `Edit ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.post ?? "post",WordAction.firstLetterCapitalSingular)}`
            : customCreatePostScreenHeader?.createPostHeading
            ? customCreatePostScreenHeader?.createPostHeading
            : `Create ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.post ?? "post",WordAction.firstLetterCapitalSingular)}`
        }
        rightComponent={
          // post button section
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={
              postToEdit
                ? isHeadingEnabled
                  ? heading?.trim() === ""
                  : false
                : isHeadingEnabled
                ? heading?.trim() !== ""
                  ? false
                  : true
                : allAttachment?.length > 0 ||
                  formattedLinkAttachments?.length > 0 ||
                  postContentText.trim() !== "" ||
                  Object.keys(poll).length > 0
                ? false
                : true
            }
            style={
              postToEdit
                ? isHeadingEnabled
                  ? heading?.trim() !== ""
                    ? styles.enabledOpacity
                    : styles.disabledOpacity
                  : styles.enabledOpacity
                : isHeadingEnabled
                ? heading?.trim() !== ""
                  ? styles.enabledOpacity
                  : styles.disabledOpacity
                : allAttachment?.length > 0 ||
                  formattedLinkAttachments?.length > 0 ||
                  postContentText.trim() !== "" ||
                  Object.keys(poll).length > 0
                ? styles.enabledOpacity
                : styles.disabledOpacity
            }
            onPress={handleOnPress}
          >
            {customCreatePostScreenHeader?.rightComponent ? (
              customCreatePostScreenHeader?.rightComponent
            ) : (
              <Text style={styles.headerRightComponentText}>
                {postToEdit ? SAVE_POST_TEXT : ADD_POST_TEXT}
              </Text>
            )}
          </TouchableOpacity>
        }
      />
    </>
  );
};

export default LMCreatePostHeader;
