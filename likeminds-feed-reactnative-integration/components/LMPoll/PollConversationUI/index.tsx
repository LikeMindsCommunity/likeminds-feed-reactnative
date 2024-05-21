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
  stringManipulation,
  dateManipulation,
  resetShowResult,
  pollType,
  disabled,
  onQuestionTextLayout,
  truncatedText,
  maxQuestionLines,
  removePollAttachment,
  editPollAttachment,
}: PollConversationUIProps) => {
  const pollStyles = STYLES.$POLL_STYLES;

  //styling props
  const pollVoteSliderColor = pollStyles?.pollVoteSliderColor;

  const calculateDaysToExpiry = () => {
    const difference = Number(expiryTime) - Date.now();

    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const millisecondsToDays = difference / millisecondsInADay;

    return Math.ceil(millisecondsToDays)?.toString();
  };

  return (
    <View>
      {/* Poll question */}
      <View>
        {/* <View style={[styles.alignRow, styles.justifySpace]}>
          <View
            style={[
              styles.pollIconParent,
              hue ? { backgroundColor: `hsl(${hue}, 53%, 15%)` } : null,
            ]}
          >
            <Image
              source={require("../../../assets/images/poll_icon3x.png")}
              style={styles.pollIcon}
            />
          </View>
          <View
            style={[
              styles.pollEndedTime,
              hue ? { backgroundColor: `hsl(${hue}, 53%, 15%)` } : null,
            ]}
          >
            <Text style={[styles.smallText, styles.whiteColor]}>
              {hasPollEnded
                ? "Poll Ended"
                : "Poll Ends " + expiryTime + " days"}
            </Text>
          </View>
        </View> */}

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

        {multipleSelectNo > 1 ? (
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
          // const isPollSentByMe =
          //   user?.id === element?.member?.id ? true : false;
          const isPollSentByMe = true;
          return (
            <View key={element?.id} style={styles.gap}>
              <Pressable
                disabled={disabled}
                onPress={() => {
                  setShowSelected(!showSelected);
                  setSelectedPollOptions(index);
                }}
                style={({ pressed }) =>
                  !disabled
                    ? [
                        isSelected || element?.isSelected
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
                    style={[styles.text, styles.blackColor, styles.optionText]}
                  >
                    {element?.text}
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
                                  ? "hsl(240, 64%, 91%)"
                                  : "white",

                              // "hsl(213, 23%, 92%)" light blue color
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
                  {(isPollSentByMe && pollType === 1) ||
                  pollType === 0 ||
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
                          voteCount < 1 ? styles.greyColor : null,
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
                  hasPollEnded ? "Poll Ended" : calculateDaysToExpiry() + " left"
                }`}</Text>
              </Text>
            </Pressable>
          ) : null}

          {/* Submit vote button */}
          {isPollEnded && multipleSelectNo > 1 && !shouldShowVotes ? (
            <View style={styles.marginSpace}>
              <TouchableOpacity
                onPress={() => {
                  submitPoll();
                }}
                style={[
                  styles.submitVoteButton,
                  styles.alignRow,
                  !shouldShowSubmitPollButton ? styles.greyBorder : null,
                  { backgroundColor: styles.whiteColor.color },
                  hue ? { backgroundColor: `hsl(${hue}, 47%, 31%)` } : null,
                ]}
              >
                <Image
                  style={[
                    styles.editIcon,
                    !shouldShowSubmitPollButton
                      ? { tintColor: styles.greyColor.color }
                      : null,
                  ]}
                  source={require("../../../assets/images/submit_click3x.png")}
                />
                <Text
                  style={[
                    styles.textAlignCenter,
                    styles.smallTextMedium,
                    !shouldShowSubmitPollButton ? styles.greyColor : null,
                  ]}
                >
                  {SUBMIT_VOTE_TITLE}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Edit Poll button */}
          {isPollEnded &&
          multipleSelectNo > 1 &&
          shouldShowVotes &&
          pollType === 1 ? (
            <TouchableOpacity
              onPress={() => {
                resetShowResult();
              }}
              style={[
                styles.submitVoteButton,
                styles.alignRow,
                styles.justifyCenter,
                {
                  backgroundColor: styles.whiteColor.color,
                  marginTop: Layout.normalize(10),
                },
                hue ? { backgroundColor: `hsl(${hue}, 47%, 31%)` } : null,
              ]}
            >
              <Image
                style={[styles.editIcon]}
                source={require("../../../assets/images/edit_icon3x.png")}
              />
              <Text style={[styles.textAlignCenter, styles.smallTextMedium]}>
                {EDIT_POLL_TEXT}
              </Text>
            </TouchableOpacity>
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
