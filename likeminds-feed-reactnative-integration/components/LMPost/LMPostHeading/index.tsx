import { View, Text, TextLayoutLine, StyleSheet } from "react-native";
import React, { useState } from "react";
import { LMPostContextValues, useLMPostContext } from "../../../context";
import STYLES from "../../../constants/Styles";
import MoreLessComponent from "../LMPostText";

const LMPostHeading = () => {
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
    if (lines.length >= MAX_LINES) {
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
    <View style={{ paddingHorizontal: 16, paddingTop: 15 }}>
      {/* post content text */}
      {truncatedText ? (
        <MoreLessComponent
          truncatedText={truncatedText}
          fullText={post?.text}
          textStyle={StyleSheet.flatten([
            { fontSize: 16, fontWeight: "600" },
            postListStyle?.postContent?.postHeadingStyle,
          ])}
          showMoreTextStyle={{
            color: STYLES.$IS_DARK_THEME
              ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
              : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
            fontWeight: "600",
            fontSize: 16,
          }}
        />
      ) : (
        <Text
          style={[
            { fontSize: 16, fontWeight: "600" },
            postListStyle?.postContent?.postHeadingStyle,
          ]}
          onTextLayout={(e) => onTextLayout(e)}
          numberOfLines={MAX_LINES + 1}
        >
          {post?.heading}
        </Text>
      )}
    </View>
  );
};

export default LMPostHeading;
