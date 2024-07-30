import { LMPostUI } from "./LMPostUI";

export type RootStackParamList = {
  UniversalFeed: undefined;
  PostsList: undefined;
  PostDetail: Array<string> | undefined;
  CreatePost:
    | { postId: string; post: LMPostUI; hidePoll?: boolean }
    | undefined;
  PostLikesList: Array<string> | undefined;
  NotificationFeed: undefined;
  NotificationList: undefined;
  CreatePollScreen: any;
  PollResult: any;
};
