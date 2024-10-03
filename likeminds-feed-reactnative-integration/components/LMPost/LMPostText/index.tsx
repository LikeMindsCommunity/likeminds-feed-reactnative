import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity } from "react-native";
import { decode } from "../../../utils";
import { styles } from "../LMPostContent/styles";

interface MoreLessComponentProps {
  truncatedText: string;
  fullText: string;
  textStyle?: TextStyle;
  showMoreTextStyle?: TextStyle;
  disable?: boolean;
  isDecoding?: boolean;
}

const MoreLessComponent = ({
  truncatedText,
  fullText,
  textStyle,
  showMoreTextStyle,
  disable,
  isDecoding,
}: MoreLessComponentProps) => {
  const [showMore, setShowMore] = React.useState(false);
  return (
    <Text style={[styles.contentText, textStyle]}>
      {!showMore
        ? `${truncatedText.trim()}...`
        : isDecoding
        ? `${fullText.trim()}`
        : decode(fullText, true)}
      {/* show more button section */}
      <Text
        style={[styles.showMoreText, showMoreTextStyle]}
        disabled={disable ? disable : showMore ? true : false}
        onPress={() => setShowMore(!showMore)}
      >
        {showMore ? "" : "Read More"}
      </Text>
    </Text>
  );
};

export default MoreLessComponent;
