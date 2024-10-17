import React from "react";
import { LMFeedClient } from "@likeminds.community/feed-rn";
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
  callbackClass: LMCoreCallbacks;
  videoCallback?: any;
  videoCarouselCallback?: any;
}
