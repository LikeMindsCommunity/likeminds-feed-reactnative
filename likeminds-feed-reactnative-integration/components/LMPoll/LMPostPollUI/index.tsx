import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  TextLayoutLine,
} from "react-native";
import React from "react";
import { styles } from "../styles";
import {
  ADD_OPTION_TEXT,
  EDIT_POLL_TEXT,
  MAX_DEFAULT_POST_CONTENT_LINES,
  SUBMIT_VOTE_TITLE,
} from "../../../constants/Strings";
import { LMPostPollUIProps } from "../models";
import Layout from "../../../constants/Layout";
import STYLES from "../../../constants/Styles";
import LMPostPollText from "../../LMPost/LMPostPollText";
import { decode } from "../../../utils";
import { LMText } from "../../../uiComponents";
import { PollType } from "../../../enums/Poll";
import { useLMFeedStyles } from "../../../lmFeedProvider";
import { useUniversalFeedCustomisableMethodsContext } from "../../../context";
import { usePollCustomisableMethodsContext } from "../../../context/pollCustomisableCallback";

const LMPostPollUI = ({
  text,
  hue,
  onNavigate,
  optionArr,
  selectedPolls,
  shouldShowSubmitPollButton,
  setSelectedPollOptions,
  submitPoll,
  showSelected,
  setShowSelected,
  allowAddOption,
  shouldShowVotes,
  setIsAddPollOptionModalVisible,
  hasPollEnded,
  expiryTime,
  expiryDays,
  toShowResults,
  member,
  user,
  isEdited,
  createdAt,
  pollAnswerText,
  isPollEnded,
  multipleSelectNo,
  multipleSelectState,
  stringManipulation,
  dateManipulation,
  getTimeLeftInPoll,
  resetShowResult,
  pollType,
  disabled,
  onQuestionTextLayout,
  truncatedText,
  maxQuestionLines,
  removePollAttachment,
  editPollAttachment,
  post,
  isMultiChoicePoll,
  reloadPost,
  setSelectedPolls,
  setShouldShowVotes,
}: LMPostPollUIProps) => {
  const {
    onSubmitButtonClicked,
    onPollOptionClicked,
    onPollEditClicked,
    onPollClearClicked,
  } = usePollCustomisableMethodsContext();

  //styling props
  const LMFeedContextStyles = useLMFeedStyles();
  const { pollStyle }: any = LMFeedContextStyles;
  const pollQuestionStyles = pollStyle?.pollQuestionStyles;
  const pollOptionSelectedColor = pollStyle?.pollOptionSelectedColor;
  const pollOptionSelectedTextStyles = pollStyle?.pollOptionSelectedTextStyles;
  const pollOptionOtherColor = pollStyle?.pollOptionOtherColor;
  const pollOptionOtherTextStyles = pollStyle?.pollOptionOtherTextStyles;
  const pollOptionEmptyTextStyles = pollStyle?.pollOptionEmptyTextStyles;
  const pollOptionAddedByTextStyles = pollStyle?.pollOptionAddedByTextStyles;
  const votesCountStyles = pollStyle?.votesCountStyles;
  const memberVotedCountStyles = pollStyle?.memberVotedCountStyles;
  const pollInfoStyles = pollStyle?.pollInfoStyles;
  const submitButtonStyles = pollStyle?.submitButtonStyles;
  const submitButtonTextStyles = pollStyle?.submitButtonTextStyles;
  const allowAddPollOptionButtonStyles =
    pollStyle?.allowAddPollOptionButtonStyles;
  const allowAddPollOptionButtonTextStyles =
    pollStyle?.allowAddPollOptionButtonTextStyles;
  const editPollOptionsStyles = pollStyle?.editPollOptionsStyles;
  const editPollOptionsIcon = pollStyle?.editPollOptionsIcon;
  const clearPollOptionsStyles = pollStyle?.clearPollOptionsStyles;
  const clearPollOptionsIcon = pollStyle?.clearPollOptionsIcon;

  return (
    <View>
      {/* Poll question */}
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            {truncatedText ? (
              <LMPostPollText truncatedText={truncatedText} fullText={text} />
            ) : (
              <LMText
                maxLines={maxQuestionLines}
                /* @ts-ignore */
                textStyle={[styles.text, styles.blackColor, pollQuestionStyles]}
                onTextLayout={(e) => onQuestionTextLayout(e)}
              >
                {text}
              </LMText>
            )}
          </View>

          {disabled && removePollAttachment ? (
            <View
              style={{
                gap: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                /* @ts-ignore */
                style={editPollOptionsStyles ? editPollOptionsStyles : null}
                onPress={
                  onPollEditClicked ? onPollEditClicked : editPollAttachment
                }
              >
                <Image
                  style={[
                    styles.editImage,
                    {
                      tintColor: STYLES.$IS_DARK_THEME
                        ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                        : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
                    },
                  ]}
                  source={
                    editPollOptionsIcon
                      ? editPollOptionsIcon
                      : require("../../../assets/images/edit_icon3x.png")
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                /* @ts-ignore */
                style={clearPollOptionsStyles ? clearPollOptionsStyles : null}
                onPress={
                  onPollClearClicked ? onPollClearClicked : removePollAttachment
                }
              >
                <Image
                  style={[
                    styles.editImage,
                    {
                      height: 15,
                      width: 15,
                      tintColor: STYLES.$IS_DARK_THEME
                        ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                        : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
                    },
                  ]}
                  source={
                    clearPollOptionsIcon
                      ? clearPollOptionsIcon
                      : require("../../../assets/images/cross_icon3x.png")
                  }
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {isMultiChoicePoll(multipleSelectNo, multipleSelectState) ? (
          <Text
            style={[
              styles.mediumText,
              styles.greyColor,
              { marginTop: Layout.normalize(15) },
              /* @ts-ignore */
              pollInfoStyles ? pollInfoStyles : null,
            ]}
          >
            {stringManipulation()}
          </Text>
        ) : null}
      </View>

      {/* Poll Options*/}
      <View style={[styles.marginSpace, styles.gap15]}>
        {optionArr?.map((element: any, index: any) => {
          const isSelected = selectedPolls.includes(index);
          const voteCount = element?.voteCount;
          const isPollSentByMe = element?.isSelected;
          return (
            <View key={element?.Id} style={styles.gap}>
              <Pressable
                disabled={disabled}
                onPress={() => {
                  setShowSelected(!showSelected);
                  const payload = {
                    pollIndex: index,
                    poll: post,
                    selectedPolls,
                    options: optionArr,
                    shouldShowVotes,
                    isMultiChoicePoll,
                    reloadPost,
                    setSelectedPolls,
                  };
                  onPollOptionClicked
                    ? onPollOptionClicked(payload)
                    : setSelectedPollOptions(payload);
                }}
                style={({ pressed }) =>
                  !disabled
                    ? [
                        isSelected || isPollSentByMe
                          ? pollOptionSelectedColor
                            ? {
                                ...styles.pollButton,
                                borderColor: pollOptionSelectedColor,
                              }
                            : styles.pollButton
                          : voteCount > 0
                          ? {
                              ...styles.greyPollButton,
                              borderColor: pollOptionOtherColor,
                            }
                          : styles.greyPollButton,
                        { opacity: pressed ? 0.5 : 1 },
                      ]
                    : styles.greyPollButton
                }
              >
                <View
                  style={[
                    voteCount < 0
                      ? [
                          {
                            width: "100%",
                            backgroundColor: "white",
                          },
                          {
                            padding: 0,
                            margin: 0,
                            borderRadius: Layout.normalize(8),
                            alignItems: "center",
                            justifyContent: "center",
                          },
                        ]
                      : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.mediumText14,
                      styles.blackColor,
                      styles.optionText,
                      allowAddOption ? styles.addedByOptionText : null,
                      /* @ts-ignore */
                      isPollSentByMe
                        ? pollOptionSelectedTextStyles
                          ? pollOptionSelectedTextStyles
                          : null
                        : voteCount > 0
                        ? pollOptionOtherTextStyles
                          ? pollOptionOtherTextStyles
                          : null
                        : pollOptionEmptyTextStyles
                        ? pollOptionEmptyTextStyles
                        : null,
                    ]}
                  >
                    {`${element?.text} \n`}

                    {allowAddOption ? (
                      <Text
                        style={[
                          styles.smallText10,
                          styles.greyColor,
                          /* @ts-ignore */
                          pollOptionAddedByTextStyles
                            ? pollOptionAddedByTextStyles
                            : null,
                        ]}
                      >
                        {`Added by ${
                          post ? post?.users[element?.uuid]?.name : user?.name
                        }`}
                      </Text>
                    ) : null}
                  </Text>

                  {isSelected ? (
                    <View style={styles.selected}>
                      <Image
                        source={require("../../../assets/images/white_tick3x.png")}
                        style={styles.smallIcon}
                      />
                    </View>
                  ) : null}
                  <View
                    style={[
                      voteCount > 0
                        ? [
                            {
                              width: `${
                                element?.percentage > 99
                                  ? 99
                                  : element?.percentage
                              }%`,
                              backgroundColor: !disabled
                                ? isPollSentByMe
                                  ? pollOptionSelectedColor
                                    ? pollOptionSelectedColor
                                    : STYLES.$IS_DARK_THEME
                                    ? `hsl(${STYLES.$HUE}, 64%, 51%)`
                                    : `hsl(${STYLES.$HUE}, 64%, 91%)`
                                  : element?.voteCount > 0
                                  ? pollOptionOtherColor
                                    ? pollOptionOtherColor
                                    : STYLES.$IS_DARK_THEME
                                    ? `hsl(${STYLES.$HUE}, 13%, 44%)`
                                    : `hsl(${STYLES.$HUE}, 23%, 92%)`
                                  : STYLES.$IS_DARK_THEME
                                  ? STYLES.$BACKGROUND_COLORS.DARK
                                  : STYLES.$BACKGROUND_COLORS.LIGHT
                                : STYLES.$IS_DARK_THEME
                                ? STYLES.$BACKGROUND_COLORS.DARK
                                : STYLES.$BACKGROUND_COLORS.LIGHT,
                            },
                            styles.pollButtonBackground,
                            styles.pollButtonPadding,
                          ]
                        : [
                            styles.pollButtonBackground,
                            styles.pollButtonPadding,
                          ],
                    ]}
                  />
                </View>
              </Pressable>

              {!disabled && toShowResults && (
                <>
                  {(isPollSentByMe && pollType === PollType.DEFERRED) ||
                  pollType === PollType.INSTANT ||
                  isPollEnded ? (
                    <Pressable
                      onPress={() => {
                        onNavigate(element?.text);
                      }}
                    >
                      <Text
                        style={[
                          styles.smallText,
                          { marginLeft: Layout.normalize(5) },
                          styles.greyColor,
                          /* @ts-ignore */
                          votesCountStyles ? votesCountStyles : null,
                        ]}
                      >{`${voteCount} ${
                        voteCount > 1 ? "votes" : "vote"
                      }`}</Text>
                    </Pressable>
                  ) : null}
                </>
              )}
            </View>
          );
        })}
      </View>

      {!disabled ? (
        <>
          {/* Add more options button */}
          {allowAddOption && isPollEnded ? (
            <View style={[styles.extraMarginSpace]}>
              <Pressable
                onPress={() => {
                  setIsAddPollOptionModalVisible(true);
                }}
                /* @ts-ignore */
                style={({ pressed }) => [
                  styles.greyPollButton,
                  {
                    opacity: pressed
                      ? Layout.normalize(0.5)
                      : Layout.normalize(1),
                    padding: Layout.normalize(12),
                  },
                  allowAddPollOptionButtonStyles
                    ? allowAddPollOptionButtonStyles
                    : null,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    styles.blackColor,
                    styles.textAlignCenter,
                    /* @ts-ignore */
                    allowAddPollOptionButtonTextStyles
                      ? allowAddPollOptionButtonTextStyles
                      : null,
                  ]}
                >
                  {ADD_OPTION_TEXT}
                </Text>
              </Pressable>
            </View>
          ) : null}

          {/* Poll answer text */}
          <Pressable
            onPress={() => {
              onNavigate("");
            }}
          >
            <Text
              style={[
                styles.mediumText,
                styles.extraMarginSpace,
                hue ? { color: `hsl(${hue}, 53%, 15%)` } : null,
                /* @ts-ignore */
                memberVotedCountStyles ? memberVotedCountStyles : null,
              ]}
            >
              {pollAnswerText}
              <Text
                style={[
                  styles.messageCustomTitle,
                  /* @ts-ignore */
                  memberVotedCountStyles ? memberVotedCountStyles : null,
                ]}
              >{` • ${
                hasPollEnded
                  ? "Poll Ended"
                  : getTimeLeftInPoll(Number(expiryTime))
              } ${
                isPollEnded && shouldShowVotes && pollType === PollType.DEFERRED
                  ? "•"
                  : ""
              }`}</Text>
              {isPollEnded &&
              shouldShowVotes &&
              pollType === PollType.DEFERRED ? (
                <Text
                  onPress={() => {
                    resetShowResult();
                  }}
                  style={[
                    styles.mediumText,
                    /* @ts-ignore */
                    memberVotedCountStyles ? memberVotedCountStyles : null,
                  ]}
                >{` ${EDIT_POLL_TEXT}
                 `}</Text>
              ) : null}
            </Text>
          </Pressable>

          {/* Submit vote button */}
          {isPollEnded &&
          isMultiChoicePoll(multipleSelectNo, multipleSelectState) &&
          !shouldShowVotes ? (
            <View style={styles.marginSpace}>
              <TouchableOpacity
                onPress={() => {
                  const payload = {
                    shouldShowSubmitPollButton,
                    selectedPolls,
                    poll: post,
                    reloadPost,
                    setShouldShowVotes,
                    setSelectedPolls,
                    stringManipulation,
                  };
                  onSubmitButtonClicked
                    ? onSubmitButtonClicked(payload)
                    : submitPoll(payload);
                }}
                style={[
                  styles.submitVoteButton,
                  styles.alignRow,
                  !shouldShowSubmitPollButton ? styles.greyBorder : null,
                  !shouldShowSubmitPollButton
                    ? {
                        backgroundColor: STYLES.$IS_DARK_THEME
                          ? STYLES.$BACKGROUND_COLORS.DARK
                          : STYLES.$BACKGROUND_COLORS.LIGHT,
                      }
                    : null,
                  hue ? { backgroundColor: `hsl(${hue}, 47%, 31%)` } : null,
                  /* @ts-ignore */
                  submitButtonStyles ? submitButtonStyles : null,
                ]}
              >
                <Text
                  style={[
                    styles.textAlignCenter,
                    styles.smallTextMedium,
                    { color: "white" },
                    !shouldShowSubmitPollButton ? styles.greyColor : null,
                    /* @ts-ignore */
                    submitButtonTextStyles ? submitButtonTextStyles : null,
                  ]}
                >
                  {SUBMIT_VOTE_TITLE}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      ) : null}

      {disabled ? (
        <Text
          style={[
            styles.smallText,
            styles.greyColor,
            { marginTop: Layout.normalize(15) },
          ]}
        >
          {`Expires on ${dateManipulation()}`}
        </Text>
      ) : null}
    </View>
  );
};

export default LMPostPollUI;
