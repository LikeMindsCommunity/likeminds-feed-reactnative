import { GestureResponderEvent, TextLayoutLine } from "react-native/types";

export interface PollConversationViewCallbacks {
  onNavigate: (val: string) => void;
  setSelectedPollOptions: (pollIndex: any) => void;
  addPollOption: () => void;
  submitPoll: () => void;
  setShowSelected: (show: boolean) => void;
  setIsAddPollOptionModalVisible: (visible: boolean) => void;
  setAddOptionInputField: (inputField: string) => void;
  stringManipulation: () => string;
  dateManipulation: () => string;
  resetShowResult: () => void;
  onQuestionTextLayout: (event: {
    nativeEvent: { lines: string | TextLayoutLine[] };
  }) => void;
}
