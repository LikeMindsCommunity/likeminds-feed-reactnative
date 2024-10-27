import React from "react";
import {
    PostDetail,
  PostDetailContextProvider,
  UniversalFeedContextProvider,
} from "@likeminds.community/feed-rn-core";
import { LMPostContent, LMPostFooter, LMPostHeader, LMPostMedia,  } from "@likeminds.community/feed-rn-core/components";
import { View, Text } from "react-native";
import LMPostHeading from "@likeminds.community/feed-rn-core/components/LMPost/LMPostHeading";
import { LINK_ATTACHMENT_TYPE } from "@likeminds.community/feed-rn-core/constants/Strings";
import LMPostTopResponse from "@likeminds.community/feed-rn-core/components/LMPost/LMPostTopResponse";
import { useLMPostContext } from "@likeminds.community/feed-rn-core/context";
import LMPostQnAFeedFooter from "@likeminds.community/feed-rn-core/components/LMPost/LMPostQnAFeedFooter";
import { useAppSelector } from "@likeminds.community/feed-rn-core/store/store";
import STYLES from "@likeminds.community/feed-rn-core/constants/Styles";
import Layout from "@likeminds.community/feed-rn-core/constants/Layout";

const PostDetailsScreen = ({ navigation, route }: any) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <PostDetailContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <PostDetail isHeadingEnabled={true} lmPostCustomFooter={<LMPostQnAFeedFooter />} customWidgetPostView={<LMPostComponent />}/>
      </PostDetailContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default PostDetailsScreen;

const LMPostComponent = React.memo(() => {
  const {
    post,
    customFooter,
    isHeadingEnabled,
    isTopResponse
  } = useLMPostContext();

  const allTopics = useAppSelector((state: any) => state.feed.topics);

  return (
    <View style={{width:'100%',paddingTop: 10, marginBottom: 10}}>
      {/* post header */}
      <LMPostHeader />

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
      {customFooter ? customFooter : <LMPostFooter />}
    </View>
  );
});