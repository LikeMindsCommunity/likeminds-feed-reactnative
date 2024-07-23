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
  CAROUSEL_SCREEN,
  POST_LIKES_LIST,
  LMOverlayProvider,
  CarouselScreen,
  LMFeedCreatePollScreen,
  LMFeedPollResult,
} from '@likeminds.community/feed-rn-core';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LMCoreCallbacks} from '@likeminds.community/feed-rn-core/setupFeed';
import {
  NOTIFICATION_FEED,
  getNotification,
  getRoute,
  LMFeedCallbacks,
  LMCarouselScreenCallbacks,
  NAVIGATED_FROM_NOTIFICATION,
  initMyClient,
} from '@likeminds.community/feed-rn-core';
import {myClient} from '.';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  PermissionsAndroid,
  Platform,
  ViewStyle,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
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
import {useQuery} from '@realm/react';
import FetchKeyInputScreen from './login';
import {
  CREATE_POLL_SCREEN,
  POLL_RESULT,
} from '@likeminds.community/feed-rn-core/constants/screenNames';
import {initiateAPI} from './registerDeviceApi';
import {carouselScreenStyle, createPollStyle, pollStyle} from './styles';
import CreatePollScreenWrapper from './feedScreen/createPollScreenWrapper';
import {LMFeedClient, InitiateUserRequest} from '@likeminds.community/feed-rn';
import {LoginSchemaRO} from './login/loginSchemaRO';

class CustomCallbacks implements LMFeedCallbacks, LMCarouselScreenCallbacks {
  onEventTriggered(eventName: string, eventProperties?: Map<string, string>) {
    // Override onEventTriggered with custom logic
  }
  onBackPressOnCarouselScreen() {
    // Override onBackPressOnCarouselScreen with custom logic
    navigationRef.goBack();
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
  const [myClient, setMyClient] = useState<LMFeedClient>();
  const [isTrue, setIsTrue] = useState(true);

  const loginSchemaArray: any = useQuery(LoginSchemaRO);

  useEffect(() => {
    async function generateClient() {
      const res: any = initMyClient();
      setMyClient(res);
    }

    generateClient();
  }, []);

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

  const callbackClass = new LMCoreCallbacks(
    (a: string, b: string) => {
      // when accessToken is expired then flow comes here
      console.log(`Testing ${a} and ${b}`);
    },
    async function () {
      // here client should call the initiateApi and return accessToken and refreshToken
      console.log('onRefreshTokenExpired called');
      const initiateUserRequest = InitiateUserRequest.builder()
        .setUserName(userName)
        .setApiKey(apiKey)
        .setUUID(userUniqueID)
        .build();
      const initiateUserResponse = await myClient.initiateUser(
        initiateUserRequest,
      );
      const accessToken = initiateUserResponse?.accessToken;
      const refreshToken = initiateUserResponse?.refreshToken;
      return {
        accessToken,
        refreshToken,
      };
    },
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      {userName && userUniqueID && apiKey && myClient ? (
        <LMOverlayProvider
          myClient={myClient}
          apiKey={apiKey}
          userName={userName}
          userUniqueId={userUniqueID}
          lmFeedInterface={lmFeedInterface}
          callbackClass={callbackClass}>
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
              <Stack.Screen
                options={{gestureEnabled: false}}
                name={CAROUSEL_SCREEN}
                component={CarouselScreen}
              />
              <Stack.Screen
                name={POLL_RESULT}
                component={LMFeedPollResult}
                options={{
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name={CREATE_POLL_SCREEN}
                component={CreatePollScreenWrapper}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </LMOverlayProvider>
      ) : !userName && !userUniqueID && !apiKey ? (
        <FetchKeyInputScreen isTrue={isTrue} setIsTrue={setIsTrue} />
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default App;
