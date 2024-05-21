import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import {
  DATE_TEXT,
  EMPTY_OPTIONS_WARNING,
  EXPIRY_TIME_WARNING,
  POLLS_OPTIONS_WARNING,
  QUESTION_WARNING,
  TIME_TEXT,
} from "../constants/Strings";
import { Client } from "../client";
import { useAppDispatch, useAppSelector } from "../store/store";
import { SHOW_TOAST } from "../store/types/loader";
import { CreatePollProps } from "../components/LMPoll/models";
import { formatDate } from "../utils/formatPollDate";
import { SET_POLL } from "../store/types/types";
import { PollMultiSelectState, PollType } from "../enums/Poll";

interface CreatePollContextProps {
  children?: ReactNode;
  navigation: any;
  route: any;
}

type CreatePollContextValues = CreatePollProps;

const CreatePollContext = createContext<CreatePollContextValues | undefined>(
  undefined
);

export const useCreatePollContext = () => {
  const context = useContext(CreatePollContext);
  if (!context) {
    throw new Error(
      "useCreatePollContext must be used within an CreatePollContextProvider"
    );
  }
  return context;
};

export const CreatePollContextProvider = ({
  children,
  navigation,
  route,
}: CreatePollContextProps) => {
  const myClient = Client.myClient;
  const poll = useAppSelector((state) => state.createPost.pollAttachment);
  const isPoll = Object.keys(poll).length > 0;

  console.log("poll ==", poll);
  const [question, setQuestion] = useState<string>(isPoll ? poll?.title : "");
  const [optionsArray, setOptionsArray] = useState<any>(
    isPoll ? poll?.options : []
  );
  const [showAdvancedOption, setShowAdvancedOption] = useState<boolean>(false);
  const [addOptionsEnabled, setAddOptionsEnabled] = useState<boolean>(
    isPoll ? poll?.allowAddOption : false
  );
  const [anonymousPollEnabled, setAnonymousPollEnabled] = useState<boolean>(
    isPoll ? poll?.isAnonymous : false
  );
  const [liveResultsEnabled, setLiveResultsEnabled] = useState<boolean>(
    isPoll ? (poll?.pollType === PollType.DEFERRED ? true : false) : false
  );
  const [userVoteFor, setUserVoteFor] = useState<string>(
    isPoll ? poll?.multipleSelectState : PollMultiSelectState.EXACTLY
  );
  const [voteAllowedPerUser, setVoteAllowedPerUser] = useState<number>(
    isPoll ? poll?.multipleSelectNumber : 1
  );
  const [date, setDate] = useState(isPoll ? new Date(poll?.expiryTime) : "");
  const [mode, setMode] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [time, setTime] = useState(
    isPoll ? new Date(poll?.expiryTime) : new Date()
  );
  const [isActionAlertModalVisible, setIsActionAlertModalVisible] =
    useState(false);
  const [isOptionAlertModalVisible, setIsOptionAlertModalVisible] =
    useState(false);
  const [userVoteForOptionsArrValue, setUserVoteForOptionsArrValue] = useState(
    []
  );
  const PAGE_SIZE = 200;

  const userCanVoteForArr = ["Exactly", "At max", "At least"];

  const dispatch = useAppDispatch();

  // to set initial poll options
  useEffect(() => {
    if (isPoll) {
      const initialOptionArray = poll?.options.map((item) => {
        return { id: Math.random(), text: item?.text };
      });
      setOptionsArray(initialOptionArray);
    } else {
      const id_1 = Math.random();
      const id_2 = Math.random();
      const initialOptionArray = [
        {
          id: id_1,
          text: "",
        },
        {
          id: id_2,
          text: "",
        },
      ];
      setOptionsArray(initialOptionArray);
    }
  }, []);

  // this function handles the input poll options
  function handleInputOptionsChangeFunction(index: any, value: any) {
    const newOptions: any = [...optionsArray];
    newOptions[index].text = value;
    setOptionsArray(newOptions);
  }

  // this fucntion add the new option in poll
  function addNewOption() {
    const newOptionsArr = [...optionsArray];
    const newOption = {
      id: Math.random(),
      text: "",
    };
    newOptionsArr.push(newOption);
    setOptionsArray(newOptionsArr);
  }

  // this function removes option in poll
  function removeAnOption(index: any) {
    const newOptionsArr = [...optionsArray];
    newOptionsArr.splice(index, 1);
    setOptionsArray(newOptionsArr);
  }

  // this function changes mode and set date and time
  const onChange = (event: any, selectedValue: any) => {
    const isIOS = Platform.OS === "ios";
    const newDate = new Date();

    // iOS DateTime Picker logic
    if (isIOS) {
      const currentDate = selectedValue || newDate;
      const selectedTime = selectedValue || newDate;
      setTime(selectedTime);
      setDate(currentDate);
    } else {
      // Android DateTime Picker logic
      setShow(false);
      if (mode == DATE_TEXT) {
        const currentDate = selectedValue || newDate;
        setDate(currentDate);
        setMode(TIME_TEXT);
        setShow(true); // to show the picker again in time mode
      } else {
        const selectedTime = selectedValue || newDate;
        setTime(selectedTime);
        setShow(false);
        setMode(DATE_TEXT);
      }
    }
  };

  // this function changes the mode
  const showDateTimePickerMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  // this function set mode "date"
  const showDatePicker = () => {
    showDateTimePickerMode(DATE_TEXT);
  };

  // this function handles question input in poll
  const handleQuestion = (val: string) => {
    setQuestion(val);
  };

  // this function toggles the advance button to show and hide advance options
  const handleShowAdvanceOption = () => {
    setShowAdvancedOption(!showAdvancedOption);
  };

  // this function handles "allow voters to add more options" toggle button
  const handleAddOptions = (val: boolean) => {
    setAddOptionsEnabled(val);
  };

  // this function handles "Anonymous poll" toggle button
  const handleAnonymousPoll = (val: boolean) => {
    setAnonymousPollEnabled(val);
  };

  // this function handles "Anonymous poll" toggle button
  const handleLiveResults = (val: boolean) => {
    setLiveResultsEnabled(val);
  };

  // this function handles "User can vote for" modal dropdown selection
  const handleUserVoteFor = (val: number) => {
    const PollMultipleSelectStateList = [
      PollMultiSelectState.EXACTLY,
      PollMultiSelectState.AT_MAX,
      PollMultiSelectState.AT_LEAST,
    ];
    setUserVoteFor(PollMultipleSelectStateList[val]);
    hideActionModal();
  };

  // this function handles "Number of votes allowed per user" modal dropdown selection
  const handleVoteAllowedPerUser = (val: number) => {
    setVoteAllowedPerUser(val + 1);
    hideSelectOptionModal();
  };

  // this function handles "Cancel" button flow
  const handleOnCancel = () => {
    navigation.goBack();
  };

  // this function hides "User can vote for" modal
  const hideActionModal = () => {
    setIsActionAlertModalVisible(false);
  };

  // this function hides "Number of votes allowed per user" modal
  const hideSelectOptionModal = () => {
    setIsOptionAlertModalVisible(false);
  };

  // this function sets "User can vote for" modal interated value to the state
  const handleOpenActionModal = () => {
    const valueArr: any = userCanVoteForArr;

    setUserVoteForOptionsArrValue(valueArr);
    setIsActionAlertModalVisible(true);
  };

  // this functioin resets date and time
  const resetDateTimePicker = () => {
    setShow(false);
    setMode("");
    setDate("");
    setTime(new Date());
  };

  // this function sets "Number of votes allowed per user" modal interated value to the state
  const handleOpenOptionModal = () => {
    let quantinyArr: any = [];
    for (let i = 0; i < optionsArray.length; i++) {
      quantinyArr = [
        ...quantinyArr,
        `${i + 1 > 1 ? `${i + 1} options` : `${i + 1} option`}`,
      ];
    }
    setUserVoteForOptionsArrValue(quantinyArr);
    setIsOptionAlertModalVisible(true);
  };

  // this function fetches postPollConversation API
  async function postPoll() {
    const expiryTime = date ? formatDate(date, time) : null;
    try {
      if (question?.trim() === "") {
        dispatch({
          type: SHOW_TOAST,
          body: { isToast: true, message: QUESTION_WARNING },
        });
        return;
      }
      if (!expiryTime) {
        dispatch({
          type: SHOW_TOAST,
          body: { isToast: true, message: EXPIRY_TIME_WARNING },
        });
        return;
      }
      const tempPollOptionsMap: any = {};
      let shouldBreak = false;
      const polls = optionsArray.map((item: any) => {
        if (tempPollOptionsMap[item?.text] !== undefined) {
          dispatch({
            type: SHOW_TOAST,
            body: { isToast: true, message: POLLS_OPTIONS_WARNING },
          });
          shouldBreak = true;
        } else {
          if (item?.text === "") {
            dispatch({
              type: SHOW_TOAST,
              body: { isToast: true, message: EMPTY_OPTIONS_WARNING },
            });
            shouldBreak = true;
          }
          tempPollOptionsMap[item?.text] = true;
          return {
            text: item?.text,
          };
        }
      });
      if (shouldBreak) {
        return;
      }

      const poll: any = {
        id: Date.now().toString(),
        state: 6,
        title: question,
        options: polls,
        pollType: liveResultsEnabled ? PollType.DEFERRED : PollType.INSTANT,
        multipleSelectState: showAdvancedOption ? userVoteFor : null,
        multipleSelectNumber: showAdvancedOption ? voteAllowedPerUser : null,
        isAnonymous: showAdvancedOption ? anonymousPollEnabled : false,
        allowAddOption: showAdvancedOption ? addOptionsEnabled : false,
        expiryTime: Date.parse(time.toString()),
        disabled: true, // to disable buttons on poll preview.
      };

      dispatch({
        type: SET_POLL,
        body: { poll: poll },
      });

      handleOnCancel();
    } catch (error) {
      // process error
    }
  }

  function utcOffset() {
    const date = new Date();
    const offsetMinutes = date.getTimezoneOffset();

    return -offsetMinutes;
  }

  // readonly props consumed by UI component
  const contextValues: CreatePollContextValues = {
    show,
    date,
    mode,
    userCanVoteForArr,
    optionsArray,
    showAdvancedOption,
    formatedDateTime: date ? formatDate(date, time) : "",
    timeZoneOffsetInMinutes: utcOffset(),
    addOptionsEnabled,
    anonymousPollEnabled,
    liveResultsEnabled,
    question,
    isSelectOptionModal: isOptionAlertModalVisible,
    userVoteForOptionsArrValue,
    isActionAlertModalVisible,
    userVoteFor,
    voteAllowedPerUser,

    handleShowAdvanceOption,
    hideActionModal,
    hideSelectOptionModal,
    onChange,
    showDatePicker,
    handleAddOptions,
    handleAnonymousPoll,
    handleLiveResults,
    handleInputOptionsChangeFunction,
    addNewOption,
    removeAnOption,
    postPoll,
    handleQuestion,
    handleOnSelect: handleUserVoteFor,
    handleOnSelectOption: handleVoteAllowedPerUser,
    handleOpenActionModal,
    handleOpenOptionModal,
    resetDateTimePicker,
  };

  return (
    <CreatePollContext.Provider value={contextValues}>
      {children}
    </CreatePollContext.Provider>
  );
};
