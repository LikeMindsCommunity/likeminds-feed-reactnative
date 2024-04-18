import React from 'react';
import DetailScreen from './detailScreen';
import {PostDetailContextProvider} from '@likeminds.community/feed-rn-core';

const DetailWrapper = ({navigation, route}) => {
  return (
    <PostDetailContextProvider navigation={navigation} route={route}>
      <DetailScreen />
    </PostDetailContextProvider>
  );
};

export default DetailWrapper;
