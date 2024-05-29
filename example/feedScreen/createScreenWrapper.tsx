import React from 'react';
import {CreatePostContextProvider, UniversalFeedContextProvider} from '@likeminds.community/feed-rn-core';
import CreateScreen from './createScreen';

const CreateWrapper = ({navigation, route}) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        <CreateScreen />
      </CreatePostContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default CreateWrapper;
