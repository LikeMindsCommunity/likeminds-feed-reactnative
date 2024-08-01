import messaging from "@react-native-firebase/messaging";

export const fetchFCMToken = async () => {
  const fcmToken = await messaging().getToken();
  return fcmToken;
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

export const token = async () => {
  const isPermissionEnabled = await requestUserPermission();
  if (isPermissionEnabled) {
    let fcmToken = await fetchFCMToken();
    return fcmToken;
  }
};
