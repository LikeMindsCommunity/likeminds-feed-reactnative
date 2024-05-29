import { GestureResponderEvent, TextLayoutLine } from "react-native/types";
import { PollMultiSelectState } from "../../../enums/Poll";

export interface LMPostPollViewCallbacks {
  onNavigate: (val: string) => void;
  setSelectedPollOptions: (pollIndex: any) => void;
  addPollOption: () => void;
  submitPoll: any;
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
  isMultiChoicePoll: (
    pollMultiSelectNo: number,
    pollMultiSelectState: PollMultiSelectState
  ) => boolean;
  reloadPost: () => void;
  setSelectedPolls: any;
  setShouldShowVotes: any;
}
