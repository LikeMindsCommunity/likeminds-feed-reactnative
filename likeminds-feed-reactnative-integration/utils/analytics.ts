import { LMFeedAnalytics } from "../analytics/LMFeedAnalytics";
import { COMMENT_TYPE, POST_TYPE, REPLY_TYPE } from "../constants/Strings";
import { Events } from "../enums/Events";
import { Keys } from "../enums/Keys";

interface ReportAnalyticsType {
  reportType: string;
  createdByUuid: string;
  postId: string;
  reportReason: string;
  postType?: string;
  commentId?: string;
  commentReplyId?: string;
}

// to get post type
export const getPostType = (attachments) => {
  let postTypeString;
  if (attachments == null || attachments?.length > 0) return "text";
  switch (attachments[0]?.attachmentType) {
    case 1: // Image
      postTypeString = "image";
      break;
    case 2: // Video
      postTypeString = "video";
      break;
    case 3: // Document
      postTypeString = "document";
      break;
    case 4: // Link
      postTypeString = "link";
      break;
    default:
      postTypeString = "text";
  }
  return postTypeString;
};

export const reportAnalytics = ({
  reportType,
  createdByUuid,
  postId,
  reportReason,
  postType,
  commentId,
  commentReplyId,
}: ReportAnalyticsType) => {
  if (reportType === POST_TYPE) {
    LMFeedAnalytics.track(
      Events.POST_REPORTED,
      new Map<string | undefined, string | undefined>([
        [Keys.UUID, createdByUuid],
        [Keys.POST_ID, postId],
        [Keys.REPORT_REASON, reportReason],
        [Keys.POST_TYPE, postType],
      ])
    );
  } else if (reportType === COMMENT_TYPE) {
    LMFeedAnalytics.track(
      Events.COMMENT_REPORTED,
      new Map<string | undefined, string | undefined>([
        [Keys.UUID, createdByUuid],
        [Keys.POST_ID, postId],
        [Keys.REPORT_REASON, reportReason],
        [Keys.COMMENT_ID, commentId],
      ])
    );
  } else if (reportType === REPLY_TYPE) {
    LMFeedAnalytics.track(
      Events.REPLY_REPORTED,
      new Map<string | undefined, string | undefined>([
        [Keys.UUID, createdByUuid],
        [Keys.POST_ID, postId],
        [Keys.REPORT_REASON, reportReason],
        [Keys.COMMENT_ID, commentId],
        [Keys.COMMENT_REPLY_ID, commentReplyId],
      ])
    );
  }
};
