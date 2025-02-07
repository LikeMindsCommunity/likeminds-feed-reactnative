export interface PollStyles {
  pollVoteSliderColor?: {
    backgroundColor?: string;
  };
}
export interface AddPollOptionParams {
  addOptionInputField: string;
  options: any[]; // pollsArr
  poll: any;
  setIsAddPollOptionModalVisible: (visible: boolean) => void;
  setAddOptionInputField: (value: string) => void;
  reloadPost: () => void;
}

export interface SetSelectedPollOptionsParams {
  pollIndex: number;
  poll: any;
  selectedPolls: number[];
  options: any[];
  shouldShowVotes: boolean;
  isMultiChoicePoll: (multipleSelectNumber: number | undefined, multipleSelectState: any) => boolean;
  reloadPost: () => void;
  setSelectedPolls: (selectedPolls: any[]) => void;
}

export interface SubmitPollParams {
  shouldShowSubmitPollButton: boolean;
  selectedPolls: number[];
  poll: any;
  reloadPost: () => Promise<void>;
  setShouldShowVotes: (shouldShow: boolean) => void;
  setSelectedPolls: (selectedPolls: any[]) => void;
  stringManipulation: (flag: boolean) => string;
}
