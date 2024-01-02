import {ViewStyle} from 'react-native';
import { LMButtonProps } from '../../LMButton/types';

export interface LMPostFooterProps {
  isLiked: boolean; // this represents the liked state of the post
  isSaved?: boolean; // this represents the saved state of the post
  likesCount: number; // this represents the likes count of the post
  commentsCount: number; // this represents the comments count of the post
  showBookMarkIcon?: boolean; // this represents if the bookmark icon has to be shown or not
  showShareIcon?: boolean; // this represents if the share icon has to be shown or not
  likeIconButton?: LMButtonProps; // this represents the custom like icon button
  likeTextButton?: LMButtonProps; // this represents the custom like text button
  commentButton?: LMButtonProps; // this represents the custom comment button
  saveButton?: LMButtonProps; // this represents the custom save button
  shareButton?: LMButtonProps; // this represents the custom share button
  footerBoxStyle?: ViewStyle; // style of the footer box view
}
