export interface CreatePollContextProps {
  navigation?: any;
  route?: any;
  onPollExpiryTimeClicked?: () => void;
  onAddOptionClicked?: () => void;
  onPollOptionCleared?: (index: any) => void;
  onPollCompleteClicked?: () => void;
}

export interface CreatePoll {
  navigation: any;
  route: any;
}
