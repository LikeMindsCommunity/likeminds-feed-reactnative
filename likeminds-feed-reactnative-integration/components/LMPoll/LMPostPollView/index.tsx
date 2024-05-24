import { View, Text, TextLayoutLine } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ANONYMOUS_POLL_SUB_TITLE,
  ANONYMOUS_POLL_TITLE,
  EMPTY_OPTIONS_WARNING,
  MAX_DEFAULT_POST_CONTENT_LINES,
  POLLS_OPTIONS_LIMIT_WARNING,
  POLLS_OPTIONS_WARNING,
  POLL_ENDED_WARNING,
  POLL_MULTIPLE_STATE_EXACTLY,
  POLL_MULTIPLE_STATE_LEAST,
  POLL_MULTIPLE_STATE_MAX,
  POLL_SUBMITTED_SUCCESSFULLY,
} from "../../../constants/Strings";
import LMPostPollUI from "../LMPostPollUI";
import AnonymousPollModal from "../../../customModals/AnonymousPollModal";
import AddOptionsModal from "../../../customModals/AddOptionModal";
import { LMPostPollViewProps, LMPostPollViewState } from "../models";
import { Client } from "../../../client";
import STYLES from "../../../constants/Styles";

import { SHOW_TOAST } from "../../../store/types/loader";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { POLL_RESULT } from "../../../constants/screenNames";
import { PollMultiSelectState, PollType } from "../../../enums/Poll";
import { GetPostRequest } from "@likeminds.community/feed-js";
import { getPost } from "../../../store/actions/postDetail";
import { useUniversalFeedContext } from "../../../context";

