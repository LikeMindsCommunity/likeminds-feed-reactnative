import {
  InitiateUserRequest,
  LMFeedClient,
  LMSDKCallbacks,
} from "@likeminds.community/feed-rn";
import { initMyClient } from "./setup";
import { LoginSchemaRO } from "../example/login/loginSchemaRO";
import { Client } from "./client";
const Realm = require("realm");

// create a class by LMFeedCoreCallbacks and take two functions in its contructors, assign these two functions to the class's functions
export class LMCoreCallbacks {
  onAccessTokenExpiredAndRefreshed: (
    accessToken: string,
    refreshToken: string
  ) => void;
  onRefreshTokenExpired: () => { accessToken: string; refreshToken: string };
  constructor(
    onAccessTokenExpiredAndRefreshed: (
      accessToken: string,
      refreshToken: string
    ) => void,
    onRefreshTokenExpired: () => { accessToken: string; refreshToken: string }
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

  async onRefreshTokenExpired() {
    const stringifiedUser: any =
      await Client.myClient.getUserFromLocalStorage(); // replace with actual method to get user
    const user = JSON.parse(stringifiedUser);
    if (user?.apiKey) {
      const response: any = await Client.myClient.initiateUser(
        InitiateUserRequest.builder()
          .setApiKey(user.apiKey)
          .setUUID(user.userUniqueId)
          .setUserName(user.userName)
          .build()
      );
      await Client.myClient.setTokens(
        response.accessToken,
        response.refreshToken
      );
      return {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };
    } else {
      const response = await this.lmCoreCallbacks.onRefreshTokenExpired();
      await Client.myClient.setTokens(
        response.accessToken,
        response.refreshToken
      );
      return {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };
    }
  }
  constructor(lmCoreCallbacks: LMCoreCallbacks, client: LMFeedClient) {
    super();
    this.lmCoreCallbacks = lmCoreCallbacks;
    this.client = client;
  }
}
