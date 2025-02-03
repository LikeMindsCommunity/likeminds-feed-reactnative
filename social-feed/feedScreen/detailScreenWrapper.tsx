import React from 'react';
import DetailScreen from './detailScreen';
import {
  PostDetailContextProvider,
  FeedContextProvider,
} from '@likeminds.community/feed-rn-core';

const DetailWrapper = ({navigation, route}) => {
  return (
    <FeedContextProvider navigation={navigation} route={route}>
      <PostDetailContextProvider navigation={navigation} route={route}>
        <DetailScreen />
      </PostDetailContextProvider>
    </FeedContextProvider>
  );
};

export default DetailWrapper;
