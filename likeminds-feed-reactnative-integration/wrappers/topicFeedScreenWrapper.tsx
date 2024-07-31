import React from "react";
import {
  UniversalFeedContextProvider,
  CreatePostContextProvider,
} from "../context";
import { TopicFeed } from "../screens/topicFeed";

const TopicFeedWrapper = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        <TopicFeed />
      </CreatePostContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default TopicFeedWrapper;
