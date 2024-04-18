export interface LMFeedCallbacks {
  onEventTriggered(
    eventName: string,
    eventProperties?: Map<string, string>
  ): void;
}
