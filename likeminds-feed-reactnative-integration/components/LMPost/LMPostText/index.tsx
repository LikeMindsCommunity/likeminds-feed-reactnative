import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity } from "react-native";
import { decode } from "../../../utils";
import { styles } from "../LMPostContent/styles";
import { useLMPostContext } from "../../../context";
import STYLES from "../../../constants/Styles";

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
  const { highlight } = useLMPostContext();
  const [showMore, setShowMore] = React.useState(false);
  const readMoreTextStyle = STYLES?.$POST_DETAIL_STYLE?.readMoreTextStyle
  return (
    <Text style={[styles.contentText, textStyle]}>
      {!showMore
        ? decode(`${truncatedText.trim()}...`, true, undefined, highlight)
        : isDecoding
          ? `${fullText.trim()}`
          : decode(fullText, true, undefined, highlight)}
      {/* show more button section */}
      <Text
        style={StyleSheet.flatten([
          styles.showMoreText,
          showMoreTextStyle,
          readMoreTextStyle
        ]
        )}
        disabled={disable ? disable : showMore ? true : false}
        onPress={() => setShowMore(!showMore)}
      >
        {showMore ? "" : "Read More"}
      </Text>
    </Text>
  );
};

export default MoreLessComponent;
