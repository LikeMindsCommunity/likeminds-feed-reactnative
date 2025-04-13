import messaging from "../optionalDependencies/FBMessaging"

export const fetchFCMToken = async () => {
  if (!messaging) return;
  const fcmToken = await messaging()?.getToken();
  return fcmToken;
};

export async function requestUserPermission() {
  if (!messaging) return
  const authStatus = await messaging()?.requestPermission();
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
