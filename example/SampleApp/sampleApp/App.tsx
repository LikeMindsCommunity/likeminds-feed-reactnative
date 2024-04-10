import React, { useEffect, useState } from 'react';
import {
  CreatePost,
  PostDetail,
  PostLikesList,
  PostsList,
  UniversalFeed,
  UNIVERSAL_FEED,
  POSTS_LIST,
  POST_DETAIL,
  CREATE_POST,
  POST_LIKES_LIST,
  LMOverlayProvider,
  LMFeedNotificationFeedScreen,
  NOTIFICATION_FEED,
  getNotification,
  getRoute
} from '@likeminds.community/feed-rn-core';
import {myClient} from '.';
import {Alert, Platform, Text, ViewStyle} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './RootNavigation';
import FeedWrapper from './feedScreen/feedWrapper';
import DetailWrapper from './feedScreen/detailScreenWrapper';
import CreateWrapper from './feedScreen/createScreenWrapper';
import LikesWrapper from './feedScreen/likesWrapper';
import NotificationWrapper from './feedScreen/notificationWrapper';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from "@notifee/react-native";
import { validateRegisterDeviceRequest } from './registerDeviceApi';
import { getUniqueId } from 'react-native-device-info';
import { InitiateUserRequest } from '@likeminds.community/feed-js';

const App = () => {
  const Stack = createStackNavigator();
   // custom style of new post button
   const newPostButtonStyle: ViewStyle = {
    backgroundColor: 'red',
    width: '40%',
    padding: '10%',
    borderRadius: 35,
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 10,
    shadowColor: '#000',
  };

  useEffect(() => {    
    // fetchFCMToken()
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('hehe')
        const val = await getNotification(remoteMessage);
        return remoteMessage;
      });
  
      return unsubscribe;
    }, []);
    // messaging().setBackgroundMessageHandler(async remoteMessage => {      
    //   let val = await getNotification(remoteMessage);
    //   return remoteMessage;
    // });


// useEffect(() =>{
//   notifee.onBackgroundEvent(async ({ type, detail }) => {
//     const { notification, pressAction } = detail;
//     console.log(type );
//     if (type === EventType.ACTION_PRESS) {
//       console.log('user pressed notification background/quite mode====>');
//    setTimeout(() => {
//               return
//               // navigationServices.navigate(navigationStrings.ACCOUNT_FINANCE)
//           }, 1200)
//       await notifee.cancelNotification(notification.id);
//     }
//   });
// })
useEffect(() => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    let routes = getRoute(detail?.notification?.data?.route);

    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        if (!!navigationRef) {
          // setTimeout(() => {
            navigationRef.navigate(routes.route, routes.params); // e.g. navigate(CHATROOM, {chatroomID: 69285});
          // }, 1000);
        }
        break;
    }
  });
});
// notifee.onBackgroundEvent(async ({type, detail}) => {
//   console.log('backgroubi3333');

//   let routes = getRoute(detail?.notification?.data?.route);
// console.log('type',type);

//   if (type === EventType.PRESS) {
//     if (!!navigationRef) {
//       // setTimeout(() => {
//         navigationRef.navigate(routes.route, routes.params); // e.g. navigate(CHATROOM, {chatroomID: 69285});
//       // }, 1000);
//     }
//   }
// });


  return (
    <LMOverlayProvider
      myClient={myClient}
      userName="abc"
      userUniqueId="siddharth-1">
      <NavigationContainer ref={navigationRef} independent={true}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={UNIVERSAL_FEED} component={FeedWrapper} />
          <Stack.Screen name={POST_DETAIL} component={DetailWrapper} />
          <Stack.Screen name={CREATE_POST} component={CreateWrapper} />
          <Stack.Screen name={POST_LIKES_LIST} component={LikesWrapper} />
          <Stack.Screen
            name={NOTIFICATION_FEED}
            component={NotificationWrapper}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LMOverlayProvider>
  );

 
};

export default App;
