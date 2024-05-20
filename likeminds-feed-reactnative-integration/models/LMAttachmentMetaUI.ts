import { PollMultiSelectState, PollType } from '../enums/Poll';
import {LMOGTagsUI} from './LMOGTagsUI';

// data model for attachmentMeta object inside attachments
export interface LMAttachmentMetaUI {
  entityId?: string;
  name?: string;
  url?: string;
  format?: string;
  size?: number;
  duration?: number;
  pageCount?: number;
  ogTags: LMOGTagsUI;
  coverImageUrl?: string;
  title?: string;
  body?: string;
  thumbnailUrl?: string;
  pollQuestion?: string;
  expiryTime?: number;
  options?: string[];
  multipleSelectState?: PollMultiSelectState;
  pollType?: PollType;
  multipleSelectNumber?: number;
  isAnonymous?: boolean;
  allowAddOption?: boolean;
}
