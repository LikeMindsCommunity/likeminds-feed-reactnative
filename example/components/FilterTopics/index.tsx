import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '@likeminds.community/feed-rn-core/store/store';
import {useUniversalFeedContext} from '@likeminds.community/feed-rn-core';
import {UniversalFeedContextValues} from '@likeminds.community/feed-rn-core/context';
import {Client} from '@likeminds.community/feed-rn-core/client';
import {
  MAPPED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
  SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
  SET_TOPICS,
} from '@likeminds.community/feed-rn-core/store/types/types';
import Layout from '@likeminds.community/feed-rn-core/constants/Layout';
import {styles} from '@likeminds.community/feed-rn-core/screens/universalFeed/styles';

const FilterTopics = () => {
  const dispatch = useAppDispatch();
  const {
    feedData,
    navigation,
    getNotificationsCount,
  }: UniversalFeedContextValues = useUniversalFeedContext();
  const myClient = Client.myClient;
  const [showTopics, setShowTopics] = useState(false);
  const [isAnyMatchFound, setIsAnyMatchFound] = useState(true);

  const selectedTopics = useAppSelector(
    state => state.feed.selectedTopicsForUniversalFeedScreen,
  );
  const topics = useAppSelector(state => state.feed.topics);
  const mappedTopics = useAppSelector(state => state.feed.mappedTopics);

  const getUnreadCount = async () => {
    await getNotificationsCount();
  };

  useEffect(() => {
    // Create a new state array named mappedTopics
    const filteredTopicArray = selectedTopics.map(topicId => ({
      id: topicId,
      name: topics[topicId]?.name || 'Unknown', // Use optional chaining and provide a default name if not found
    }));
    dispatch({
      type: MAPPED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
      body: {topics: filteredTopicArray},
    });
    getUnreadCount();
  }, [selectedTopics, topics]);

  const handleIndividualTopicsPress = async topicId => {
    /* @ts-ignore */
    await dispatch({
      type: SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
      body: {topics: [topicId]},
    });
  };

  const getTopics = async () => {
    const apiRes = await myClient?.getTopics({
      isEnabled: null,
      search: '',
      searchType: 'name',
      page: 1,
      pageSize: 10,
    } as any);
    const topics: any = apiRes?.data?.topics;
    if (topics && topics?.length > 0) {
      setShowTopics(true);
      const topicsObject = {};
      topics.forEach(topic => {
        topicsObject[topic.Id] = {
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
        body: {topics: topicsObject},
      });
    }
  };

  useEffect(() => {
    getTopics();
  }, [showTopics]);

  useEffect(() => {
    let isTopicMatched = false; // Initialize as false

    // Loop through the items
    for (const item of feedData) {
      // Check if the item's topic matches any name in the topics array
      if (
        item?.topics?.some(topicId =>
          mappedTopics.some(topic => topic.id == topicId),
        )
      ) {
        isTopicMatched = true; // Set to true if any match is found
        break; // Exit loop once a match is found
      }
    }

    // If no match is found and topics are present, set the flag to false
    if (!isTopicMatched && mappedTopics?.length > 0) {
      setIsAnyMatchFound(false);
    } else if (mappedTopics?.length === 0) {
      setIsAnyMatchFound(true);
    }
  }, [mappedTopics, feedData]);

  return (
    <View style={{backgroundColor: 'white'}}>
      {/* all topics filter */}
      {Object.keys(topics)?.length > 0 && showTopics ? (
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <ScrollView
            style={{flexGrow: 0, margin: Layout.normalize(10)}}
            horizontal={true}>
            <View style={{flexDirection: 'row'}}>
              <View style={{margin: Layout.normalize(5)}}>
                <TouchableOpacity
                  onPress={async () => {
                    await dispatch({
                      type: SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
                      body: {topics: []},
                    });
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: Layout.normalize(7),
                      borderWidth: 1,
                      borderColor: selectedTopics.length === 0 ? '#5046E5' : 'grey',
                      borderRadius: Layout.normalize(5),
                    }}>
                    <Text
                      style={{
                        fontSize: Layout.normalize(16),
                        color: selectedTopics.length === 0 ? '#5046E5' : 'grey',
                        fontWeight: '400',
                      }}>
                      {'All'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {Object.keys(topics)?.map((item, index) => {
                const isSelected = item === selectedTopics[0] ? true : false;
                return (
                  <View key={index} style={{margin: Layout.normalize(5)}}>
                    <TouchableOpacity
                      onPress={() => handleIndividualTopicsPress(item)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: Layout.normalize(7),
                          borderWidth: 1,
                          borderColor: isSelected ? '#5046E5' : 'grey',
                          borderRadius: Layout.normalize(5),
                        }}>
                        <Text
                          style={{
                            fontSize: Layout.normalize(16),
                            color: isSelected ? '#5046E5' : 'grey',
                            fontWeight: '400',
                          }}>
                          {topics[item]?.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      ) : null}
      {/* posts list section */}
      {!isAnyMatchFound ? (
        <View style={[styles.justifyCenter]}>
          <Text style={styles.title}>No matching post found</Text>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
};

export default FilterTopics;
