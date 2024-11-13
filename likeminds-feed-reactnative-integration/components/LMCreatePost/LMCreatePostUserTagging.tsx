import { View, Text, FlatList, Pressable, TextStyle } from "react-native";
import React from "react";
import { LMUserViewData } from "../../models";
import { nameInitials, replaceLastMention } from "../../utils";
import { userTaggingDecoder } from "../../utils/decodeMentions";
import { LMFeedAnalytics } from "../../analytics/LMFeedAnalytics";
import { Events } from "../../enums/Events";
import { Keys } from "../../enums/Keys";
import { styles } from "../../screens/createPost/styles";
import { LMProfilePicture, LMText } from "../../uiComponents";
import STYLES from "../../constants/Styles";
import LMLoader from "../LMLoader";
import { CreatePostContextValues, useCreatePostContext } from "../../context";

const LMCreatePostUserTagging = () => {
  const postListStyle = STYLES.$POST_LIST_STYLE;
  const postDetailStyle = STYLES.$POST_DETAIL_STYLE;
  const postHeaderStyle = postListStyle?.header;

  let {
    postContentText,
    handleLoadMore,
    allTags,
    setAllTags,
    isUserTagging,
    userTaggingListHeight,
    setIsUserTagging,
    taggedUserName,
    setPostContentText,
    isLoading,
  }: CreatePostContextValues = useCreatePostContext();
  return (
    <>
      {allTags && isUserTagging ? (
        <View
          style={[
            styles.taggingListView,
            {
              height: userTaggingListHeight,
            },
            allTags.length === 0 && { borderTopWidth: 0 },
            postDetailStyle?.userTaggingListStyle?.taggingListView,
          ]}
        >
          <FlatList
            data={[...allTags]}
            renderItem={({ item }: { item: LMUserViewData }) => {
              return (
                <Pressable
                  onPress={() => {
                    const uuid = item?.sdkClientInfo?.uuid;
                    const res = replaceLastMention(
                      postContentText,
                      taggedUserName,
                      item?.name,
                      uuid ? `user_profile/${uuid}` : uuid
                    );
                    setPostContentText(res);
                    setAllTags([]);
                    setIsUserTagging(false);

                    const taggedUsers = userTaggingDecoder(res);
                    if (taggedUsers?.length > 0) {
                      const taggedUserIds = taggedUsers
                        .map((user) => user.route)
                        .join(", ");
                      LMFeedAnalytics.track(
                        Events.USER_TAGGED_IN_POST,
                        new Map<string, string>([
                          [Keys.TAGGED_USER_UUID, taggedUserIds],
                          [
                            Keys.TAGGED_USER_COUNT,
                            taggedUsers?.length.toString(),
                          ],
                        ])
                      );
                    }
                  }}
                  style={[
                    styles.taggingListItem,
                    postDetailStyle?.userTaggingListStyle?.userTagView,
                  ]}
                  key={item?.id}
                >
                  <LMProfilePicture
                    {...postHeaderStyle?.profilePicture}
                    fallbackText={{
                      ...postHeaderStyle?.profilePicture?.fallbackText,
                      children: postHeaderStyle?.profilePicture?.fallbackText
                        ?.children ? (
                        postHeaderStyle?.profilePicture?.fallbackText?.children
                      ) : (
                        <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
                          {nameInitials(item?.name)}
                        </Text>
                      ),
                    }}
                    fallbackTextBoxStyle={[
                      styles.taggingListProfileBoxStyle,
                      postHeaderStyle?.profilePicture?.fallbackTextBoxStyle,
                    ]}
                    size={
                      postHeaderStyle?.profilePicture?.size
                        ? postHeaderStyle?.profilePicture?.size
                        : 40
                    }
                  />
                  <View style={styles.taggingListItemTextView}>
                    <LMText
                      children={
                        <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
                          {item?.name}
                        </Text>
                      }
                      maxLines={1}
                      textStyle={
                        [
                          styles.taggingListText,
                          postDetailStyle?.userTaggingListStyle
                            ?.userTagNameStyle,
                        ] as TextStyle
                      }
                    />
                  </View>
                </Pressable>
              );
            }}
            extraData={{
              value: [postContentText, allTags],
            }}
            keyboardShouldPersistTaps={"handled"}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={1}
            bounces={false}
            ListFooterComponent={
              isLoading ? (
                <View style={styles.taggingLoaderView}>
                  <LMLoader size={"small"} />
                </View>
              ) : null
            }
            /* @ts-ignore */
            keyExtractor={(item) => {
              return item?.id;
            }}
          />
        </View>
      ) : null}
    </>
  );
};

export default LMCreatePostUserTagging;
