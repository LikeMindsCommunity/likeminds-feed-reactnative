import React from "react";

import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Modal, Pressable } from "react-native";
import {
  ADD_NEW_POLL_OPTION,
  NEW_POLL_OPTION_TEXT,
  SUBMIT_TEXT,
} from "../../constants/Strings";
import { styles } from "../../components/LMPoll/styles";
import { useUniversalFeedCustomisableMethodsContext } from "../../context";
import { usePollCustomisableMethodsContext } from "../../context/pollCustomisableCallback";
import STYLES from "../../constants/Styles";

const AddOptionsModal = ({
  isAddPollOptionModalVisible,
  setIsAddPollOptionModalVisible,
  addOptionInputField,
  setAddOptionInputField,
  handelAddOptionSubmit,
  pollsArr,
  post,
  reloadPost,
}: any) => {
  const handleModalClose = () => {
    setIsAddPollOptionModalVisible(false);
    setAddOptionInputField("");
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isAddPollOptionModalVisible}
      onRequestClose={() => {
        handleModalClose();
      }}
    >
      <Pressable style={styles.centeredView} onPress={handleModalClose}>
        <View style={styles.addOptionsModalViewParent}>
          <Pressable onPress={() => {}} style={[styles.modalView]}>
            <View style={styles.alignModalElements}>
              <AddOptionUI
                setIsAddPollOptionModalVisible={setIsAddPollOptionModalVisible}
                addOptionInputField={addOptionInputField}
                setAddOptionInputField={setAddOptionInputField}
                handelAddOptionSubmit={handelAddOptionSubmit}
                handleModalClose={handleModalClose}
                pollsArr={pollsArr}
                post={post}
                reloadPost={reloadPost}
              />
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

{
  /* Add more options in poll modal UI */
}
const AddOptionUI = ({
  hue,
  addOptionInputField,
  setAddOptionInputField,
  setIsAddPollOptionModalVisible,
  handelAddOptionSubmit,
  handleModalClose,
  pollsArr,
  post,
  reloadPost,
}: any) => {
  const { onAddPollOptionsClicked } = usePollCustomisableMethodsContext();
  return (
    <View>
      <View style={styles.padding20}>
        <TouchableOpacity
          onPress={handleModalClose}
          style={[{ alignSelf: "flex-end" }]}
        >
          <Image
            style={[styles.pollIcon, { tintColor: styles.blackColor.color }]}
            source={require("../../assets/images/cross_icon3x.png")}
          />
        </TouchableOpacity>
        <View>
          <Text style={[styles.boldText, styles.blackColor]}>
            {ADD_NEW_POLL_OPTION}
          </Text>
          <Text
            style={[styles.smallText, styles.greyColor, styles.marginSpace]}
          >
            {NEW_POLL_OPTION_TEXT}
          </Text>
        </View>
        <View style={styles.extraMarginSpace}>
          <TextInput
            value={addOptionInputField}
            onChangeText={setAddOptionInputField}
            placeholder={"Type new option"}
            placeholderTextColor={
              STYLES.$IS_DARK_THEME
                ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
            }
            style={styles.textInput}
          />
        </View>
        <View style={styles.extraMarginSpace}>
          <TouchableOpacity
            onPress={() => {
              const payload = {
                addOptionInputField,
                options: pollsArr,
                poll: post,
                setIsAddPollOptionModalVisible,
                setAddOptionInputField,
                reloadPost,
              };
              onAddPollOptionsClicked
                ? onAddPollOptionsClicked(payload)
                : handelAddOptionSubmit(payload);
            }}
            style={[
              styles.submitButton,
              hue ? { backgroundColor: `hsl(${hue}, 47%, 31%)` } : null,
            ]}
          >
            <Text
              style={[
                styles.mediumBoldText,
                styles.whiteColor,
                styles.textAlignCenter,
              ]}
            >
              {SUBMIT_TEXT}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddOptionsModal;
