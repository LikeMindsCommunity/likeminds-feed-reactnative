import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { styles } from "../../screens/feed/styles";
import { LMFeedAnalytics } from "../../analytics/LMFeedAnalytics";
import { Events } from "../../enums/Events";
import {
  CLEAR_SELECTED_TOPICS,
  CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
} from "../../store/types/types";
import {
  FeedContextValues,
  useFeedContext,
  useFeedCustomisableMethodsContext,
} from "../../context";
import { useAppDispatch } from "../../store/store";
import STYLES from "../../constants/Styles";
import { CommunityConfigs } from "../../communityConfigs";
import pluralizeOrCapitalize from "../../utils/variables";
import { WordAction } from "../../enums/Variables";

const LMCreatePostButton = ({ customText }: { customText?: string }) => {
  const dispatch = useAppDispatch();
  const { showCreatePost, newPostButtonClick }: FeedContextValues =
    useFeedContext();
  const feedStyle = STYLES.$FEED_STYLE;
  const { newPostButtonClickProps } =
    useFeedCustomisableMethodsContext();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.newPostButtonView,
        showCreatePost
          ? styles.newPostButtonEnable
          : styles.newPostButtonDisable,
        feedStyle?.newPostButtonStyle,
      ]}
      // handles post uploading status and member rights to create post
      onPress={() => {
        newPostButtonClickProps
          ? newPostButtonClickProps()
          : newPostButtonClick();
        LMFeedAnalytics.track(Events.POST_CREATION_STARTED);
        dispatch({
          type: CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
        });
      }}
    >
      <Image
        source={require("../../assets/images/add_post_icon3x.png")}
        resizeMode={"contain"}
        style={styles.newPostButtonIcon}
        {...feedStyle?.newPostIcon}
      />
      <Text style={[styles.newPostText, feedStyle?.newPostButtonText]}>
        {customText ? customText : `NEW ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.post ?? "post",WordAction.allCapitalSingular)}`}
      </Text>
    </TouchableOpacity>
  );
};

export default LMCreatePostButton;
