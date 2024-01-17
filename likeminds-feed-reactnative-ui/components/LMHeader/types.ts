import {ReactElement} from 'react';
import { LMIconProps } from '../LMIcon/types';
import { TextStyle, ViewStyle } from 'react-native';

export interface LMHeaderProps {
  heading?: string;
  rightComponent?: ReactElement;
  showBackArrow?: boolean;
  onBackPress?: () => void;
  subHeading?: string;
  backIcon?: LMIconProps;
  subHeadingTextStyle?: TextStyle;
  headingTextStyle?: TextStyle;
  headingViewStyle?: ViewStyle
}
