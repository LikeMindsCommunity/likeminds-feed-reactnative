import React from "react";
import {
  PostDetailContextProvider,
  UniversalFeedContextProvider,
} from "../context";
import { PostDetail } from "../screens/postDetail";

const DetailWrapper = ({ navigation, route }: any) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <PostDetailContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <PostDetail />
      </PostDetailContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default DetailWrapper;
