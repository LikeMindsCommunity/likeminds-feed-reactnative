import { LMFeedClient } from "@likeminds.community/feed-rn";

export const initMyClient = () => {
  const lmFeedClient = LMFeedClient.Builder()
    .setPlatformCode("rn")
    .setVersionCode(13)
    .build();

  return lmFeedClient;
};
