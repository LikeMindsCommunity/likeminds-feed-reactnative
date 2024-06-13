import {
  InitiateUserRequest,
  LMFeedClient,
  LMSDKCallbacks,
} from "@likeminds.community/feed-rn-beta";
import { initMyClient } from "./setup";
import { LoginSchemaRO } from "../example/login/loginSchemaRO";
const Realm = require("realm");

// create a class by LMFeedCoreCallbacks and take two functions in its contructors, assign these two functions to the class's functions
export class LMCoreCallbacks {
  onAccessTokenExpiredAndRefreshed: (
    accessToken: string,
    refreshToken: string
  ) => void;
  onRefreshTokenExpired: (getUserFromLocalDB: () => void) => void;
  constructor(
    onAccessTokenExpiredAndRefreshed: (
      accessToken: string,
      refreshToken: string
    ) => void,
    onRefreshTokenExpired: (getUserFromLocalDB: () => void) => void
  ) {
    this.onAccessTokenExpiredAndRefreshed = onAccessTokenExpiredAndRefreshed;
    this.onRefreshTokenExpired = onRefreshTokenExpired;
  }
}

// create a new class LMFeedSdkCallbackImplementation which is an implementation of the abstract class provided by data layer
export class LMSDKCallbacksImplementations extends LMSDKCallbacks {
  lmCoreCallbacks: LMCoreCallbacks;
  client: LMFeedClient;

  onAccessTokenExpiredAndRefreshed(
    accessToken: string,
    refreshToken: string
  ): void {
    this.lmCoreCallbacks.onAccessTokenExpiredAndRefreshed(
      accessToken,
      refreshToken
    );
  }
  async onRefreshTokenExpired(getUserFromLocalDB) {
    const user: any = await getUserFromLocalDB(); // replace with actual method to get user
    if (user?.apiKey) {
      const response: any = await this.client.initiateUser(
        InitiateUserRequest.builder()
          .setApiKey(user.apiKey)
          .setUUID(user.sdkClientInfo.uuid)
          .setUserName(user.name)
          .build()
      );

      console.log("response", response);
      return {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };
    } else {
      // Call Core Layer callback
      return this.lmCoreCallbacks.onRefreshTokenExpired(getUserFromLocalDB);
    }
  }
  constructor(lmCoreCallbacks: LMCoreCallbacks, client: LMFeedClient) {
    super();
    this.lmCoreCallbacks = lmCoreCallbacks;
    this.client = client;
  }
}
