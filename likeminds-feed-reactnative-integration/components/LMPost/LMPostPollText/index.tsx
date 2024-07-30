import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { decode } from "../../../utils";
import { useLMFeedStyles } from "../../../lmFeedProvider";
import { styles } from "../LMPostContent/styles";
import STYLES from "../../../constants/Styles";

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
      /* @ts-ignore */
      style={StyleSheet.flatten([
        styles.contentText,
        {
          color: STYLES.$IS_DARK_THEME
            ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
            : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
        },
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
            /* @ts-ignore */
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
