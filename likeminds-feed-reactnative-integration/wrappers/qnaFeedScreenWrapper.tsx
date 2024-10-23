import React, { useState, useEffect } from "react";
import {
  PostListContextProvider,
  UniversalFeedContextProvider,
  useLMPostContext,
  usePostListContext,
} from "../context";
import { useAppSelector } from "../store/store";
import { token } from "../utils/pushNotifications";
import { View } from "react-native";
import { UniversalFeed } from "../screens/universalFeed";
import LMUniversalFeedHeader from "../components/LMUniversalFeedHeader";
import LMFilterTopics from "../components/LMFilterTopics";
import LMPostUploadIndicator from "../components/LMPostUploadIndicator";
import { PostsList } from "../screens/postsList";
import LMCreatePostButton from "../components/LMCreatePostButton";
import LMPostQnAFeedFooter from "../components/LMPost/LMPostQnAFeedFooter";
import STYLES from "../constants/Styles";
import { LINK_ATTACHMENT_TYPE } from "../constants/Strings";
import { LMPostContent, LMPostFooter, LMPostHeader, LMPostMedia } from "../components";
import LMPostTopResponse from "../components/LMPost/LMPostTopResponse";
import LMPostHeading from "../components/LMPost/LMPostHeading";
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

const QnAFeedWrapper = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <PostListContextProvider navigation={navigation} route={route}>
        <Feed />
      </PostListContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default QnAFeedWrapper;

const LMPostComponent = React.memo(() => {
  const {
    post,
    isHeadingEnabled,
    isTopResponse,
    customFooter,
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
