import { Attachment, MenuItem } from "@likeminds.community/feed-rn";

export interface LMFilterCommentViewData {
  id: string;
  attachments: Attachment[];
  commentsCount: number;
  communityId: number;
  createdAt: number;
  isEdited: boolean;
  isLiked: boolean;
  level: number;
  likesCount: number;
  menuItems: MenuItem[];
  postId: string;
  tempId: string | null;
  text: string;
  updatedAt: number;
  userId: string;
  uuid: string;
}
