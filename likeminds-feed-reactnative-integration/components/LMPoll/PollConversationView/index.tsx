import { View, Text, TextLayoutLine } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ANONYMOUS_POLL_SUB_TITLE,
  ANONYMOUS_POLL_TITLE,
  MAX_DEFAULT_POST_CONTENT_LINES,
  POLL_ENDED_WARNING,
  POLL_MULTIPLE_STATE_EXACTLY,
  POLL_MULTIPLE_STATE_LEAST,
  POLL_MULTIPLE_STATE_MAX,
  POLL_SUBMITTED_SUCCESSFULLY,
} from "../../../constants/Strings";
import PollConversationUI from "../PollConversationUI";
import AnonymousPollModal from "../../../customModals/AnonymousPollModal";
import AddOptionsModal from "../../../customModals/AddOptionModal";
import {
  PollConversationViewProps,
  PollConversationViewState,
} from "../models";
import { Client } from "../../../client";
import STYLES from "../../../constants/Styles";

import { SHOW_TOAST } from "../../../store/types/loader";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { POLL_RESULT } from "../../../constants/screenNames";
import { useNavigation } from "@react-navigation/native";
import { PollMultiSelectState } from "../../../enums/Poll";

const PollConversationView = ({ item }: any) => {
  const myClient = Client.myClient;

  const { navigation }: any = useNavigation();

  const [selectedPolls, setSelectedPolls] = useState<any>([]);
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

  // this function navigates to poll result screen if we click on votes or show alert in case of anonymous poll
  const onNavigate = (val: string) => {
    if (item?.isAnonymous) {
      setIsAnonymousPollModalVisible(true);
    } else {
      navigation.navigate(POLL_RESULT, {
        screen: val,
        tabsValueArr: pollsArr,
        conversationID: item?.id,
      });
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
                msg: `You can select max ${item?.multipleSelectNumber} options. Unselect an option or submit your vote now`,
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
            // show toast
            dispatch({
              type: SHOW_TOAST,
              body: {
                isToast: true,
                msg: `You can select max ${item?.multipleSelectNumber} options. Unselect an option or submit your vote now`,
              },
            });
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
      if (item?.pollType === 1) {
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
    const arr = pollsArr.map((item: any) => {
      return {
        ...item,
        isSelected: false,
        percentage: 0,
        noVotes: 0,
      };
    });
    setPollsArr([...arr]);
    setShowResultsButton(false);
    setShouldShowVotes(false);
    setSelectedPolls([]);
  };

  useEffect(() => {
    setPollsArr(item?.options);
  }, [item?.options]);

  // API to reload the existing poll conversation
  async function reloadConversation() {
    // const payload = {
    //   chatroomId: item?.chatroomId,
    //   conversationId: item?.id,
    // };
    // await myClient?.updatePollVotes(
    //   res?.conversations,
    //   user?.sdkClientInfo?.community
    // );
  }

  // this function call an API which adds a poll option in existing poll
  async function addPollOption() {
    try {
      if (addOptionInputField.length === 0) {
        return;
      }

      setIsAddPollOptionModalVisible(false);
      setAddOptionInputField("");

      // const pollObject = {
      //   text: addOptionInputField,
      // };
      // const addPollCall = await myClient.addPollOption({
      //   conversationId: item?.id,
      //   poll: pollObject,
      // });

      await reloadConversation();
    } catch (error) {
      // process error
    }
  }

  // this function used we interact with poll options
  async function setSelectedPollOptions(pollIndex: any) {
    if (Date.now() > item?.expiryTime) {
      dispatch({
        type: SHOW_TOAST,
        body: { isToast: true, msg: POLL_ENDED_WARNING },
      });
      return;
    }
    const newSelectedPolls = [...selectedPolls];
    const isPollIndexIncluded = newSelectedPolls.includes(pollIndex);

    if (isPollIndexIncluded) {
      // if poll item is already selected
      const isSelected = item?.polls?.some((poll: any) => {
        return poll?.isSelected;
      });
      const selectedIndex = newSelectedPolls.findIndex(
        (index) => index === pollIndex
      );
      newSelectedPolls.splice(selectedIndex, 1);
    } else {
      const isSelected = pollsArr?.some((poll: any) => {
        return poll?.isSelected;
      });

      // Already submitted poll condition
      if (isSelected && item?.pollType === 0) {
        return;
      } else if (item?.pollType === 1 && shouldShowVotes) {
        return;
      }

      // if only one option is allowed
      if (item?.multipleSelectNumber === 1 || !item?.multipleSelectNumber) {
        // can change selected ouptput in deferred poll
        if (item?.pollType === 1) {
          // const pollSubmissionCall = await myClient.submitPoll({
          //   conversationId: item?.id,
          //   polls: [item?.polls[pollIndex]],
          // });
          await reloadConversation();
          dispatch({
            type: SHOW_TOAST,
            body: { isToast: true, msg: POLL_SUBMITTED_SUCCESSFULLY },
          });
        } else {
          // for instant poll selection only for once

          // if not selected
          if (!isSelected) {
            // const pollSubmissionCall = await myClient.submitPoll({
            //   conversationId: item?.id,
            //   polls: [item?.polls[pollIndex]],
            // });
            await reloadConversation();
            dispatch({
              type: SHOW_TOAST,
              body: { isToast: true, msg: POLL_SUBMITTED_SUCCESSFULLY },
            });
          }
        }
        return;
      }

      // multiple options are allowed
      switch (item?.multipleSelectState) {
        case PollMultiSelectState.EXACTLY: {
          if (selectedPolls.length === item?.multipleSelectNumber) {
            return;
          }
          break;
        }
        case PollMultiSelectState.AT_MAX: {
          if (selectedPolls.length == item?.multipleSelectNumber) {
            return;
          }
          break;
        }
      }
      newSelectedPolls.push(pollIndex);
    }
    setSelectedPolls(newSelectedPolls);
  }

  // this function call submit poll button API
  async function submitPoll() {
    if (shouldShowSubmitPollButton) {
      try {
        const polls = selectedPolls?.map((itemIndex: any) => {
          return item?.polls[itemIndex];
        });
        // const pollSubmissionCall = await myClient.submitPoll({
        //   conversationId: item?.id,
        //   polls: polls,
        // });
        await reloadConversation();
        setShouldShowVotes(true);
        setSelectedPolls([]);
        dispatch({
          type: SHOW_TOAST,
          body: { isToast: true, msg: POLL_SUBMITTED_SUCCESSFULLY },
        });
      } catch (error) {
        // process error
      }
    } else {
      const string = stringManipulation(true);
      dispatch({
        type: SHOW_TOAST,
        body: {
          isToast: true,
          msg: string,
        },
      });
    }
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

  // readonly props consumed by UI component
  const props: PollConversationViewState = {
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
  };

  return (
    <View>
      <PollConversationUI
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
        {...props}
      />
      <AddOptionsModal
        isAddPollOptionModalVisible={isAddPollOptionModalVisible}
        setIsAddPollOptionModalVisible={setIsAddPollOptionModalVisible}
        addOptionInputField={addOptionInputField}
        setAddOptionInputField={setAddOptionInputField}
        handelAddOptionSubmit={addPollOption}
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

export default PollConversationView;
