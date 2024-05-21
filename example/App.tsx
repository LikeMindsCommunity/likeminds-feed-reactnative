import React, {useEffect, useState} from 'react';
import {
  CreatePost,
  PostDetail,
  PostLikesList,
  PostsList,
  UniversalFeed,
  TopicFeed,
  UNIVERSAL_FEED,
  TOPIC_FEED,
  POSTS_LIST,
  POST_DETAIL,
  CREATE_POST,
  POST_LIKES_LIST,
  LMOverlayProvider,
  CreatePollScreen,
  PollResult,
} from '@likeminds.community/feed-rn-core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  NOTIFICATION_FEED,
  getNotification,
  getRoute,
  LMFeedCallbacks,
  NAVIGATED_FROM_NOTIFICATION,
  initMyClient,
} from '@likeminds.community/feed-rn-core';
import {myClient} from '.';
import {
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
  Platform,
  ViewStyle,
} from 'react-native';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './RootNavigation';
import FeedWrapper from './feedScreen/feedWrapper';
import DetailWrapper from './feedScreen/detailScreenWrapper';
import CreateWrapper from './feedScreen/createScreenWrapper';
import LikesWrapper from './feedScreen/likesWrapper';
import TopicFeedWrapper from './feedScreen/topicFeedScreenWrapper';
import NotificationWrapper from './feedScreen/notificationWrapper';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import {Credentials} from './login/credentials';
import {LoginSchemaRO} from './login/loginSchemaRO';
import {useQuery} from '@realm/react';
import FetchKeyInputScreen from './login';
import {
  CREATE_POLL_SCREEN,
  POLL_RESULT,
} from '@likeminds.community/feed-rn-core/constants/screenNames';

class CustomCallbacks implements LMFeedCallbacks {
  onEventTriggered(eventName: string, eventProperties?: Map<string, string>) {
    // Override onEventTriggered with custom logic
  }
}

const lmFeedInterface = new CustomCallbacks();

