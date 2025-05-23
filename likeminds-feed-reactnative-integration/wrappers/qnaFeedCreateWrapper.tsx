import React from "react";
import { View } from "react-native";
import {
  CreatePost,
  CreatePostContextProvider,
  UniversalFeedContextProvider,
  useCreatePostContext,
} from "../index";
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
  LMCreatePostAnonymousCheckbox
} from "../index";

const CreateScreen = () => {
  return (
    <CreatePost isHeadingEnabled={true} isAnonymousPostAllowed={true} >
      {/* screen header section*/}
      <LMCreatePostHeader />

      {/* handles the UI to be rendered for edit post and create post */}
      <LMCreatePostUIRender>
        {/* user profile section */}
        <LMUserProfileSection />

        {/* Anonymous post checkbox */}
        <LMCreatePostAnonymousCheckbox/>

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

        {/* selection options section */}
        <LMCreatePostAttachmentSelection />
      </LMCreatePostUIRender>
    </CreatePost>
  );
};

export default function QnAFeedCreateWrapper({ navigation, route }) {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        <CreateScreen />
      </CreatePostContextProvider>
    </UniversalFeedContextProvider>
  );
}
