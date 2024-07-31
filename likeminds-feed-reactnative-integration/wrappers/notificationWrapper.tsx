import React from "react";
import { NotificationFeedContextProvider } from "../context";
import { LMFeedNotificationFeedScreen } from "../screens/notificationFeed";

const NotificationWrapper = ({ navigation, route }) => {
  return (
    <NotificationFeedContextProvider navigation={navigation} route={route}>
      <LMFeedNotificationFeedScreen />
    </NotificationFeedContextProvider>
  );
};

export default NotificationWrapper;
