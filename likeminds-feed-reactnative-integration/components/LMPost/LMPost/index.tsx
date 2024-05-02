import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import LMPostHeader from "../LMPostHeader";
import LMPostContent from "../LMPostContent";
import LMPostMedia from "../LMPostMedia";
import LMPostFooter from "../LMPostFooter";
import { LINK_ATTACHMENT_TYPE } from "../../../constants/Strings";
import { styles } from "./styles";
import { LMPostContextProvider, useLMPostContext } from "../../../context";
import { useAppSelector } from "../../../store/store";

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
  const allTopics = useAppSelector((state) => state.feed.topics);

  return (
    <View style={styles.mainContainer}>
      {/* post header */}
      <LMPostHeader />
      {post?.topics?.length > 0 ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
          {post?.topics?.map((item, index) => {
            // Find the corresponding topic object from allTopics
            const topicObject = allTopics[item];
            return (
              <View key={index}>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#5046E5",
                      marginLeft: index === 0 ? 15 : 5,
                      marginTop: 10,
                      padding: 7,
                      backgroundColor: "hsla(244, 75%, 59%, 0.1)",
                      borderRadius: 5,
                    }}
                  >
                    {topicObject?.name}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
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
