import React from "react";
import {
  CreatePostContextProvider,
  UniversalFeedContextProvider,
} from "../context";
import { CreatePost } from "../screens/createPost";

const QnAFeedCreateWrapper = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <CreatePost isHeadingEnabled={true} />
      </CreatePostContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default QnAFeedCreateWrapper;
