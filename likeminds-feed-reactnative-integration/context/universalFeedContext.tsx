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
import { useAppDispatch, useAppSelector } from "../store/store";
import { mentionToRouteConverter, uploadFilesToAWS } from "../utils";
import { addPost, setUploadAttachments } from "../store/actions/createPost";
import { AddPostRequest, GetFeedRequest } from "@likeminds.community/feed-js";
import { autoPlayPostVideo, refreshFeed } from "../store/actions/feed";
import {
  CREATE_POST_PERMISSION,
  POST_UPLOADED,
  POST_UPLOAD_INPROGRESS,
  RIGHT_CREATE_POST,
  STATE_ADMIN,
} from "../constants/Strings";
import { RootStackParamList } from "../models/RootStackParamsList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { showToastMessage } from "../store/actions/toast";
import { FlatList } from "react-native";
import { LMAttachmentUI, LMPostUI } from "../models";
import { CREATE_POST, NOTIFICATION_FEED } from "../constants/screenNames";
import {
  getUnreadNotificationCount,
  notificationFeedClear,
} from "../store/actions/notification";
import { LMFeedAnalytics } from "../analytics/LMChatAnalytics";
import { Events } from "../enums/Events";
import { Keys } from "../enums/Keys";

interface UniversalFeedContextProps {
  children: ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList, "UniversalFeed">;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
}

export interface UniversalFeedContextValues {
  navigation: NativeStackNavigationProp<RootStackParamList, "UniversalFeed">;
  feedData: Array<LMPostUI>;
  accessToken: string;
  memberData: {};
  memberRight: [];
  postUploading: boolean;
  showCreatePost: boolean;
  refreshing: boolean;
  localRefresh: boolean;
  listRef: MutableRefObject<FlatList<LMPostUI> | null>;
  mediaAttachmemnts: [];
  linkAttachments: [];
  postContent: string;
  uploadingMediaAttachmentType: number;
  uploadingMediaAttachment: string;
  unreadNotificationCount: number;
  setLocalRefresh: Dispatch<SetStateAction<boolean>>;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  setPostUploading: Dispatch<SetStateAction<boolean>>;
  setShowCreatePost: Dispatch<SetStateAction<boolean>>;
  onRefresh: () => void;
  postAdd: () => void;
  keyExtractor: (val) => string;
  newPostButtonClick: () => void;
  getNotificationsCount: () => void;
  onTapNotificationBell: () => void;
}

const UniversalFeedContext = createContext<
  UniversalFeedContextValues | undefined
>(undefined);

export const useUniversalFeedContext = () => {
  const context = useContext(UniversalFeedContext);
  if (!context) {
    throw new Error(
      "useUniversalFeedContext must be used within an UniversalFeedContextProvider"
    );
  }
  return context;
};

