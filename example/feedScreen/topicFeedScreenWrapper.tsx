import React from 'react';
import {
  TopicFeed,
  UniversalFeedContextProvider,
} from '@likeminds.community/feed-rn-core';

const TopicFeedWrapper = ({navigation, route}) => {
  console.log('heree');

  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <TopicFeed />
    </UniversalFeedContextProvider>
  );
};

export default TopicFeedWrapper;
