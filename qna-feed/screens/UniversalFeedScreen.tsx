import React, { useState, useEffect } from "react";
import {
    LMCreatePostButton,
  LMFilterTopics,
  LMPostUploadIndicator,
  LMUniversalFeedHeader,
  PostListContextProvider,
  PostsList,
  UniversalFeed,
  UniversalFeedContextProvider,
  usePostListContext,
} from "@likeminds.community/feed-rn-core";
import { View } from "react-native";
import { LMPostContent, LMPostFooter, LMPostHeader, LMPostMedia } from "@likeminds.community/feed-rn-core/components";
import { useLMPostContext } from "@likeminds.community/feed-rn-core/context";
import { token } from "../pushNotification";
import { LINK_ATTACHMENT_TYPE } from "@likeminds.community/feed-rn-core/constants/Strings";
import LMPostQnAFeedFooter from "@likeminds.community/feed-rn-core/components/LMPost/LMPostQnAFeedFooter";
import { useAppSelector } from "@likeminds.community/feed-rn-core/store/store";
import LMPostHeading from "@likeminds.community/feed-rn-core/components/LMPost/LMPostHeading";
import LMPostTopResponse from "@likeminds.community/feed-rn-core/components/LMPost/LMPostTopResponse";


const Feed = () => {
  const mappedTopics = useAppSelector((state: any) => state.feed.mappedTopics);
  const [FCMToken, setFCMToken] = useState("");

  /// Setup notifications
  useEffect(() => {
    token().then((res) => {
      if (!!res) {
        setFCMToken(res);
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <UniversalFeed isHeadingEnabled={true} isTopResponse={true}>
        <LMUniversalFeedHeader />
        <LMFilterTopics />
        <LMPostUploadIndicator />
        <PostsList
          items={mappedTopics}
          lmPostCustomFooter={<LMPostQnAFeedFooter />}
          customWidgetPostView={<LMPostComponent />}
        />
        <LMCreatePostButton customText="ASK QUESTION" />
      </UniversalFeed>
    </View>
  );
};

const UniversalFeedScreen = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <PostListContextProvider navigation={navigation} route={route}>
        <Feed />
      </PostListContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default UniversalFeedScreen;

const LMPostComponent = React.memo(() => {
  const {
    post,
    customFooter,
    isHeadingEnabled,
    isTopResponse
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