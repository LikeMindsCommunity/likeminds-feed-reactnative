import React from "react";
import {
  CreatePostContextProvider,
  UniversalFeedContextProvider,
} from "../context";
import { CreatePost } from "../screens/createPost";
import { Theme } from "../enums/Themes";

const QAFeedCreateWrapper = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <CreatePost theme={Theme.QA} />
      </CreatePostContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default QAFeedCreateWrapper;
