import React from 'react';
import {
  CreatePost,
  useCreatePostContext,
} from '@likeminds.community/feed-rn-core';

const CreateScreen = ({navigation}) => {
  const {handleDocument, handleGallery, onPostClick, handleScreenBackPress} =
    useCreatePostContext();

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
  ) => {
    console.log('before post click');
    onPostClick(
      allAttachment,
      formattedLinkAttachments,
      postContentText,
      topics,
    );
    console.log('after post click');
  };
  const customBackHandler = () => {
    console.log('before back click');
    handleScreenBackPress();
    console.log('after back click');
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
      ) =>
        customHandleCreatePost(
          allAttachment,
          formattedLinkAttachments,
          postContentText,
          topics,
        )
      }
      handleScreenBackPressProp={() => customBackHandler()}
    />
  );
};

export default CreateScreen;
