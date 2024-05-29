import { LMOGTagsUI } from "./LMOGTagsUI";
import { PollMultiSelectState, PollType } from "../enums/Poll";

// data model for attachmentMeta object inside attachments
export interface LMAttachmentMetaUI {
  entityId?: string;
  name?: string;
  format?: string;
  size?: number;
  duration?: number;
  pageCount?: number;
  url: string;
  thumbnailUrl?: string;
  ogTags: LMOGTagsUI;
  coverImageUrl?: string;
  title?: string;
  body?: string;
  pollQuestion?: string;
  expiryTime?: number;
  options?: string[];
  multipleSelectState?: PollMultiSelectState;
  pollType?: PollType;
  multipleSelectNumber?: number;
  isAnonymous?: boolean;
  allowAddOption?: boolean;
}
