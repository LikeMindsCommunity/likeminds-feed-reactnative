import { CallBack } from "../callBacks/callBackClass";

export class LMFeedAnalytics {
  static track(
    eventName: string,
    eventProperties?: Map<string | undefined, string | undefined>
  ) {
    const lmFeedInterface = CallBack.lmFeedInterface;
    lmFeedInterface.onEventTriggered(eventName, eventProperties);
  }
}
