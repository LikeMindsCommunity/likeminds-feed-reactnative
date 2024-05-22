import React from 'react';
import DetailScreen from './detailScreen';
import {
  PostDetailContextProvider,
  UniversalFeedContextProvider,
} from '@likeminds.community/feed-rn-core';

const DetailWrapper = ({navigation, route}) => {
  return (
    <UniversalFeedContextProvider>
      <PostDetailContextProvider navigation={navigation} route={route}>
        <DetailScreen />
      </PostDetailContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default DetailWrapper;
