import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { CreatePostContextValues, useCreatePostContext, useCreatePostCustomisableMethodsContext } from "../../context";
import {
  ADD_SELECTED_TOPICS,
  SET_DISABLED_TOPICS,
} from "../../store/types/types";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Client } from "../../client";
import STYLES from "../../constants/Styles";
import { styles } from "../../screens/createPost/styles";
import Layout from "../../constants/Layout";
import { LMIcon } from "../../uiComponents";
import pluralizeOrCapitalize from "../../utils/variables";
import { WordAction } from "../../enums/Variables";
import { CommunityConfigs } from "../../communityConfigs";
import { TOPIC_FEED } from "../../constants/screenNames";

const LMCreatePostTopics = () => {
  const dispatch = useAppDispatch();
  const predefinedTopics = useAppSelector(
    (state) => state.createPost.predefinedTopics
  );
  const topicsStyle = STYLES.$TOPICS_STYLE;
  const selectTopicPlaceholder = topicsStyle?.selectTopicPlaceholder;
  const selectedTopicsStyle = topicsStyle?.selectedTopicsStyle;
  const plusIconStyle = topicsStyle?.plusIconStyle;

  let {
    navigation,
    setDisabledTopicsGlobal,
    showTopics,
    mappedTopics,
    setShowTopics,
    setMappedTopics,
    postToEdit,
    anonymousPost,
    handleOnAnonymousPostClicked,
    postDetail,
    setAnonymousPost
  }: CreatePostContextValues = useCreatePostContext();


  const { hideTopicsViewCreate, hideTopicsViewEdit, hintTextForAnonymous, isAnonymousPostAllowed, handleOnAnonymousPostClickedProp } = useCreatePostCustomisableMethodsContext();

  const shouldHideTopicsView = (postToEdit && hideTopicsViewEdit) ? true : (postToEdit == undefined && hideTopicsViewCreate) ? true : false

  const handleAllTopicPress = () => {
    const arrayOfIds = mappedTopics.map((obj) => obj.id);
    dispatch({
      type: ADD_SELECTED_TOPICS,
      body: { topics: arrayOfIds },
    });
    /* @ts-ignore */
    return navigation.navigate(TOPIC_FEED);
  };

  const myClient = Client.myClient;
  const selectedTopics = useAppSelector(
    (state) => state.feed.selectedTopicsForCreatePostScreen
  );
  const topics = useAppSelector((state) => state.feed.topics);
  const topicsSelected = useAppSelector(
    (state) => state.createPost.selectedTopics
  );

  const getTopics = async () => {
    const apiRes = await myClient?.getTopics({
      isEnabled: null,
      search: "",
      searchType: "name",
      page: 1,
      pageSize: 10,
    } as any);
    const topics: any = apiRes?.data?.topics;
    if (topics?.length > 0) {
      setShowTopics(true);
    }
  };

  useEffect(() => {
    getTopics();
  }, [showTopics]);

  const filterEnabledFalse = (topicId) => {
    const topic = topics[topicId];
    return topic && !topic.isEnabled; // Check if isEnabled is false
  };

  useEffect(() => {
    if(postDetail) {
      setAnonymousPost(postDetail.isAnonymous)
    }
  }, [postDetail])

  useEffect(() => {
    // Create a new state array named mappedTopics
    if (topicsSelected.length > 0) {
      const filteredTopicArray = topicsSelected.map((topicId) => ({
        id: topicId,
        name: topics[topicId]?.name || "Unknown", // Use optional chaining and provide a default name if not found
      }));
      const disabledTopics = filteredTopicArray.filter((topic) =>
        filterEnabledFalse(topic.id)
      );
      setDisabledTopicsGlobal(disabledTopics);

      setMappedTopics(filteredTopicArray);
      dispatch({
        type: SET_DISABLED_TOPICS,
        body: { topics: disabledTopics },
      });
    } else {
      const filteredTopicArray = selectedTopics.map((topicId) => ({
        id: topicId,
        name: topics[topicId]?.name || "Unknown", // Use optional chaining and provide a default name if not found
      }));
      const disabledTopics = filteredTopicArray.filter((topic) =>
        filterEnabledFalse(topic.id)
      );
      setDisabledTopicsGlobal(disabledTopics);

      setMappedTopics(filteredTopicArray);
      dispatch({
        type: SET_DISABLED_TOPICS,
        body: { topics: disabledTopics },
      });
    }
  }, [selectedTopics, topicsSelected]);
  return (
    <>
      {isAnonymousPostAllowed && !postToEdit ? <View style={{ marginTop: Layout.normalize(30), marginHorizontal: 15, flexDirection: 'row', flex: 1 }}>
        <CheckBox label={(hintTextForAnonymous as string)?.length > 0 ? hintTextForAnonymous : `Share this as an anonymous ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.post ?? "post",WordAction.allSmallSingular)}`}
          isChecked={anonymousPost}
          onPress={handleOnAnonymousPostClickedProp ? handleOnAnonymousPostClickedProp : handleOnAnonymousPostClicked} />
      </View> : <></>}
      
      {mappedTopics.length > 0 &&
      showTopics && !shouldHideTopicsView &&
      !(predefinedTopics.length > 0) ? (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginLeft: Layout.normalize(10),
            marginTop: Layout.normalize(15),
          }}
        >
          {mappedTopics.map((item, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  paddingVertical: Layout.normalize(4),
                  backgroundColor: `hsla(${STYLES.$HUE}, 75%, 59%, 0.1)`,
                  borderRadius: 5,
                  paddingHorizontal: Layout.normalize(8),
                  margin: Layout.normalize(5),
                }}
              >
                <Text
                  style={{
                    fontSize: Layout.normalize(15),
                    color: STYLES.$COLORS.PRIMARY,
                    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
                    ...(selectedTopicsStyle !== undefined
                      ? selectedTopicsStyle
                      : {}),
                  }}
                >
                  {item?.name}
                </Text>
              </View>
              {index === mappedTopics.length - 1 && (
                <View>
                  <TouchableOpacity
                    onPress={() => handleAllTopicPress()}
                    style={{
                      backgroundColor: `hsla(${STYLES.$HUE}, 75%, 59%, 0.1)`,
                      borderRadius: 5,
                      paddingHorizontal: Layout.normalize(4),
                      paddingVertical: Layout.normalize(2),
                      marginLeft: 5,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/edit_icon3x.png")}
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : showTopics && !shouldHideTopicsView && !(predefinedTopics.length > 0) ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: Layout.normalize(15),
            marginTop: Layout.normalize(15),
          }}
        >
          <TouchableOpacity onPress={() => handleAllTopicPress()}>
            <View
              style={{
                paddingVertical: Layout.normalize(4),
                backgroundColor: `hsla(${STYLES.$HUE}, 75%, 59%, 0.1)`,
                borderRadius: Layout.normalize(5),
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: Layout.normalize(8),
              }}
            >
              <Image
                source={require("../../assets/images/plusAdd_icon3x.png")}
                style={{
                  tintColor: STYLES.$COLORS.PRIMARY,
                  width: Layout.normalize(12),
                  height: Layout.normalize(12),
                  marginRight: Layout.normalize(5), // Add margin to separate Image and Text
                  ...(plusIconStyle !== undefined ? plusIconStyle : {}),
                }}
              />
              <Text
                style={{
                  fontSize: Layout.normalize(15),
                  color: STYLES.$COLORS.PRIMARY,
                  fontFamily: STYLES.$FONT_TYPES.MEDIUM,
                }}
              >
                {selectTopicPlaceholder !== undefined
                  ? selectTopicPlaceholder
                  : "Select Topics"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default LMCreatePostTopics;

function CheckBox({ isChecked, onPress, label }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{
        borderWidth: 1, borderColor: isChecked ? STYLES.$COLORS.PRIMARY : "#D0D5DD",
        height: 18, width: 18, justifyContent: 'center',
        alignItems: 'center', borderRadius: 3,
        backgroundColor: isChecked ? "#D0D5DD" : STYLES.$COLORS.WHITE
      }}>

        {isChecked ? <LMIcon
          assetPath={require("../../assets/images/white_tick3x.png")}
          color={STYLES.$COLORS.PRIMARY}
          height={12}
          width={12}
        /> : <></>}

      </View>
      <Text numberOfLines={2} style={{
        maxWidth: Layout.normalize(320),
        color: STYLES.$IS_DARK_THEME ? STYLES.$COLORS.WHITE_TEXT_COLOR : STYLES.$COLORS.BLACK
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}