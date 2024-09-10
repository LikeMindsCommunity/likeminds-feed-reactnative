import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { decode } from "../../../utils";
import { styles } from "../LMPostContent/styles";
import STYLES from "../../../constants/Styles";

interface MoreLessComponentProps {
  truncatedText: string;
  fullText: string;
}

const MoreLessComponent = ({
  truncatedText,
  fullText,
}: MoreLessComponentProps) => {
  const [showMore, setShowMore] = React.useState(false);
  const postListStyle = STYLES.$POST_LIST_STYLE;
  const postContentStyle = postListStyle?.postContent;
  return (
    <Text
      style={StyleSheet.flatten([
        styles.contentText,
        postContentStyle?.textStyle,
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
            {marginTop: 5},
            postContentStyle?.showMoreText?.textStyle,
            
          ])}
        >
          {showMore
            ? ""
            : postContentStyle?.showMoreText?.children
            ? postContentStyle?.showMoreText.children
            : "See More"}
        </Text>
      </TouchableOpacity>
    </Text>
  );
};

export default MoreLessComponent;
