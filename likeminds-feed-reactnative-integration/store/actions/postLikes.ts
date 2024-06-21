import { Alert } from "react-native";
import {
  POST_LIKES_DATA,
  POST_LIKES_SUCCESS,
  POST_LIKES_FAILED,
  POST_LIKES_CLEAR,
  COMMENT_LIKES_SUCCESS,
  COMMENT_LIKES_DATA,
  COMMENT_LIKES_FAILED,
} from "../types/types";
import { CALL_API } from "../apiMiddleware";
import { Client } from "../../client";
import {
  GetPostLikesRequest,
  GetCommentLikesRequest,
} from "@likeminds.community/feed-rn-beta";

// get post likes api action
export const postLikes =
  (payload: GetPostLikesRequest, showLoader: boolean) => () => {
    try {
      return {
        type: POST_LIKES_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.getPostLikes(payload),
          body: payload,
          types: [POST_LIKES_DATA, POST_LIKES_SUCCESS, POST_LIKES_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// clear post likes data action
export const postLikesClear = () => () => {
  try {
    return {
      type: POST_LIKES_CLEAR,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// get comment likes api action
export const commentLikes =
  (payload: GetCommentLikesRequest, showLoader: boolean) => () => {
    try {
      return {
        type: COMMENT_LIKES_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.getCommentLikes(payload),
          body: payload,
          types: [
            COMMENT_LIKES_DATA,
            COMMENT_LIKES_SUCCESS,
            COMMENT_LIKES_FAILED,
          ],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };
