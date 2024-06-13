import { Alert } from "react-native";
import {
  POST_DATA,
  POST_DATA_SUCCESS,
  POST_DATA_FAILED,
  POST_COMMENTS_SUCCESS,
  POST_COMMENTS_FAILED,
  POST_COMMENTS,
  LIKE_COMMENT,
  LIKE_COMMENT_SUCCESS,
  LIKE_COMMENT_FAILED,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT,
  CREATE_COMMENT_FAILED,
  COMMENT_DELETE_SUCCESS,
  COMMENT_DELETE_FAILED,
  COMMENT_DELETE,
  DELETE_COMMENT_STATE,
  CLEAR_COMMENT,
  CLEAR_POST,
  CREATE_COMMENT_STATE,
  CREATE_REPLY_SUCCESS,
  CREATE_REPLY,
  CREATE_REPLY_FAILED,
  CREATE_REPLY_STATE,
  EDIT_COMMENT_SUCCESS,
  EDIT_COMMENT_FAILED,
  EDIT_COMMENT,
  EDIT_COMMENT_STATE,
  TAGGING_LIST_SUCCESS,
  TAGGING_LIST_DATA,
  TAGGING_LIST_FAILED,
  POST_DATA_REFRESH_SUCCESS,
  POST_DATA_REFRESH,
  POST_DATA_REFRESH_FAILED,
} from "../types/types";
import { CALL_API } from "../apiMiddleware";
import { Client } from "../../client";
import {
  AddCommentRequest,
  DeleteCommentRequest,
  EditCommentRequest,
  GetCommentRequest,
  GetPostRequest,
  GetTaggingListRequest,
  LikeCommentRequest,
  ReplyCommentRequest,
} from "@likeminds.community/feed-rn-beta";

interface EditCommentState {
  commentId: string;
  commentText: string;
}
interface DeleteCommentState {
  deleteReason: string;
  commentId: string;
  postId: string;
}
interface ReplyCommentState {
  payload: {
    postId: string;
    newComment: string;
    tempId: string;
    commentId: string;
  };
  loggedInUser: {};
}
interface AddCommentState {
  payload: {
    postId: string;
    newComment: string;
    tempId: string;
  };
  loggedInUser: {};
}
// get post api action
export const getPost = (payload: GetPostRequest, showLoader: boolean) => () => {
  try {
    return {
      type: POST_DATA_SUCCESS,
      [CALL_API]: {
        func: Client.myClient.getPost(payload),
        body: payload,
        types: [POST_DATA, POST_DATA_SUCCESS, POST_DATA_FAILED],
        showLoader: showLoader,
      },
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// get comments api action
export const getComments =
  (payload: GetCommentRequest, showLoader: boolean) => () => {
    try {
      return {
        type: POST_COMMENTS_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.getComments(
            payload.postId,
            payload,
            payload.commentId,
            payload.page
          ),
          body: payload,
          types: [POST_COMMENTS, POST_COMMENTS_SUCCESS, POST_COMMENTS_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };
// clear comments data action
export const clearComments = (payload?: string) => () => {
  try {
    return {
      type: CLEAR_COMMENT,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// clear post detail data action
export const clearPostDetail = () => () => {
  try {
    return {
      type: CLEAR_POST,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// like comment api action
export const likeComment =
  (payload: LikeCommentRequest, showLoader: boolean) => () => {
    try {
      return {
        type: LIKE_COMMENT_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.likeComment(payload),
          body: payload,
          types: [LIKE_COMMENT, LIKE_COMMENT_SUCCESS, LIKE_COMMENT_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// add comment api action
export const addComment =
  (payload: AddCommentRequest, showLoader: boolean) => () => {
    try {
      return {
        type: CREATE_COMMENT_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.addComment(payload),
          body: payload,
          types: [
            CREATE_COMMENT,
            CREATE_COMMENT_SUCCESS,
            CREATE_COMMENT_FAILED,
          ],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// add comment state handler action
export const addCommentStateHandler = (payload: AddCommentState) => () => {
  try {
    return {
      type: CREATE_COMMENT_STATE,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// add reply api action
export const replyComment =
  (payload: ReplyCommentRequest, showLoader: boolean) => () => {
    try {
      return {
        type: CREATE_REPLY_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.replyComment(payload),
          body: payload,
          types: [CREATE_REPLY, CREATE_REPLY_SUCCESS, CREATE_REPLY_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// add reply state handler action
export const replyCommentStateHandler = (payload: ReplyCommentState) => () => {
  try {
    return {
      type: CREATE_REPLY_STATE,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// delete comment api action
export const deleteComment =
  (payload: DeleteCommentRequest, showLoader: boolean) => () => {
    try {
      return {
        type: COMMENT_DELETE_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.deleteComment(payload),
          body: payload,
          types: [
            COMMENT_DELETE,
            COMMENT_DELETE_SUCCESS,
            COMMENT_DELETE_FAILED,
          ],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// delete post state handler action
export const deleteCommentStateHandler =
  (payload: DeleteCommentState) => () => {
    try {
      return {
        type: DELETE_COMMENT_STATE,
        body: payload,
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// edit comment api action
export const editComment =
  (payload: EditCommentRequest, showLoader: boolean) => () => {
    try {
      return {
        type: EDIT_COMMENT_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.editComment(payload),
          body: payload,
          types: [EDIT_COMMENT, EDIT_COMMENT_SUCCESS, EDIT_COMMENT_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// delete post state handler action
export const editCommentStateHandler = (payload: EditCommentState) => () => {
  try {
    return {
      type: EDIT_COMMENT_STATE,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// edit comment api action
export const getTaggingList =
  (payload: GetTaggingListRequest, showLoader: boolean) => () => {
    try {
      return {
        type: TAGGING_LIST_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.getTaggingList(payload),
          body: payload,
          types: [TAGGING_LIST_DATA, TAGGING_LIST_SUCCESS, TAGGING_LIST_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// refresh feed API action
export const refreshPostDetail =
  (payload: GetPostRequest, showLoader: boolean) => () => {
    try {
      return {
        type: POST_DATA_REFRESH_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.getPost(payload),
          body: payload,
          types: [
            POST_DATA_REFRESH,
            POST_DATA_REFRESH_SUCCESS,
            POST_DATA_REFRESH_FAILED,
          ],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };
