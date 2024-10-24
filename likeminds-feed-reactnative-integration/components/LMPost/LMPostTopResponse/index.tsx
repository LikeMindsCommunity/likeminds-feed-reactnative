import { View, Text, StyleSheet, TextLayoutLine } from "react-native";
import React, { useState } from "react";
import { LMPostContextValues, useLMPostContext } from "../../../context";
import { LMProfilePicture } from "../../../uiComponents";
import { nameInitials, timeStamp } from "../../../utils";
import STYLES from "../../../constants/Styles";
import MoreLessComponent from "../LMPostText";
import pluralizeOrCapitalize from "@likeminds.community/feed-rn-core/utils/variables";
import { WordAction } from "@likeminds.community/feed-rn-core/enums/Variables";
import { CommunityConfigs } from "@likeminds.community/feed-rn-core/communityConfigs";

const LMPostTopResponse = () => {
  const [truncatedText, setTruncatedText] = useState("");
  const { post }: LMPostContextValues = useLMPostContext();
  const postListStyle = STYLES.$POST_LIST_STYLE;

  const MAX_LINES = 3;

  // this handles the show more functionality
  const onTextLayout = (event: {
    nativeEvent: { lines: string | TextLayoutLine[] };
  }) => {
    //get all lines
    const { lines } = event.nativeEvent;
    let text = "";

    //get lines after it truncate
    if (lines.length > MAX_LINES) {
      if (Array.isArray(lines)) {
        text = lines
          .splice(0, MAX_LINES)
          .map((line) => line.text)
          .join("");
      }
      setTruncatedText(text);
    }
  };
  return (
    <>
      {Object.keys(post?.filteredComments).length > 0 ? (
        <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
          <Text
            style={[
              {
                fontSize: 16,
                color: STYLES.$IS_DARK_THEME
                  ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                  : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
                fontWeight: "600",
                paddingVertical: 10,
              },
              postListStyle?.postContent?.postTopResponse?.heading,
            ]}
          >
            {`Top ${pluralizeOrCapitalize(CommunityConfigs?.getCommunityConfigs("feed_metadata")?.value?.comment ?? "comment", WordAction.firstLetterCapitalSingular)}`}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <LMProfilePicture
              fallbackText={{
                children: nameInitials(post?.user?.name),
                textStyle:
                  postListStyle?.postContent?.postTopResponse
                    ?.profilePictureFallbackTextStyle,
              }}
              imageUrl={post?.user?.imageUrl}
              size={40}
            />
            <View
              style={[
                {
                  padding: 10,
                  backgroundColor: STYLES.$IS_DARK_THEME
                    ? STYLES.$SEPARATOR_COLORS.DARK
                    : STYLES.$SEPARATOR_COLORS.LIGHT,
                  borderRadius: 10,
                  flex: 1,
                },
                postListStyle?.postContent?.postTopResponse?.commentBox,
              ]}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    color: STYLES.$IS_DARK_THEME
                      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
                    fontWeight: "600",
                  },
                  postListStyle?.postContent?.postTopResponse
                    ?.commentUserNameStyle,
                ]}
              >
                {post?.user?.name}
              </Text>
              <Text
                style={[
                  {
                    fontSize: 12,
                    color: STYLES.$IS_DARK_THEME
                      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
                    fontWeight: "400",
                    marginBottom: 5,
                  },
                  postListStyle?.postContent?.postTopResponse
                    ?.commentTimeStampStyle,
                ]}
              >
                {timeStamp(Number(post?.createdAt)) === undefined
                  ? "now"
                  : `${timeStamp(Number(post?.createdAt))}`}
              </Text>
              <View>
                {truncatedText ? (
                  <MoreLessComponent
                    truncatedText={truncatedText}
                    fullText={post?.filteredComments?.text}
                    textStyle={StyleSheet.flatten([
                      {
                        color: STYLES.$IS_DARK_THEME
                          ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                          : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
                      },
                      postListStyle?.postContent?.postTopResponse
                        ?.commentTextStyle,
                    ])}
                    showMoreTextStyle={{
                      color: STYLES.$IS_DARK_THEME
                        ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                        : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
                      fontWeight: "400",
                    }}
                    disable={true}
                  />
                ) : (
                  <Text
                    style={StyleSheet.flatten([
                      {
                        color: STYLES.$IS_DARK_THEME
                          ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                          : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
                      },
                      postListStyle?.postContent?.postTopResponse
                        ?.commentTextStyle,
                    ])}
                    onTextLayout={(e) => onTextLayout(e)}
                    numberOfLines={MAX_LINES + 1}
                  >
                    {post?.filteredComments?.text}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default LMPostTopResponse;
