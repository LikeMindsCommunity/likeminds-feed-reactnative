import {
  LMFeedCreatePollScreen,
  CreatePollContextProvider,
} from '@likeminds.community/feed-rn-core';
import React from 'react';

const CreatePollScreenWrapper = ({navigation, route}) => {

//   const onPollExpiryTimeClicked = () => {};
//   const onAddOptionClicked = () => {};
//   const onPollOptionCleared = () => {};
//   const onPollCompleteClicked = () => {};
  return (
    <CreatePollContextProvider navigation={navigation} route={route}>
      <LMFeedCreatePollScreen
        // onPollExpiryTimeClicked={onPollExpiryTimeClicked}
        // onAddOptionClicked={onAddOptionClicked}
        // onPollOptionCleared={onPollOptionCleared}
        // onPollCompleteClicked={onPollCompleteClicked}
      />
    </CreatePollContextProvider>
  );
};

export default CreatePollScreenWrapper;
