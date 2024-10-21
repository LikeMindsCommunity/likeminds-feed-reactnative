import React from "react";
import {
  CreatePostContextProvider,
  UniversalFeedContextProvider,
} from "../context";
import { CreatePost } from "../screens/createPost";
import LMCreatePostHeader from "../components/LMCreatePost/LMCreatePostHeader";
import LMCreatePostUIRender from "../components/LMCreatePost/LMCreatePostUIRender";
import LMCreatePostAttachmentSelection from "../components/LMCreatePost/LMCreatePostAttachmentSelection";
import LMUserProfileSection from "../components/LMCreatePost/LMUserProfileSection";
import LMCreatePostTopics from "../components/LMCreatePost/LMCreatePostTopics";
import LMCreatePostHeading from "../components/LMCreatePost/LMCreatePostHeading";
import LMCreatePostTextInput from "../components/LMCreatePost/LMCreatePostTextInput";
import LMCreatePostUserTagging from "../components/LMCreatePost/LMCreatePostUserTagging";
import LMCreatePostMedia from "../components/LMCreatePost/LMCreatePostMedia";

const SocialFeedCreateWrapper = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <CreatePost>
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
      </CreatePostContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default SocialFeedCreateWrapper;
