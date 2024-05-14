import { GestureResponderEvent } from "react-native/types";

export interface PollConversationViewCallbacks {
  onNavigate: (val: string) => void;
  setSelectedPollOptions: (pollIndex: any) => void;
  addPollOption: () => void;
  submitPoll: () => void;
  setShowSelected: (show: boolean) => void;
  setIsAddPollOptionModalVisible: (visible: boolean) => void;
  setAddOptionInputField: (inputField: string) => void;
  stringManipulation: () => string;
  resetShowResult: () => void;
}
