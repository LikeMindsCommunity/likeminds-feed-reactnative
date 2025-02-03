import React from "react";
import {
  PostDetailContextProvider,
  FeedContextProvider,
} from "../context";
import { PostDetail } from "../screens/postDetail";

const DetailWrapper = ({ navigation, route }: any) => {
  return (
    <FeedContextProvider navigation={navigation} route={route}>
      <PostDetailContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <PostDetail />
      </PostDetailContextProvider>
    </FeedContextProvider>
  );
};

export default DetailWrapper;
