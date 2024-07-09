import {
  Attachment,
  AttachmentMeta,
  GetFeedResponse,
  IActivities,
  IActivity,
  IMenuItem,
  IOgTag,
  IPost,
  IUser,
  Like,
  GetPostLikesResponse,
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
import { IComment } from "@likeminds.community/feed-rn";
import {
  LMActivityEntityUI,
  LMActivityUI,
  LMAttachmentMetaUI,
  LMAttachmentUI,
  LMLikeUI,
  LMMenuItemsUI,
  LMOGTagsUI,
  LMPostUI,
  LMSDKClientInfoUI,
  LMUserUI,
} from "../models";

/**
 * @param data: [GetFeedResponse]
 * @returns list of [LMPostUI]
 */
export function convertUniversalFeedPosts(data: any): LMPostUI[] {
  const postData = data.posts;
  const userData = data.users;
  const widgetData = data.widgets;
  return postData?.map((item: IPost) => {
    return convertToLMPostUI(item, userData, widgetData);
  });
}

/**
 * @param post: [IPost]
 * @param user: [Map] of String to User
 * @returns LMPostUI
 */
export function convertToLMPostUI(
  post: IPost,
  user: { [key: string]: LMUserUI },
  widgets: any
): LMPostUI {
  const postData: LMPostUI = {
    id: post.Id,
    attachments: post.attachments
      ? convertToLMAttachmentsUI(post.attachments, widgets)
      : [],
    commentsCount: post.commentsCount,
    communityId: post.communityId,
    createdAt: post.createdAt,
    isEdited: post.isEdited,
    isLiked: post.isLiked,
    isPinned: post.isPinned,
    isSaved: post.isSaved,
    likesCount: post.likesCount,
    menuItems: convertToLMMenuItemsUI(post.menuItems),
    replies: post?.replies
      ? convertToLMCommentUI(post.Id, post.replies, user)
      : [],
    text: post.text,
    updatedAt: post.updatedAt,
    userId: user?.id?.toString(),
    uuid: post.uuid,
    user: convertToLMUserUI(user[post.uuid]),
    topics: post.topics,
    users: user,
  };
  return postData;
}

/**
 * @param data: [Attachment]
 * @returns list of [LMAttachmentUI]
 */
export function convertToLMAttachmentsUI(
  data: Attachment[],
  widgets: any
): LMAttachmentUI[] {
  return data?.map((item: Attachment) => {
    return {
      attachmentMeta: convertToLMAttachmentMetaUI(item.attachmentMeta, widgets),
      attachmentType: item.attachmentType,
    };
  });
}

/**
 * @param data: AttachmentMeta
 * @returns LMAttachmentMetaUI
 */
export function convertToLMAttachmentMetaUI(
  data: AttachmentMeta,
  widgets
): LMAttachmentMetaUI {
  const attachmentMetaData: LMAttachmentMetaUI = {
    duration: data.duration,
    format: data.format,
    name: data.name,
    ogTags: convertToLMOgTagsUI(data.ogTags),
    pageCount: data.pageCount,
    size: data.size,
    url: data.url,
    thumbnailUrl: data.thumbnailUrl,
    ...convertToLMPollUI(data?.entityId, widgets),
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
 * @param widgets: any
 * @returns any
 */
export function convertToLMPollUI(id: string, widgets: any) {
  const item = widgets[id];
  const pollMetaData: any = {
    id: id,
    title: item?.metadata?.title,
    options: item?.LmMeta?.options,
    allowAddOption: item?.metadata?.allowAddOption,
    expiryTime: item?.metadata?.expiryTime,
    expiryDays: calculateDaysToExpiry(item),
    toShowResults: item?.LmMeta?.toShowResults,
    createdAt: item?.createdAt,
    pollAnswerText: item?.LmMeta?.pollAnswerText,
    multipleSelectNumber: item?.metadata?.multipleSelectNumber,
    multipleSelectState: item?.metadata?.multipleSelectState,
    isAnonymous: item?.metadata?.isAnonymous,
    pollType: item?.metadata?.pollType,
  };
  return pollMetaData;
}

/**
 * @param data: IOgTag
 * @returns LMOGTagsUI
 */
export function convertToLMOgTagsUI(data: IOgTag): LMOGTagsUI {
  const ogTagsData: LMOGTagsUI = {
    title: data.title,
    description: data.description,
    url: data.url,
    image: data.image,
  };
  return ogTagsData;
}

/**
 * @param data: [IMenuItem]
 * @returns [LMMenuItemsUI]
 */
export function convertToLMMenuItemsUI(data: IMenuItem[]): LMMenuItemsUI[] {
  return data?.map((item) => {
    return {
      title: item.title,
      id: item.id,
    };
  });
}

/**
 * @param data: IUser
 * @returns LMUserUI
 */
export function convertToLMUserUI(data: IUser): LMUserUI {
  const userData: LMUserUI = {
    customTitle: data?.customTitle,
    id: data?.id,
    imageUrl: data?.imageUrl,
    isGuest: data?.isGuest,
    name: data?.name,
    organisationName: data?.organisationName,
    sdkClientInfo: convertToLMSDKClientInfoUI(data),
    updatedAt: data?.updatedAt,
    userUniqueId: data?.userUniqueId,
    uuid: data?.uuid,
  };
  return userData;
}

/**
 * @param data: IUser
 * @returns LMSDKClientInfoUI
 */
export function convertToLMSDKClientInfoUI(data: IUser): LMSDKClientInfoUI {
  const sdkClientInfo = data?.sdkClientInfo;
  const sdkClientInfoConverter: LMSDKClientInfoUI = {
    community: sdkClientInfo?.community,
    user: sdkClientInfo?.user,
    uuid: sdkClientInfo?.uuid,
    userUniqueId: sdkClientInfo?.userUniqueId,
  };
  return sdkClientInfoConverter;
}

/**
 * @param data: [GetPostLikesResponse]
 * @returns list of [LMLikeUI]
 */
export function convertToLMLikesList(data: GetPostLikesResponse): LMLikeUI[] {
  const likesListData = data?.likes;
  const userData = data?.users;
  return likesListData?.map((item: Like) => {
    return convertToLMLikeUI(item, userData);
  });
}

/**
 * @param likes: [Like]
 * @param users: [Map] of String to User
 * @returns LMLikeUI
 */
export function convertToLMLikeUI(
  likes: Like,
  users: { [key: string]: LMUserUI }
): LMLikeUI {
  const likesData: LMLikeUI = {
    id: likes?.id,
    createdAt: likes?.createdAt,
    updatedAt: likes?.updatedAt,
    userId: likes?.uuid,
    uuid: likes?.uuid,
    user: convertToLMUserUI(users[likes?.uuid]),
  };
  return likesData;
}

/**
 * @param data: [ImageVideoMetaData]
 * @returns list of [LMAttachmentUI]
 */
export function convertImageVideoMetaData(
  data: ImageVideoMetaData[]
): LMAttachmentUI[] {
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
 * @returns list of [LMAttachmentUI]
 */
export function convertDocumentMetaData(
  data: DocumentMetaData[]
): LMAttachmentUI[] {
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
 * @param data: [LMOGTagsUI]
 * @returns list of [LMAttachmentUI]
 */
export function convertLinkMetaData(data: LMOGTagsUI[]): LMAttachmentUI[] {
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
 * @returns LMAttachmentUI
 */
export function convertPollMetaData(item: any): LMAttachmentUI {
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
      options: convertPollOptionsMetaData(item?.options),
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
 * @param data: [IComment]
 * @param user: [Map] of String to User
 * @returns list of [LMCommentUI]
 */
export function convertToLMCommentUI(
  postId: string,
  data: IComment[],
  user: { [key: string]: LMUserUI }
): any[] {
  return data?.map((item: IComment) => {
    return {
      id: item.Id,
      postId: postId,
      repliesCount: item.commentsCount,
      level: item.level,
      createdAt: item.createdAt,
      isEdited: item.isEdited,
      isLiked: item.isLiked,
      likesCount: item.likesCount,
      menuItems: convertToLMMenuItemsUI(item.menuItems),
      text: item.text,
      replies: item?.replies ? item.replies : [],
      updatedAt: item.updatedAt,
      userId: item.uuid,
      uuid: item.uuid,
      user: convertToLMUserUI(user[item.uuid]),
    };
  });
}

/**
 * @param data: [IActivities]
 * @returns list of [LMActivityUI]
 */
export function convertNotificationsFeed(data: IActivities): LMActivityUI[] {
  const notificationData = data.activities;
  const userData = data.users;
  return notificationData?.map((item) => {
    return convertToLMActivityUI(item, userData);
  });
}

/**
 * @param post: [IActivity]
 * @param user: [Map] of String to User
 * @returns LMActivityUI
 */
export function convertToLMActivityUI(
  activity: IActivity,
  users: { [key: string]: LMUserUI }
): LMActivityUI {
  const notificationData: LMActivityUI = {
    id: activity.Id,
    isRead: activity.isRead,
    actionOn: activity.actionOn,
    actionBy: activity.actionBy,
    entityType: activity.entityType,
    entityId: activity.entityId,
    entityOwnerId: activity.entityOwnerId,
    action: activity.action,
    cta: activity.cta,
    activityText: activity.activityText,
    activityEntityData: convertToLMActivityEntityUI(
      activity.activityEntityData
    ),
    activityByUser: convertToLMUserUI(
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
 * @returns LMActivityEntityUI
 */
export function convertToLMActivityEntityUI(data): LMActivityEntityUI {
  const activityEntityData: LMActivityEntityUI = {
    id: data?.Id,
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
