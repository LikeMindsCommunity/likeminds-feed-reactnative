import {
  LMFeedCreatePollScreen,
  CreatePollContextProvider,
} from '@likeminds.community/feed-rn-core';
import React from 'react';
import CreatePollScreen from './createPollScreen';

const CreatePollScreenWrapper = ({navigation, route}) => {
  return (
    <CreatePollContextProvider navigation={navigation} route={route}>
      <CreatePollScreen />
    </CreatePollContextProvider>
  );
};

export default CreatePollScreenWrapper;
