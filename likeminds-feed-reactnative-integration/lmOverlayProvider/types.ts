import React from "react";
import { LMFeedClient } from "@likeminds.community/feed-rn";
import { LMCoreCallbacks } from "../setupFeed";
import { VideoCallback, VideoCarouselCallback } from "../components/LMMedia/LMVideo/types";

export interface LMOverlayProviderProps {
  myClient: LMFeedClient;
  children: React.ReactNode;
  apiKey?: string;
  userName?: string;
  userUniqueId?: string;
  accessToken?: string;
  refreshToken?: string;
  lmFeedInterface?: any;
  callbackClass: LMCoreCallbacks;
  videoCallback?: VideoCallback;
  videoCarouselCallback?: VideoCarouselCallback;
}
