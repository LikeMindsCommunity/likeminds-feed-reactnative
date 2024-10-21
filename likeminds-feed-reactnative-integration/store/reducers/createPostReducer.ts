import {
  ADD_SELECTED_TOPICS,
  CLEAR_POLL,
  CLEAR_SELECTED_TOPICS,
  DECODE_URL_SUCCESS,
  SET_DISABLED_TOPICS,
  SET_POLL,
  SET_PREDEFINED_TOPICS,
  UPLOAD_ATTACHMENTS,
} from "../types/types";

export interface CreatePostReducerState {
  ogTags: {};
  mediaAttachmemnts: [];
  linkAttachments: [];
  postContent: "";
  heading: "";
  topics: [];
  poll: {};
  selectedTopics: [];
  disbaledTopics: [];
  predefinedTopics: [];
  pollAttachment: {};
  metaData: {};
  isAnonymous: boolean;
}

export const initialState: CreatePostReducerState = {
  ogTags: {},
  mediaAttachmemnts: [],
  linkAttachments: [],
  postContent: "",
  heading: "",
  topics: [],
  poll: {}, // to send poll data on universal feed screen
  selectedTopics: [],
  disbaledTopics: [],
  predefinedTopics: [],
  pollAttachment: {}, // for local preview of poll data
  metaData: {}, // meta data for custom widget
  isAnonymous: false
};

export function createPostReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SELECTED_TOPICS: {
      const { topics = {} } = action.body;
      return {
        ...state,
        selectedTopics: topics,
      };
    }
    case SET_PREDEFINED_TOPICS: {
      const { topics = {} } = action.body;
      return {
        ...state,
        predefinedTopics: topics,
      };
    }
    case CLEAR_SELECTED_TOPICS: {
      return { ...state, selectedTopics: [] };
    }
    case SET_DISABLED_TOPICS: {
      const { topics = {} } = action.body;
      return {
        ...state,
        disbaledTopics: topics,
      };
    }
    case SET_POLL: {
      const { poll = {} } = action.body;
      return {
        ...state,
        pollAttachment: poll,
      };
    }
    case CLEAR_POLL: {
      return {
        ...state,
        pollAttachment: {},
      };
    }
    case DECODE_URL_SUCCESS: {
      const { og_tags = {} } = action.body;
      return { ...state, ogTags: og_tags };
    }
    case UPLOAD_ATTACHMENTS: {
      const {
        mediaAttachmentData = [],
        linkAttachmentData = [],
        postContentData = "",
        heading = "",
        topics = [],
        poll = {},
        metaData = {},
        isAnonymous = false
      } = action.body;
      return {
        ...state,
        mediaAttachmemnts: mediaAttachmentData,
        linkAttachments: linkAttachmentData,
        postContent: postContentData,
        heading: heading,
        topics: topics,
        poll: poll,
        metaData: metaData,
        isAnonymous: isAnonymous
      };
    }
    default:
      return state;
  }
}
