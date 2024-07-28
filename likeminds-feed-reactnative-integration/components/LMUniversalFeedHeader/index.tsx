import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import LMHeader from "../LMHeader";
import { useLMFeedStyles } from "../../lmFeedProvider";
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
  const LMFeedContextStyles = useLMFeedStyles();
  const { universalFeedStyle }: any = LMFeedContextStyles;
  const { onTapNotificationBellProp } =
    useUniversalFeedCustomisableMethodsContext();

  return (
    <View
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
                <Text style={{ color: "#fff", fontSize: 12 }}>
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
    </View>
  );
};

export default LMUniversalFeedHeader;
