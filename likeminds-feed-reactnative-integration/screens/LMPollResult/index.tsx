import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import styles from "./styles";
import STYLES from "../../constants/Styles";
import { NO_RESPONSES, POLL_RESULT_TEXT } from "../../constants/Strings";
import { Client } from "../../client";
import Layout from "../../constants/Layout";
import LMHeader from "../../components/LMHeader";

const PollStack = createMaterialTopTabNavigator();

export const LMFeedPollResult = ({ navigation, route }: any) => {
  const { tabsValueArr = [], pollId, backIconPath } = route.params;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <LMHeader
        showBackArrow={true}
        onBackPress={() => {
          navigation.goBack();
        }}
        heading={POLL_RESULT_TEXT}
      />
      <PollStack.Navigator
        screenOptions={{
          tabBarLabelStyle: styles.font,
          tabBarIndicatorStyle: { backgroundColor: STYLES.$COLORS.PRIMARY },
          tabBarScrollEnabled: tabsValueArr.length < 3 ? false : true,
        }}
      >
        {tabsValueArr?.map((val: any) => {
          return (
            <PollStack.Screen
              name={val?.text}
              children={(props: any) => (
                <TabScreenUI pollID={pollId} votes={val?.Id} {...props} />
              )}
              options={{
                tabBarLabel: ({ focused }) => (
                  <View>
                    <Text
                      style={[
                        styles.font,
                        {
                          color: focused
                            ? STYLES.$COLORS.PRIMARY
                            : STYLES.$COLORS.MSG,
                          textAlign: "center",
                        },
                      ]}
                    >
                      {val?.voteCount}
                    </Text>
                    <Text
                      style={[
                        styles.font,
                        {
                          color: focused
                            ? STYLES.$COLORS.PRIMARY
                            : STYLES.$COLORS.MSG,
                          marginTop: Layout.normalize(5),
                        },
                      ]}
                    >
                      {val?.text}
                    </Text>
                  </View>
                ),
                tabBarStyle: {
                  backgroundColor: STYLES.$IS_DARK_THEME
                    ? STYLES.$BACKGROUND_COLORS.DARK
                    : STYLES.$BACKGROUND_COLORS.LIGHT,
                },
              }}
            />
          );
        })}
      </PollStack.Navigator>
    </SafeAreaView>
  );
};

const TabScreenUI = ({ pollID, votes }: any) => {
  const [users, setUsers] = useState<any>();
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 20;

  useEffect(() => {
    fetchPollUsers(pollID);
  }, []);

  // this handles the pagination of tagging list
  const handleLoadMore = async () => {
    if (users.length >= page * PAGE_SIZE) {
      const res: any = await Client.myClient.getPollVotes({
        pollId: `${pollID}`,
        votes: [votes],
        page: page + 1,
        pageSize: PAGE_SIZE,
      });

      setPage(page + 1);

      if (res?.success) {
        let userList = res?.data?.votes.map(
          (item) => res?.data?.users[item?.users[0]]
        );
        setUsers([...users, ...userList]);
      }
    }
  };

  const fetchPollUsers = async (pollID?: string) => {
    const res: any = await Client.myClient.getPollVotes({
      pollId: `${pollID}`,
      votes: [votes],
      page: page,
      pageSize: PAGE_SIZE,
    });

    if (res?.success && res?.data?.votes.length > 0) {
      let userList = res?.data?.votes[0]?.users?.map(
        (item) => res?.data?.users[item]
      );
      setUsers(userList);
    } else {
      setUsers([]);
    }
  };

  return (
    <View style={styles.page}>
      {!users ? (
        <View style={styles.nothingDM}>
          <View style={[styles.justifyCenter]}>
            <ActivityIndicator size="large" color={STYLES.$COLORS.PRIMARY} />
          </View>
        </View>
      ) : users?.length < 1 ? (
        <View style={styles.nothingDM}>
          <View style={[styles.justifyCenter]}>
            <Image
              style={styles.nothingImg}
              source={require("../../assets/images/nothing3x.png")}
            />
            <Text style={styles.title}>{NO_RESPONSES}</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={users}
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
                <View style={styles.gap}>
                  <View>
                    <Text style={styles.title} numberOfLines={1}>
                      {item?.name}
                      {item?.customTitle ? (
                        <Text
                          style={styles.messageCustomTitle}
                        >{` • ${item?.customTitle}`}</Text>
                      ) : null}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
          keyExtractor={(item: any) => item?.id?.toString()}
        />
      )}
    </View>
  );
};