const LMPostPollView = ({
  item,
  post,
  removePollAttachment,
  editPollAttachment,
}: any) => {
  const { navigation, setSelectedPollOptions, addPollOption, submitPoll } =
    useUniversalFeedContext();

  const [selectedPolls, setSelectedPolls] = useState<number[]>([]);
  const [showSelected, setShowSelected] = useState(false);
  const [shouldShowSubmitPollButton, setShouldShowSubmitPollButton] =
    useState(false);
  const [allowAddOption, setAllowAddOption] = useState(false);
  const [showResultsButton, setShowResultsButton] = useState(false);
  const [isAddPollOptionModalVisible, setIsAddPollOptionModalVisible] =
    useState(false);
  const [addOptionInputField, setAddOptionInputField] = useState("");
  const [hasPollEnded, setHasPollEnded] = useState(false);
  const [shouldShowVotes, setShouldShowVotes] = useState(false);
  const [pollVoteCount, setPollVoteCount] = useState(0);
  const [isAnonymousPollModalVisible, setIsAnonymousPollModalVisible] =
    useState(false);
  const [pollsArr, setPollsArr] = useState(item?.options);
  const [truncatedText, setTruncatedText] = useState("");

  const { member } = useAppSelector((item) => item.login);

  const dispatch = useAppDispatch();
  const pollStyles: any = STYLES.$POLL_STYLES;
  const MAX_LINES = pollStyles?.visibleLines
    ? pollStyles?.visibleLines
    : MAX_DEFAULT_POST_CONTENT_LINES;

  // resets local selected polls state
  useEffect(() => {
    setSelectedPolls([]);
  }, [item]);

  // this function navigates to poll result screen if we click on votes or show alert in case of anonymous poll
  const onNavigate = (val: string) => {
    if (item?.isAnonymous) {
      setIsAnonymousPollModalVisible(true);
    } else {
      if (item?.toShowResults == true || hasPollEnded == true) {
        navigation.navigate(POLL_RESULT, {
          screen: val,
          tabsValueArr: pollsArr,
          pollId: item?.id,
        });
      } else {
        // show toast
        dispatch({
          type: SHOW_TOAST,
          body: {
            isToast: true,
            message: "The results will be visible after the poll has ended.",
          },
        });
      }
    }
  };

  // this functions have submit poll button logics
  const submitPollLogics = () => {
    if (item?.multipleSelectNumber === undefined) {
      // defensive check
      if (selectedPolls.length > 0) {
        setShouldShowSubmitPollButton(true);
      } else {
        setShouldShowSubmitPollButton(false);
      }
    } else {
      const MAX_POLL_OPTIONS = item?.multipleSelectNumber;

      switch (item?.multipleSelectState) {
        // defensive check
        case undefined: {
          if (selectedPolls.length === MAX_POLL_OPTIONS) {
            // show submit poll button
            setShouldShowSubmitPollButton(true);
          } else if (selectedPolls.length > MAX_POLL_OPTIONS) {
            // show toast
            dispatch({
              type: SHOW_TOAST,
              body: {
                isToast: true,
                message: `You can select max ${item?.multipleSelectNumber} options. Unselect an option or submit your vote now`,
              },
            });
          }
          break;
        }

        case PollMultiSelectState.EXACTLY: {
          // Exactly
          if (selectedPolls.length === MAX_POLL_OPTIONS) {
            // show submit poll button
            setShouldShowSubmitPollButton(true);
          } else if (selectedPolls.length > MAX_POLL_OPTIONS) {
            // hide submit poll button
            setShouldShowSubmitPollButton(false);
          } else if (selectedPolls.length < MAX_POLL_OPTIONS) {
            // hide submit poll button
            setShouldShowSubmitPollButton(false);
          }
          break;
        }

        case PollMultiSelectState.AT_MAX: {
          if (
            selectedPolls.length <= item?.multipleSelectNumber &&
            selectedPolls.length > 0
          ) {
            // show submit poll button
            setShouldShowSubmitPollButton(true);
          } else {
            // hide submit poll button
            setShouldShowSubmitPollButton(false);
          }
          break;
        }

        case PollMultiSelectState.AT_LEAST: {
          if (selectedPolls.length >= item?.multipleSelectNumber) {
            // show submit poll button
            setShouldShowSubmitPollButton(true);
          } else {
            // hide submit poll button
            setShouldShowSubmitPollButton(false);
          }
          break;
        }

        default: {
          // hide submit poll button
          setShouldShowSubmitPollButton(false);
        }
      }
    }
  };

  // this useEffects monitors the interaction in poll options, according to which we have to show submit button
  useEffect(() => {
    submitPollLogics();
  }, [selectedPolls]);

  // check if user already answered on th poll or not
  useEffect(() => {
    let count = 0;
    const res = pollsArr?.forEach((poll: any) => {
      if (poll.isSelected === true) {
        count = count + 1;
      }
    });
    if (count > 0) {
      setAllowAddOption(false);
      setShouldShowVotes(true);

      // deffered poll show edit button state updation logic
      if (item?.pollType === PollType.DEFERRED) {
        setShowResultsButton(true);
      }
    } else {
      setAllowAddOption(item?.allowAddOption);
      setShouldShowVotes(false);
    }

    setPollVoteCount(count);
  }, [pollsArr]);

  // Poll end timer logic
  useEffect(() => {
    const difference = item?.expiryTime - Date.now();

    if (difference > 0) {
      setHasPollEnded(false);
    } else {
      setHasPollEnded(true);
    }
    if (difference > 0) {
      const timer = setTimeout(() => {
        setHasPollEnded(true);
      }, difference);

      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  // this function triggers when have to hide anonymous poll modal
  const hideAnonymousPollModal = () => {
    setIsAnonymousPollModalVisible(false);
  };
  // this function resets showResult state
  const resetShowResult = () => {
    const updatedSelectedPolls: number[] = [];
    const arr = pollsArr.map((option: any, index: number) => {
      if (item?.multipleSelectNumber > 1 && option.isSelected) {
        updatedSelectedPolls.push(index);
      }
      return {
        ...option,
        isSelected: false,
        percentage: 0,
        voteCount: 0,
      };
    });
    setPollsArr([...arr]);
    setShowResultsButton(false);
    setShouldShowVotes(false);
    setSelectedPolls(updatedSelectedPolls);
  };

  useEffect(() => {
    setPollsArr(item?.options);
  }, [item?.options]);

  // API to reload the existing poll post
  async function reloadPost() {
    const getPostResponse = await dispatch(
      getPost(
        GetPostRequest.builder()
          .setpostId(post?.id)
          .setpage(1)
          .setpageSize(10)
          .build(),
        false
      )
    );
  }

  const stringManipulation = (val?: boolean) => {
    const multipleSelectNo = item?.multipleSelectNumber;
    switch (item?.multipleSelectState) {
      case PollMultiSelectState.EXACTLY: {
        const string = `Select exactly ${multipleSelectNo} options.`;
        return val ? string : "*" + string;
      }

      case PollMultiSelectState.AT_MAX: {
        const string = `Select at most ${multipleSelectNo} options.`;
        return val ? string : "*" + string;
      }

      case PollMultiSelectState.AT_LEAST: {
        const string = `Select at least ${multipleSelectNo} options.`;
        return val ? string : "*" + string;
      }

      default: {
        return "";
      }
    }
  };

  const dateManipulation = () => {
    // Define the UNIX timestamp in milliseconds
    const timestampMs: number = Number(item?.expiryTime);

    // Convert milliseconds to a Date object
    const date: Date = new Date(timestampMs);

    // Define options for formatting the date and time to 12-hour format
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    // Use toLocaleString to get the formatted date and time
    const formattedDate: string = date.toLocaleString("en-US", options);
    return formattedDate;
  };

  // this method calculate days to expiry for preview
  const calculateDaysToExpiry = () => {
    const difference = item?.expiryTime - Date.now();

    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const millisecondsToDays = difference / millisecondsInADay;

    return Math.ceil(millisecondsToDays)?.toString();
  };

  // this handles the show more functionality
  const onTextLayout = (event: {
    nativeEvent: { lines: string | TextLayoutLine[] };
  }) => {
    //get all lines
    const { lines } = event.nativeEvent;
    let text = "";

    //get lines after it truncate
    if (lines.length >= MAX_LINES) {
      if (Array.isArray(lines)) {
        text = lines
          .splice(0, MAX_LINES)
          .map((line) => line.text)
          .join("");
      }
      setTruncatedText(text);
    }
  };

  // this function retreives time left in poll
  function getTimeLeftInPoll(expiryTime: number | null): string {
    if (expiryTime === null) {
      return "";
    }

    const expiryTimeInDateTime = new Date(expiryTime);
    const now = new Date();
    const difference = expiryTimeInDateTime.getTime() - now.getTime();

    if (difference < 0) {
      return "Poll Ended";
    }

    const differenceInMinutes = Math.floor(difference / (1000 * 60));
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays > 0) {
      return `${differenceInDays}d left`;
    } else if (differenceInHours > 0) {
      return `${differenceInHours}h left`;
    } else if (differenceInMinutes > 0) {
      return `${differenceInMinutes}m left`;
    } else {
      return "Just Now";
    }
  }

  // this function checks if poll is multiple choice or not
  function isMultiChoicePoll(
    pollMultiSelectNo: number,
    pollMultiSelectState: PollMultiSelectState
  ) {
    return !(
      pollMultiSelectState === PollMultiSelectState.EXACTLY &&
      pollMultiSelectNo === 1
    );
  }

  // readonly props consumed by UI component
  const props: LMPostPollViewState = {
    text: item?.title,
    votes: pollVoteCount,
    optionArr: pollsArr,
    pollTypeText: item?.pollTypeText,
    submitTypeText: item?.submitTypeText,
    addOptionInputField: addOptionInputField,
    shouldShowSubmitPollButton: shouldShowSubmitPollButton,
    selectedPolls: selectedPolls,
    showSelected: showSelected,
    allowAddOption: allowAddOption,
    shouldShowVotes: shouldShowVotes,
    hasPollEnded: hasPollEnded,
    expiryTime: item?.expiryTime,
    expiryDays: calculateDaysToExpiry(),
    toShowResults: item?.toShowResults,
    member: item?.member,
    user: member,
    isEdited: item?.isEdited,
    createdAt: item?.createdAt,
    pollAnswerText: item?.pollAnswerText,
    isPollEnded: Date.now() > item?.expiryTime ? false : true,
    multipleSelectNo: item?.multipleSelectNumber,
    multipleSelectState: item?.multipleSelectState,
    showResultsButton: showResultsButton,
    pollType: item?.pollType,
    disabled: item?.disabled ? item?.disabled : false,
    truncatedText: truncatedText,
    maxQuestionLines: MAX_LINES,
    post: post,
  };

  return (
    <View>
      <LMPostPollUI
        onNavigate={onNavigate}
        setSelectedPollOptions={setSelectedPollOptions}
        addPollOption={addPollOption}
        submitPoll={submitPoll}
        setShowSelected={setShowSelected}
        setIsAddPollOptionModalVisible={setIsAddPollOptionModalVisible}
        setAddOptionInputField={setAddOptionInputField}
        stringManipulation={stringManipulation}
        dateManipulation={dateManipulation}
        resetShowResult={resetShowResult}
        onQuestionTextLayout={onTextLayout}
        removePollAttachment={removePollAttachment}
        editPollAttachment={editPollAttachment}
        getTimeLeftInPoll={getTimeLeftInPoll}
        isMultiChoicePoll={isMultiChoicePoll}
        reloadPost={reloadPost}
        setSelectedPolls={setSelectedPolls}
        setShouldShowVotes={setShouldShowVotes}
        {...props}
      />
      <AddOptionsModal
        isAddPollOptionModalVisible={isAddPollOptionModalVisible}
        setIsAddPollOptionModalVisible={setIsAddPollOptionModalVisible}
        addOptionInputField={addOptionInputField}
        setAddOptionInputField={setAddOptionInputField}
        handelAddOptionSubmit={addPollOption}
        pollsArr={pollsArr}
        post={post}
        reloadPost={reloadPost}
      />
      <AnonymousPollModal
        isAnonymousPollModalVisible={isAnonymousPollModalVisible}
        hideAnonymousPollModal={hideAnonymousPollModal}
        title={ANONYMOUS_POLL_TITLE}
        subTitle={ANONYMOUS_POLL_SUB_TITLE}
      />
    </View>
  );
};

export default LMPostPollView;
