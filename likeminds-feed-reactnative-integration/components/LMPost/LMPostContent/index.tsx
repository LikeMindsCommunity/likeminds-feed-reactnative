import {
  StyleSheet,
  TextLayoutLine,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MAX_DEFAULT_POST_CONTENT_LINES } from "../../../constants/Strings";
import { LMText } from "../../../uiComponents";
import { styles } from "./styles";
import decode from "../../../utils/decodeMentions";
import { LMPostContextValues, useLMPostContext } from "../../../context";
import MoreLessComponent from "../LMPostText";
import STYLES from "../../../constants/Styles";

const LMPostContent = React.memo(() => {
  const { post, highlight }: LMPostContextValues = useLMPostContext();
  const postListStyle = STYLES.$POST_LIST_STYLE;
  const postContentStyle = postListStyle?.postContent;

  const MAX_LINES = postContentStyle?.visibleLines
    ? postContentStyle?.visibleLines
    : MAX_DEFAULT_POST_CONTENT_LINES;
  const [truncatedText, setTruncatedText] = useState("");

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

  // to cause a re-render whenever the content of the post is edited
  useEffect(() => {
    setTruncatedText("");
  }, [post, highlight])

  return (
    <View
      style={StyleSheet.flatten([
        postContentStyle?.postContentViewStyle,
        { paddingHorizontal: 16, paddingTop: 15, paddingBottom: 10 },
      ])}
    >
      {/* post content text */}
      {truncatedText ? (
        <MoreLessComponent
          truncatedText={truncatedText}
          fullText={post?.text}
          textStyle={postContentStyle?.textStyle}
          showMoreTextStyle={StyleSheet.flatten([
            { fontWeight: "400" },
            postContentStyle?.showMoreText?.textStyle,
          ])}
        />
      ) : (
        <LMText
          maxLines={MAX_LINES + 1}
          highlight={highlight ?? ""}
          textStyle={StyleSheet.flatten([
            styles.contentText,
            postContentStyle?.textStyle,
          ])}
          onTextLayout={(e) => onTextLayout(e)}
        >
          {decode(post?.text, true, undefined, highlight)}
        </LMText>
      )}
    </View>
  );
});

export default LMPostContent;
