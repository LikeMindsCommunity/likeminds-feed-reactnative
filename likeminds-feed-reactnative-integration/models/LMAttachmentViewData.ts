import { AttachmentType } from "@likeminds.community/feed-rn";
import { LMAttachmentMetaViewData } from "./LMAttachmentMetaViewData";

// data model for array of attachments
export interface LMAttachmentViewData {
  metaData: LMAttachmentMetaViewData;
  type: AttachmentType;
}
