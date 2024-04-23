import { Client } from "../../client";
import Layout from "../../constants/Layout";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { styles } from "./styles";
import STYLES from "../../constants/Styles";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
  SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
  SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
} from "../../store/types/types";

const TopicFeed = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  let routes = navigation.getState()?.routes;
  let previousRoute = routes[routes?.length - 2];
  console.log("previousRoute", previousRoute);

  const myClient = Client.myClient;
  const [topics, setTopics] = useState({} as any);
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [searchedTopics, setsearchedTopics] = useState([] as any);
  const [searchPage, setSearchPage] = useState(1);
  const [newTopics, setNewTopics] = useState([] as any);

  const dispatch = useAppDispatch();

  const selectedTopics = useAppSelector(
    (state) => state.feed.selectedTopicsForCreatePostScreen
  );

  useEffect(() => {
    if (selectedTopics?.length > 0) {
      setNewTopics(selectedTopics);
    }
  }, [selectedTopics]);

  const handleUpdateAndNavigateBack = async () => {
    console.log("newTopicsFinale", newTopics);

    if (previousRoute?.name === "UniversalFeed") {
      await dispatch({
        type: SELECTED_TOPICS_FOR_UNIVERSAL_FEED_SCREEN,
        body: { topics: newTopics },
      });
    } else if (previousRoute?.name === "CreatePost") {
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
      headerShadowVisible: false,
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
                  color: STYLES.$COLORS.FONT_PRIMARY,
                  fontSize: STYLES.$FONT_SIZES.LARGE,
                  fontFamily: STYLES.$FONT_TYPES.BOLD,
                }}
              >
                {"Select Topic"}
              </Text>
              <Text
                style={{
                  color: STYLES.$COLORS.MSG,
                  fontSize: STYLES.$FONT_SIZES.SMALL,
                  fontFamily: STYLES.$FONT_TYPES.LIGHT,
                }}
              >
                {`${newTopics?.length} selected`}
              </Text>
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
              // searchPlaceholderText ? searchPlaceholderText : "Search..."
              "Search..."
            }
            placeholderTextColor="#aaa"
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
      isEnabled: true,
      search: search,
      searchType: "name",
      page: 1,
      pageSize: 10,
    } as any);
    const res = apiRes?.data;
    // LMChatAnalytics.track(
    //   Events.VIEW_CHATROOM_PARTICIPANTS,
    //   new Map<string, string>([
    //     [Keys.CHATROOM_ID, chatroomID?.toString()],
    //     [Keys.COMMUNITY_ID, user?.sdkClientInfo?.community],
    //     [Keys.SOURCE, Sources.CHATROOM_OVERFLOW_MENU],
    //   ])
    // );
    setTopics(res?.topics);
    setCount(0);
    if (!!res && res?.topics.length === 10) {
      const apiResponse = await myClient?.getTopics({
        isEnabled: true,
        search: search,
        searchType: "name",
        page: 2,
        pageSize: 10,
      } as any);
      const response = apiResponse?.data;
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
      if (isSearch) {
        fetchTopics();
      }
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
      pageSize: 10,
    };
    const response = await myClient?.getTopics(payload);
    return response?.data;
  }

  const loadData = async (newPage: number) => {
    setIsLoading(true);
    const res = await updateData(newPage);
    if (res) {
      setTopics([...topics, ...res?.topics]);
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!isLoading) {
      const arr = topics;
      if (
        arr?.length % 10 === 0 &&
        arr?.length > 0 &&
        arr?.length === 10 * page
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

  return (
    <View style={styles.page}>
      <FlatList
        data={topics}
        renderItem={({ item }: any) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (!newTopics.includes(item?.Id)) {
                  setNewTopics([...newTopics, item?.Id]);
                } else {
                  const filteredArr = newTopics.filter((val: any) => {
                    return val !== item?.Id;
                  });
                  setNewTopics([...filteredArr]);
                }
              }}
              key={item?.Id}
              style={styles.participants}
            >
              <View style={styles.infoContainer}>
                <Text
                  style={
                    [
                      styles.title,
                      // userNameStyles?.color && {
                      //   color: userNameStyles?.color,
                      // },
                      // userNameStyles?.fontSize && {
                      //   fontSize: userNameStyles?.fontSize,
                      // },
                      // userNameStyles?.fontFamily && {
                      //   fontFamily: userNameStyles?.fontFamily,
                      // },
                    ] as TextStyle
                  }
                  numberOfLines={1}
                >
                  {item?.name}
                  {item?.customTitle ? (
                    <Text
                      style={
                        [
                          styles.messageCustomTitle,
                          // userTitleStyles?.color && {
                          //   color: userTitleStyles?.color,
                          // },
                          // userTitleStyles?.fontSize && {
                          //   fontSize: userTitleStyles?.fontSize,
                          // },
                          // userTitleStyles?.fontFamily && {
                          //   fontFamily: userTitleStyles?.fontFamily,
                          // },
                        ] as TextStyle
                      }
                    >{` • ${item?.customTitle}`}</Text>
                  ) : null}
                </Text>
              </View>
              <View>
                {newTopics.includes(item?.Id) ? (
                  <View style={styles.selected}>
                    <Image
                      source={require("../../assets/images/white_tick3x.png")}
                      style={styles.smallIcon}
                    />
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        }}
        extraData={{
          value: [searchedTopics, topics, newTopics],
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        keyExtractor={(item: any) => item?.Id?.toString()}
      />
      {isSearch && searchedTopics?.length === 0 && (
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
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      ) : null}
      {count > 0 && <LoaderComponent />}
    </View>
  );
};

export { TopicFeed };
