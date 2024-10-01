import React from 'react';
import {
  TopicFeed,
  UniversalFeedContextProvider,
} from '@likeminds.community/feed-rn-core';
import {CreatePostContextProvider} from '@likeminds.community/feed-rn-core/context/createPostContext';

const TopicFeedWrapper = ({navigation, route}) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        <TopicFeed />
      </CreatePostContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default TopicFeedWrapper;
