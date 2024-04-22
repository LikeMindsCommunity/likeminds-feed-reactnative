export class CallBack {
  private static _lmFeedInterface;

  static setLMFeedInterface(lmFeedInterface): void {
    CallBack._lmFeedInterface = lmFeedInterface;
  }

  static get lmFeedInterface() {
    return CallBack._lmFeedInterface;
  }
}
