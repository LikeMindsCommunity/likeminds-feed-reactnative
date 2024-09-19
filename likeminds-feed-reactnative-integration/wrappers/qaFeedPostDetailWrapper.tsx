import React from "react";
import {
  PostDetailContextProvider,
  UniversalFeedContextProvider,
} from "../context";
import { PostDetail } from "../screens/postDetail";
import LMPostQAFeedFooter from "../components/LMPost/LMPostQAFeedFooter";

const QAFeedPostDetailWrapper = ({ navigation, route }: any) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <PostDetailContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <PostDetail isHeadingEnabled={true} lmPostCustomFooter={<LMPostQAFeedFooter />} />
      </PostDetailContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default QAFeedPostDetailWrapper;
