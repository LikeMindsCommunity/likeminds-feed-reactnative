import {TextStyle, ViewStyle} from 'react-native';
import {LMPostMenuProps} from '../LMPostMenu/types';
import {LMPostUI, LMUserUI} from '../../../models';
import { LMProfilePictureProps } from '../../LMProfilePicture/types';
import { LMTextProps } from '../../LMText/types';
import { LMIconProps } from '../../LMIcon/types';

export interface LMPostHeaderProps {
  post: LMPostUI; // post data
  profilePicture?: LMProfilePictureProps; // props for profile avatar style
  titleText?: LMTextProps; // this represents the style of title of the post
  createdAt?: LMTextProps; // style of time of creation of post
  showMemberStateLabel?: boolean; // this represents if the member state label should be visible or not
  memberState?: number; // this gets the member state
  memberStateViewStyle?: ViewStyle; // style of the member state label view
  memberStateTextStyle?: TextStyle; // style of the member state label text
  postHeaderViewStyle?: ViewStyle; // style of the post header section
  pinIcon?: LMIconProps; // this represents the pin icon to display
  menuIcon?: LMIconProps; // this represents the icon that makes the menu list visible on click over it
  postMenu: LMPostMenuProps; // this represents the post menu props
  onTap: (user?: LMUserUI) => void; // callback function executed on tap of post header
  showMenuIcon?: boolean; //this represents if the menu icon should be visible or not
}
