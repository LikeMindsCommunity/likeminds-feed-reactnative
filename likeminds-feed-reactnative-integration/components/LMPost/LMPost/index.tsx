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
import Layout from "../../../constants/Layout";
import STYLES from "../../../constants/Styles";
import LMPostHeading from "../LMPostHeading";
import LMPostTopResponse from "../LMPostTopResponse";

const LMPost = ({
  navigation,
  children,
  post,
  headerProps,
  contentProps,
  mediaProps,
  footerProps,
  isHeadingEnabled,
  isTopResponse,
}: any) => {
  return (
    <LMPostContextProvider
      navigation={navigation}
      post={post}
      headerProps={headerProps}
      footerProps={footerProps}
      contentProps={contentProps}
      mediaProps={mediaProps}
      isHeadingEnabled={isHeadingEnabled}
      isTopResponse={isTopResponse}
    >
      <LMPostComponent />
    </LMPostContextProvider>
  );
};
const LMPostComponent = React.memo(() => {
  const { post, isHeadingEnabled, isTopResponse } = useLMPostContext();
  const allTopics = useAppSelector((state) => state.feed.topics);
  const postListStyle = STYLES.$POST_LIST_STYLE;

  return (
    <View style={styles.mainContainer}>
      {/* post header */}
      <LMPostHeader />

      {/* post topics */}
      {post?.topics?.length > 0 ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
          {post?.topics?.map((item, index) => {
            // Find the corresponding topic object from allTopics
            const topicObject = allTopics[item];
            return (
              <View key={index}>
                <View
                  style={[
                    {
                      backgroundColor: `hsla(${STYLES.$HUE}, 75%, 59%, 0.1)`,
                      marginLeft: index === 0 ? 15 : 5,
                      marginTop: Layout.normalize(10),
                      borderRadius: Layout.normalize(5),
                    },
                    postListStyle?.postContent?.postTopicStyle?.box,
                  ]}
                >
                  <Text
                    style={[
                      {
                        fontSize: Layout.normalize(14),
                        color: STYLES.$COLORS.PRIMARY,
                        paddingVertical: Layout.normalize(2),
                        paddingHorizontal: Layout.normalize(8),
                        fontFamily: STYLES.$FONT_TYPES.LIGHT,
                      },
                      postListStyle?.postContent?.postTopicStyle?.text,
                    ]}
                  >
                    {topicObject?.name}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}

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
      <LMPostFooter />
    </View>
  );
});

export default LMPost;
