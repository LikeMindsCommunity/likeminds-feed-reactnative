export interface LMChatCallbacks {
  onEventTriggered(
    eventName: string,
    eventProperties?: Map<string, string>
  ): void;
}
