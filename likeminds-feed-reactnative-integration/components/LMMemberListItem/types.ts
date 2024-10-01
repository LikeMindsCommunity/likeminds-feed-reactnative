import {ViewStyle} from 'react-native';
import {LMTextProps,LMProfilePictureProps} from '../../uiComponents';
import {LMLikeViewData, LMUserViewData} from '../../models';

export interface LMMemberListItemProps {
  likes: LMLikeViewData; // this represents the user data
  profilePictureProps?: LMProfilePictureProps; // props for member profile avatar
  nameProps?: LMTextProps; // this represents the name of the member
  customTitleProps?: LMTextProps; // this represents the title of the member
  boxStyle?: ViewStyle; // this represents the style of the member item view
  onTap?: (user?: LMUserViewData) => void; // callback function for accessing the user data
}
