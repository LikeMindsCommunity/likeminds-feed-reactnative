import {
  InitiateUserRequest,
  LMFeedClient,
} from "@likeminds.community/feed-rn";
import { initMyClient } from "./setup";
import { LoginSchemaRO } from "../example/login/loginSchemaRO";
const Realm = require("realm");

interface LMFeedCoreCallback {
  onAccessTokenExpiredAndRefreshed(
    accessToken: string,
    refreshToken: string
  ): void;
  onRefreshTokenExpired(): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}

interface LMFeedSDKCallback {
  onAccessTokenExpiredAndRefreshed(): void;
  onRefreshTokenExpired(): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}

function setupFeed(callback: LMFeedCoreCallback) {
  const lmFeedClient = initMyClient();
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
    onRefreshTokenExpired: async (): {
      accessToken: string;
      refreshToken: string;
    } => {
      // Customer is not using API Key Security
      const user: any = await getUserFromLocalDB(); // replace with actual method to get user
      if (user?.apiKey) {
        const response = await lmFeedClient.initiateUser(
          InitiateUserRequest.builder()
            .setApiKey(user.apiKey)
            .setUUID(user.sdkClientInfo.uuid)
            .setUserName(user.name)
            .build()
        );

        console.log("response", response);
        // return {
        //   accessToken: response.accessToken,
        //   refreshToken: response.refreshToken,
        // };
      } else {
        // Call Core Layer callback
        return callback.onRefreshTokenExpired();
      }
    },
  });
}

export async function getUserFromLocalDB() {
  let realm;

  try {
    // Open the Realm with the User schema
    realm = await Realm.open({
      schema: [LoginSchemaRO],
    });

    // Fetch the user by userId
    const user = realm.objectForPrimaryKey("LoginSchemaRO", "LoginSchema");

    console.log("user ==", user);

    // If user not found, return null
    if (!user) {
      return null;
    }

    // Map the Realm user object to LoginSchemaRO
    return;
  } catch (error) {
    console.error("Error fetching user from local DB:", error);
    throw error;
  } finally {
    // Close the Realm
    if (realm) {
      realm.close();
    }
  }
}