export const UniversalFeedContextProvider = ({
  children,
  navigation,
}: UniversalFeedContextProps) => {
  const dispatch = useAppDispatch();
  const feedData = useAppSelector((state) => state.feed.feed);
  const accessToken = useAppSelector((state) => state.login.accessToken);
  const memberData = useAppSelector((state) => state.login.member);
  const memberRight = useAppSelector((state) => state.login.memberRights);
  const [postUploading, setPostUploading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(true);
  const { mediaAttachmemnts, linkAttachments, postContent } = useAppSelector(
    (state) => state.createPost
  );
  const unreadNotificationCount = useAppSelector(
    (state) => state.notification.activitiesCount
  );
  const uploadingMediaAttachmentType = mediaAttachmemnts[0]?.attachmentType;
  const uploadingMediaAttachment = mediaAttachmemnts[0]?.attachmentMeta.url;

  const [refreshing, setRefreshing] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(false);
  const listRef = useRef<FlatList<LMPostUI>>(null);

  useEffect(() => {
    if (accessToken) {
      // handles members right
      if (memberData?.state !== STATE_ADMIN) {
        const members_right = memberRight?.find(
          (item) => item?.state === RIGHT_CREATE_POST
        );

        if (members_right?.isSelected === false) {
          setShowCreatePost(false);
        }
      }
    }
  }, [accessToken]);

  // this function is executed on pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setLocalRefresh(true);
    // calling getFeed API
    await dispatch(
      refreshFeed(
        GetFeedRequest.builder().setpage(1).setpageSize(20).build(),
        false
      )
    );
    setLocalRefresh(false);
    setRefreshing(false);
  };

  // Analytics event
  useEffect(() => {
    LMFeedAnalytics.track(
      Events.FEED_OPENED,
      new Map<string, string>([[Keys.FEED_TYPE, Keys.UNIVERSAL_FEED]])
    );
  }, []);

  // this function adds a new post
  const postAdd = async () => {
    // replace the mentions with route
    const postContentText = mentionToRouteConverter(postContent);
    // upload media to aws
    const uploadPromises = mediaAttachmemnts?.map(
      async (item: LMAttachmentUI) => {
        return uploadFilesToAWS(
          item.attachmentMeta,
          memberData.userUniqueId
        ).then((res) => {
          item.attachmentMeta.url = res.Location;
          return item; // Return the updated item
        });
      }
    );
    // Wait for all upload operations to complete
    const updatedAttachments = await Promise.all(uploadPromises);
    const addPostResponse = await dispatch(
      addPost(
        AddPostRequest.builder()
          .setAttachments([...updatedAttachments, ...linkAttachments])
          .setText(postContentText)
          .build(),
        false
      )
    );
    if (addPostResponse) {
      setPostUploading(false);
      dispatch(
        setUploadAttachments({
          allAttachment: [],
          linkData: [],
          conText: "",
        })
      );
      await onRefresh();
      listRef.current?.scrollToIndex({ animated: true, index: 0 });
      dispatch(
        showToastMessage({
          isToast: true,
          message: POST_UPLOADED,
        })
      );
    }
    return addPostResponse;
  };

  // this handles the functionality of new post button
  const newPostButtonClick = () => {
    dispatch(autoPlayPostVideo(""));
    showCreatePost
      ? postUploading
        ? dispatch(
            showToastMessage({
              isToast: true,
              message: POST_UPLOAD_INPROGRESS,
            })
          )
        : navigation.navigate(CREATE_POST)
      : dispatch(
          showToastMessage({
            isToast: true,
            message: CREATE_POST_PERMISSION,
          })
        );
  };

  // this useEffect handles the execution of addPost api
  useEffect(() => {
    // this checks if any media is selected to be posted and then executes the addPost api
    if (
      mediaAttachmemnts.length > 0 ||
      linkAttachments.length > 0 ||
      postContent !== ""
    ) {
      setPostUploading(true);
      postAdd();
    }
  }, [mediaAttachmemnts, linkAttachments, postContent]);

  // keyExtractor of feed list
  const keyExtractor = (item: LMPostUI) => {
    const id = item?.id;
    const itemLiked = item?.isLiked;
    const itemPinned = item?.isPinned;
    const itemComments = item?.commentsCount;
    const itemSaved = item?.isSaved;
    const itemText = item?.text;

    return `${id}`;
  };

  const getNotificationsCount = async () => {
    const unreadNotificationCountResponse = await dispatch(
      getUnreadNotificationCount()
    );
    return unreadNotificationCountResponse;
  };

  useEffect(() => {
    getNotificationsCount();
  }, []);

  const onTapNotificationBell = () => {
    dispatch(notificationFeedClear());
    dispatch(autoPlayPostVideo(""));
    navigation.navigate(NOTIFICATION_FEED);
  };

  const contextValues: UniversalFeedContextValues = {
    navigation,
    feedData,
    accessToken,
    memberData,
    memberRight,
    postUploading,
    showCreatePost,
    setPostUploading,
    setShowCreatePost,
    refreshing,
    localRefresh,
    listRef,
    mediaAttachmemnts,
    linkAttachments,
    postContent,
    uploadingMediaAttachmentType,
    uploadingMediaAttachment,
    setLocalRefresh,
    setRefreshing,
    onRefresh,
    postAdd,
    keyExtractor,
    newPostButtonClick,
    getNotificationsCount,
    unreadNotificationCount,
    onTapNotificationBell,
  };

  return (
    <UniversalFeedContext.Provider value={contextValues}>
      {children}
    </UniversalFeedContext.Provider>
  );
};
