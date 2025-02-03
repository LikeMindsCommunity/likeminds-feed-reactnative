import React, { useState, useEffect } from "react";
import {
  PostListContextProvider,
  FeedContextProvider,
  useLMPostContext,
  usePostListContext,
} from "../context";
import { useAppSelector } from "../store/store";
import { token } from "../utils/pushNotifications";
import { View } from "react-native";
import { Feed } from "../screens/feed";
import LMFeedHeader from "../components/LMFeedHeader";
import LMFilterTopics from "../components/LMFilterTopics";
import LMPostUploadIndicator from "../components/LMPostUploadIndicator";
import { PostsList } from "../screens/postsList";
import LMCreatePostButton from "../components/LMCreatePostButton";
import LMPostQnAFeedFooter from "../components/LMPost/LMPostQnAFeedFooter";
import STYLES from "../constants/Styles";
import { LINK_ATTACHMENT_TYPE } from "../constants/Strings";
import {
  LMPostContent,
  LMPostFooter,
  LMPostHeader,
  LMPostMedia,
} from "../components";
import LMPostTopResponse from "../components/LMPost/LMPostTopResponse";
import LMPostHeading from "../components/LMPost/LMPostHeading";
const QnAFeed = () => {
  const [FCMToken, setFCMToken] = useState("");

  /// Setup notifications
  useEffect(() => {
    token().then((res) => {
      if (!!res) {
        setFCMToken(res);
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Feed isHeadingEnabled={true} isTopResponse={true}>
        <LMFeedHeader />
        <LMFilterTopics />
        <LMPostUploadIndicator />
        <PostsList lmPostCustomFooter={<LMPostQnAFeedFooter />} />
        <LMCreatePostButton customText="ASK QUESTION" />
      </Feed>
    </View>
  );
};

const QnAFeedWrapper = ({ navigation, route }) => {
  return (
    <FeedContextProvider navigation={navigation} route={route}>
      <PostListContextProvider navigation={navigation} route={route}>
        <QnAFeed />
      </PostListContextProvider>
    </FeedContextProvider>
  );
};

export default QnAFeedWrapper;
