import React from "react";
import {
  NativeSyntheticEvent,
  TextLayoutEventData,
  TextStyle,
} from "react-native";

// required and optional props expected in the LMText component
export interface LMTextProps {
  maxLines?: number; // this defines the maximum lines to be displayed
  textStyle?: TextStyle | TextStyle[]; // this represents ths style of the text
  selectable?: boolean; // this represents the selection behaviour of the text
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void; // callback function executed on change of text layout
  children?: React.ReactNode;
  onPress?: () => void;
}
