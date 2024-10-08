import { TextStyle } from "react-native";
import { LMCommentViewData } from "../../models";
import { LMTextProps, LMButtonProps } from "../../uiComponents";

export interface LMCommentProps {
  comment: LMCommentViewData; // comment data
  likeIconButton?: LMButtonProps; // custom like icon button
  likeTextButton?: LMButtonProps; // custom like text button
  onTapViewMore?: (
    page: number,
    data: (repliesArray: Array<LMCommentViewData>) => void
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
  onTapReplies?: (data: (repliesArray: Array<LMCommentViewData>) => void, commentIdOfReplies: string) => void; // callback function to be executed on click of replies
  isRepliesVisible?: boolean;
  onCommentOverflowMenuClick?: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    commentId: string
  ) => void;
  hideThreeDotsMenu?: boolean;
}
