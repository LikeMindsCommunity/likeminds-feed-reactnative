import {
  convertToLMPostUI,
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
} from "../types/types";
import { LMPostUI } from "../../models";

export interface FeedReducerState {
  feed: LMPostUI[];
  users: {};
  reportTags: {};
  autoPlayVideoPostId: "";
  topics: {};
  selectedTopicsForUniversalFeedScreen: [];
  selectedTopicsForCreatePostScreen: [];
  selectedTopicsFromUniversalFeedScreen: [];
}

export const initialState: FeedReducerState = {
  feed: [],
  users: {},
  reportTags: {},
  autoPlayVideoPostId: "",
  topics: {},
  selectedTopicsForUniversalFeedScreen: [],
  selectedTopicsForCreatePostScreen: [],
  selectedTopicsFromUniversalFeedScreen: [],
};
export const feedReducer = (state = initialState, action) => {
  switch (action.type) {
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
      return { ...state, topics: topics };
    }
    case UNIVERSAL_FEED_SUCCESS: {
      const { users = {} } = action.body;
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
      };
    }
    case UNIVERSAL_FEED_REFRESH_SUCCESS: {
      const { users = {} } = action.body;
      // model converter function
      const post = convertUniversalFeedPosts(action.body);
      return { ...state, feed: post, users: users };
    }
    case DELETE_POST_STATE: {
      const updatedFeed = state.feed;
      // this gets the index of the post that is deleted
      const deletedPostIndex = updatedFeed.findIndex(
        (item: LMPostUI) => item?.id === action.body
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
        (item: LMPostUI) => item?.id === action.body
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
      const { post = {}, users = {} } = action.body;
      const updatedFeed = [...state.feed];
      const postData = convertToLMPostUI(post, users);
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
      updatedFeed.find((item: LMPostUI) => {
        if (item.id === comment.postId) {
          item.commentsCount = item?.commentsCount + 1;
        }
      });
      return { ...state };
    }
    case DELETE_COMMENT_STATE: {
      const updatedFeed = state.feed;
      // finds the post whose comment is deleted in post detail and manage its comment count
      updatedFeed.find((item: LMPostUI) => {
        if (item.id === action.body.postId) {
          item.commentsCount = item?.commentsCount - 1;
        }
      });
      return { ...state };
    }
    case AUTO_PLAY_POST_VIDEO: {
      return { ...state, autoPlayVideoPostId: action.body };
    }
    case POST_DATA_SUCCESS: {
      const updatedFeed = state.feed;
      const { post = {}, users = {} } = action.body;
      const converterPostData = convertToLMPostUI(post, users);
      const index = updatedFeed.findIndex(
        (item) => item.id === converterPostData.id
      );
      if (index !== -1) {
        updatedFeed[index] = converterPostData;
      }
      return { ...state, feed: updatedFeed };
    }
    default:
      return state;
  }
};
