import { NAVIGATED_FROM_NOTIFICATION } from "../constants/Strings";
import { CREATE_POST, POST_DETAIL, FEED } from "../constants/screenNames";
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';


export interface RouteParams {
    [key: string]: string;
  }
  export const REGEX_TO_EXTRACT_PATH = /route:\/\/(.*?)\?/;
  export const REGEX_TO_EXTRACT_PARAMS = /[?&]([^=#]+)=([^&#]*)/g;
// to get notification routes
export function getRoute(route: any) {
    if (route === undefined) {
      return {route: FEED, params: {}};
    }
  
    let params = {} as RouteParams,
      match;
  
    const navigationRoute = route?.match(REGEX_TO_EXTRACT_PATH);
    while ((match = REGEX_TO_EXTRACT_PARAMS.exec(route))) {
      params[match[1]] = match[2];
    }
    if (navigationRoute) {
      switch (navigationRoute[1]) {
        case 'post_detail': {
          return {
            route: POST_DETAIL,
            params: [params?.post_id, NAVIGATED_FROM_NOTIFICATION],
          };
        }
        case 'create_post': {
          return {
            route: CREATE_POST,
          };
        }
        default:
          return {
            route: FEED,
            params: { navigationRoute: navigationRoute[1]},
          };
      }
    } else {
        return {
          route: FEED,
          params: { navigationRoute: navigationRoute[1] },
        };
      }
  }
  
  export default async function getNotification(remoteMessage: any) {  
    const channelId = await notifee.createChannel({
      id: 'important',
      name: 'Important Notifications',
      importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
      title: remoteMessage?.data?.title,
      body: remoteMessage?.data?.sub_title,
      data: remoteMessage?.data,
      id: remoteMessage?.messageId,
      android: {
        channelId,
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        timestamp: Date.now(),
        showTimestamp: true,
  
        importance: AndroidImportance.HIGH,
      },
    });
     await getRoute(remoteMessage?.data?.route);
  }