import { Client } from "../../client";
import Layout from "../../constants/Layout";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { styles } from "./styles";
import STYLES from "../../constants/Styles";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useUniversalFeedContext } from "../../context/universalFeedContext";
import {
  CLEAR_FEED,
  CLEAR_SELECTED_TOPICS,
  CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
  SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
  SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
  SET_TOPICS,
} from "../../store/types/types";
import { getFeed, getTopicsFeed } from "../../store/actions/feed";
import { GetFeedRequest } from "@likeminds.community/feed-rn";
import { useCreatePostContext } from "../../context";

const TopicFeed = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  let routes = navigation.getState()?.routes;
  let previousRoute = routes[routes?.length - 2];
  const { setFeedPageNumber, setIsPaginationStopped } = useUniversalFeedContext()

  const topicsStyle: any = STYLES.$TOPICS_STYLE;

  const searchTextStyle = topicsStyle?.searchTextStyle;
  const searchTextPlaceholder = topicsStyle?.searchTextPlaceholder;
  const topicListStyle = topicsStyle?.topicListStyle;
  const selectTopicHeaderStyle = topicsStyle?.selectTopicHeader;
  const selectTopicHeaderPlaceholder =
    topicsStyle?.selectTopicHeaderPlaceholder;
  const tickIconStyle = topicsStyle?.tickIconStyle;
  const nextArrowStyle = topicsStyle?.nextArrowStyle;

  const myClient = Client.myClient;
  const [topics, setTopics] = useState({} as any);
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [searchedTopics, setSearchedTopics] = useState([] as any);
  const [searchPage, setSearchPage] = useState(1);
  const [newTopics, setNewTopics] = useState([] as any);
  const [stopPagination, setStopPagination] = useState(false);
  let sortedTopics: any = [];
  let sortedTopicsFromUniversalFeed: any = [];

  const dispatch = useAppDispatch();

  const selectedTopics = useAppSelector(
    (state) => state.feed.selectedTopicsForCreatePostScreen
  );

  const topicsSelected = useAppSelector(
    (state) => state.createPost.selectedTopics
  );
  const allTopics = useAppSelector((state) => state.feed.topics);
  
  const selectedTopicsFromUniversalFeedScreen = useAppSelector(
    (state) => state.feed.selectedTopicsFromUniversalFeedScreen
  );

  const filterEnabledTrue = (topicId) => {
    const topic = allTopics[topicId];
    return topic && topic.isEnabled; // Check if isEnabled is true
  };

  useEffect(() => {
    if (selectedTopics?.length > 0) {
      setNewTopics(selectedTopics);
    }
  }, [selectedTopics]);

  useEffect(() => {
    if (topicsSelected?.length > 0 || previousRoute?.name === "CreatePost") {
      const enabledTopics = topicsSelected.filter((topic) =>
        filterEnabledTrue(topic)
      );
      const filteredTopics = Object.entries(allTopics)
        .filter(
          ([topicId, topic]: any) =>
            !enabledTopics.includes(topicId) && topic.isEnabled
        )
        .map(([topicId]) => topicId);
      let newArr = [...enabledTopics, ...filteredTopics];

      let newTopics = newArr.map((topicId) => {
        const topic = allTopics[topicId];
        return {
          id: topicId,
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
      sortedTopics = newTopics;
      setNewTopics(enabledTopics);
    } else {
      const filteredTopics = Object.entries(allTopics)
        .filter(
          ([topicId, topic]: any) =>
            !selectedTopicsFromUniversalFeedScreen.includes(topicId)
        )
        .map(([topicId]) => topicId);

      let newArr = [
        ...selectedTopicsFromUniversalFeedScreen,
        ...filteredTopics,
      ];

      let newTopics = newArr.map((topicId) => {
        const topic = allTopics[topicId];
        return {
          id: topicId,
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
      sortedTopicsFromUniversalFeed = newTopics;
      setNewTopics(selectedTopicsFromUniversalFeedScreen);
    }
  }, [topicsSelected, selectedTopicsFromUniversalFeedScreen]);

  const handleUpdateAndNavigateBack = async () => {
    if (previousRoute?.name === "UniversalFeed") {
      let body;
      if (newTopics[0] === "0") {
        body = { topics: [] };
      } else {
        body = { topics: newTopics };
      }
      await dispatch({
        type: SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
        body,
      });
      setFeedPageNumber(1);
      setIsPaginationStopped(false);
      setTimeout(async () => await dispatch(
        getTopicsFeed(
          GetFeedRequest.builder()
            .setPage(1)
            .setPageSize(20)
            .setTopicIds(newTopics?.length > 0 && newTopics[0] != "0" ? newTopics : [])
            .build(),
          false
        )
      ),100);
  
    } else if (previousRoute?.name === "CreatePost") {
      // clearing selected topics for create screen to allow deselecting and updating topics
      dispatch({
        type: CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN
      })
      await dispatch({
        type: SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
        body: { topics: newTopics },
      });
    }
    navigation.goBack();
  };

  const setInitialHeader = () => {
    navigation.setOptions({
      title: "",
      headerShadowVisible: true,
      headerLeft: () => (
        <View style={styles.headingContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../../assets/images/backArrow_icon3x.png")}
              style={styles.backBtn}
            />
          </TouchableOpacity>
          {!(Object.keys(topics ? topics : 0).length === 0) ? (
            <View style={styles.chatRoomInfo}>
              <Text
                style={{
                  color: STYLES.$IS_DARK_THEME
                    ? STYLES.$COLORS.FONT_PRIMARY
                    : STYLES.$COLORS.BLACK,
                  fontSize: STYLES.$FONT_SIZES.XXL,
                  fontFamily: STYLES.$FONT_TYPES.BOLD,
                  ...(selectTopicHeaderStyle !== undefined
                    ? selectTopicHeaderStyle
                    : {}),
                }}
              >
                {selectTopicHeaderPlaceholder !== undefined
                  ? selectTopicHeaderPlaceholder
                  : "Select Topic"}
              </Text>
              {newTopics?.length > 0 && newTopics[0] !== "0" && (
                <Text
                  style={{
                    color: STYLES.$COLORS.MSG,
                    fontSize: STYLES.$FONT_SIZES.MEDIUM,
                    fontFamily: STYLES.$FONT_TYPES.LIGHT,
                  }}
                >
                  {`${newTopics?.length} selected`}
                </Text>
              )}
            </View>
          ) : null}
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setIsSearch(true);
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: Layout.normalize(5),
          }}
        >
          <Image
            source={require("../../assets/images/search_icon3x.png")}
            style={styles.search}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: STYLES.$IS_DARK_THEME
          ? STYLES.$BACKGROUND_COLORS.DARK
          : STYLES.$BACKGROUND_COLORS.LIGHT,
      },
    });
  };

  const setSearchHeader = () => {
    navigation.setOptions({
      title: "",
      headerShadowVisible: false,
      headerLeft: () => (
        <View style={styles.headingContainer}>
          <TouchableOpacity
            onPress={() => {
              setSearch("");
              setIsSearch(false);
            }}
          >
            <Image
              source={require("../../assets/images/backArrow_icon3x.png")}
              style={styles.backBtn}
            />
          </TouchableOpacity>
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={[styles.input]}
            autoFocus={true}
            placeholder={
              searchTextPlaceholder !== undefined
                ? searchTextPlaceholder
                : "Search..."
            }
            placeholderTextColor="#aaa"
            {...(searchTextStyle !== undefined ? searchTextStyle : {})}
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {}}
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: Layout.normalize(5),
          }}
        >
          <Image
            source={require("../../assets/images/search_icon3x.png")}
            style={styles.search}
          />
        </TouchableOpacity>
      ),
    });
  };

  const fetchTopics = async () => {
    const apiRes = await myClient?.getTopics({
      isEnabled: previousRoute?.name === "UniversalFeed" ? null : true,
      search: search,
      searchType: "name",
      page: 1,
      pageSize: 10,
    } as any);
    const res = apiRes?.data;
    if (previousRoute?.name === "UniversalFeed") {
      const updatedTopics = search
        ? [...res?.topics]
        : sortedTopicsFromUniversalFeed?.length > 0
        ? [{ id: "0", name: "All Topics" }, ...sortedTopicsFromUniversalFeed]
        : [{ id: "0", name: "All Topics" }, ...res?.topics];
      setTopics(updatedTopics);
    } else {
      if (sortedTopics?.length > 0) {
        setTopics(sortedTopics);
      } else {
        setTopics(res?.topics);
      }
    }
    setCount(0);
    if (isSearch) setSearchedTopics(res?.topics);
    if (!!res && res?.topics.length === 10) {
      const apiResponse = await myClient?.getTopics({
        isEnabled: true,
        search: search,
        searchType: "name",
        page: 2,
        pageSize: 10,
      } as any);
      const response = apiResponse?.data;

      const topicsResponse: any = response?.topics;
      if (topicsResponse && topicsResponse?.length > 0) {
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
          body: { topics: topicsObject},
        });
      }

      setTopics((topics: any) => [...topics, ...response?.topics]);
      setPage(2);
    }
  };

  useLayoutEffect(() => {
    fetchTopics();
    setInitialHeader();
  }, [navigation]);

  useEffect(() => {
    setInitialHeader();
  }, [newTopics]);

  useEffect(() => {
    if (isSearch) {
      setSearchHeader();
    } else {
      setInitialHeader();
    }
  }, [topics]);

  useEffect(() => {
    if (isSearch) {
      setSearchHeader();
    }
  }, [search]);

  useEffect(() => {
    const delay = setTimeout(() => {
      // if (isSearch) {
      fetchTopics();
      // }
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (isSearch) {
      setSearchHeader();
    } else {
      setInitialHeader();
    }
  }, [isSearch]);

  async function updateData(newPage: number) {
    const payload: any = {
      isEnabled: true,
      search: search,
      searchType: "name",
      page: newPage,
      pageSize: 50,
    };
    const response = await myClient?.getTopics(payload);
    return response?.data;
  }

  const loadData = async (newPage: number) => {
    setIsLoading(true);
    const res = await updateData(newPage);
    if (res) {
      const topicsResponse: any = res?.topics;
      if (topicsResponse?.length == 0) {
        setStopPagination(true);
      }
      if (topicsResponse && topicsResponse?.length > 0) {
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
      setTopics([...topics, ...res?.topics]);
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!isLoading) {
      const arr = topics;
      if (
        !stopPagination
      ) {
        const newPage = page + 1;
        loadData(newPage);
        setPage(newPage);
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View style={{ paddingVertical: Layout.normalize(20) }}>
        <ActivityIndicator size="large" color={STYLES.$COLORS.SECONDARY} />
      </View>
    ) : null;
  };

  const LoaderComponent = () => {
    return (
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          opacity: 0.5,
        }}
      >
        <ActivityIndicator size="large" color={STYLES.$COLORS.SECONDARY} />
      </View>
    );
  };

  function getUniqueObjectsById(topics : any[]) {
    if(!Array.isArray(topics)) return []
    const seen = new Set(); // To track unique ids
    return topics.filter(topic => {
      if (!topic?.id || seen.has(topic?.id)) {
        return false; // Ignore if id is missing or already seen
      }
      seen.add(topic?.id); // Add id to the set
      return true; // Keep the object
    });
  }

  return (
    <View style={styles.page}>
      <FlatList
        data={getUniqueObjectsById(topics)}
        renderItem={({ item }: any) => {
          return (
            <>
              <TouchableOpacity
                onPress={() => {
                  if (item?.id === "0") {
                    setNewTopics([item?.id]);
                  } else {
                    if (newTopics.includes("0")) {
                      const filteredArr = newTopics.filter(
                        (val: any) => val !== "0"
                      );
                      setNewTopics([...filteredArr, item?.id]);
                    } else {
                      if (!newTopics.includes(item?.id)) {
                        setNewTopics([...newTopics, item?.id]);
                      } else {
                        const filteredArr = newTopics.filter(
                          (val: any) => val !== item?.id
                        );
                        setNewTopics([...filteredArr]);
                      }
                    }
                  }
                }}
                key={item?.id}
                style={styles.participants}
              >
                <View style={styles.infoContainer}>
                  <Text
                    style={[
                      styles.title,
                      ...(topicListStyle && typeof topicListStyle === "object"
                        ? [topicListStyle]
                        : []),
                    ]}
                    numberOfLines={1}
                  >
                    {item?.name}
                  </Text>
                </View>
                <View>
                  {newTopics.includes(item?.id) ? (
                    <View style={StyleSheet.flatten([
                      styles.selected,
                      topicsStyle?.tickIconContainerStyle
                      ])}>
                      <Image
                        source={require("../../assets/images/white_tick3x.png")}
                        style={[
                          styles.smallIcon,
                          ...(tickIconStyle && typeof tickIconStyle === "object"
                            ? [tickIconStyle]
                            : []),
                        ]}
                      />
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
              {item?.name === "All Topics" && (
                <View style={styles.border}></View>
              )}
            </>
          );
        }}
        extraData={{
          value: [searchedTopics, topics, newTopics],
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        keyExtractor={(item: any) => item?.id?.toString()}
      />
      {isSearch && searchedTopics?.length === 0 && search && (
        <View style={[styles.justifyCenter]}>
          <Text style={styles.title}>No search results found</Text>
        </View>
      )}

      {newTopics.length > 0 ? (
        <TouchableOpacity
          onPress={() => {
            if (newTopics.length > 0) {
              handleUpdateAndNavigateBack();
            }
          }}
          style={styles.sendBtn}
        >
          <Image
            source={require("../../assets/images/send_arrow3x.png")}
            style={[
              styles.sendIcon,
              ...(nextArrowStyle && typeof nextArrowStyle === "object"
                ? [nextArrowStyle]
                : []),
            ]}
          />
        </TouchableOpacity>
      ) : null}
      {count > 0 && <LoaderComponent />}
    </View>
  );
};

export { TopicFeed };
