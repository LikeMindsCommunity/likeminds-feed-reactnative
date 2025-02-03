import React from "react";
import {
  FeedContextProvider,
  CreatePostContextProvider,
} from "../context";
import { TopicFeed } from "../screens/topicFeed";

const TopicFeedWrapper = ({ navigation, route }) => {
  return (
    <FeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        <TopicFeed />
      </CreatePostContextProvider>
    </FeedContextProvider>
  );
};

export default TopicFeedWrapper;
