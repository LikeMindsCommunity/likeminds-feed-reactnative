import React from 'react';
import {
  TopicFeed,
  FeedContextProvider,
} from '@likeminds.community/feed-rn-core';
import {CreatePostContextProvider} from '@likeminds.community/feed-rn-core/context/createPostContext';

const TopicFeedWrapper = ({navigation, route}) => {
  return (
    <FeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        <TopicFeed />
      </CreatePostContextProvider>
    </FeedContextProvider>
  );
};

export default TopicFeedWrapper;
