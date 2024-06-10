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
import { LMFeedAnalytics } from "../../../analytics/LMFeedAnalytics";
import { Events } from "../../../enums/Events";
import { Keys } from "../../../enums/Keys";
import { ScreenNames } from "../../../enums/ScreenNames";
import { getPostType, joinStrings } from "../../../utils/analytics";
import { useRoute } from "@react-navigation/native";
import { POST_DETAIL, UNIVERSAL_FEED } from "../../../constants/screenNames";

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
  let route: any = useRoute();
  let isPostDetailScreen = route.name === POST_DETAIL ? true : false;

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
                    onPress={() => {
                      LMFeedAnalytics.track(
                        Events.POST_TOPIC_CLICKED,
                        new Map<string, string>([
                          [
                            Keys.SCREEN_NAME,
                            isPostDetailScreen
                              ? ScreenNames.POST_DETAIL_SCREEN
                              : ScreenNames.UNIVERSAL_FEED,
                          ],
                          [Keys.POST_ID, post?.id],
                          [Keys.POST_TYPE, getPostType(post.attachments)],
                          [Keys.POST_TOPICS, joinStrings(post?.topics)],
                          [
                            Keys.CREATED_BY_UUID,
                            post?.user?.sdkClientInfo?.uuid,
                          ],
                          [Keys.TOPIC_ID, topicObject?.Id],
                        ])
                      );
                    }}
                    style={{
                      fontSize: Layout.normalize(16),
                      color: "#5046E5",
                      marginLeft: index === 0 ? 15 : 5,
                      marginTop: Layout.normalize(10),
                      paddingVertical: Layout.normalize(5),
                      backgroundColor: "hsla(244, 75%, 59%, 0.1)",
                      borderRadius: Layout.normalize(5),
                      paddingHorizontal: Layout.normalize(12),
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
