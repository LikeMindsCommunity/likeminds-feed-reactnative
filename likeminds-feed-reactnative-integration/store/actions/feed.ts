import { Alert } from "react-native";
import { CALL_API } from "../apiMiddleware";
import {
  UNIVERSAL_FEED_DATA,
  UNIVERSAL_FEED_FAILED,
  UNIVERSAL_FEED_SUCCESS,
  REPORT_TAGS_SUCCESS,
  REPORT_TAGS_FAILED,
  REPORT_TAGS_DATA,
  POST_REPORT_SUCCESS,
  POST_REPORT_FAILED,
  POST_REPORT,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAILED,
  POST_DELETE,
  LIKE_POST_SUCCESS,
  LIKE_POST,
  LIKE_POST_FAILED,
  LIKE_POST_STATE,
  SAVE_POST_SUCCESS,
  SAVE_POST,
  SAVE_POST_FAILED,
  SAVE_POST_STATE,
  PIN_POST_SUCCESS,
  PIN_POST,
  PIN_POST_FAILED,
  PIN_POST_STATE,
  DELETE_POST_STATE,
  AUTO_PLAY_POST_VIDEO,
  CLEAR_FEED,
  UNIVERSAL_FEED_REFRESH_SUCCESS,
} from "../types/types";
import { Client } from "../../client";
import {
  DeletePostRequest,
  GetFeedRequest,
  GetReportTagsRequest,
  LikePostRequest,
  PinPostRequest,
  PostReportRequest,
  SavePostRequest,
} from "@likeminds.community/feed-rn-beta";

// get universal feed API action
export const getFeed = (payload: GetFeedRequest, showLoader: boolean) => () => {
  try {
    return {
      type: UNIVERSAL_FEED_SUCCESS,
      [CALL_API]: {
        func: Client.myClient.getFeed(payload),
        body: payload,
        types: [
          UNIVERSAL_FEED_DATA,
          UNIVERSAL_FEED_SUCCESS,
          UNIVERSAL_FEED_FAILED,
        ],
        showLoader: showLoader,
      },
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// refresh feed API action
export const refreshFeed =
  (payload: GetFeedRequest, showLoader: boolean) => () => {
    try {
      return {
        type: UNIVERSAL_FEED_REFRESH_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.getFeed(payload),
          body: payload,
          types: [
            UNIVERSAL_FEED_DATA,
            UNIVERSAL_FEED_REFRESH_SUCCESS,
            UNIVERSAL_FEED_FAILED,
          ],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// clear feed data action
export const clearFeed = () => () => {
  try {
    return {
      type: CLEAR_FEED,
      body: [],
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// like post API action
export const likePost =
  (payload: LikePostRequest, showLoader: boolean) => () => {
    try {
      return {
        type: LIKE_POST_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.likePost(payload),
          body: payload,
          types: [LIKE_POST, LIKE_POST_SUCCESS, LIKE_POST_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// like post state managing action
export const likePostStateHandler = (payload: string) => () => {
  try {
    return {
      type: LIKE_POST_STATE,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// save post API action
export const savePost =
  (payload: SavePostRequest, showLoader: boolean) => () => {
    try {
      return {
        type: SAVE_POST_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.savePost(payload),
          body: payload,
          types: [SAVE_POST, SAVE_POST_SUCCESS, SAVE_POST_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// save post state managing action
export const savePostStateHandler = (payload: string) => () => {
  try {
    return {
      type: SAVE_POST_STATE,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// get report tags API action
export const getReportTags =
  (payload: GetReportTagsRequest, showLoader: boolean) => () => {
    try {
      return {
        type: REPORT_TAGS_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.getReportTags(payload),
          body: payload,
          types: [REPORT_TAGS_DATA, REPORT_TAGS_SUCCESS, REPORT_TAGS_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// report post API action
export const postReport =
  (payload: PostReportRequest, showLoader: boolean) => () => {
    try {
      return {
        type: POST_REPORT_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.postReport(payload),
          body: payload,
          types: [POST_REPORT, POST_REPORT_SUCCESS, POST_REPORT_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// delete post API action
export const deletePost =
  (payload: DeletePostRequest, showLoader: boolean) => () => {
    try {
      return {
        type: POST_DELETE_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.deletePost(payload),
          body: payload,
          types: [POST_DELETE, POST_DELETE_SUCCESS, POST_DELETE_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// delete post state managing action
export const deletePostStateHandler = (payload: string) => () => {
  try {
    return {
      type: DELETE_POST_STATE,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// pin post API action
export const pinPost = (payload: PinPostRequest, showLoader: boolean) => () => {
  try {
    return {
      type: PIN_POST_SUCCESS,
      [CALL_API]: {
        func: Client.myClient.pinPost(payload),
        body: payload,
        types: [PIN_POST, PIN_POST_SUCCESS, PIN_POST_FAILED],
        showLoader: showLoader,
      },
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// pin post state managing action
export const pinPostStateHandler = (payload: string) => () => {
  try {
    return {
      type: PIN_POST_STATE,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// video auto play/pause handler action
export const autoPlayPostVideo = (payload) => () => {
  try {
    return {
      type: AUTO_PLAY_POST_VIDEO,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};
