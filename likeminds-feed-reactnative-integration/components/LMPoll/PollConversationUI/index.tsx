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
import { PollConversationUIProps } from "../models";
import Layout from "../../../constants/Layout";
import STYLES from "../../../constants/Styles";
import LMPostPollText from "../../LMPost/LMPostPollText";
import { decode } from "../../../utils";
import { LMText } from "../../../uiComponents";
import { PollType } from "../../../enums/Poll";

const PollConversationUI = ({
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
}: PollConversationUIProps) => {
  const pollStyles = STYLES.$POLL_STYLES;

  //styling props
  const pollVoteSliderColor = pollStyles?.pollVoteSliderColor;

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
          {truncatedText ? (
            <LMPostPollText truncatedText={truncatedText} fullText={text} />
          ) : (
            <LMText
              maxLines={maxQuestionLines}
              textStyle={[styles.text, styles.blackColor]}
              onTextLayout={(e) => onQuestionTextLayout(e)}
            >
              {text}
            </LMText>
          )}

          {disabled && removePollAttachment ? (
            <View
              style={{
                gap: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={editPollAttachment}>
                <Image
                  style={[styles.editImage, { tintColor: "black" }]}
                  source={require("../../../assets/images/edit_icon3x.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={removePollAttachment}>
                <Image
                  style={styles.editImage}
                  source={require("../../../assets/images/cross_circle_icon3x.png")}
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
                  setSelectedPollOptions(index);
                }}
                style={({ pressed }) =>
                  !disabled
                    ? [
                        isSelected || isPollSentByMe
                          ? styles.pollButton
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
                    ]}
                  >
                    {`${element?.text} \n`}

                    {allowAddOption ? (
                      <Text style={[styles.smallText10, styles.greyColor]}>
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
                              backgroundColor:
                                pollVoteSliderColor?.backgroundColor
                                  ? pollVoteSliderColor?.backgroundColor
                                  : !disabled
                                  ? isPollSentByMe
                                    ? "hsl(240, 64%, 91%)"
                                    : element?.voteCount > 0
                                    ? "hsl(213, 23%, 92%)"
                                    : "white"
                                  : "white",
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

              {!disabled && (
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
                style={({ pressed }) => [
                  styles.greyPollButton,
                  {
                    opacity: pressed
                      ? Layout.normalize(0.5)
                      : Layout.normalize(1),
                    padding: Layout.normalize(12),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    styles.blackColor,
                    styles.textAlignCenter,
                  ]}
                >
                  {ADD_OPTION_TEXT}
                </Text>
              </Pressable>
            </View>
          ) : null}

          {/* Poll answer text */}
          {toShowResults === true ? (
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
                ]}
              >
                {pollAnswerText}
                <Text style={styles.messageCustomTitle}>{` • ${
                  hasPollEnded
                    ? "Poll Ended"
                    : getTimeLeftInPoll(Number(expiryTime))
                } ${
                  isPollEnded &&
                  shouldShowVotes &&
                  pollType === PollType.DEFERRED
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
                    style={styles.mediumText}
                  >{` ${EDIT_POLL_TEXT}
                 `}</Text>
                ) : null}
              </Text>
            </Pressable>
          ) : null}

          {/* Submit vote button */}
          {isPollEnded &&
          isMultiChoicePoll(multipleSelectNo, multipleSelectState) &&
          !shouldShowVotes ? (
            <View style={styles.marginSpace}>
              <TouchableOpacity
                onPress={() => {
                  submitPoll();
                }}
                style={[
                  styles.submitVoteButton,
                  styles.alignRow,
                  !shouldShowSubmitPollButton ? styles.greyBorder : null,
                  !shouldShowSubmitPollButton
                    ? { backgroundColor: styles.whiteColor.color }
                    : null,
                  hue ? { backgroundColor: `hsl(${hue}, 47%, 31%)` } : null,
                ]}
              >
                <Text
                  style={[
                    styles.textAlignCenter,
                    styles.smallTextMedium,
                    { color: "white" },
                    !shouldShowSubmitPollButton ? styles.greyColor : null,
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

export default PollConversationUI;
