import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import React, { useState } from "react";
import LMHeader from "../LMHeader";
import {
  FeedContextValues,
  useFeedContext,
  useFeedCustomisableMethodsContext,
} from "../../context";
import { LMFeedAnalytics } from "../../analytics/LMFeedAnalytics";
import { Events } from "../../enums/Events";
import { APP_TITLE } from "../../constants/Strings";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";
import { useNavigation } from "@react-navigation/native";
import { USER_ONBOARDING_SCREEN } from "../../constants/screenNames";
import { nameInitials } from "../../utils";
import { LMProfilePicture } from "../../uiComponents";
import { useLMFeed } from "../../lmFeedProvider";

const LMFeedHeader = () => {
  const {
    unreadNotificationCount,
    onTapNotificationBell,
    memberData
  }: FeedContextValues = useFeedContext();
  const {isUserOnboardingRequired} = useLMFeed()
  const navigation = useNavigation();
  const feedStyle = STYLES.$FEED_STYLE;
  const postHeaderStyle = STYLES.$POST_LIST_STYLE.header
  const { onTapNotificationBellProp } =
    useFeedCustomisableMethodsContext();

  return (
    <SafeAreaView
      style={{
        backgroundColor: STYLES.$IS_DARK_THEME
          ? STYLES.$BACKGROUND_COLORS.DARK
          : STYLES.$BACKGROUND_COLORS.LIGHT,
      }}
    >
      {/* header */}
      <LMHeader
        heading={APP_TITLE}
        rightComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                onTapNotificationBellProp
                  ? onTapNotificationBellProp()
                  : onTapNotificationBell();

                LMFeedAnalytics.track(Events.NOTIFICATION_PAGE_OPENED);
              }}
            >
              <Image
                source={require("../../assets/images/notification_bell.png")}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: "contain",
                  tintColor: STYLES.$IS_DARK_THEME
                    ? STYLES.$BACKGROUND_COLORS.LIGHT
                    : STYLES.$BACKGROUND_COLORS.DARK,
                }}
              />
              {unreadNotificationCount > 0 && (
                <View
                  style={{
                    backgroundColor: "#FB1609",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 18,
                    height: 18,
                    position: "absolute",
                    top: -8,
                    right: -5,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontFamily: STYLES.$FONT_TYPES.LIGHT,
                    }}
                  >
                    {unreadNotificationCount < 100
                      ? unreadNotificationCount
                      : `99+`}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
            // @ts-ignore
              onPress={ isUserOnboardingRequired ? () => navigation.navigate(USER_ONBOARDING_SCREEN, {
                action: "EDIT_PROFILE"
              }) : () => {}}
            >
              {(memberData as any)?.imageUrl ? <LMProfilePicture
              size={34}
              imageUrl={(memberData as any)?.imageUrl}
              fallbackText={{}}
              /> :
                <LMProfilePicture
                  {...postHeaderStyle?.profilePicture}
                  fallbackText={{
                    children: nameInitials((memberData as any)?.name),
                    textStyle: postHeaderStyle?.profilePicture?.fallbackTextStyle,
                  }}
                  size={33}
                />
              }
            </TouchableOpacity>
          </View>
        }
        {...feedStyle?.screenHeader}
      />
    </SafeAreaView>
  );
};

export default LMFeedHeader;
