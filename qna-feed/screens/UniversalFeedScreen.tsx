import React, { useState, useEffect } from "react";
import {
    LMCreatePostButton,
  LMFilterTopics,
  LMPostUploadIndicator,
  LMUniversalFeedHeader,
  PostListContextProvider,
  PostsList,
  UniversalFeed,
  UniversalFeedContextProvider,
  usePostListContext,
} from "@likeminds.community/feed-rn-core";
import { Text, View } from "react-native";
import { token } from "../pushNotification";
import LMPostQnAFeedFooter from "@likeminds.community/feed-rn-core/components/LMPost/LMPostQnAFeedFooter";
import { useAppSelector } from "@likeminds.community/feed-rn-core/store/store";
import CustomPost from "../components/CustomPost";


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
      <UniversalFeed isHeadingEnabled={true} isTopResponse={true}>
        <LMUniversalFeedHeader />
        <LMFilterTopics />
        <LMPostUploadIndicator />
        <PostsList
          items={mappedTopics}
          lmPostCustomFooter={<LMPostQnAFeedFooter />}
        />
        <LMCreatePostButton />
      </UniversalFeed>
    </View>
  );
};

const UniversalFeedScreen = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <PostListContextProvider navigation={navigation} route={route}>
        <Feed />
      </PostListContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default UniversalFeedScreen;