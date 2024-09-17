import {TextStyle, ViewStyle} from 'react-native';
import {LMProfilePictureProps, LMIconProps} from '../../uiComponents';
import {LMActivityViewData} from '../../models/LMActivityViewData';

export interface LMNotificationFeedItemProps {
  activity: LMActivityViewData; // notification activity data
  onTap?: () => void; // callback function executed on click of notification item
}
