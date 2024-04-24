import React from "react"
import { LMFeedClient } from "@likeminds.community/feed-js";
import { CreatePostStyleProps, LoaderStyleProps, NotificationFeedStyleProps, PostDetailStyleProps, PostLikesListStyleProps, PostListStyleProps, UniversalFeedStyleProps } from "../lmFeedProvider/types";

export interface LMOverlayProviderProps {
  myClient: LMFeedClient;
  children: React.ReactNode;
  userName: string;
  userUniqueId: string;
  lmFeedInterface?: any;
  universalFeedStyle?: UniversalFeedStyleProps;
  postListStyle?: PostListStyleProps;
  loaderStyle?: LoaderStyleProps;
  postDetailStyle?: PostDetailStyleProps;
  createPostStyle?: CreatePostStyleProps;
  postLikesListStyle?: PostLikesListStyleProps;
  notificationFeedStyle?: NotificationFeedStyleProps
}