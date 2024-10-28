import React from "react";
import {
    PostDetail,
  PostDetailContextProvider,
  UniversalFeedContextProvider,
} from "@likeminds.community/feed-rn-core";
import LMPostQnAFeedFooter from "@likeminds.community/feed-rn-core/components/LMPost/LMPostQnAFeedFooter";
import CustomPost from "../components/CustomPost";

const PostDetailsScreen = ({ navigation, route }: any) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <PostDetailContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <PostDetail isHeadingEnabled={true} lmPostCustomFooter={<LMPostQnAFeedFooter />} />
      </PostDetailContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default PostDetailsScreen;
