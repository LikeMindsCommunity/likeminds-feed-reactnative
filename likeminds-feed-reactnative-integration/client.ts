import { LMFeedClient } from "@likeminds.community/feed-js";

export class Client {
  private static _myClient: LMFeedClient;

  static setMyClient(myClient: LMFeedClient): void {
    Client._myClient = myClient;
  }

  static get myClient(): LMFeedClient {
    return Client._myClient;
  }
}