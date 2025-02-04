import {
  Attachment,
  AttachmentMeta,
  GetNotification,
  Activity,
  MenuItem,
  OgTag,
  User,
  Post,
  Reply,
  Like,
  GetPostLikes,
} from "@likeminds.community/feed-rn";
import {
  DocumentMetaData,
  ImageVideoMetaData,
} from "../models/addPostMetaData";
import {
  DOCUMENT_ATTACHMENT_TYPE,
  IMAGE_ATTACHMENT_TYPE,
  LINK_ATTACHMENT_TYPE,
  POLL_ATTACHMENT_TYPE,
  VIDEO_ATTACHMENT_TYPE,
} from "../constants/Strings";
import {
  LMActivityEntityViewData,
  LMActivityViewData,
  LMAttachmentMetaViewData,
  LMAttachmentViewData,
  LMLikeViewData,
  LMMenuItemsViewData,
  LMOGTagsViewData,
  LMPostViewData,
  LMSDKClientInfoViewData,
  LMUserViewData,
} from "../models";
import { LMFilterCommentViewData } from "../models/LMFilterCommentViewData";
import { LMTopicViewData } from "../models/LMTopicViewData";
import { LMFeedWidgetViewData } from "../models/LMWidgetData";
import { TemporaryPost } from "@likeminds.community/feed-rn/dist/post/models/TemporaryPost";

/**
 * @param data: [GetFeedResponse]
 * @returns list of [LMPostViewData]
 */
export function convertUniversalFeedPosts(data: {
  posts: Post[];
  topics: { [key: string]: LMTopicViewData };
  users: { [key: string]: LMUserViewData };
  filteredComments: { [key: string]: LMFilterCommentViewData };
  widgets: Record<string, LMFeedWidgetViewData>;
}): LMPostViewData[] {
  const postData = data.posts ? data.posts : [];
  const userData = data.users;
  const widgetData = data.widgets;
  const filteredComments = data.filteredComments;
  return postData?.map((item: Post) => {
    return convertToLMPostViewData(
      item,
      userData,
      widgetData,
      filteredComments
    );
  });
}

/**
 * @param data: [GetPostResponse]
 * @returns list of [LMPostViewData]
 */
export function convertSingleFeedPost(data: {
  post: Post;
  users: { [key: string]: LMUserViewData };
  widgets: Record<string, LMFeedWidgetViewData>;
  filteredComments: { [key: string]: LMFilterCommentViewData };
}): LMPostViewData {
  const postData: Post = data.post;
  const userData = data.users;
  const widgetData = data.widgets;
  const filteredComments = data.filteredComments;

  return convertToLMPostViewData(
    postData,
    userData,
    widgetData,
    filteredComments
  );
}

/**
 * @param post: [Post]
 * @param user: [Map] of String to User
 * @returns LMPostViewData
 */
export function convertToLMPostViewData(
  post: Post,
  user: { [key: string]: LMUserViewData },
  widgets: Record<string, LMFeedWidgetViewData>,
  filteredComments: { [key: string]: LMFilterCommentViewData }
): LMPostViewData {
  const postData: LMPostViewData = {
    id: post.id,
    attachments: post.attachments
      ? convertToLMAttachmentsViewData(post.attachments, widgets)
      : [],
    commentsCount: post.commentsCount,
    communityId: post.communityId,
    createdAt: post.createdAt,
    isEdited: post.isEdited,
    isLiked: post.isLiked,
    isPinned: post.isPinned,
    isSaved: post.isSaved,
    likesCount: post.likesCount,
    isAnonymous: post.isAnonymous,
    isHidden: post.isHidden,
    menuItems: convertToLMMenuItemsViewData(post.menuItems),
    replies: post?.replies
      ? convertToLMCommentViewData(post.id, post.replies, user)
      : [],
    text: post.text,
    heading: post.heading,
    updatedAt: post.updatedAt,
    userId: user?.id?.toString(),
    uuid: post.uuid,
    user: convertToLMUserViewData(user[post.uuid]),
    topics: post.topics,
    users: user,
    filteredComments: post?.commentIds
      ? filteredComments.hasOwnProperty(post?.commentIds[0])
        ? filteredComments[post?.commentIds[0]]
        : undefined
      : undefined,
  };
  return postData;
}

