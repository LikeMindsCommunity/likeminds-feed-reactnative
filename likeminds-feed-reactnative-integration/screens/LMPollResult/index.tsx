import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import styles from "./styles";
import STYLES from "../../constants/Styles";
import { NO_RESPONSES, POLL_RESULT_TEXT } from "../../constants/Strings";
import { Client } from "../../client";
import Layout from "../../constants/Layout";
import { LMHeader } from "../../components";

const PollStack = createMaterialTopTabNavigator();

export const PollResult = ({ navigation, route }: any) => {
  const { tabsValueArr = [], pollId, backIconPath } = route.params;

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
            {backIconPath ? (
              <Image source={backIconPath} style={styles.backOptionalBtn} />
            ) : (
              <Image
                source={require("../../assets/images/backArrow_icon3x.png")}
                style={styles.backBtn}
              />
            )}
          </TouchableOpacity>
          <View style={styles.chatRoomInfo}>
            <Text
              style={{
                color: STYLES.$COLORS.FONT_PRIMARY,
                fontSize: STYLES.$FONT_SIZES.LARGE,
                fontFamily: STYLES.$FONT_TYPES.BOLD,
              }}
            >
              {POLL_RESULT_TEXT}
            </Text>
          </View>
        </View>
      ),
    });
  };

  useEffect(() => {
    setInitialHeader();
  }, []);

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
        {tabsValueArr?.map((val: any, index: any) => {
          return (
            <PollStack.Screen
              //   key={val?.id}
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
              }}
            />
          );
        })}
      </PollStack.Navigator>
    </SafeAreaView>
  );
};

const TabScreenUI = ({ pollID, votes }: any) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchPollUsers(pollID);
  }, []);

  const fetchPollUsers = async (pollID?: string) => {
    const res: any = await Client.myClient.getPollVotes({
      pollId: `${pollID}`,
      votes: [votes],
    });

    if (res?.success) {
      let userList = res?.data?.votes.map(
        (item) => res?.data?.users[item?.users[0]]
      );
      setUsers(userList);
    }
  };

  return (
    <View style={styles.page}>
      {users?.length < 1 ? (
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
          keyExtractor={(item: any) => item?.id?.toString()}
        />
      )}
    </View>
  );
};
