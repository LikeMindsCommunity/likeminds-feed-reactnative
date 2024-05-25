import { LMPostUI } from "./LMPostUI";

export type RootStackParamList = {
  UniversalFeed: undefined;
  PostsList: undefined;
  PostDetail: Array<string> | undefined;
  CreatePost: { postId: string, post: LMPostUI } | undefined;
  PostLikesList: Array<string> | undefined;
  NotificationFeed: undefined;
  NotificationList: undefined;
  CreatePollScreen: any;
  PollResult: any;
};
