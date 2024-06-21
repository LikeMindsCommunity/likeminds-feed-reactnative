import { LMFeedClient } from "@likeminds.community/feed-rn-beta";

export const initMyClient = () => {
  const lmFeedClient = LMFeedClient.Builder()
    .setPlatformCode("rn")
    .setVersionCode(6)
    .build();

  return lmFeedClient;
};
