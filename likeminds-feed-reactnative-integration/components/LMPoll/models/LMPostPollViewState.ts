import { PollMultiSelectState, PollType } from "../../../enums/Poll";
import { LMPostViewData } from "../../../models";
import { Poll } from "./Poll";

export interface LMPostPollViewState {
  hue?: number;
  text: string; // Assuming it's a string, update the type if necessary
  votes: number;
  optionArr: Poll[];
  pollTypeText: string;
  submitTypeText: string;
  addOptionInputField: string;
  shouldShowSubmitPollButton: boolean;
  selectedPolls: number[];
  showSelected: boolean;
  allowAddOption: boolean;
  shouldShowVotes: boolean;
  hasPollEnded: boolean;
  expiryTime: string;
  expiryDays: number | string;
  toShowResults: boolean;
  member: any;
  user: any;
  isEdited: boolean;
  createdAt: string;
  pollAnswerText: string;
  isPollEnded: boolean;
  multipleSelectNo: number;
  multipleSelectState: PollMultiSelectState;
  showResultsButton: boolean;
  pollType: PollType;
  disabled: boolean;
  truncatedText: string;
  maxQuestionLines: number;
  post: LMPostViewData;
}
