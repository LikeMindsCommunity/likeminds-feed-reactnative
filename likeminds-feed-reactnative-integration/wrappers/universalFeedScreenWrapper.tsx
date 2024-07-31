import React, { useState, useEffect } from "react";
import {
  PostListContextProvider,
  UniversalFeedContextProvider,
} from "../context";
import { useAppSelector } from "../store/store";
import { token } from "../utils/pushNotifications";
import { View } from "react-native";
import { UniversalFeed } from "../screens/universalFeed";
import LMUniversalFeedHeader from "../components/LMUniversalFeedHeader";
import LMFilterTopics from "../components/LMFilterTopics";
import LMPostUploadIndicator from "../components/LMPostUploadIndicator";
import { PostsList } from "../screens/postsList";
import LMCreatePostButton from "../components/LMCreatePostButton";

const Feed = () => {
  const mappedTopics = useAppSelector((state: any) => state.feed.mappedTopics);
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
      <UniversalFeed>
        <LMUniversalFeedHeader />
        <LMFilterTopics />
        <LMPostUploadIndicator />
        <PostsList items={mappedTopics} />
        <LMCreatePostButton />
      </UniversalFeed>
    </View>
  );
};

const FeedWrapper = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <PostListContextProvider navigation={navigation} route={route}>
        <Feed />
      </PostListContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default FeedWrapper;
