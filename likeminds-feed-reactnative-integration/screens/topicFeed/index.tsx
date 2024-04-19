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
import { useAppSelector } from "../../store/store";

const TopicFeed = () => {
  const myClient = Client.myClient;
  const [topics, setTopics] = useState({} as any);
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const user = useAppSelector((state: any) => state.login.member);

  const navigation = useNavigation<StackNavigationProp<any>>();

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
                {"Participants"}
              </Text>
              {/* <Text
                style={{
                  color: STYLES.$COLORS.MSG,
                  fontSize: STYLES.$FONT_SIZES.SMALL,
                  fontFamily: STYLES.$FONT_TYPES.LIGHT,
                }}
              >
                {`${totalChatroomCount} participants`}
              </Text> */}
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

  const fetchParticipants = async () => {
    const apiRes = await myClient?.getTopics({
      isEnabled: false,
      search: search,
      searchType: null,
      page: 1,
      pageSize: 10,
    } as any);
    console.log("apiRes", apiRes);

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
        isEnabled: false,
        search: search,
        searchType: null,
        page: 2,
        pageSize: 10,
      } as any);
      const response = apiResponse?.data;
      setTopics((topics: any) => [...topics, ...response?.topics]);
      setPage(2);
    }
  };

  useLayoutEffect(() => {
    fetchParticipants();
    setInitialHeader();
  }, [navigation]);

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
        fetchParticipants();
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
      isEnabled: false,
      search: search,
      searchType: null,
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
        extraData={{
          value: [user, topics],
        }}
        renderItem={({ item }: any) => {
          return (
            <View key={item?.id} style={styles.participants}>
              <Image
                source={
                  item?.imageUrl
                    ? { uri: item?.imageUrl }
                    : require("../../assets/images/default_pic.png")
                }
                style={styles.avatar}
              />
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
            </View>
          );
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        keyExtractor={(item: any) => item?.id?.toString()}
      />
      {topics?.length === 0 && (
        <View style={[styles.justifyCenter]}>
          <Text style={styles.title}>No search results found</Text>
        </View>
      )}
      {count > 0 && <LoaderComponent />}
    </View>
  );
};

export { TopicFeed };
