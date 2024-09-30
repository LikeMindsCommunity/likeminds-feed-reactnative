/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App.tsx';
import {name as appName} from './app.json';
import {getRoute, getNotification} from '@likeminds.community/feed-rn-core';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import * as RootNavigation from './RootNavigation.js';
import {RealmProvider} from '@realm/react';
import {LoginSchemaRO} from './login/loginSchemaRO.ts';

// notification display for background state
notifee.onBackgroundEvent(async ({type, detail}) => {
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

const WrappedApp = () => (
  <RealmProvider schema={[LoginSchemaRO]}>
    <App />
  </RealmProvider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
