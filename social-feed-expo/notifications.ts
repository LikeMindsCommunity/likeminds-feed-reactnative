import notifee, { EventType } from '@notifee/react-native';
import * as RootNavigation from './RootNavigation';
import { getNotification, getRoute } from '@likeminds.community/feed-rn-core-beta';
import messaging from '@react-native-firebase/messaging';

// ✅ Background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 [FCM Background] Message:', remoteMessage);
  // You can trigger a Notifee notification here manually if needed
});

// notifee-handler.js or inside firebase-messaging.js

// notification display for background state
notifee.onBackgroundEvent(async ({ type, detail }) => {
  let routes = getRoute(detail?.notification?.data?.route);

  if (type === EventType.PRESS) {
    if (!!RootNavigation) {
      setTimeout(() => {
        RootNavigation.navigate(routes.route, routes.params);
      }, 3000);
    }
  }
});

// notification listener for background state
messaging().setBackgroundMessageHandler(async remoteMessage => {
  await getNotification(remoteMessage);
  return remoteMessage;
});