/**
 * @param data: [Attachment]
 * @returns list of [LMAttachmentViewData]
 */
export function convertToLMAttachmentsViewData(
  data: Attachment[],
  widgets: Record<string, LMFeedWidgetViewData>
): LMAttachmentViewData[] {
  return data?.map((item: Attachment) => {
    return {
      attachmentMeta: convertToLMAttachmentMetaViewData(
        item.attachmentMeta,
        widgets
      ),
      attachmentType: item.attachmentType,
    };
  });
}

/**
 * @param data: AttachmentMeta
 * @returns LMAttachmentMetaViewData
 */
export function convertToLMAttachmentMetaViewData(
  data: AttachmentMeta,
  widgets
): LMAttachmentMetaViewData {
  const attachmentMetaData: LMAttachmentMetaViewData = {
    duration: data.duration,
    format: data.format,
    name: data.name,
    ogTags: data.ogTags ? convertToLMOgTagsViewData(data.ogTags) : undefined,
    pageCount: data.pageCount,
    size: data.size,
    url: data.url,
    thumbnailUrl: data.thumbnailUrl,
    ...convertToLMPollViewData(data?.entityId ? data?.entityId : "", widgets),
  };
  return attachmentMetaData;
}

// to calculate days of poll expiry.
const calculateDaysToExpiry = (item) => {
  const difference = item?.metadata?.expiryTime - Date.now();

  const millisecondsInADay = 24 * 60 * 60 * 1000;
  const millisecondsToDays = difference / millisecondsInADay;

  return Math.ceil(millisecondsToDays)?.toString();
};

/**
 * @param is: string
 * @param widgets: Record<string, LMFeedWidgetViewData>
 * @returns any
 */
export function convertToLMPollViewData(
  id: string,
  widgets: Record<string, LMFeedWidgetViewData>
) {
  const item = widgets[id];
  const pollMetaData: any = {
    id: id,
    title: item?.metadata?.title,
    options: item?.lmMeta?.options,
    allowAddOption: item?.metadata?.allowAddOption,
    expiryTime: item?.metadata?.expiryTime,
    expiryDays: calculateDaysToExpiry(item),
    toShowResults: item?.lmMeta?.toShowResults,
    createdAt: item?.createdAt,
    pollAnswerText: item?.lmMeta?.pollAnswerText,
    multipleSelectNumber: item?.metadata?.multipleSelectNumber,
    multipleSelectState: item?.metadata?.multipleSelectState,
    isAnonymous: item?.metadata?.isAnonymous,
    pollType: item?.metadata?.pollType,
  };
  return pollMetaData;
}

/**
 * @param data: OgTag
 * @returns LMOGTagsViewData
 */
export function convertToLMOgTagsViewData(data: OgTag): LMOGTagsViewData {
  const ogTagsData: LMOGTagsViewData = {
    title: data.title,
    description: data.description,
    url: data.url,
    image: data.image,
  };
  return ogTagsData;
}

/**
 * @param data: [MenuItem]
 * @returns [LMMenuItemsViewData]
 */
export function convertToLMMenuItemsViewData(
  data: MenuItem[]
): LMMenuItemsViewData[] {
  return data?.map((item) => {
    return {
      title: item.title,
      id: item.id,
    };
  });
}

/**
 * @param data: User
 * @returns LMUserViewData
 */
export function convertToLMUserViewData(data: User): LMUserViewData {
  const userData: LMUserViewData = {
    customTitle: data?.customTitle,
    id: data?.id,
    imageUrl: data?.imageUrl,
    isGuest: data?.isGuest,
    name: data?.name,
    organisationName: data?.organisationName,
    sdkClientInfo: convertToLMSDKClientInfoViewData(data),
    updatedAt: data?.updatedAt,
    userUniqueId: data?.userUniqueId,
    uuid: data?.uuid,
  };
  return userData;
}

/**
 * @param data: User
 * @returns LMSDKClientInfoViewData
 */
export function convertToLMSDKClientInfoViewData(
  data: User
): LMSDKClientInfoViewData {
  const sdkClientInfo = data?.sdkClientInfo;
  const sdkClientInfoConverter: LMSDKClientInfoViewData = {
    community: sdkClientInfo?.community,
    user: sdkClientInfo?.user,
    uuid: sdkClientInfo?.uuid,
    userUniqueId: sdkClientInfo?.userUniqueId,
    widgetId: sdkClientInfo?.widgetId,
  };
  return sdkClientInfoConverter;
}

