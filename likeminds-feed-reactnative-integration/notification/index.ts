import { NAVIGATED_FROM_NOTIFICATION } from "../constants/Strings";
import { CREATE_POST, POST_DETAIL, UNIVERSAL_FEED } from "../constants/screenNames";
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';


export interface RouteParams {
    [key: string]: string;
  }
  export const REGEX_TO_EXTRACT_PATH = /route:\/\/(.*?)\?/;
  export const REGEX_TO_EXTRACT_PARAMS = /[?&]([^=#]+)=([^&#]*)/g;
// to get notification routes
export function getRoute(route: any) {
    if (route === undefined) {
      return {route: UNIVERSAL_FEED, params: {}};
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
            route: UNIVERSAL_FEED,
            params: { navigationRoute: navigationRoute[1]},
          };
      }
    } else {
        return {
          route: UNIVERSAL_FEED,
          params: { navigationRoute: navigationRoute[1] },
        };
      }
  }
  
  export default async function getNotification(remoteMessage: any) {
    console.log('remoteMessage', JSON.stringify(remoteMessage));
  
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
        timestamp: Date.now(), // 8 minutes ago
        showTimestamp: true,
  
        importance: AndroidImportance.HIGH,
      },
    });
    // const users = await Client.myClient?.getUserSchema();
    // Credentials.setCredentials(users?.userName, users?.userUniqueID);
    // const isIOS = Platform.OS === "ios" ? true : false;
    // // const message = isIOS
    // //   ? generateGifString(remoteMessage?.notification?.body)
    // //   : generateGifString(remoteMessage?.data?.sub_title);
    // const channelId = await notifee.createChannel({
    //   id: "important",
    //   name: "Important Notifications",
    //   importance: AndroidImportance.HIGH,
    // });
  
    // let decodedAndroidMsg;
    // let decodedIOSMsg;
    // if (isIOS) {
    //   decodedIOSMsg = decodeForNotifications(message);
    // } else {
    //   decodedAndroidMsg = decodeForNotifications(message);
    // }
  
    // if (!remoteMessage?.data?.route) {
    //   return;
    // }
  
    const route = await getRoute(remoteMessage?.data?.route);
    console.log('aaaroute',route)
    // const navigationRoute = route?.params?.navigationRoute;
  
    // if (navigationRoute === "collabcard" && navigationRoute) {
    //   const UUID =
    //     Credentials.userUniqueId.length > 0
    //       ? Credentials.userUniqueId
    //       : users?.userUniqueID;
    //   const userName =
    //     Credentials.username.length > 0 ? Credentials.username : users?.username;
  
    //   const payload = {
    //     uuid: UUID, // uuid
    //     userName: userName, // user name
    //     isGuest: false,
    //   };
  
    //   if (isIOS) {
    //     await notifee.displayNotification({
    //       title: remoteMessage?.data?.title,
    //       body: isIOS ? decodedIOSMsg : decodedAndroidMsg,
    //       data: remoteMessage?.data,
    //       id: remoteMessage?.messageId,
    //       android: {
    //         channelId,
    //         // pressAction is needed if you want the notification to open the app when pressed
    //         pressAction: {
    //           id: "default",
    //           launchActivity: "default",
    //         },
    //         importance: AndroidImportance.HIGH,
    //       },
    //     });
    //   } else {
    //     const res = await Client.myClient.initiateUser(payload);
    //     if (res?.success === true) {
    //       const response =
    //         await Client.myClient?.getUnreadConversationNotification();
    //       if (response?.success === false) {
    //         await notifee.displayNotification({
    //           title: remoteMessage?.data?.title,
    //           body: decodedAndroidMsg,
    //           data: remoteMessage?.data,
    //           id: remoteMessage?.messageId,
    //           android: {
    //             channelId,
    //             // pressAction is needed if you want the notification to open the app when pressed
    //             pressAction: {
    //               id: "default",
    //               launchActivity: "default",
    //             },
    //             importance: AndroidImportance.HIGH,
    //           },
    //         });
    //       } else {
    // const unreadConversation = response?.data?.unreadConversation;
    // const sortedUnreadConversation = unreadConversation?.sort(
    //   (a: ChatroomData, b: ChatroomData) => {
    //     return (
    //       b?.chatroomLastConversationTimestamp -
    //       a?.chatroomLastConversationTimestamp
    //     );
    //   }
    // );
    // let totalCount = 0;
    // for (const obj of sortedUnreadConversation) {
    //   if (obj.hasOwnProperty("chatroomUnreadConversationCount")) {
    //     totalCount += obj.chatroomUnreadConversationCount;
    //   }
    // }
  
    // Create summary
    // notifee.displayNotification({
    //   title: navigationRoute,
    //   subtitle: `${totalCount} messages from ${sortedUnreadConversation?.length} chatrooms`,
    //   android: {
    //     channelId,
    //     groupSummary: true,
    //     groupId: navigationRoute?.toString(16),
    //     groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
    //     pressAction: {
    //       id: "default",
    //       launchActivity: "default",
    //       launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
    //     },
    //   },
    //   id: "group",
    // });
  
    // // Children
    // for (let i = 0; i < sortedUnreadConversation.length; i++) {
    //   const convertedGifString = generateGifString(
    //     sortedUnreadConversation[i]?.chatroomLastConversation
    //   );
  
    //   const decodedMessage = convertedGifString
    //     ? decodeForNotifications(convertedGifString)
    //     : "";
  
    //   const message = getNotificationsMessage(
    //     sortedUnreadConversation[i]?.attachments,
    //     decodedMessage
    //   );
  
    //   notifee.displayNotification({
    //     title: sortedUnreadConversation[i]?.chatroomName,
    //     body: `<b>${sortedUnreadConversation[i]?.chatroomLastConversationUserName}</b>: ${message}`,
    //     android: {
    //       channelId,
    //       groupId: navigationRoute?.toString(16),
    //       groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
    //       timestamp:
    //         sortedUnreadConversation[i]
    //           ?.chatroomLastConversationTimestamp * 1000 ?? Date.now(),
    //       showTimestamp: true,
    //       sortKey: i?.toString(),
    //       pressAction: {
    //         id: "default",
    //         launchActivity: "default",
    //         launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
    //       },
    //     },
    //     data: { route: sortedUnreadConversation[i]?.routeChild },
    //     id: sortedUnreadConversation[i]?.chatroomId?.toString(),
    //   });
    // }
    // }
    // }
    // }
    // }
  }