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
  removePollAttachment?: () => void;
  editPollAttachment?: () => void;
  onQuestionTextLayout: (event: {
    nativeEvent: { lines: string | TextLayoutLine[] };
  }) => void;
  getTimeLeftInPoll: (expiryTime: number | null) => string;
}
