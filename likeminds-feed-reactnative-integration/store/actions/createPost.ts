import { Alert } from "react-native";
import {
  DECODE_URL_SUCCESS,
  DECODE_URL_DATA,
  DECODE_URL_FAILED,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILED,
  CREATE_POST,
  UPLOAD_ATTACHMENTS,
  EDIT_POST_SUCCESS,
  EDIT_POST,
  EDIT_POST_FAILED,
} from "../types/types";
import { CALL_API } from "../apiMiddleware";
import { Client } from "../../client";
import {
  AddPostRequest,
  DecodeURLRequest,
  EditPostRequest,
} from "@likeminds.community/feed-rn";

// get decoded url data api action
export const getDecodedUrl =
  (payload: DecodeURLRequest, showLoader: boolean) => () => {
    try {
      return {
        type: DECODE_URL_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.decodeURL(payload),
          body: payload,
          types: [DECODE_URL_DATA, DECODE_URL_SUCCESS, DECODE_URL_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// add post api action
export const addPost = (payload: AddPostRequest, showLoader: boolean) => () => {
  try {
    return {
      type: CREATE_POST_SUCCESS,
      [CALL_API]: {
        func: Client.myClient.addPost(payload),
        body: payload,
        types: [CREATE_POST, CREATE_POST_SUCCESS, CREATE_POST_FAILED],
        showLoader: showLoader,
      },
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// selected media to be uploaded action
export const setUploadAttachments = (payload: {}) => () => {
  try {
    return {
      type: UPLOAD_ATTACHMENTS,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// edit post api action
export const editPost =
  (payload: EditPostRequest, showLoader: boolean) => () => {
    try {
      return {
        type: EDIT_POST_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.editPost(payload),
          body: payload,
          types: [EDIT_POST, EDIT_POST_SUCCESS, EDIT_POST_FAILED],
          showLoader: true,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };
