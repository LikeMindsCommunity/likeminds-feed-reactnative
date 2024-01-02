import {StyleSheet, TextLayoutLine, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {LMPostContentProps} from './types';
import {MAX_DEFAULT_POST_CONTENT_LINES} from '../../../constants/strings';
import LMText from '../../LMText'

const LMPostContent = ({
  text,
  textStyle,
  visibleLines,
  showMoreText,
  postContentViewStyle,
}: LMPostContentProps) => {
  const MAX_LINES = visibleLines
    ? visibleLines
    : MAX_DEFAULT_POST_CONTENT_LINES;
  const [showText, setShowText] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState<number>();
  const [showMoreButton, setShowMoreButton] = useState(false);

  // this handles the show more functionality
  const onTextLayout = useCallback(
    (event: {nativeEvent: {lines: string | TextLayoutLine[]}}) => {
      if (event.nativeEvent.lines.length > MAX_LINES && !showText) {
        setShowMoreButton(true);
        setNumberOfLines(MAX_LINES);
      }
    },
    [showText, MAX_LINES],
  );

  // this handles the visiblity of whole post content and trimmed text upto maximum line
  useEffect(() => {
    if (showMoreButton) {
      setNumberOfLines(showText ? undefined : MAX_LINES);
    }
  }, [showText, showMoreButton, MAX_LINES]);

  return (
    <View
      style={StyleSheet.flatten([
        postContentViewStyle,
        {paddingHorizontal: 16, paddingTop: 15},
      ])}>
      {/* post content text */}
      <LMText
        maxLines={numberOfLines}
        textStyle={StyleSheet.flatten([styles.contentText, textStyle])}
        onTextLayout={e => onTextLayout(e)}
      >{text}</LMText>
      {/* show more button section */}
      {showMoreButton && (
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          disabled={showText ? true : false}
          onPress={() => setShowText(!showText)}
          accessibilityRole="button">
          <LMText
            textStyle={StyleSheet.flatten([
              styles.showMoreText,
              showMoreText?.textStyle,
            ])}
          >{
            showText
              ? ''
              : showMoreText?.children
              ? showMoreText.children
              : 'See More'
          }</LMText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contentText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
    lineHeight: 20,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#007AFF',
    lineHeight: 20,
  },
  showMoreText: {
    color: '#9B9B9B',
  },
});

export default LMPostContent;
