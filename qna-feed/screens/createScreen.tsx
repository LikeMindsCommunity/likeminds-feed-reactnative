import React from 'react';
import {View} from 'react-native';
import {
  CreatePost,
  useCreatePostContext,
} from '@likeminds.community/feed-rn-core';
import {
  LMCreatePostAttachmentSelection,
  LMCreatePostHeader,
  LMCreatePostHeading,
  LMCreatePostMedia,
  LMCreatePostTextInput,
  LMCreatePostTopics,
  LMCreatePostUIRender,
  LMCreatePostUserTagging,
  LMUserProfileSection,
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
    isAnonymous,
  ) => {
    console.log('before post click');
    onPostClick(
      allAttachment,
      formattedLinkAttachments,
      postContentText,
      topics,
      poll,
      isAnonymous,
      {text: 'custom widget is working'},
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
        isAnonymous,
      ) =>
        customHandleCreatePost(
          allAttachment,
          formattedLinkAttachments,
          postContentText,
          topics,
          poll,
          isAnonymous,
        )
      }
      handleScreenBackPressProp={() => customBackHandler()}
      onPollEditClicked={customPollEditClicked}
      onPollClearClicked={customPollClearClicked}
      isHeadingEnabled={true}
      isAnonymousPostAllowed>
      {/* screen header section*/}
      <LMCreatePostHeader />

      {/* handles the UI to be rendered for edit post and create post */}
      <LMCreatePostUIRender>
        {/* user profile section */}
        <LMUserProfileSection />

        {/* post topics section */}
        <LMCreatePostTopics />

        {/* post heading section */}
        <LMCreatePostHeading />

        {/* text input field */}
        <LMCreatePostTextInput />

        {/* users tagging list */}
        <LMCreatePostUserTagging />

        {/* selected media section */}
        <LMCreatePostMedia />
      </LMCreatePostUIRender>

      {/* selection options section */}
      <LMCreatePostAttachmentSelection />
    </CreatePost>
  );
};

export default CreateScreen;
