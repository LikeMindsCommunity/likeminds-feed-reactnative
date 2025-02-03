import React from "react";
import {
    PostDetail,
  PostDetailContextProvider,
  FeedContextProvider,
} from "@likeminds.community/feed-rn-core";
import LMPostQnAFeedFooter from "@likeminds.community/feed-rn-core/components/LMPost/LMPostQnAFeedFooter";
import CustomPost from "../components/CustomPost";

const PostDetailsScreen = ({ navigation, route }: any) => {
  return (
    <FeedContextProvider navigation={navigation} route={route}>
      <PostDetailContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <PostDetail isHeadingEnabled={true} lmPostCustomFooter={<LMPostQnAFeedFooter />} />
      </PostDetailContextProvider>
    </FeedContextProvider>
  );
};

export default PostDetailsScreen;
