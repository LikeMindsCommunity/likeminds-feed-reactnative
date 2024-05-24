import React from "react";
import { LMFeedClient } from "@likeminds.community/feed-js";
import {
  CreatePostStyleProps,
  LoaderStyleProps,
  NotificationFeedStyleProps,
  PollStyle,
  PostDetailStyleProps,
  PostLikesListStyleProps,
  PostListStyleProps,
  TopicsStyle,
  UniversalFeedStyleProps,
} from "../lmFeedProvider/types";

export interface LMOverlayProviderProps {
  myClient: LMFeedClient;
  children: React.ReactNode;
  accessToken: string;
  refreshToken: string;
  lmFeedInterface?: any;
  universalFeedStyle?: UniversalFeedStyleProps;
  postListStyle?: PostListStyleProps;
  loaderStyle?: LoaderStyleProps;
  postDetailStyle?: PostDetailStyleProps;
  createPostStyle?: CreatePostStyleProps;
  postLikesListStyle?: PostLikesListStyleProps;
  notificationFeedStyle?: NotificationFeedStyleProps;
  topicsStyle?: TopicsStyle;
  pollStyle?: PollStyle;
}
