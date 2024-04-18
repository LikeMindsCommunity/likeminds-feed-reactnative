import { TextStyle } from "react-native";
import { LMPostMenuProps } from "../LMPost/LMPostMenu/types";
import { LMCommentUI } from "../../models";
import { LMTextProps, LMButtonProps } from "../../uiComponents";

export interface LMCommentProps {
  comment: LMCommentUI; // comment data
  likeIconButton?: LMButtonProps; // custom like icon button
  likeTextButton?: LMButtonProps; // custom like text button
  onTapViewMore?: (
    page: number,
    data: (repliesArray: Array<LMCommentUI>) => void
  ) => void; // callback function to be executed on click of view more replies
  commentMaxLines?: number; // maximun lines of comment to be shown
  menuIcon?: LMButtonProps; // custom menu icon button
  commentUserNameStyle?: TextStyle; // style for user name text
  commentContentProps?: LMTextProps; // props for comment content
  showMoreProps?: LMTextProps; // props for show more text
  replyTextProps?: LMButtonProps; // props for reply text
  repliesCountTextStyle?: TextStyle; // props for comment count text
  timeStampStyle?: TextStyle; // props for time stamp text
  viewMoreRepliesProps?: LMTextProps; // props for view more text
  onTapReplies?: (data: (repliesArray: Array<LMCommentUI>) => void) => void; // callback function to be executed on click of replies
  commentMenu: LMPostMenuProps; // this represents the post menu props;
  isRepliesVisible?: boolean;
  onCommentOverflowMenuClick?: (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => void;
}
