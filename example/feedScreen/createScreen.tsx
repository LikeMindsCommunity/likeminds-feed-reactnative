import React from 'react';
import {
  CreatePost,
  useCreatePostContext,
} from '@likeminds.community/feed-rn-core';

const CreateScreen = () => {
  const {
    handleDocument,
    handleGallery,
    onPostClick,
    handleScreenBackPress,
    removePollAttachment,
    editPollAttachment,
  } = useCreatePostContext();

  const customHandleDocumentProp = () => {
    console.log('before document handle');
    handleDocument();
    console.log('after document handle');
  };
  const customHandleGalleryProp = type => {
    console.log('before gallery handle');
    handleGallery(type);
    console.log('after gallery handle');
  };
  const customHandleCreatePost = (
    allAttachment,
    formattedLinkAttachments,
    postContentText,
    topics,
    poll,
  ) => {
    console.log('before post click');
    onPostClick(
      allAttachment,
      formattedLinkAttachments,
      postContentText,
      topics,
      poll,
    );
    console.log('after post click');
  };
  const customBackHandler = () => {
    console.log('before back click');
    handleScreenBackPress();
    console.log('after back click');
  };
  const customPollEditClicked = () => {
    console.log('before edit poll click');
    editPollAttachment();
    console.log('after edit poll  click');
  };
  const customPollClearClicked = () => {
    console.log('before clear poll  click');
    removePollAttachment();
    console.log('after clear poll  click');
  };
  return (
    <CreatePost
      handleDocumentProp={() => customHandleDocumentProp()}
      handleGalleryProp={type => customHandleGalleryProp(type)}
      onPostClickProp={(
        allAttachment,
        formattedLinkAttachments,
        postContentText,
        topics,
        poll,
      ) =>
        customHandleCreatePost(
          allAttachment,
          formattedLinkAttachments,
          postContentText,
          topics,
          poll,
        )
      }
      handleScreenBackPressProp={() => customBackHandler()}
      onPollEditClicked={customPollEditClicked}
      onPollClearClicked={customPollClearClicked}
    />
  );
};

export default CreateScreen;
