import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { decode } from "../../../utils";
import { useLMFeedStyles } from "../../../lmFeedProvider";
import { styles } from "../LMPostContent/styles";

interface LMPostPollTextProps {
  truncatedText: string;
  fullText: string;
}

const LMPostPollText = ({ truncatedText, fullText }: LMPostPollTextProps) => {
  const [showMore, setShowMore] = React.useState(false);
  const LMFeedContextStyles = useLMFeedStyles();
  const { pollStyle } = LMFeedContextStyles;
  const pollQuestionStyles: any = pollStyle?.pollQuestionStyles;
  return (
    <Text
      style={StyleSheet.flatten([
        styles.contentText,
        { color: "black" },
        pollQuestionStyles,
      ])}
    >
      {!showMore ? `${truncatedText}` : decode(fullText, true)}
      {/* show more button section */}
      <TouchableOpacity
        onPress={() => setShowMore(!showMore)}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        disabled={showMore ? true : false}
        accessibilityRole="button"
      >
        <Text
          style={StyleSheet.flatten([
            styles.showMoreText,
            { marginTop: 5 },
            pollQuestionStyles?.showMoreText,
          ])}
        >
          {showMore ? "" : "See More"}
        </Text>
      </TouchableOpacity>
    </Text>
  );
};

export default LMPostPollText;
