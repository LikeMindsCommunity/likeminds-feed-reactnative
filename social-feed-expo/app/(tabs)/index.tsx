import React, { useEffect, useState } from 'react';
import { Text, View } from "react-native"
import {
  UNIVERSAL_FEED,
  TOPIC_FEED,
  POST_DETAIL,
  CREATE_POST,
  CAROUSEL_SCREEN,
  POST_LIKES_LIST,
  LMOverlayProvider,
  CarouselScreen,
  LMFeedPollResult,
  initMyClient,
  LMSocialFeedPostDetailScreen,
  LMCreatePollScreen,
  LMLikesScreen,
  LMNotificationScreen,
  LMTopicFeedScreen,
  LMSocialFeedScreen,
  LMUserOnboardingScreen,
  LMSocialFeedSearchScreenWrapper,
  LMQnAFeedCreatePostScreen,
  LMQnaFeedSearchScreenWrapper,
  STYLES
} from '@likeminds.community/feed-rn-core-beta';
import LMSocialFeedCreateScreen from '@likeminds.community/feed-rn-core-beta/wrappers/socialFeedCreateWrapper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationIndependentTree } from "@react-navigation/native"
import { LMCoreCallbacks } from '@likeminds.community/feed-rn-core-beta/setupFeed';
import {
  NOTIFICATION_FEED,
  getNotification,
  getRoute,
  LMFeedCallbacks,
  LMCarouselScreenCallbacks,
  NAVIGATED_FROM_NOTIFICATION,
} from '@likeminds.community/feed-rn-core-beta';
import {
  AppState,
  Button,
  KeyboardAvoidingView,
  Linking,
  PermissionsAndroid,
  Platform,
  ViewStyle,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  CREATE_POLL_SCREEN,
  POLL_RESULT,
  SEARCH_SCREEN,
  USER_ONBOARDING_SCREEN,
} from '@likeminds.community/feed-rn-core-beta/constants/screenNames';
import { LMFeedClient, InitiateUserRequest, RegisterDeviceRequest } from '@likeminds.community/feed-rn';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FeedType } from '@likeminds.community/feed-rn-core-beta';
import Constants from 'expo-constants';
import { token } from '@likeminds.community/feed-rn-core-beta/utils/pushNotifications';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { navigate, navigationRef } from '../../RootNavigation';
import { getDeviceId } from "react-native-device-info"


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

const Stack = createNativeStackNavigator();

export default function SDK() {
  const [myClient, setMyClient] = useState<LMFeedClient>();
  const apiKey = "aca40392-f386-4c58-b9dd-7f59a50de207";
  const userName = "newUSERTEST33";
  const uuid = "newUSERTEST33";
  const onboardUser = false;

  const [FCMToken, setFCMToken] = useState("");


  useEffect(() => {
    async function generateClient() {
      const res: any = initMyClient();
      setMyClient(res);
    }

    generateClient();
  }, []);



  /// Setup notifications
  useEffect(() => {
    token().then((res) => {
      if (!!res) {
        console.log({
          res
        })
        setFCMToken(res);
      }
    });
  }, []);

  useEffect(() => {
    async function pushNotifications() {
      const deviceID = await getDeviceId()
      await myClient?.registerDevice(
        RegisterDeviceRequest.builder()
          .setDeviceId(deviceID)
          .setPlatformCode(
            Platform.OS == "ios" ? "ios" : "an"
          )
          .setToken(FCMToken)
          .build()
      );
    }
    pushNotifications();
  }, [FCMToken, myClient]);

  useEffect(() => {
    async function generateClient() {
      // Initiate LMChatClient as described in step 2
      const res: any = initMyClient();
      setMyClient(res);
    }
    generateClient();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationIndependentTree>
        <NavigationContainer independent={true} ref={navigationRef}>
          {userName && uuid && apiKey && myClient ? (
            <LMOverlayProvider
              myClient={myClient}
              apiKey={apiKey}
              userName={userName}
              userUniqueId={uuid}
              isUserOnboardingRequired={onboardUser}
            >
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name={USER_ONBOARDING_SCREEN}
                  component={LMUserOnboardingScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name={UNIVERSAL_FEED}
                  component={LMSocialFeedScreen}
                  initialParams={{
                    feedType: FeedType.UNIVERSAL_FEED,
                  }}
                />
                <Stack.Screen
                  name={POST_DETAIL}
                  component={LMSocialFeedPostDetailScreen}
                />
                <Stack.Screen
                  name={CREATE_POST}
                  component={LMSocialFeedCreateScreen}
                />
                <Stack.Screen name={POST_LIKES_LIST} component={LMLikesScreen} />
                <Stack.Screen
                  name={TOPIC_FEED}
                  component={LMTopicFeedScreen}
                  options={{ headerShown: true }}
                />
                <Stack.Screen
                  name={NOTIFICATION_FEED}
                  component={LMNotificationScreen}
                />
                <Stack.Screen
                  options={{ gestureEnabled: false }}
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
                  component={LMCreatePollScreen}
                />
                <Stack.Screen
                  name={SEARCH_SCREEN}
                  component={LMSocialFeedSearchScreenWrapper}
                />
              </Stack.Navigator>
            </LMOverlayProvider>
          ) : null}
        </NavigationContainer>
      </NavigationIndependentTree>
    </GestureHandlerRootView>
  );
};
