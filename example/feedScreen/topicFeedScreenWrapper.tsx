import React from 'react';
import {
  PostDetailContextProvider,
  TopicFeed,
} from '@likeminds.community/feed-rn-core';

const TopicFeedWrapper = ({navigation, route}) => {
  return (
    <PostDetailContextProvider navigation={navigation} route={route}>
      <TopicFeed />
    </PostDetailContextProvider>
  );
};

export default TopicFeedWrapper;
