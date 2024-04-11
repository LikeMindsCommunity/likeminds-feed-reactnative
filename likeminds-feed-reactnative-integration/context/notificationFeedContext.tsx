import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useRef,
  MutableRefObject,
} from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../models/RootStackParamsList";
import { useAppDispatch, useAppSelector } from "../store/store";
import { LMActivityUI } from "../models";
import {
  getNotificationFeed,
  markReadNotification,
  notificationReadHandler,
  refreshNotificationFeed,
} from "../store/actions/notification";
import {
  GetNotificationFeedRequest,
  MarkReadNotificationRequest,
} from "@likeminds.community/feed-js";
import { clearPostDetail } from "../store/actions/postDetail";
import { CREATE_POST, POST_DETAIL, UNIVERSAL_FEED } from "../constants/screenNames";
import { NAVIGATED_FROM_NOTIFICATION } from "../constants/Strings";

interface NotificationFeedContextProps {
  children: ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList, "NotificationFeed">;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
}

export interface NotificationFeedContextValues {
  navigation: NativeStackNavigationProp<RootStackParamList, "NotificationFeed">;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
  notificationFeedPageNumber: number;
  setNotificationFeedPageNumber: Dispatch<SetStateAction<number>>;
  notifications: LMActivityUI[];
  refreshing: boolean;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  fetchNotificationFeed: (page: number) => void;
  readNotification: (id: string) => void;
  handleScreenBackPress: () => void;
  handleActivityOnTap:(activity: LMActivityUI) => void;
  onRefresh: () => void;
  handleLoadMore: () => void;
}

const NotificationFeedContext = createContext<
  NotificationFeedContextValues | undefined
>(undefined);

export const useNotificationFeedContext = () => {
  const context = useContext(NotificationFeedContext);
  if (!context) {
    throw new Error(
      "useNotificationFeedContext must be used within an NotificationFeedContextProvider"
    );
  }
  return context;
};

export const NotificationFeedContextProvider = ({
  children,
  navigation,
  route,
}: NotificationFeedContextProps) => {
  const dispatch = useAppDispatch();
  const [notificationFeedPageNumber, setNotificationFeedPageNumber] =
    useState(1);
  const notifications = useAppSelector(
    (state) => state.notification.activities
  );
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const PostRegexPattern = /^route:\/\/post_detail\?post_id=\w+$/;
  const commentRegexPattern =
    /^route:\/\/post_detail\?post_id=[\w\d]+&comment_id=[\w\d]+$/;
  const createPostRegexPattern = /^route:\/\/create_post$/;
  const universalFeedRegexPattern = /^route:\/\/feed\?type=universal$/;
  const PAGE_SIZE = 20
  // this functions gets notification feed data
  const fetchNotificationFeed = async (page) => {
    const payload = {
      page: page,
      pageSize: 20,
    };
    // calling getFeed API
    const getNotificationFeedResponse = await dispatch(
      getNotificationFeed(
        GetNotificationFeedRequest.builder()
          .setpage(payload.page)
          .setpageSize(payload.pageSize)
          .build(),
        false
      )
    );
    return getNotificationFeedResponse;
  };

  const readNotification = async (activityId: string) => {
    await dispatch(notificationReadHandler(activityId));
    const readNotificationResponse = await dispatch(
      markReadNotification(
        MarkReadNotificationRequest.builder().setactivityId(activityId).build(),
        false
      )
    );
    return readNotificationResponse;
  };

  useEffect(() => {
    fetchNotificationFeed(notificationFeedPageNumber);
  }, []);

  const handleScreenBackPress = () => {
    navigation.goBack();
  };

  const handleActivityOnTap = (activity) => {
    readNotification(activity?.id)
    activity?.cta.match(PostRegexPattern)
      ? (dispatch(clearPostDetail()),
        navigation.navigate(POST_DETAIL, [
          activity?.activityEntityData?.id,
          NAVIGATED_FROM_NOTIFICATION,
        ]))
      : activity?.cta.match(commentRegexPattern)
      ? (dispatch(clearPostDetail()),
        navigation.navigate(POST_DETAIL, [
          activity?.activityEntityData?.postId,
          NAVIGATED_FROM_NOTIFICATION,
        ]))
      : activity?.cta.match(createPostRegexPattern)
      ? navigation.navigate(CREATE_POST)
      : activity?.cta.match(universalFeedRegexPattern)
      ? navigation.navigate(UNIVERSAL_FEED)
      : null;
  };
  const onRefresh = async () => {
    setRefreshing(true);
    // calling getNotification API
    await dispatch(
      refreshNotificationFeed(
        GetNotificationFeedRequest.builder()
          .setpage(1)
          .setpageSize(20)
          .build(),
        false
      )
    );
    setRefreshing(false);
  };

  // fetch data for next page
  const loadData = async (newPage: number) => {
    setIsLoading(true);
    setTimeout(async () => {
      const res: any = await fetchNotificationFeed(newPage);
      if (res) {
        setIsLoading(false);
      }
    }, 1500);
  };

  // pagination
  const handleLoadMore = async () => {
    if (!isLoading && notifications.length === PAGE_SIZE * notificationFeedPageNumber) {
      const newPage = notificationFeedPageNumber + 1;
      setNotificationFeedPageNumber((page) => {
        return page + 1;
      });
      loadData(newPage);
    }
  };
  const contextValues: NotificationFeedContextValues = {
    navigation,
    route,
    notificationFeedPageNumber,
    setNotificationFeedPageNumber,
    notifications,
    refreshing,
    setRefreshing,
    fetchNotificationFeed,
    readNotification,
    handleScreenBackPress,
    handleActivityOnTap,
    onRefresh,
    handleLoadMore,
    setIsLoading,
    isLoading
  };

  return (
    <NotificationFeedContext.Provider value={contextValues}>
      {children}
    </NotificationFeedContext.Provider>
  );
};
