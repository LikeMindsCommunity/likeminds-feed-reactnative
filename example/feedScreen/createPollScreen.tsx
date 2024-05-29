import {
  LMFeedCreatePollScreen,
  useCreatePollContext,
} from '@likeminds.community/feed-rn-core';
import React from 'react';

const CreatePollScreen = () => {
  const {showDatePicker, addNewOption, removeAnOption, postPoll} =
    useCreatePollContext();

  const onPollExpiryTimeClicked = () => {
    console.log('before onPollExpiryTimeClicked');
    showDatePicker();
    console.log('after onPollExpiryTimeClicked');
  };
  const onAddOptionClicked = () => {
    console.log('before onAddOptionClicked');
    addNewOption();
    console.log('after onAddOptionClicked');
  };
  const onPollOptionCleared = index => {
    console.log('before onPollOptionCleared');
    removeAnOption(index);
    console.log('after onPollOptionCleared');
  };
  const onPollCompleteClicked = () => {
    console.log('before onPollCompleteClicked');
    postPoll();
    console.log('after onPollCompleteClicked');
  };
  return (
    <LMFeedCreatePollScreen
      onPollExpiryTimeClicked={onPollExpiryTimeClicked}
      onAddOptionClicked={onAddOptionClicked}
      onPollOptionCleared={onPollOptionCleared}
      onPollCompleteClicked={onPollCompleteClicked}
    />
  );
};

export default CreatePollScreen;
