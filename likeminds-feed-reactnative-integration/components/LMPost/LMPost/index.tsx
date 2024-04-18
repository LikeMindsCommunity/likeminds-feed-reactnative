import { View } from "react-native";
import React from "react";
import LMPostHeader from "../LMPostHeader";
import LMPostContent from "../LMPostContent";
import LMPostMedia from "../LMPostMedia";
import LMPostFooter from "../LMPostFooter";
import { LINK_ATTACHMENT_TYPE } from "../../../constants/Strings";
import { styles } from "./styles";
import { LMPostContextProvider, useLMPostContext } from "../../../context";

const LMPost = ({
  navigation,
  children,
  post,
  headerProps,
  contentProps,
  mediaProps,
  footerProps,
}: any) => {
  return (
    <LMPostContextProvider
      navigation={navigation}
      post={post}
      headerProps={headerProps}
      footerProps={footerProps}
      contentProps={contentProps}
      mediaProps={mediaProps}
    >
      <LMPostComponent />
    </LMPostContextProvider>
  );
};
const LMPostComponent = React.memo(() => {
  const { post } = useLMPostContext();
  return (
    <View style={styles.mainContainer}>
      {/* post header */}
      <LMPostHeader />
      {/* post content */}
      {(post?.text ||
        post?.attachments?.find(
          (item) => item?.attachmentType === LINK_ATTACHMENT_TYPE
        )?.attachmentType === LINK_ATTACHMENT_TYPE) && <LMPostContent />}
      {/* post media */}
      {post?.attachments && post?.attachments.length > 0 && <LMPostMedia />}
      {/* post footer */}
      <LMPostFooter />
    </View>
  );
});

export default LMPost;
