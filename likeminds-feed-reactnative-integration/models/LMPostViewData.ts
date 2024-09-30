import { LMAttachmentViewData } from "./LMAttachmentViewData";
import { LMCommentViewData } from "./LMCommentViewData";
import { LMMenuItemsViewData } from "./LMMenuItemsViewData";
import { LMUserViewData } from "./LMUserViewData";
import { FilterComment } from "@likeminds.community/feed-rn";

// data model for post ViewData
export interface LMPostViewData {
  id: string;
  attachments?: Array<LMAttachmentViewData>;
  commentsCount: number;
  communityId: number;
  createdAt: number;
  isEdited: boolean;
  isLiked: boolean;
  isPinned: boolean;
  isSaved: boolean;
  likesCount: number;
  menuItems: Array<LMMenuItemsViewData>;
  replies?: Array<LMCommentViewData>;
  text: string;
  heading: string;
  updatedAt: number;
  userId: string;
  uuid: string;
  user: LMUserViewData;
  topics: string[];
  users: { [key: string]: LMUserViewData };
  filteredComments: FilterComment;
}
