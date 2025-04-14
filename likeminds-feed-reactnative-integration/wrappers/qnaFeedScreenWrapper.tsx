import React, { useState, useEffect } from "react";
import {
  PostListContextProvider,
  UniversalFeedContextProvider,
  useLMPostContext,
  usePostListContext,
} from "../context";
import { useAppSelector } from "../store/store";
import { View } from "react-native";
import { UniversalFeed } from "../screens/universalFeed";
import LMUniversalFeedHeader from "../components/LMUniversalFeedHeader";
import LMFilterTopics from "../components/LMFilterTopics";
import LMPostUploadIndicator from "../components/LMPostUploadIndicator";
import { PostsList } from "../screens/postsList";
import LMCreatePostButton from "../components/LMCreatePostButton";
import LMPostQnAFeedFooter from "../components/LMPost/LMPostQnAFeedFooter";
import STYLES from "../constants/Styles";
import { LINK_ATTACHMENT_TYPE } from "../constants/Strings";
import { LMPostContent, LMPostFooter, LMPostHeader, LMPostMedia } from "../components";
import LMPostTopResponse from "../components/LMPost/LMPostTopResponse";
import LMPostHeading from "../components/LMPost/LMPostHeading";
const Feed = () => {

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <UniversalFeed isHeadingEnabled={true} isTopResponse={true}>
        <LMUniversalFeedHeader />
        <LMFilterTopics />
        <LMPostUploadIndicator />
        <PostsList
          lmPostCustomFooter={<LMPostQnAFeedFooter />}
        />
        <LMCreatePostButton customText="ASK QUESTION" />
      </UniversalFeed>
    </View>
  );
};

const QnAFeedWrapper = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <PostListContextProvider navigation={navigation} route={route}>
        <Feed />
      </PostListContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default QnAFeedWrapper;
