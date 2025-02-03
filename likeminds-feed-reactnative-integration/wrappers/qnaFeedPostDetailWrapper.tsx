import React from "react";
import {
  PostDetailContextProvider,
  FeedContextProvider,
  useLMPostContext,
} from "../context";
import { PostDetail } from "../screens/postDetail";
import LMPostQnAFeedFooter from "../components/LMPost/LMPostQnAFeedFooter";

const LMQnAPostDetailScreen = ({ navigation, route }: any) => {
  return (
    <FeedContextProvider navigation={navigation} route={route}>
      <PostDetailContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <PostDetail isHeadingEnabled={true} lmPostCustomFooter={<LMPostQnAFeedFooter />} />
      </PostDetailContextProvider>
    </FeedContextProvider>
  );
};

export default LMQnAPostDetailScreen;


