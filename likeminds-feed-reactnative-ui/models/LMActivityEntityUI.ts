import {LMAttachmentUI} from './LMAttachmentUI';
import {LMCommentUI} from './LMCommentUI';
import {LMUserUI} from './LMUserUI';

export interface LMActivityEntityUI {
  id: string;
  text: string;
  deleteReason?: string;
  deletedBy?: string;
  heading?: string;
  attachments?: Array<LMAttachmentUI>;
  communityId: number;
  isEdited: boolean;
  isPinned?: boolean;
  userId: string;
  user: LMUserUI;
  replies?: Array<LMCommentUI>;
  level?: number;
  createdAt: number;
  updatedAt: number;
  uuid: string;
  deletedByUUID?: string;
}
