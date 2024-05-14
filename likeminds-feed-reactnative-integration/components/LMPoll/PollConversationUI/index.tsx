import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React from "react";
import { styles } from "../styles";
import {
  ADD_OPTION_TEXT,
  EDIT_POLL_TEXT,
  SUBMIT_VOTE_TITLE,
} from "../../../constants/Strings";
import { PollConversationUIProps } from "../models";
import Layout from "../../../constants/Layout";
import STYLES from "../../../constants/Styles";
import { CallBack } from "../../../callBacks/callBackClass";
// import MessageHeader from "../../MessageHeader";
// import MessageFooter from "../../MessageFooter";
// import { useCustomComponentsContext } from "../../../context/CustomComponentContextProvider";

const PollConversationUI = ({
  text,
  hue,
  onNavigate,
  optionArr,
  submitTypeText,
  pollTypeText,
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
  toShowResults,
  member,
  user,
  isEdited,
  createdAt,
  pollAnswerText,
  isPollEnded,
  isIncluded,
  multipleSelectNo,
  stringManipulation,
  resetShowResult,
  pollType,
}: PollConversationUIProps) => {
  const pollStyles = STYLES.$POLL_STYLES;

  //styling props
  const pollVoteSliderColor = pollStyles?.pollVoteSliderColor;

  // const { customMessageHeader, customMessageFooter } =
  //   useCustomComponentsContext();
  return (
    <View>
      {isIncluded ? (
        <TouchableOpacity
          style={styles.selectedItem}
        />
      ) : null}
      {/* {member?.id == user?.id ? null : customMessageHeader ? (
        customMessageHeader
      ) : (
        <MessageHeader />
      )} */}

      {/* Poll heading */}
      <View style={[styles.alignRow, styles.gap]}>
        <Text style={[styles.smallText, styles.greyColor]}>{pollTypeText}</Text>
        <Text
          style={[styles.smallText, styles.greyColor]}
        >{`• ${submitTypeText}`}</Text>
      </View>

      {/* Poll question */}
      <View style={styles.extraMarginSpace}>
        <View style={[styles.alignRow, styles.justifySpace]}>
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
        </View>

        <Text style={[styles.text, styles.blackColor, styles.marginSpace]}>
          {text}
        </Text>

        {multipleSelectNo > 1 ? (
          <Text
            style={[
              styles.smallText,
              styles.greyColor,
              { marginTop: Layout.normalize(5) },
            ]}
          >
            {stringManipulation()}
          </Text>
        ) : null}
      </View>

      {/* Poll Options*/}
      <View style={[styles.extraMarginSpace, styles.gap10]}>
        {optionArr?.map((element: any, index: any) => {
          const isSelected = selectedPolls.includes(index);
          const voteCount = element?.noVotes;
          const isPollSentByMe =
            user?.id === element?.member?.id ? true : false;
          return (
            <View key={element?.id} style={styles.gap}>
              <Pressable
                onPress={() => {
                  setShowSelected(!showSelected);
                  setSelectedPollOptions(index);
                }}
                style={({ pressed }) => [
                  isSelected || element?.isSelected
                    ? styles.pollButton
                    : styles.greyPollButton,
                  { opacity: pressed ? 0.5 : 1 },
                  hue ? { borderColor: `hsl(${hue}, 47%, 31%)` } : null,
                ]}
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
                                element?.percentage > 98
                                  ? 98
                                  : element?.percentage
                              }%`,
                              backgroundColor:
                                pollVoteSliderColor?.backgroundColor
                                  ? pollVoteSliderColor?.backgroundColor
                                  : "hsl(222, 60%, 85%)",
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
                  >{`${voteCount} ${voteCount > 1 ? "votes" : "vote"}`}</Text>
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Add more options button */}
      {allowAddOption && isPollEnded ? (
        <View style={[styles.extraMarginSpace]}>
          <Pressable
            onPress={() => {
              setIsAddPollOptionModalVisible(true);
            }}
            style={({ pressed }) => [
              styles.pollButton,
              {
                opacity: pressed ? Layout.normalize(0.5) : Layout.normalize(1),
                padding: Layout.normalize(12),
              },
              hue ? { borderColor: `hsl(${hue}, 47%, 31%)` } : null,
            ]}
          >
            <Text
              style={[styles.text, styles.blackColor, styles.textAlignCenter]}
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

      {/* Poll timestamp and show edited text if edited */}
      {/* {customMessageFooter ? customMessageFooter : <MessageFooter />} */}
    </View>
  );
};

export default PollConversationUI;
