import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import React, { useState } from "react";
import LMHeader from "../LMHeader";
import {
  UniversalFeedContextValues,
  useUniversalFeedContext,
  useUniversalFeedCustomisableMethodsContext,
} from "../../context";
import { LMFeedAnalytics } from "../../analytics/LMFeedAnalytics";
import { Events } from "../../enums/Events";
import { APP_TITLE } from "../../constants/Strings";
import STYLES from "../../constants/Styles";

const LMUniversalFeedHeader = () => {
  const {
    unreadNotificationCount,
    onTapNotificationBell,
  }: UniversalFeedContextValues = useUniversalFeedContext();
  const universalFeedStyle = STYLES.$UNIVERSAL_FEED_STYLE;
  const { onTapNotificationBellProp } =
    useUniversalFeedCustomisableMethodsContext();

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
        }
        {...universalFeedStyle?.screenHeader}
      />
    </SafeAreaView>
  );
};

export default LMUniversalFeedHeader;
