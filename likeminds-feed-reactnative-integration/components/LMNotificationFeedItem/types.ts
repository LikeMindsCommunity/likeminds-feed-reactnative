import {TextStyle, ViewStyle} from 'react-native';
import {LMProfilePictureProps, LMIconProps} from '../../uiComponents';
import {LMActivityUI} from '../../models/LMActivityUI';

export interface LMNotificationFeedItemProps {
  activity: LMActivityUI; // notification activity data
  onTap?: () => void; // callback function executed on click of notification item
}
