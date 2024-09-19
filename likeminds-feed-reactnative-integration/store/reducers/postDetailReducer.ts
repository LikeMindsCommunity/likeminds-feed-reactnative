import {
  convertToLMCommentViewData,
  convertToLMPostViewData,
} from "../../viewDataModels";
import {
  PIN_POST_ID,
  PIN_THIS_POST,
  UNPIN_POST_ID,
  UNPIN_THIS_POST,
} from "../../constants/Strings";
import {
  CLEAR_COMMENT,
  CLEAR_POST,
  CREATE_COMMENT_STATE,
  CREATE_COMMENT_SUCCESS,
  CREATE_REPLY_STATE,
  CREATE_REPLY_SUCCESS,
  DELETE_COMMENT_STATE,
  EDIT_COMMENT_STATE,
  EDIT_POST_SUCCESS,
  LIKE_POST_STATE,
  PIN_POST_STATE,
  POST_COMMENTS_SUCCESS,
  POST_DATA_REFRESH_SUCCESS,
  POST_DATA_SUCCESS,
  SAVE_POST_STATE,
} from "../types/types";
import { LMCommentViewData, LMPostViewData } from "../../models";

export interface PostDetailReducerState {
  postDetail: LMPostViewData;
}
export const initialState: PostDetailReducerState = {
  postDetail: {
    id: "",
    commentsCount: 0,
    communityId: 0,
    createdAt: 0,
    isEdited: false,
    isLiked: false,
    isPinned: false,
    isSaved: false,
    likesCount: 0,
    menuItems: [],
    text: "",
    heading: "",
    updatedAt: 0,
    userId: "",
    uuid: "",
    user: {
      id: 0,
      name: "",
      imageUrl: "",
      userUniqueId: "",
      sdkClientInfo: {
        community: 0,
        user: 0,
        userUniqueId: "",
        uuid: "",
      },
      uuid: "",
      isGuest: false,
      updatedAt: 0,
      customTitle: "",
      organisationName: "",
    },
    users: {},
    topics: [],
    filteredComments: {},
  },
};
export const postDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_DATA_SUCCESS: {
      const {
        post = {},
        users = {},
        widgets = {},
        filteredComments = {},
      } = action.body;
      const updatedPostDetail = state.postDetail;
      const converterPostData = convertToLMPostViewData(
        post,
        users,
        widgets,
        filteredComments
      );
      let newReplies = converterPostData.replies || [];
      // filter out the replies already present in postDetail
      newReplies = newReplies.filter(
        (newReply) =>
          !updatedPostDetail?.replies || // Check if replies in postDetail exist
          !updatedPostDetail?.replies.some(
            (existingReply) => existingReply.id === newReply.id
          )
      );
      // combines all the replies (handling pagination)
      const allMergedReplies = [
        ...(updatedPostDetail?.replies || []),
        ...newReplies,
      ];

      return {
        ...state,
        postDetail: { ...converterPostData, replies: allMergedReplies },
      };
    }
    case POST_DATA_REFRESH_SUCCESS: {
      const {
        post = {},
        users = {},
        widgets = {},
        filteredComments = {},
      } = action.body;
      // model converter function
      const converterPostData = convertToLMPostViewData(
        post,
        users,
        widgets,
        filteredComments
      );
      return { ...state, postDetail: converterPostData };
    }
    case POST_COMMENTS_SUCCESS: {
      const { comment, users } = action.body;
      const updatedDetail = state.postDetail;
      updatedDetail?.replies &&
        updatedDetail.replies.find((item) => {
          if (item.id === comment?.id) {
            const commentData = convertToLMCommentViewData(
              comment?.postId,
              comment.replies,
              users
            );
            let newReplies = commentData || [];
            // Filter out replies that are already present in item.replies
            newReplies = newReplies.filter(
              (newReply) =>
                !item.replies || // Check if item.replies exist
                !item.replies.some(
                  (existingReply) => existingReply.id === newReply.id
                )
            );

            // Merge the unique newReplies with existing replies in item.replies
            const mergedReplies = [...(item.replies || []), ...newReplies];
            item.replies = mergedReplies;
          }
        });
      return { ...state, postDetail: updatedDetail };
    }
    case CLEAR_COMMENT: {
      const updatedDetail = state.postDetail;
      updatedDetail?.replies &&
        updatedDetail.replies.find((item) => {
          if (item.id === action.body) {
            item.replies = [];
          }
        });
      return { ...state, postDetail: updatedDetail };
    }
    case CLEAR_POST: {
      return { ...state, postDetail: {} as LMPostViewData };
    }
    case PIN_POST_STATE: {
      const updatedFeed = state.postDetail;
      if (updatedFeed?.id !== "" && updatedFeed?.id === action.body) {
        // this updates the isPinned value
        updatedFeed.isPinned = !updatedFeed.isPinned;

        // this gets the index of pin/unpin from menu item
        const menuItemIndex = updatedFeed?.menuItems?.findIndex(
          (item: any) => item.id === PIN_POST_ID || item.id === UNPIN_POST_ID
        );
        if (updatedFeed.isPinned) {
          //  this updates the menuItem title to unpin
          updatedFeed.menuItems[menuItemIndex].id = UNPIN_POST_ID;
          updatedFeed.menuItems[menuItemIndex].title = UNPIN_THIS_POST;
        } else {
          //  this updates the menuItem title to pin
          updatedFeed.menuItems[menuItemIndex].id = PIN_POST_ID;
          updatedFeed.menuItems[menuItemIndex].title = PIN_THIS_POST;
        }
      }
      return { ...state, postDetail: updatedFeed };
    }
    case CREATE_COMMENT_STATE: {
      const currentDate = new Date();
      const updatedPostDetail = state.postDetail;
      const { newComment, postId, tempId } = action.body.payload;
      const { loggedInUser } = action.body;
      // creating an local object of comment
      const localComment: LMCommentViewData = {
        id: "",
        postId: postId,
        repliesCount: 0,
        level: 0,
        createdAt: currentDate.getTime(),
        isEdited: false,
        isLiked: false,
        likesCount: 0,
        menuItems: [],
        text: newComment,
        replies: [],
        tempId: tempId,
        updatedAt: currentDate.getTime(),
        userId: "",
        uuid: "",
        user: loggedInUser,
      };
      // appending that object in the list and update the count
      updatedPostDetail.replies?.splice(0, 0, localComment);
      updatedPostDetail.commentsCount = updatedPostDetail.commentsCount + 1;

      return { ...state, postDetail: updatedPostDetail };
    }
    case CREATE_COMMENT_SUCCESS: {
      const { comment, users } = action.body;
      const updatedPostDetail = state.postDetail;
      // finds the reply with same tempId
      updatedPostDetail.replies?.find((item) => {
        if (item.tempId === comment.tempId) {
          // converts the response to LMCommentViewData model
          const commentData = convertToLMCommentViewData(
            comment.postId,
            [comment],
            users
          );
          // replacing the local object with response of the api
          item.createdAt = commentData[0].createdAt;
          item.id = commentData[0].id;
          item.menuItems = commentData[0].menuItems;
          item.isEdited = commentData[0].isEdited;
          item.isLiked = commentData[0].isLiked;
          item.level = commentData[0].level;
          item.likesCount = commentData[0].likesCount;
          item.postId = commentData[0].postId;
          item.replies = commentData[0].replies;
          item.repliesCount = commentData[0].repliesCount;
          item.text = commentData[0].text;
          item.user = commentData[0].user;
          item.userId = commentData[0].userId;
          item.uuid = commentData[0].uuid;
        }
      });
      return { ...state, postDetail: updatedPostDetail };
    }
    case CREATE_REPLY_STATE: {
      const currentDate = new Date();
      const updatedPostDetail = state.postDetail;
      const { newComment, postId, tempId, commentId } = action.body.payload;
      const { loggedInUser } = action.body;
      // creating an local object of reply
      const localReply: LMCommentViewData = {
        id: "",
        postId: postId,
        repliesCount: 0,
        level: 1,
        createdAt: currentDate.getTime(),
        isEdited: false,
        isLiked: false,
        likesCount: 0,
        menuItems: [],
        text: newComment,
        replies: [],
        tempId: tempId,
        updatedAt: currentDate.getTime(),
        userId: "",
        uuid: "",
        user: loggedInUser,
      };
      // finding the parentComment of the reply added
      const parentComment = updatedPostDetail.replies?.find(
        (item) => item.id === commentId
      );
      // append the reply locaaly in the comment's replies list and handle the count
      parentComment?.replies && parentComment.replies.splice(0, 0, localReply);
      if (parentComment) {
        parentComment.repliesCount = parentComment?.repliesCount + 1;
      }
      return { ...state, postDetail: updatedPostDetail };
    }
    case CREATE_REPLY_SUCCESS: {
      const { comment, users } = action.body;
      const updatedPostDetail = state.postDetail;
      // finds the parent comment
      updatedPostDetail.replies?.find((item) => {
        if (item.id === comment?.parentComment?.id) {
          // converts the response to LMCommentViewData model
          const commentData = convertToLMCommentViewData(
            comment.postId,
            [comment],
            users
          );
          // replacing the local object with response of the api
          item?.replies &&
            item.replies.find((replyItem) => {
              if (replyItem.tempId === comment.tempId) {
                replyItem.createdAt = commentData[0].createdAt;
                replyItem.id = commentData[0].id;
                replyItem.menuItems = commentData[0].menuItems;
                replyItem.isEdited = commentData[0].isEdited;
                replyItem.isLiked = commentData[0].isLiked;
                replyItem.level = commentData[0].level;
                replyItem.likesCount = commentData[0].likesCount;
                replyItem.postId = commentData[0].postId;
                replyItem.replies = commentData[0].replies;
                replyItem.repliesCount = commentData[0].repliesCount;
                replyItem.text = commentData[0].text;
                replyItem.user = commentData[0].user;
                replyItem.userId = commentData[0].userId;
                replyItem.uuid = commentData[0].uuid;
              }
            });
        }
      });
      return { ...state, postDetail: updatedPostDetail };
    }
    case EDIT_COMMENT_STATE: {
      const updatedPostDetail: any = state.postDetail;
      const { commentId, commentText, replyObject } = action.body;
      let parentCommentId = replyObject?.comment?.id;
      if (updatedPostDetail?.replies?.length > 0) {
        updatedPostDetail?.replies?.forEach((item) => {
          if (item?.id == parentCommentId) {
            item.replies = replyObject?.comment?.replies;
          }
        });
      }
      const editCommentIndex =
        updatedPostDetail?.replies &&
        updatedPostDetail.replies.findIndex(
          (item: LMCommentViewData) => item?.id === commentId
        );
      // removes that comment from the data
      if (
        updatedPostDetail?.replies &&
        editCommentIndex !== undefined &&
        editCommentIndex !== -1
      ) {
        updatedPostDetail.replies[editCommentIndex].text = commentText;
        updatedPostDetail.replies[editCommentIndex].isEdited = true;
        return { ...state, postDetail: updatedPostDetail };
      } else {
        if (updatedPostDetail?.replies) {
          for (let i = 0; i <= updatedPostDetail?.replies?.length - 1; i++) {
            const editCommentIndexChild = updatedPostDetail.replies[
              i
            ]?.replies.findIndex(
              (item: LMCommentViewData) => item?.id === commentId
            );
            // removes that child comment from the data
            if (
              updatedPostDetail?.replies[i]?.replies &&
              editCommentIndexChild !== undefined &&
              editCommentIndexChild !== -1
            ) {
              updatedPostDetail.replies[i].replies[editCommentIndexChild].text =
                commentText;
              updatedPostDetail.replies[i].replies[
                editCommentIndexChild
              ].isEdited = true;
            }
          }
        }
      }
      return { ...state };
    }
    case DELETE_COMMENT_STATE: {
      const updatedPostDetail: any = state.postDetail;
      // this gets the index of the comment that is deleted
      const { replyObject } = action.body;
      let parentCommentId = replyObject?.comment?.id;
      if (updatedPostDetail?.replies?.length > 0) {
        updatedPostDetail?.replies?.forEach((item) => {
          if (item?.id == parentCommentId) {
            item.replies = replyObject?.comment?.replies;
          }
        });
      }
      const deletedCommentIndex =
        updatedPostDetail?.replies &&
        updatedPostDetail.replies.findIndex(
          (item: any) => item?.id === action.body.commentId
        );
      // removes that comment from the data
      if (
        updatedPostDetail?.replies &&
        deletedCommentIndex !== undefined &&
        deletedCommentIndex !== -1
      ) {
        updatedPostDetail?.replies.splice(deletedCommentIndex, 1);
        updatedPostDetail.commentsCount = updatedPostDetail.commentsCount - 1;
        return { ...state, postDetail: updatedPostDetail };
      } else {
        if (updatedPostDetail?.replies) {
          for (let i = 0; i <= updatedPostDetail?.replies?.length - 1; i++) {
            const deletedCommentIndexChild = updatedPostDetail.replies[
              i
            ].replies.findIndex(
              (item: any) => item?.id === action.body.commentId
            );
            // removes that child comment from the data
            if (
              updatedPostDetail?.replies[i].replies &&
              deletedCommentIndexChild !== undefined &&
              deletedCommentIndexChild !== -1
            ) {
              updatedPostDetail.replies[i].replies.splice(
                deletedCommentIndexChild,
                1
              );
              updatedPostDetail.replies[i] = {
                ...updatedPostDetail.replies[i],
                replies: updatedPostDetail.replies[i].replies,
                repliesCount: updatedPostDetail.replies[i].repliesCount - 1,
              } as LMCommentViewData;
            }
          }
        }
      }
      return { ...state, postDetail: { ...updatedPostDetail } };
    }
    case EDIT_POST_SUCCESS: {
      const {
        post = {},
        users = {},
        widgets = {},
        filteredComments = {},
      } = action.body;
      const converterPostData = convertToLMPostViewData(
        post,
        users,
        widgets,
        filteredComments
      );
      return { ...state, postDetail: converterPostData };
    }
    case LIKE_POST_STATE: {
      const updatedDetail = state.postDetail;
      // this updates the isLiked value
      updatedDetail.isLiked = !updatedDetail.isLiked;
      if (updatedDetail.isLiked) {
        // increase the like count
        updatedDetail.likesCount = updatedDetail.likesCount + 1;
      } else {
        // decrease the like count
        updatedDetail.likesCount = updatedDetail.likesCount - 1;
      }
      return { ...state, postDetail: updatedDetail };
    }
    case SAVE_POST_STATE: {
      const updatedDetail = state.postDetail;
      // this updates the isSaved value
      updatedDetail.isSaved = !updatedDetail.isSaved;
      return { ...state, postDetail: updatedDetail };
    }
    default:
      return state;
  }
};
