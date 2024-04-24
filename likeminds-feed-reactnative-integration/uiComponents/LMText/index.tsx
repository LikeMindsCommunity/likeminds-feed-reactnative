import { StyleSheet, Text } from "react-native";
import React from "react";
import { LMTextProps } from "./types";
import { defaultStyles } from "./styles";

const LMText = React.memo(({
  maxLines,
  textStyle,
  selectable,
  onTextLayout,
  children,

  ...textProps
}: LMTextProps) => {
  return (
    // this renders the text component
    <Text
      selectable={selectable ? selectable : true} // default selectable value is true
      numberOfLines={maxLines}
      onTextLayout={onTextLayout}
      style={StyleSheet.flatten([defaultStyles.textStyle, textStyle])}
      ellipsizeMode="tail"
      {...textProps}
    >
      {children}
    </Text>
  );
})

export default LMText