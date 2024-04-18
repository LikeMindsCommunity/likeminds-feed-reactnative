import { Client } from "../../client";
import Layout from "../../constants/Layout";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { styles } from "./styles";
import STYLES from "../../constants/Styles";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

const TopicFeed = () => {
  const myClient = Client.myClient;
  const [topics, setTopics] = useState({} as any);
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);

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

  const renderFooter = () => {
    return isLoading ? (
      <View style={{ paddingVertical: Layout.normalize(20) }}>
        <ActivityIndicator size="large" color={STYLES.$COLORS.SECONDARY} />
      </View>
    ) : null;
  };

  return (
    <View style={styles.page}>
      {/* <Text style={{color:'black',fontSize:24}}>hey there</Text> */}
    </View>
  );
};

export { TopicFeed };
