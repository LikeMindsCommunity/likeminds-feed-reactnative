import React, { ReactNode, useEffect, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

import {
  APP_TITLE,
  CREATE_POST_PERMISSION,
  DOCUMENT_ATTACHMENT_TYPE,
  IMAGE_ATTACHMENT_TYPE,
  POST_UPLOADING,
  POST_UPLOAD_INPROGRESS,
  VIDEO_ATTACHMENT_TYPE,
} from "../../constants/Strings";
import {
  CREATE_POST,
  TOPIC_FEED,
  NOTIFICATION_FEED,
} from "../../constants/screenNames";
// @ts-ignore the lib do not have TS declarations yet
import _ from "lodash";
import { PostsList } from "../postsList";
import { useLMFeedStyles } from "../../lmFeedProvider";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  UniversalFeedContextProvider,
  UniversalFeedContextValues,
  UniversalFeedCustomisableMethodsContextProvider,
  useUniversalFeedContext,
  useUniversalFeedCustomisableMethodsContext,
} from "../../context";
import STYLES from "../../constants/Styles";
import { showToastMessage } from "../../store/actions/toast";
import { LMHeader, LMImage, LMLoader, LMVideo } from "../../components";
import { LMIcon } from "../../uiComponents";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LMMenuItemsUI, RootStackParamList } from "../../models";
import { LMFeedAnalytics } from "../../analytics/LMFeedAnalytics";
import { Events } from "../../enums/Events";
import { Keys } from "../../enums/Keys";
import { notificationFeedClear } from "../../store/actions/notification";
import {
  CLEAR_SELECTED_TOPICS,
  CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
  CLEAR_SELECTED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
  MAPPED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
  SELECTED_TOPICS_FROM_UNIVERSAL_FEED_SCREEN,
  SET_TOPICS,
} from "../../store/types/types";
import { Client } from "../../client";
import Layout from "../../constants/Layout";
import { PollCustomisableMethodsContextProvider } from "../../context/pollCustomisableCallback";

interface UniversalFeedProps {
  children: React.ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList, "UniversalFeed">;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
  postLikeHandlerProp: (id: string) => void;
  savePostHandlerProp: (id: string, saved?: boolean) => void;
  selectPinPostProp: (id: string, pinned?: boolean) => void;
  selectEditPostProp: (id: string) => void;
  onSelectCommentCountProp: (id: string) => void;
  onTapLikeCountProps: (id: string) => void;
  handleDeletePostProps: (visible: boolean, postId: string) => void;
  handleReportPostProps: (postId: string) => void;
  newPostButtonClickProps: () => void;
  onOverlayMenuClickProp: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    menuItems: LMMenuItemsUI[],
    postId: string
  ) => void;
  onTapNotificationBellProp: () => void;
  onSharePostClicked: (id: string) => void;
  onSubmitButtonClicked: any;
  onAddPollOptionsClicked: any;
  onPollOptionClicked: any;
}

interface UniversalFeedComponentProps {
  children: ReactNode;
}

const UniversalFeed = ({
  navigation,
  route,
  children,
  postLikeHandlerProp,
  savePostHandlerProp,
  selectPinPostProp,
  selectEditPostProp,
  onSelectCommentCountProp,
  onTapLikeCountProps,
  handleDeletePostProps,
  handleReportPostProps,
  newPostButtonClickProps,
  onOverlayMenuClickProp,
  onTapNotificationBellProp,
  onSharePostClicked,
  onSubmitButtonClicked,
  onAddPollOptionsClicked,
  onPollOptionClicked,
}: UniversalFeedProps) => {
  return (
    <PollCustomisableMethodsContextProvider
      onSubmitButtonClicked={onSubmitButtonClicked}
      onAddPollOptionsClicked={onAddPollOptionsClicked}
      onPollOptionClicked={onPollOptionClicked}
    >
      <UniversalFeedCustomisableMethodsContextProvider
        postLikeHandlerProp={postLikeHandlerProp}
        savePostHandlerProp={savePostHandlerProp}
        selectEditPostProp={selectEditPostProp}
        selectPinPostProp={selectPinPostProp}
        onSelectCommentCountProp={onSelectCommentCountProp}
        onTapLikeCountProps={onTapLikeCountProps}
        handleDeletePostProps={handleDeletePostProps}
        handleReportPostProps={handleReportPostProps}
        newPostButtonClickProps={newPostButtonClickProps}
        onOverlayMenuClickProp={onOverlayMenuClickProp}
        onTapNotificationBellProp={onTapNotificationBellProp}
        onSharePostClicked={onSharePostClicked}
      >
        <UniversalFeedComponent children={children} />
      </UniversalFeedCustomisableMethodsContextProvider>
    </PollCustomisableMethodsContextProvider>
  );
};

const UniversalFeedComponent = ({ children }) => {
  return <View style={styles.mainContainer}>{children}</View>;
};

export { UniversalFeed };
