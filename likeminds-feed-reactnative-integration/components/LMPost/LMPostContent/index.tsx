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
import { useLMFeedStyles } from "../../../lmFeedProvider";

const LMPostContent = React.memo(() => {
  const { post }: LMPostContextValues = useLMPostContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const { postListStyle } = LMFeedContextStyles;
  const postContentStyle = postListStyle?.postContent

  const MAX_LINES = postContentStyle?.visibleLines
    ? postContentStyle?.visibleLines
    : MAX_DEFAULT_POST_CONTENT_LINES;
  const [showText, setShowText] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState<number>();
  const [showMoreButton, setShowMoreButton] = useState(false);

  // this handles the show more functionality
  const onTextLayout = (event: {
    nativeEvent: { lines: string | TextLayoutLine[] };
  }) => {
    if (event.nativeEvent.lines.length > MAX_LINES && !showText) {
      setShowMoreButton(true);
      setNumberOfLines(MAX_LINES);
    }
  };

  // this handles the visiblity of whole post content and trimmed text upto maximum line
  useEffect(() => {
    if (showMoreButton) {
      setNumberOfLines(showText ? undefined : MAX_LINES);
    }
  }, [showText, showMoreButton, MAX_LINES]);

  return (
    <View
      style={StyleSheet.flatten([
        postContentStyle?.postContentViewStyle,
        { paddingHorizontal: 16, paddingTop: 15 },
      ])}
    >
      {/* post content text */}
      <LMText
        maxLines={numberOfLines}
        textStyle={StyleSheet.flatten([
          styles.contentText,
          postContentStyle?.textStyle
        ])}
        onTextLayout={(e) => onTextLayout(e)}
      >
        {decode(post?.text, true)}
      </LMText>
      {/* show more button section */}
      {showMoreButton && (
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          disabled={showText ? true : false}
          onPress={() => setShowText(!showText)}
          accessibilityRole="button"
        >
          <LMText
            textStyle={StyleSheet.flatten([
              styles.showMoreText,
              postContentStyle?.showMoreText?.textStyle,
            ])}
          >
            {showText
              ? ""
              : postContentStyle?.showMoreText?.children
              ? postContentStyle?.showMoreText.children
              : "See More"}
          </LMText>
        </TouchableOpacity>
      )}
    </View>
  );
});

export default LMPostContent;
