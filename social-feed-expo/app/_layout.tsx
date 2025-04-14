import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { PermissionsAndroid, Platform } from 'react-native';
import { getMessaging } from '@react-native-firebase/messaging';
import { getNotification, getRoute } from '@likeminds.community/feed-rn-core-beta';
import { navigationRef } from '@/RootNavigation';
import notifee, {EventType} from '@notifee/react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // if (Platform.OS === 'android') {
  //   PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //   );
  // }

  // // notification listener on foreground state
  // useEffect(() => {
  //   const unsubscribe = getMessaging().onMessage(async remoteMessage => {
  //     const val = await getNotification(remoteMessage);
  //     return remoteMessage;
  //   });

  //   return unsubscribe;
  // }, []);


  // // notification display on foreground state
  // useEffect(() => {
  //   notifee.onForegroundEvent(({ type, detail }) => {
  //     let routes = getRoute(detail?.notification?.data?.route);
  //     switch (type) {
  //       case EventType.DISMISSED:
  //         break;
  //       case EventType.PRESS:
  //         if (!!navigationRef) {
  //           setTimeout(() => {
  //             router?.push('/(tabs)/two')
  //             navigationRef.navigate(routes.route, routes.params);
  //           }, 0)
  //         }
  //         break;
  //     }
  //   });
  // }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
