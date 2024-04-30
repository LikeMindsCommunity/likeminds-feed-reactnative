import { Alert } from "react-native";
import { CALL_API } from "../apiMiddleware";
import {
  NOTIFICATION_FEED_SUCCESS,
  NOTIFICATION_FEED_DATA,
  NOTIFICATION_FEED_FAILED,
  NOTIFICATION_FEED_CLEAR,
  MARK_READ_NOTIFICATION_SUCCESS,
  MARK_READ_NOTIFICATION,
  MARK_READ_NOTIFICATION_FAILED,
  UNREAD_NOTIFICATION_COUNT_SUCCESS,
  UNREAD_NOTIFICATION_COUNT_DATA,
  UNREAD_NOTIFICATION_COUNT_FAILED,
  READ_NOTIFICATION_STATE,
  NOTIFICATION_FEED_REFRESH_SUCCESS,
} from "../types/types";
import { Client } from "../../client";
import {
  GetNotificationFeedRequest,
  MarkReadNotificationRequest,
} from "@likeminds.community/feed-js";

// get notification feed api
export const getNotificationFeed =
  (payload: GetNotificationFeedRequest, showLoader: boolean) => () => {
    try {
      return {
        type: NOTIFICATION_FEED_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.getNotificationFeed(payload),
          body: payload,
          types: [
            NOTIFICATION_FEED_DATA,
            NOTIFICATION_FEED_SUCCESS,
            NOTIFICATION_FEED_FAILED,
          ],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// clear notification data action
export const notificationFeedClear = () => () => {
  try {
    return {
      type: NOTIFICATION_FEED_CLEAR,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// mark notification read api
export const markReadNotification =
  (payload: MarkReadNotificationRequest, showLoader: boolean) => () => {
    try {
      return {
        type: MARK_READ_NOTIFICATION_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.markReadNotification(payload),
          body: payload,
          types: [
            MARK_READ_NOTIFICATION,
            MARK_READ_NOTIFICATION_SUCCESS,
            MARK_READ_NOTIFICATION_FAILED,
          ],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// mark read notification action
export const notificationReadHandler = (payload: string) => () => {
  try {
    return {
      type: READ_NOTIFICATION_STATE,
      body: payload,
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// get unread notification count api
export const getUnreadNotificationCount = () => () => {
  try {
    return {
      type: UNREAD_NOTIFICATION_COUNT_SUCCESS,
      [CALL_API]: {
        func: Client.myClient.getUnreadNotificationCount(),
        body: null,
        types: [
          UNREAD_NOTIFICATION_COUNT_DATA,
          UNREAD_NOTIFICATION_COUNT_SUCCESS,
          UNREAD_NOTIFICATION_COUNT_FAILED,
        ],
        showLoader: false,
      },
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

// refresh notification feed api
export const refreshNotificationFeed =
  (payload: GetNotificationFeedRequest, showLoader: boolean) => () => {
    try {
      return {
        type: NOTIFICATION_FEED_REFRESH_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.getNotificationFeed(payload),
          body: payload,
          types: [
            NOTIFICATION_FEED_DATA,
            NOTIFICATION_FEED_REFRESH_SUCCESS,
            NOTIFICATION_FEED_FAILED,
          ],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };
