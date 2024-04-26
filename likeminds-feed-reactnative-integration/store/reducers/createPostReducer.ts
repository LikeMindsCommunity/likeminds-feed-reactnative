import {
  ADD_SELECTED_TOPICS,
  CLEAR_SELECTED_TOPICS,
  DECODE_URL_SUCCESS,
  UPLOAD_ATTACHMENTS,
} from "../types/types";

export interface CreatePostReducerState {
  ogTags: {};
  mediaAttachmemnts: [];
  linkAttachments: [];
  postContent: "";
  topics: [];
  selectedTopics: [];
}

export const initialState: CreatePostReducerState = {
  ogTags: {},
  mediaAttachmemnts: [],
  linkAttachments: [],
  postContent: "",
  topics: [],
  selectedTopics: [],
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
