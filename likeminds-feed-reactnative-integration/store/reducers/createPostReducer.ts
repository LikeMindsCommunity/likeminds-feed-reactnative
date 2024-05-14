import {
  ADD_SELECTED_TOPICS,
  CLEAR_POLL,
  CLEAR_SELECTED_TOPICS,
  DECODE_URL_SUCCESS,
  SET_DISABLED_TOPICS,
  SET_POLL,
  UPLOAD_ATTACHMENTS,
} from "../types/types";

export interface CreatePostReducerState {
  ogTags: {};
  mediaAttachmemnts: [];
  linkAttachments: [];
  postContent: "";
  topics: [];
  selectedTopics: [];
  disbaledTopics: [];
  pollAttachment: {};
}

export const initialState: CreatePostReducerState = {
  ogTags: {},
  mediaAttachmemnts: [],
  linkAttachments: [],
  postContent: "",
  topics: [],
  selectedTopics: [],
  disbaledTopics: [],
  pollAttachment: {},
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
        topics = [],
      } = action.body;
      return {
        ...state,
        mediaAttachmemnts: mediaAttachmentData,
        linkAttachments: linkAttachmentData,
        postContent: postContentData,
        topics: topics,
      };
    }
    default:
      return state;
  }
}
