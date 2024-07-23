import React from "react";
import { LMFeedClient } from "@likeminds.community/feed-rn";
import {
  CarouselScreenStyle,
  CreatePollStyle,
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
import { LMCoreCallbacks } from "../setupFeed";

export interface LMOverlayProviderProps {
  myClient: LMFeedClient;
  children: React.ReactNode;
  apiKey?: string;
  userName?: string;
  userUniqueId?: string;
  accessToken?: string;
  refreshToken?: string;
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
  createPollStyle?: CreatePollStyle;
  callbackClass: LMCoreCallbacks;
  carouselScreenStyle?: CarouselScreenStyle;
}
