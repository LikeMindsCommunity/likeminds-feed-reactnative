import React from "react";
import {
  CreatePostContextProvider,
  UniversalFeedContextProvider,
} from "../context";
import { CreatePost } from "../screens/createPost";

const SocialFeedCreateWrapper = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <CreatePost />
      </CreatePostContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default SocialFeedCreateWrapper;
