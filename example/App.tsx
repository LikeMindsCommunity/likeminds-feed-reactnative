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
import {ActivityIndicator, Linking, ViewStyle} from 'react-native';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './RootNavigation';
import FeedWrapper from './feedScreen/feedWrapper';
import DetailWrapper from './feedScreen/detailScreenWrapper';
import CreateWrapper from './feedScreen/createScreenWrapper';
import LikesWrapper from './feedScreen/likesWrapper';
import NotificationWrapper from './feedScreen/notificationWrapper';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import { NAVIGATED_FROM_NOTIFICATION } from '@likeminds.community/feed-rn-core/constants/Strings';

const App = () => {
  const Stack = createStackNavigator();
  // custom style of new post button
  const regex = /post_id=([^&]+)/;

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

  // notification listener on foreground state
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const val = await getNotification(remoteMessage);
      return remoteMessage;
    });

    return unsubscribe;
  }, []);

  // notification display on foreground state
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
  // deeplink listener for foreground state
  useEffect(() => {
    Linking.addEventListener('url', ({url}) => {
      const match = url.match(regex);      
      // Extract the postId from the matched result
      const postId = match ? match[1] : null;
      if(navigationRef) {
      navigationRef.navigate(POST_DETAIL, [
        postId,
        NAVIGATED_FROM_NOTIFICATION
      ])
    }
    })
  }, [])

  // deeplink listener for kill state
  useEffect(() => {
    let isMounted = true;

    const getUrlAsync = async () => {
        const initialUrl = await Linking.getInitialURL();
        if (isMounted) {
            // Execute the regex pattern on the URL
            const match = initialUrl.match(regex);
            // Extract the postId from the matched result
            const postId = match ? match[1] : null;
           setTimeout(() =>{
            if(navigationRef) {
              navigationRef.navigate(POST_DETAIL, [
                postId,
                NAVIGATED_FROM_NOTIFICATION
              ])
            }
           },2000)

        }
    };

    getUrlAsync();

    // Cleanup function to unsubscribe when component is unmounted
    return () => {
        isMounted = false; 
    };
}, []);

  return (
    <LMOverlayProvider
      myClient={myClient}
      userName=""
      userUniqueId="">
      <NavigationContainer
         ref={navigationRef} independent={true}>
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
