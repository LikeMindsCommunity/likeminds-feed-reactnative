import React, {useEffect, useState} from 'react';
import {
  UNIVERSAL_FEED,
  POST_DETAIL,
  CREATE_POST,
  POST_LIKES_LIST,
  LMOverlayProvider,
  NOTIFICATION_FEED,
  getNotification,
  getRoute,
} from '@likeminds.community/feed-rn-core';
import {myClient} from '.';
import {ViewStyle} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './RootNavigation';
import FeedWrapper from './feedScreen/feedWrapper';
import DetailWrapper from './feedScreen/detailScreenWrapper';
import CreateWrapper from './feedScreen/createScreenWrapper';
import LikesWrapper from './feedScreen/likesWrapper';
import NotificationWrapper from './feedScreen/notificationWrapper';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';

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
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const val = await getNotification(remoteMessage);
      return remoteMessage;
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      let routes = getRoute(detail?.notification?.data?.route);
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          if (!!navigationRef) {
            navigationRef.navigate(routes.route, routes.params); 
          }
          break;
      }
    });
  });

  return (
    <LMOverlayProvider
      myClient={myClient}
      userName=""
      userUniqueId="">
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
