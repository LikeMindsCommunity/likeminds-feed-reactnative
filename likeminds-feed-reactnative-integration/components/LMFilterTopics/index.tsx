import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Client } from "../../client";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  UniversalFeedContextValues,
  useUniversalFeedContext,
} from "../../context";
import {
  CLEAR_SELECTED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
  MAPPED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
  SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
  SELECTED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
  SET_TOPICS,
} from "../../store/types/types";
import Layout from "../../constants/Layout";
import STYLES from "../../constants/Styles";
import { styles } from "../../screens/universalFeed/styles";
import { TOPIC_FEED } from "../../constants/screenNames";
import { CommunityConfigs } from "../../communityConfigs";
import { WordAction } from "../../enums/Variables";
import pluralizeOrCapitalize from "../../utils/variables";
import { GetFeedRequest } from "@likeminds.community/feed-rn";
import { getTopicsFeed } from "../../store/actions/feed";

const LMFilterTopics = () => {
  const dispatch = useAppDispatch();
  const {
    feedData,
    navigation,
    getNotificationsCount,
    setIsAnyMatchingPost,
    setFeedPageNumber
  }: UniversalFeedContextValues = useUniversalFeedContext();
  const myClient = Client.myClient;
  const [showTopics, setShowTopics] = useState(false);
  const topicsStyle = STYLES.$TOPICS_STYLE;
  const [topicsPage, setTopicsPage] = useState(1);

  const selectedTopics = useAppSelector(
    (state) => state.feed.selectedTopicsForUniversalFeedScreen
  );
  const topics = useAppSelector((state) => state.feed.topics);
  const mappedTopics = useAppSelector((state) => state.feed.mappedTopics);

  const allTopicPlaceholder = topicsStyle?.allTopicPlaceholder;
  const allTopicsStyle = topicsStyle?.allTopic;
  const filteredTopicsStyle = topicsStyle?.filteredTopicsStyle;
  const crossIconStyle = topicsStyle?.crossIconStyle;
  const arrowDownStyle = topicsStyle?.arrowDownStyle;

  const getUnreadCount = async () => {
    await getNotificationsCount();
  };

  useEffect(() => {
    // Create a new state array named mappedTopics
    const filteredTopicArray = selectedTopics.map((topicId) => ({
      id: topicId,
      name: topics[topicId]?.name || "Unknown", // Use optional chaining and provide a default name if not found
    }));
    dispatch({
      type: MAPPED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
      body: { topics: filteredTopicArray },
    });
    getUnreadCount();
  }, [selectedTopics, topics]);

  const handleAllTopicPress = () => {
    dispatch({
      type: CLEAR_SELECTED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
    });
    /* @ts-ignore */
    return navigation.navigate(TOPIC_FEED);
  };

  const handleIndividualTopicsPress = () => {
    const arrayOfIds = mappedTopics.map((obj) => obj.id);
    dispatch({
      type: SELECTED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
      body: { topics: arrayOfIds },
    });
    /* @ts-ignore */
    return navigation.navigate(TOPIC_FEED);
  };

  const removeItem = async (index: any) => {
    const newItems = [...mappedTopics]; // Create a copy of the array
    const filteredTopics = selectedTopics?.filter(topic =>  topic != (newItems[index])?.id);
    newItems.splice(index, 1); // Remove the item at the specified index
    dispatch({
      type: MAPPED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
      body: { topics: newItems },
    }); // Update the state with the new array
    dispatch({
      type: SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
      body: { topics: filteredTopics },
    }); // Update the state with the new array
    setFeedPageNumber(1);
    await callTopicsFeed(filteredTopics)
  };

  const getTopics = async () => {
    const apiRes = await myClient?.getTopics({
      isEnabled: null,
      search: "",
      searchType: "name",
      page: topicsPage,
      pageSize: 10,
    } as any);
    const topicsResponse: any = apiRes?.data?.topics;
    if (topicsResponse && topicsResponse?.length > 0) {
      setShowTopics(true);
      const topicsObject = {};
      topicsResponse.forEach((topic) => {
        topicsObject[topic.id] = {
          allParentIds: topic.allParentIds,
          isEnabled: topic.isEnabled,
          isSearchable: topic.isSearchable,
          level: topic.level,
          name: topic.name,
          numberOfPosts: topic.numberOfPosts,
          parentId: topic.parentId,
          parentName: topic.parentName,
          priority: topic.priority,
          totalChildCount: topic.totalChildCount,
          widgetId: topic.widgetId,
        };
      });
      dispatch({
        type: SET_TOPICS,
        body: { topics: topicsObject },
      });
    }
  };

  const callTopicsFeed = async (topics) => await dispatch(
    getTopicsFeed(
      GetFeedRequest.builder()
        .setPage(1)
        .setPageSize(20)
        .setTopicIds(topics?.length > 0 && topics[0] != "0" ? topics : [])
        .build(),
      false
    )
  );

  useEffect(() => {
    getTopics();
  }, [showTopics, topicsPage]);

  const [isAnyMatchFound, setIsAnyMatchFound] = useState(true);

  useEffect(() => {
    let isTopicMatched = false; // Initialize as false

    // Loop through the items
    for (const item of feedData) {
      // Check if the item's topic matches any name in the topics array
      if (
        item?.topics?.some((topicId) =>
          mappedTopics.some((topic) => topic.id == topicId)
        )
      ) {
        isTopicMatched = true; // Set to true if any match is found
        break; // Exit loop once a match is found
      }
    }

    // If no match is found and topics are present, set the flag to false
    if (!isTopicMatched && mappedTopics?.length > 0) {
      setIsAnyMatchFound(false);
      setIsAnyMatchingPost(false)
    } else if (mappedTopics?.length === 0) {
      setIsAnyMatchFound(true);
      setIsAnyMatchingPost(true);
    }
  }, [mappedTopics, feedData, topics]);


  useEffect(() => {
    let isTopicMissing = false; // Initialize as false

    // Loop through the items
    for (const item of feedData) {
      // Check if the item's topic matches any name in the topics array
      if (
        item?.topics?.some((topicId) => {
          return topics[topicId] == undefined
        })
      ) {
        isTopicMissing = true; // Set to true if any match is found
        break; // Exit loop once a match is found
      }
    }

    if (isTopicMissing) {
      setTopicsPage(previousPage => previousPage + 1);
    }
  }, [topics, feedData]);

  return (
    <View
      style={{
        backgroundColor: STYLES.$IS_DARK_THEME
          ? STYLES.$BACKGROUND_COLORS.DARK
          : STYLES.$BACKGROUND_COLORS.LIGHT,
      }}
    >
      {/* all topics filter */}
      {mappedTopics?.length > 0 && showTopics ? (
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <ScrollView
            style={{ flexGrow: 0, margin: Layout.normalize(10) }}
            horizontal={true}
          >
            <View style={{ flexDirection: "row" }}>
              {mappedTopics?.map((item, index) => (
                <View key={index} style={{ margin: Layout.normalize(5) }}>
                  <TouchableOpacity onPress={handleIndividualTopicsPress}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: Layout.normalize(7),
                        borderWidth: 1,
                        borderColor: STYLES.$COLORS.PRIMARY,
                        borderRadius: Layout.normalize(5),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: Layout.normalize(16),
                          color: STYLES.$COLORS.PRIMARY,
                          marginRight: Layout.normalize(8),
                          fontWeight: "400",
                          fontFamily: STYLES.$FONT_TYPES.MEDIUM,
                          ...(filteredTopicsStyle !== undefined
                            ? filteredTopicsStyle
                            : {}),
                        }}
                      >
                        {item?.name}
                      </Text>
                      <TouchableOpacity onPress={() => removeItem(index)}>
                        {/* Your cross icon component */}
                        <Image
                          source={require("../../assets/images/close_tag3x.png")}
                          style={{
                            tintColor: STYLES.$COLORS.PRIMARY,
                            width: Layout.normalize(15),
                            height: Layout.normalize(15),
                            ...(crossIconStyle !== undefined
                              ? crossIconStyle
                              : {}),
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                dispatch({
                  type: MAPPED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
                  body: { topics: [] },
                });
                dispatch({
                  type: SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
                  body: { topics: [] },
                });
                setFeedPageNumber(1)
                await callTopicsFeed([]);
              }}
            >
              <Text
                style={{
                  color: STYLES.$COLORS.PRIMARY,
                  fontSize: Layout.normalize(17),
                  fontFamily: STYLES.$FONT_TYPES.MEDIUM,
                }}
              >
                Clear
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        showTopics && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: STYLES.$IS_DARK_THEME ? STYLES.$SEPARATOR_COLORS.DARK : STYLES.$SEPARATOR_COLORS.LIGHT,
              borderTopWidth: 1,
              borderTopColor: STYLES.$IS_DARK_THEME ? STYLES.$SEPARATOR_COLORS.DARK : STYLES.$SEPARATOR_COLORS.LIGHT,
              paddingVertical: Layout.normalize(10),
              backgroundColor: STYLES.$IS_DARK_THEME
                ? STYLES.$BACKGROUND_COLORS.DARK
                : STYLES.$BACKGROUND_COLORS.LIGHT,
            }}
          >
            <TouchableOpacity onPress={() => handleAllTopicPress()}>
              <View
                style={{
                  marginTop: Layout.normalize(10),
                  marginLeft: Layout.normalize(20),
                  borderRadius: Layout.normalize(5),
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: Layout.normalize(10),
                }}
              >
                <Text
                  style={{
                    fontSize: Layout.normalize(16),
                    marginRight: Layout.normalize(5),
                    fontWeight: "400",
                    color: STYLES.$IS_DARK_THEME
                      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
                    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
                    ...(allTopicsStyle !== undefined ? allTopicsStyle : {}),
                  }}
                >
                  {allTopicPlaceholder !== undefined
                    ? allTopicPlaceholder
                    : "All Topics"}
                </Text>
                <Image
                  source={require("../../assets/images/arrow_down3x.png")}
                  style={{
                    tintColor: "#666666",
                    width: Layout.normalize(15),
                    height: Layout.normalize(15),
                    ...(arrowDownStyle !== undefined ? arrowDownStyle : {}),
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        )
      )}
      {/* posts list section */}
      {!isAnyMatchFound ? (
        <View style={[styles.justifyCenter]}>
          <Text style={styles.title}>No matching {pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.post ?? "post",WordAction.allSmallSingular)} found</Text>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default LMFilterTopics;
