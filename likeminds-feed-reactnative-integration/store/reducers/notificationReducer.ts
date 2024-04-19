import { LMActivityUI } from "../../models";
import { convertNotificationsFeed } from "../../viewDataModels";
import {
  MARK_READ_NOTIFICATION_SUCCESS,
  NOTIFICATION_FEED_CLEAR,
  NOTIFICATION_FEED_REFRESH_SUCCESS,
  NOTIFICATION_FEED_SUCCESS,
  READ_NOTIFICATION_STATE,
  UNREAD_NOTIFICATION_COUNT_SUCCESS,
} from "../types/types";

export interface NotificationReducerState {
  activities: LMActivityUI[];
  users: {};
  activitiesCount: 0;
}
export const initialState: NotificationReducerState = {
  activities: [],
  users: {},
  activitiesCount: 0,
};

export function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATION_FEED_SUCCESS: {
      const { users } = action.body;
      let notificationData = state.activities;
      let usersData = state.users;
      // model converter function
      const notifications = convertNotificationsFeed(action.body);
      // this handles pagination and appends new post data with previous data
      notificationData = notificationData
        ? [...notificationData, ...notifications]
        : [...notifications];
      // this appends the new users data with previous data
      usersData = { ...usersData, ...users };
      return { ...state, activities: notificationData, users: usersData };
    }
    case NOTIFICATION_FEED_CLEAR: {
      return { ...state, activities: [], users: {} };
    }
    case MARK_READ_NOTIFICATION_SUCCESS: {
      let notificationCount = state.activitiesCount;
      notificationCount = notificationCount - 1;
      return { ...state, activitiesCount: notificationCount };
    }
    case UNREAD_NOTIFICATION_COUNT_SUCCESS: {
      const { count } = action.body;
      return { ...state, activitiesCount: count };
    }
    case READ_NOTIFICATION_STATE: {
      let updatedActivities = state.activities;
      let activityReadIndex = updatedActivities.findIndex(
        (item) => item?.id === action.body
      );
      updatedActivities[activityReadIndex].isRead = true;
      return { ...state, activities: updatedActivities };
    }
    case NOTIFICATION_FEED_REFRESH_SUCCESS: {
      const { users = {} } = action.body;
      // model converter function
      const notifications = convertNotificationsFeed(action.body);
      return { ...state, activities: notifications, users: users };
    }
    default:
      return state;
  }
}
