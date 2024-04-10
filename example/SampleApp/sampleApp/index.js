/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App.tsx';
import {name as appName} from './app.json';
import {initMyClient, getRoute, getNotification} from '@likeminds.community/feed-rn-core';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from "@notifee/react-native";
import * as RootNavigation from './RootNavigation.js'
notifee.onBackgroundEvent(async ({type, detail}) => {
    console.log('backgroubi3333');
  
    let routes = getRoute(detail?.notification?.data?.route);
  console.log('type',type);
  
    if (type === EventType.PRESS) {
      if (!!RootNavigation) {
        setTimeout(() => {
            console.log('routeee',routes.route, routes.params);
            RootNavigation.navigate(routes.route, routes.params); // e.g. navigate(CHATROOM, {chatroomID: 69285});
        }, 3000);
      }
    }
  });
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    await getNotification(remoteMessage);
    return remoteMessage;
});
const myClient = initMyClient('69edd43f-4a5e-4077-9c50-2b7aa740acce');

AppRegistry.registerComponent(appName, () => App);

export {myClient};