/**
 * @param data: [GetPostLikes]
 * @returns list of [LMLikeViewData]
 */
export function convertToLMLikesList(data: GetPostLikes): LMLikeViewData[] {
  const likesListData = data?.likes;
  const userData = data?.users;
  return likesListData?.map((item: Like) => {
    return convertToLMLikeViewData(item, userData);
  });
}

/**
 * @param likes: [Like]
 * @param users: [Map] of String to User
 * @returns LMLikeViewData
 */
export function convertToLMLikeViewData(
  likes: Like,
  // users: { [key: string]: LMUserViewData }
  users: User[]
): LMLikeViewData {
  const likesData: LMLikeViewData = {
    id: likes?.id,
    createdAt: likes?.createdAt,
    updatedAt: likes?.updatedAt,
    userId: likes?.uuid,
    uuid: likes?.uuid,
    user: convertToLMUserViewData(users[likes?.uuid]),
  };
  return likesData;
}

/**
 * @param data: [ImageVideoMetaData]
 * @returns list of [LMAttachmentViewData]
 */
export function convertImageVideoMetaData(
  data: ImageVideoMetaData[]
): LMAttachmentViewData[] {
  const convertedImageVideoMetaData = data?.map((item) => {
    return {
      attachmentMeta: {
        entityId: "",
        format: item?.type,
        name: item?.fileName,
        ogTags: {
          description: "",
          title: "",
          url: "",
          image: "",
        },
        size: item?.fileSize,
        duration: Math.round(item?.duration ? item.duration : 0),
        pageCount: 0,
        url: item?.uri,
      },
      attachmentType: item?.duration
        ? VIDEO_ATTACHMENT_TYPE
        : IMAGE_ATTACHMENT_TYPE, // You need to specify the attachment type.
    };
  });
  return convertedImageVideoMetaData;
}

/**
 * @param data: [DocumentMetaData]
 * @returns list of [LMAttachmentViewData]
 */
export function convertDocumentMetaData(
  data: DocumentMetaData[]
): LMAttachmentViewData[] {
  const convertedDocumentMetaData = data?.map((item) => {
    return {
      attachmentMeta: {
        entityId: "",
        format: item?.type,
        name: item?.name,
        ogTags: {
          description: "",
          title: "",
          url: "",
          image: "",
        },
        size: item?.size,
        duration: 0,
        pageCount: 0,
        url: item?.uri,
      },
      attachmentType: DOCUMENT_ATTACHMENT_TYPE, // You need to specify the attachment type.
    };
  });
  return convertedDocumentMetaData;
}

/**
 * @param data: [LMOGTagsViewData]
 * @returns list of [LMAttachmentViewData]
 */
export function convertLinkMetaData(
  data: LMOGTagsViewData[]
): LMAttachmentViewData[] {
  const convertedLinkMetaData = data?.map((item) => {
    return {
      attachmentMeta: {
        entityId: "",
        format: "",
        name: "",
        ogTags: {
          description: item?.description,
          title: item?.title,
          url: item?.url,
          image: item?.image,
        },
        size: 0,
        duration: 0,
        pageCount: 0,
        url: "",
      },
      attachmentType: LINK_ATTACHMENT_TYPE, // You need to specify the attachment type.
    };
  });
  return convertedLinkMetaData;
}

/**
 * @param options: {text:string}[]
 * @returns string[]
 */
export function convertPollOptionsMetaData(
  options: { text: string }[]
): string[] {
  const convertedPollOptions = options.map((item) => item?.text);
  return convertedPollOptions;
}

/**
 * @param item: any
 * @returns LMAttachmentViewData
 */
export function convertPollMetaData(item: any): LMAttachmentViewData {
  return {
    attachmentMeta: {
      entityId: item?.id ? item?.id : "",
      format: "",
      name: "",
      ogTags: {
        description: "",
        title: "",
        url: "",
        image: "",
      },
      size: 0,
      duration: 0,
      pageCount: 0,
      url: "",
      title: item?.title,
      expiryTime: item?.expiryTime,
      options: item?.options
        ? convertPollOptionsMetaData(item?.options)
        : undefined,
      multipleSelectState: item?.multipleSelectState,
      pollType: item?.pollType,
      multipleSelectNumber: item?.multipleSelectNumber,
      isAnonymous: item?.isAnonymous,
      allowAddOption: item?.allowAddOption,
    },
    attachmentType: POLL_ATTACHMENT_TYPE, // You need to specify the attachment type.
  };
}

