import {
  convertSingleFeedPost,
  convertToLMPostViewData,
  convertUniversalFeedPosts,
} from "../../viewDataModels";
import {
  PIN_POST_ID,
  PIN_THIS_POST,
  UNPIN_POST_ID,
  UNPIN_THIS_POST,
} from "../../constants/Strings";
import {
  UNIVERSAL_FEED_SUCCESS,
  REPORT_TAGS_SUCCESS,
  PIN_POST_STATE,
  DELETE_POST_STATE,
  UNIVERSAL_FEED_REFRESH_SUCCESS,
  LIKE_POST_STATE,
  SAVE_POST_STATE,
  EDIT_POST_SUCCESS,
  CREATE_COMMENT_SUCCESS,
  DELETE_COMMENT_STATE,
  AUTO_PLAY_POST_VIDEO,
  SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
  SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
  CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
  POST_DATA_SUCCESS,
  SET_TOPICS,
  SELECTED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
  CLEAR_SELECTED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
  STATUS_BAR_STYLE,
  SET_MUTED_STATE,
  SET_PAUSED_STATUS,
  SET_CURRENT_ID_OF_VIDEO,
  SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
  SET_FLOW_TO_CREATE_POST_SCREEN,
  SET_FLOW_TO_CAROUSEL_SCREEN,
  MAPPED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
  SET_NOTIFICATION_COUNT,
  SET_FLOW_TO_POST_DETAIL_SCREEN,
  HIDE_POST_STATE,
  CLEAR_SELECTED_TOPICS,
  CLEAR_FEED,
  UNIVERSAL_TOPICS_FEED_SUCCESS,
  REFRESH_FROM_ONBOARDING_SCREEN,
  PERSONALISED_FEED_SUCCESS,
  PERSONALISED_FEED_REFRESH_SUCCESS,
  CREATE_POST_SUCCESS,
} from "../types/types";
import { LMPostViewData } from "../../models";
import Styles from "../../constants/Styles";

export interface FeedReducerState {
  feed: LMPostViewData[];
  users: {};
  reportTags: {};
  autoPlayVideoPostId: "";
  topics: {};
  mappedTopics: {};
  selectedTopicsForUniversalFeedScreen: [];
  selectedTopicsForCreatePostScreen: [];
  selectedTopicsFromUniversalFeedScreen: [];
  statusBarStyle: string;
  muteStatus: boolean;
  pauseStatus: boolean;
  currentIdOfVideo: string;
  reportModalOpenedInPostDetail: boolean;
  flowToCreatePostScreen: boolean;
  flowToCarouselScreen: boolean;
  notificationCount: number;
  flowToPostDetailScreen: boolean;
  refreshScreenFromOnboardingScreen: boolean;
}

export const initialState: FeedReducerState = {
  feed: [],
  users: {},
  reportTags: {},
  autoPlayVideoPostId: "",
  topics: {},
  mappedTopics: {},
  selectedTopicsForUniversalFeedScreen: [],
  selectedTopicsForCreatePostScreen: [],
  selectedTopicsFromUniversalFeedScreen: [],
  statusBarStyle: Styles.$STATUS_BAR_STYLE.default
    ? Styles.$STATUS_BAR_STYLE.default
    : "",
  muteStatus: false,
  pauseStatus: false,
  currentIdOfVideo: "",
  reportModalOpenedInPostDetail: false,
  flowToCreatePostScreen: false,
  flowToCarouselScreen: false,
  notificationCount: 0,
  flowToPostDetailScreen: false,
  refreshScreenFromOnboardingScreen: false,
};

