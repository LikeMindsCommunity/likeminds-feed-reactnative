import { LMFeedClient } from "@likeminds.community/feed-rn";
import { initMyClient } from "./setup";

interface LMFeedCoreCallback {
    onAccessTokenExpiredAndRefreshed(accessToken: string, refreshToken: string): void;
    onRefreshTokenExpired(): Promise<{ accessToken: string; refreshToken: string }>;
}

interface LMFeedSDKCallback {
  onAccessTokenExpiredAndRefreshed(): void;
  onRefreshTokenExpired(): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}

function setupFeed(callback: LMFeedCoreCallback) {
    const lmFeedClient = initMyClient()
    lmFeedClient.setLMSDKCallbacks({
        onAccessTokenExpiredAndRefreshed: async () => {
          // Open Token Management drawio.png
          // Call Core Layer callback
          callback.onAccessTokenExpiredAndRefreshed(
            lmFeedClient.getAccessToken(),
            lmFeedClient.getRefreshToken()
          );
          // Handle token update logic if needed
        },
        onRefreshTokenExpired: async (): Promise<{
          accessToken: string;
          refreshToken: string;
        }> => {
          // Open Token Management Diagram.png
          // Get apiKey
          const apiKey = lmFeedClient.getAPIKey();
          if (apiKey) {
            // Customer is not using API Key Security
            const user = await getUserFromLocalDB(); // replace with actual method to get user
            const response = await lmFeedClient.initiateUser(
              apiKey,
              user.sdkClientInfo.uuid,
              user.name
            );
            return {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            };
          } else {
            // Call Core Layer callback
            return callback.onRefreshTokenExpired();
          }
        },
      })
}