const App = () => {
  const Stack = createNativeStackNavigator();
  const [users, setUsers] = useState<any>();
  const [apiKey, setApiKey] = useState(
    Credentials?.apiKey?.length > 0 ? Credentials?.apiKey : users?.apiKey,
  );
  const [userUniqueID, setUserUniqueID] = useState(
    Credentials?.userUniqueId?.length > 0
      ? Credentials.userUniqueId
      : users?.userUniqueID,
  );
  const [userName, setUserName] = useState(
    Credentials?.username?.length > 0 ? Credentials?.username : users?.userName,
  );
  const [myClient, setMyClient] = useState();
  const [isTrue, setIsTrue] = useState(true);
  const loginSchemaArray: any = useQuery(LoginSchemaRO);
  const accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidnRtOEhabEtWNldCVm8zTzIzdHZjOEFDOVdDYURyQU1WeDRBbmpQYk84VUQzbVpvQ1J2TnFBUGtFbDNINGN5TDhzM1BKNllXUlRhRGF4RzRoejh1VE13dFExd2VXTFVkN29qMkNoaHhTVEErSDlJM2VmVmVvdUJYUEhZVTk5S0NOKzIvZ1JyZkJpQlM3anJrQWRIVVF1cGdPdmZkdTNrYTdkNHVCWS9RWDMzeVBPbFpKcEhqMGFha0RnajNEcnYrc2FuWFBuaFQ1aU1DUURyR25RRGd1UUZQMWFkRGxNRWFjbURmR2k2TUZhcTBBeGFIMGozNk5zdEhFNWJ6c3NINlVJUUxGaUtJZU44TUg1STUiLCJleHAiOjE3MTYyMDc0Mjl9.2o9EzGOQIe2dIiMf_hJfVSMrffvpAwDkaTMtOgxQ_dM';
  const refreshToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMlpHbFQxS1ROdE1ya1RQV0ovc3JqUVZZbXZJRnFaQ2t2Qi83SG54WXI1SG1aQ2dkdU9mRDJoNER4ZTBlaVJET3dSVE10Y0tJQlkrdzY3amswVlphS2JML1BqWWF5NjJYQ29DSzQxVUs3Z0FtUHdWdVlxK3crRkxNK2Y2UnljMUlpN3dFd0lGQXdiQW1vWmk2dkZ6RzMwMTl3VWFSdXo4RmtrQkFJcUNUYXUyTWRlK1Q1SGtSTzVsOFNSaU9rVFZ3SUFWWWlhaGZKYXlydDh3R0R0cEZmdzgwb2lkaDRjcC9sb3lEY1BERTM0a290QmExUWtaWEpwY2lTTVo4UjNnNXZsK3JVSHpKaUdOcENQdFBkQT09IiwiZXhwIjoxNzE4ODg0OTI5fQ.Ye8kt-he4kfJTQPjjR3b1Q8HKN1qxX1i_obXiUV10fw';

  useEffect(() => {
    const userSchema = async () => {
      const loginSchema = loginSchemaArray[0];
      if (loginSchema) {
        Credentials.setCredentials(
          loginSchema?.userName,
          loginSchema?.userUniqueID,
          loginSchema?.apiKey,
        );
        setUsers(loginSchema);
      }
    };
    userSchema();
  }, [isTrue]);

  useEffect(() => {
    setUserName(
      Credentials?.username?.length > 0
        ? Credentials?.username
        : users?.userName,
    );
    setUserUniqueID(
      Credentials?.userUniqueId?.length > 0
        ? Credentials.userUniqueId
        : users?.userUniqueID,
    );
    setApiKey(
      Credentials?.apiKey?.length > 0 ? Credentials?.apiKey : users?.apiKey,
    );
  }, [users, isTrue]);

  useEffect(() => {
    if (apiKey) {
      const res: any = initMyClient();
      setMyClient(res);
    }
  }, [isTrue, apiKey]);

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

  if (Platform.OS === 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
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
      if (navigationRef) {
        navigationRef.navigate(POST_DETAIL, [
          postId,
          NAVIGATED_FROM_NOTIFICATION,
        ]);
      }
    });
  }, []);

  // deeplink listener for kill state
  useEffect(() => {
    let isMounted = true;

    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (isMounted) {
        if (initialUrl) {
          // Execute the regex pattern on the URL
          const match = initialUrl?.match(regex);
          // Extract the postId from the matched result
          const postId = match ? match[1] : null;
          setTimeout(() => {
            if (navigationRef) {
              navigationRef.navigate(POST_DETAIL, [
                postId,
                NAVIGATED_FROM_NOTIFICATION,
              ]);
            }
          }, 2000);
        }
      }
    };

    getUrlAsync();

    // Cleanup function to unsubscribe when component is unmounted
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {userName && userUniqueID && apiKey && myClient ? (
        <LMOverlayProvider
          myClient={myClient}
          accessToken={accessToken}
          refreshToken={refreshToken}
          lmFeedInterface={lmFeedInterface}>
          <NavigationContainer ref={navigationRef} independent={true}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name={UNIVERSAL_FEED} component={FeedWrapper} />
              <Stack.Screen name={POST_DETAIL} component={DetailWrapper} />
              <Stack.Screen name={CREATE_POST} component={CreateWrapper} />
              <Stack.Screen name={POST_LIKES_LIST} component={LikesWrapper} />
              <Stack.Screen
                name={TOPIC_FEED}
                component={TopicFeedWrapper}
                options={{headerShown: true}}
              />
              <Stack.Screen
                name={NOTIFICATION_FEED}
                component={NotificationWrapper}
              />
              <Stack.Screen name={POLL_RESULT} component={PollResult} />
              <Stack.Screen
                name={CREATE_POLL_SCREEN}
                component={CreatePollScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </LMOverlayProvider>
      ) : !userName && !userUniqueID && !apiKey ? (
        <FetchKeyInputScreen isTrue={isTrue} setIsTrue={setIsTrue} />
      ) : null}
    </>
  );
};

export default App;
