import React from "react";
import {
  PostDetailContextProvider,
  UniversalFeedContextProvider,
  useLMPostContext,
} from "../context";
import { PostDetail } from "../screens/postDetail";
import LMPostQnAFeedFooter from "../components/LMPost/LMPostQnAFeedFooter";
import { LMPostContent, LMPostFooter, LMPostHeader, LMPostMedia } from "../components";
import { View } from "react-native";
import LMPostHeading from "../components/LMPost/LMPostHeading";
import { LINK_ATTACHMENT_TYPE } from "../constants/Strings";
import LMPostTopResponse from "../components/LMPost/LMPostTopResponse";

const LMQnAPostDetailScreen = ({ navigation, route }: any) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <PostDetailContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <PostDetail isHeadingEnabled={true} lmPostCustomFooter={<LMPostQnAFeedFooter />} customWidgetPostView={<LMPostComponent />}/>
      </PostDetailContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default LMQnAPostDetailScreen;

const LMPostComponent = React.memo(() => {
  const {
    isHeadingEnabled,
    isTopResponse,
    customFooter,
    post
  } = useLMPostContext();



  return (
    <View style={{width:'100%',paddingTop: 10, marginBottom: 10}}>
      {/* post header */}
      <LMPostHeader />

      {/* post heading */}
      {isHeadingEnabled ? <LMPostHeading /> : null}

      {/* post content */}
      {(post?.text ||
        post?.attachments?.find(
          (item) => item?.attachmentType === LINK_ATTACHMENT_TYPE
        )?.attachmentType === LINK_ATTACHMENT_TYPE) && <LMPostContent />}

      {/* post media */}
      {post?.attachments && post?.attachments.length > 0 && <LMPostMedia />}

      {/* post top response */}
      {isTopResponse ? <LMPostTopResponse /> : null}

      {/* post footer */}
      {customFooter ? customFooter : <LMPostFooter />}
    </View>
  );
});
