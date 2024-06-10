import { LMFeedAnalytics } from "../analytics/LMFeedAnalytics";
import { COMMENT_TYPE, POST_TYPE, REPLY_TYPE } from "../constants/Strings";
import { Events } from "../enums/Events";
import { Keys } from "../enums/Keys";
import { ScreenNames } from "../enums/ScreenNames";
import { LMPostUI } from "../models";

interface ReportAnalyticsType {
  reportType: string;
  createdByUuid: string;
  postId: string;
  reportReason: string;
  postType?: string;
  commentId?: string;
  commentReplyId?: string;
  post: LMPostUI;
  commentCreatedByUuid: string;
}

// to get post type
export const getPostType = (attachments) => {
  let postTypeString;
  if (attachments || attachments?.length === 0) return "text";
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
  post,
  commentCreatedByUuid,
}: ReportAnalyticsType) => {
  if (reportType === POST_TYPE) {
    LMFeedAnalytics.track(
      Events.POST_REPORTED,
      new Map<string | undefined, string | undefined>([
        [Keys.SCREEN_NAME, ScreenNames.REPORT_SCREEN],
        [Keys.POST_ID, postId],
        [Keys.REPORT_REASON, reportReason],
        [Keys.POST_TYPE, postType],
        [Keys.POST_TOPICS, joinStrings(post?.topics)],
        [Keys.POST_CREATED_BY_UUID, createdByUuid],
      ])
    );
  } else if (reportType === COMMENT_TYPE) {
    LMFeedAnalytics.track(
      Events.COMMENT_REPORTED,
      new Map<string | undefined, string | undefined>([
        [Keys.SCREEN_NAME, ScreenNames.REPORT_SCREEN],
        [Keys.POST_ID, postId],
        [Keys.REPORT_REASON, reportReason],
        [Keys.COMMENT_ID, commentId],
        [Keys.POST_TOPICS, joinStrings(post?.topics)],
        [Keys.POST_CREATED_BY_UUID, createdByUuid],
        [Keys.COMMENT_CREATED_BY_UUID, commentCreatedByUuid],
      ])
    );
  } else if (reportType === REPLY_TYPE) {
    LMFeedAnalytics.track(
      Events.REPLY_REPORTED,
      new Map<string | undefined, string | undefined>([
        [Keys.SCREEN_NAME, ScreenNames.REPORT_SCREEN],
        [Keys.POST_ID, postId],
        [Keys.REPORT_REASON, reportReason],
        [Keys.COMMENT_ID, commentId],
        [Keys.COMMENT_REPLY_ID, commentReplyId],
        [Keys.POST_TOPICS, joinStrings(post?.topics)],
        [Keys.POST_CREATED_BY_UUID, createdByUuid],
        [Keys.COMMENT_CREATED_BY_UUID, commentCreatedByUuid],
      ])
    );
  }
};

export function joinStrings(array: string[]): string {
  if (!Array.isArray(array)) {
    throw new Error("Input must be an array");
  }

  return array.join(", ");
}