/**
 * @param postId: string
 * @param data: [Reply]
 * @param user: [Map] of String to User
 * @returns list of [LMCommentViewData]
 */
export function convertToLMCommentViewData(
  postId: string,
  data: Reply[],
  user: { [key: string]: LMUserViewData }
): any[] {
  return data?.map((item: Reply) => {
    return {
      id: item.id,
      postId: postId,
      repliesCount: item.commentsCount,
      level: item.level,
      createdAt: item.createdAt,
      isEdited: item.isEdited,
      isLiked: item.isLiked,
      likesCount: item.likesCount,
      menuItems: convertToLMMenuItemsViewData(item.menuItems),
      text: item.text,
      replies: item?.replies ? item.replies : [],
      updatedAt: item.updatedAt,
      userId: item.uuid,
      uuid: item.uuid,
      user: convertToLMUserViewData(user[item.uuid]),
    };
  });
}

/**
 * @param data: [GetNotification]
 * @returns list of [LMActivityViewData]
 */
export function convertNotificationsFeed(
  data: GetNotification
): LMActivityViewData[] {
  const notificationData = data.activities;
  const userData = data.users;
  return notificationData?.map((item) => {
    return convertToLMActivityViewData(item, userData);
  });
}

/**
 * @param post: [Activity]
 * @param user: [Map] of String to User
 * @returns LMActivityViewData
 */
export function convertToLMActivityViewData(
  activity: Activity,
  // users: { [key: string]: LMUserViewData }
  users: Record<string, User>
): LMActivityViewData {
  const notificationData: LMActivityViewData = {
    id: activity.id,
    isRead: activity.isRead,
    actionOn: activity.actionOn,
    actionBy: activity.actionBy,
    entityType: activity.entityType,
    entityId: activity.entityId,
    entityOwnerId: activity.entityOwnerId,
    action: activity.action,
    cta: activity.cta,
    activityText: activity.activityText,
    activityEntityData: convertToLMActivityEntityViewData(
      activity.activityEntityData
    ),
    activityByUser: convertToLMUserViewData(
      users[activity.actionBy[activity.actionBy.length - 1]]
    ),
    createdAt: activity.createdAt,
    updatedAt: activity.updatedAt,
    uuid: activity.uuid,
  };
  return notificationData;
}

/**
 * @param data
 * @returns LMActivityEntityViewData
 */
export function convertToLMActivityEntityViewData(
  data
): LMActivityEntityViewData {
  const activityEntityData: LMActivityEntityViewData = {
    id: data?.id,
    text: data?.text,
    deleteReason: data?.deleteReason,
    deletedBy: data?.deletedBy,
    heading: data?.heading,
    attachments: data?.attachments,
    communityId: data?.communityId,
    isEdited: data?.isEdited,
    isPinned: data?.isPinned,
    userId: data?.userId,
    user: data?.user,
    replies: data?.replies,
    level: data?.level,
    createdAt: data?.createdAt,
    updatedAt: data?.updatedAt,
    uuid: data?.uuid,
    deletedByUUID: data?.deletedByUUID,
    postId: data?.postId,
  };
  return activityEntityData;
}

export function convertToTemporaryPost(
  attachment: Attachment[],
  heading: string,
  text: string,
  topics: string[],
  isAnonymous: boolean = false,
  isHidden = false): TemporaryPost {
  return {
    id: `-${Date.now()}`,
    temporaryId: `-${Date.now()}`,
    attachments: attachment,
    commentsCount: 0,
    communityId: 0,
    createdAt: Date.now(),
    heading: heading,
    isEdited: false,
    isLiked: false,
    isPinned: false,
    isSaved: false,
    likesCount: 0,
    menuItems: [],
    text: text,
    topics: topics,
    updatedAt: 0,
    userId: "",
    uuid: "",
    replies: [],
    isAnonymous,
    isHidden,
  }
}