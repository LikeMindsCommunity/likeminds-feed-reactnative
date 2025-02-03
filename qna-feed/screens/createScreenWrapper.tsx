import React from 'react';
import {CreatePostContextProvider, FeedContextProvider} from '@likeminds.community/feed-rn-core';
import CreateScreen from './createScreen';

const CreateWrapper = ({navigation, route}: any) => {
  return (
    <FeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        <CreateScreen />
      </CreatePostContextProvider>
    </FeedContextProvider>
  );
};

export default CreateWrapper;