export const feedReducer = (state = initialState, action) => {
  switch (action.type) {
    case REFRESH_FROM_ONBOARDING_SCREEN: {
      const { refresh } = action.body;
      return { ...state, refreshScreenFromOnboardingScreen: refresh };
    }
    case SET_FLOW_TO_POST_DETAIL_SCREEN: {
      const { flowToPostDetailScreen } = action.body;
      return { ...state, flowToPostDetailScreen: flowToPostDetailScreen };
    }
    case SET_NOTIFICATION_COUNT: {
      const { notificationCount } = action.body;
      return { ...state, notificationCount: notificationCount };
    }
    case SET_FLOW_TO_CAROUSEL_SCREEN: {
      const { flowToCarouselScreen } = action.body;
      return { ...state, flowToCarouselScreen: flowToCarouselScreen };
    }
    case SET_FLOW_TO_CREATE_POST_SCREEN: {
      const { flowToCreatePostScreen } = action.body;
      return { ...state, flowToCreatePostScreen: flowToCreatePostScreen };
    }
    case SET_REPORT_MODEL_STATUS_IN_POST_DETAIL: {
      const { reportModalStatus } = action.body;
      return { ...state, reportModalOpenedInPostDetail: reportModalStatus };
    }
    case SET_CURRENT_ID_OF_VIDEO: {
      const { currentIdOfVideo } = action.body;
      return { ...state, currentIdOfVideo: currentIdOfVideo };
    }
    case SET_PAUSED_STATUS: {
      const { paused } = action.body;
      return { ...state, pauseStatus: paused };
    }
    case SET_MUTED_STATE: {
      const { mute } = action.body;
      return { ...state, muteStatus: mute };
    }
    case STATUS_BAR_STYLE: {
      const { color } = action.body;
      return { ...state, statusBarStyle: color };
    }
    case UNIVERSAL_TOPICS_FEED_SUCCESS: {
      const { users = {}, topics } = action.body;
      let feedData = state.feed;
      let usersData = state.users;
      // model converter function
      const post = convertUniversalFeedPosts(action.body);
      // this handles pagination and appends new post data with previous data
      feedData = [...post];
      // this appends the new users data with previous data
      usersData = { ...usersData, ...users };
      return {
        ...state,
        feed: feedData,
        users: usersData,
        topics: { ...state.topics, ...topics },
      };
    }
    case SELECTED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN: {
      const { topics = {} } = action.body;
      return {
        ...state,
        selectedTopicsFromUniversalFeedScreen: topics,
      };
    }
    case CLEAR_SELECTED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN: {
      return {
        ...state,
        selectedTopicsFromUniversalFeedScreen: [],
      };
    }
    case SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN: {
      const { topics = {} } = action.body;
      return {
        ...state,
        selectedTopicsForUniversalFeedScreen: topics,
      };
    }
    case SELECTED_TOPICS_FOR_CREATE_POST_SCREEN: {
      const { topics = {} } = action.body;
      return {
        ...state,
        selectedTopicsForCreatePostScreen: topics,
      };
    }
    case CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN: {
      return {
        ...state,
        selectedTopicsForCreatePostScreen: [],
      };
    }
    case SET_TOPICS: {
      const { topics = {} } = action.body;
      return { ...state, topics: { ...state.topics, ...topics } };
    }
    case MAPPED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN: {
      const { topics = {} } = action.body;
      return {
        ...state,
        mappedTopics: topics,
      };
    }
    case CLEAR_SELECTED_TOPICS: {
      return {
        ...state,
        selectedTopicsForUniversalFeedScreen: [],
      };
    }
    case UNIVERSAL_FEED_SUCCESS: {
      const { users = {}, topics } = action.body;
      let feedData = state.feed;
      let usersData = state.users;
      // model converter function
      const post = convertUniversalFeedPosts(action.body);
      // this handles pagination and appends new post data with previous data
      feedData = feedData ? [...feedData, ...post] : [...post];
      // this appends the new users data with previous data
      usersData = { ...usersData, ...users };
      return {
        ...state,
        feed: feedData,
        users: usersData,
        topics: { ...state.topics, ...topics },
      };
    }
    case UNIVERSAL_FEED_REFRESH_SUCCESS: {
      const { users = {} } = action.body;
      // model converter function
      const post = convertUniversalFeedPosts(action.body);
      return { ...state, feed: post, users: users };
    }
    case PERSONALISED_FEED_SUCCESS: {
      const { users = {}, topics } = action.body;
      let feedData = state.feed;
      let usersData = state.users;
      // model converter function
      const post = convertUniversalFeedPosts(action.body);
      // this handles pagination and appends new post data with previous data
      feedData = feedData ? [...feedData, ...post] : [...post];
      // this appends the new users data with previous data
      usersData = { ...usersData, ...users };
      return {
        ...state,
        feed: feedData,
        users: usersData,
        topics: { ...state.topics, ...topics },
      };
    }
    case PERSONALISED_FEED_REFRESH_SUCCESS: {
      const { users = {} } = action.body;
      // model converter function
      const post = convertUniversalFeedPosts(action.body);
      return { ...state, feed: post, users: users };
    }
    case DELETE_POST_STATE: {
      const updatedFeed = state.feed;
      // this gets the index of the post that is deleted
      const deletedPostIndex = updatedFeed.findIndex(
        (item: LMPostViewData) => item?.id === action.body
      );
      // removes that post from the data
      if (deletedPostIndex != -1) {
        updatedFeed.splice(deletedPostIndex, 1);
      }
      return { ...state, feed: updatedFeed };
    }
    case DELETE_POST_STATE: {
      const updatedFeed = state.feed;
      // this gets the index of the post that is deleted
      const deletedPostIndex = updatedFeed.findIndex(
        (item: LMPostViewData) => item?.id === action.body
      );
      // removes that post from the data
      if (deletedPostIndex != -1) {
        updatedFeed.splice(deletedPostIndex, 1);
      }
      return { ...state, feed: updatedFeed };
    }
    case REPORT_TAGS_SUCCESS: {
      const { reportTags = {} } = action.body;
      return { ...state, reportTags: reportTags };
    }
    case PIN_POST_STATE: {
      const updatedFeed = state.feed;
      // this gets the index of post that is pinned
      const pinnedPostIndex = updatedFeed.findIndex(
        (item: any) => item?.id === action.body
      );

      // this updates the isPinned value
      if (pinnedPostIndex != -1) {
        updatedFeed[pinnedPostIndex].isPinned =
          !updatedFeed[pinnedPostIndex].isPinned;
        // this gets the index of pin/unpin from menu item
        const menuItemIndex = updatedFeed[pinnedPostIndex].menuItems.findIndex(
          (item: any) => item.id === PIN_POST_ID || item.id === UNPIN_POST_ID
        );

        if (menuItemIndex != -1) {
          if (updatedFeed[pinnedPostIndex].isPinned) {
            //  this updates the menuItem title to unpin
            updatedFeed[pinnedPostIndex].menuItems[menuItemIndex].id =
              UNPIN_POST_ID;
            updatedFeed[pinnedPostIndex].menuItems[menuItemIndex].title =
              UNPIN_THIS_POST;
          } else {
            //  this updates the menuItem title to pin
            updatedFeed[pinnedPostIndex].menuItems[menuItemIndex].id =
              PIN_POST_ID;
            updatedFeed[pinnedPostIndex].menuItems[menuItemIndex].title =
              PIN_THIS_POST;
          }
        }
      }

      return { ...state, feed: updatedFeed };
    }
    case LIKE_POST_STATE: {
      const updatedFeed = state.feed;
      // this gets the index of post that is liked
      const likedPostIndex = updatedFeed.findIndex(
        (item: LMPostViewData) => item?.id === action.body
      );
      // this updates the isLiked value
      if (likedPostIndex != -1) {
        updatedFeed[likedPostIndex].isLiked =
          !updatedFeed[likedPostIndex].isLiked;
        if (updatedFeed[likedPostIndex].isLiked) {
          // increase the like count
          updatedFeed[likedPostIndex].likesCount =
            updatedFeed[likedPostIndex].likesCount + 1;
        } else {
          // decrease the like count
          updatedFeed[likedPostIndex].likesCount =
            updatedFeed[likedPostIndex].likesCount - 1;
        }
      }
      return { ...state, feed: updatedFeed };
    }
    case SAVE_POST_STATE: {
      const updatedFeed = state.feed;
      // this gets the index of post that is saved
      const savedPostIndex = updatedFeed.findIndex(
        (item: any) => item?.id === action.body
      );
      // this updates the isSaved value
      if (savedPostIndex != -1) {
        updatedFeed[savedPostIndex].isSaved =
          !updatedFeed[savedPostIndex].isSaved;
      }

      return { ...state, feed: updatedFeed };
    }
    case EDIT_POST_SUCCESS: {
      const {
        post = {},
        users = {},
        widgets = {},
        filteredComments = {},
      } = action.body;
      const updatedFeed = [...state.feed];
      const postData = convertToLMPostViewData(
        post,
        users,
        widgets,
        filteredComments
      );
      const index = updatedFeed.findIndex((item) => item.id === postData.id);
      if (index !== -1) {
        updatedFeed[index] = postData;
      }
      return { ...state, feed: updatedFeed };
    }
    case CREATE_COMMENT_SUCCESS: {
      const { comment } = action.body;
      const updatedFeed = state.feed;
      // finds the post in which new comment is added in post detail and manage its comment count
      updatedFeed.find((item: LMPostViewData) => {
        if (item.id === comment.postId) {
          item.commentsCount = item?.commentsCount + 1;
        }
      });
      return { ...state };
    }
    case DELETE_COMMENT_STATE: {
      const updatedFeed = state.feed;
      // finds the post whose comment is deleted in post detail and manage its comment count
      updatedFeed.find((item: LMPostViewData) => {
        if (item.id === action.body.postId) {
          item.commentsCount = item?.commentsCount - 1;
        }
      });
      return { ...state };
    }
    case HIDE_POST_STATE: {
      const feed = state.feed;
      const { postId, title } = action.body;
      const postIndex = feed.findIndex((post) => post.id == postId);

      if (postIndex != -1) {
        feed[postIndex].isHidden = !feed[postIndex]?.isHidden;
        feed[postIndex]?.menuItems?.forEach((menuItem) => {
          if (menuItem?.id == 12) {
            menuItem.id = 13;
            menuItem.title = title;
          } else if (menuItem?.id == 13) {
            menuItem.id = 12;
            menuItem.title = title;
          }
        });
      }

      return { ...state };
    }
    case AUTO_PLAY_POST_VIDEO: {
      return { ...state, autoPlayVideoPostId: action.body };
    }
    case CREATE_POST_SUCCESS: {
      // model converter function
      const post = convertSingleFeedPost(action.body);
      if (post) {
        return { ...state, feed: [post, ...state.feed] };
      } else {
        return state;
      }
    }
    case POST_DATA_SUCCESS: {
      // model converter function
      const post = convertSingleFeedPost(action.body);
      const feed = state.feed.map((item) =>
        item?.id === post?.id
          ? {
              ...item,
              ...post,
            }
          : item
      );
      if (post) {
        return { ...state, feed: feed };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};
