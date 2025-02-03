import React, { useState, useEffect } from "react";
import {
  PostListContextProvider,
  FeedContextProvider,
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

const SocialFeed = () => {
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
      <Feed>
        <LMFeedHeader />
        <LMFilterTopics />
        <LMPostUploadIndicator />
        <PostsList />
        <LMCreatePostButton />
      </Feed>
    </View>
  );
};

const LMSocialFeedScreen = ({ navigation, route }) => {
  return (
    <FeedContextProvider navigation={navigation} route={route}>
      <PostListContextProvider navigation={navigation} route={route}>
        <SocialFeed />
      </PostListContextProvider>
    </FeedContextProvider>
  );
};

export default LMSocialFeedScreen;
