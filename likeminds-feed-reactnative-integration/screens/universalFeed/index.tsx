import React, { useEffect } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
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
import { CREATE_POST, NOTIFICATION_FEED } from "../../constants/screenNames";
// @ts-ignore the lib do not have TS declarations yet
import _ from "lodash";
import { PostsList } from "../postsList";
import { useLMFeedStyles } from "../../lmFeedProvider";
import { useAppDispatch } from "../../store/store";
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
  handleDeletePostProps: (
    visible: boolean,
    postId: string,
    isCM: boolean
  ) => void;
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
}: UniversalFeedProps) => {
  return (
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
      <UniversalFeedComponent />
    </UniversalFeedCustomisableMethodsContextProvider>
  );
};

const UniversalFeedComponent = () => {
  const dispatch = useAppDispatch();
  const {
    feedData,
    showCreatePost,
    postUploading,
    navigation,
    uploadingMediaAttachment,
    uploadingMediaAttachmentType,
    newPostButtonClick,
    unreadNotificationCount,
    onTapNotificationBell,
  }: UniversalFeedContextValues = useUniversalFeedContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const { universalFeedStyle, loaderStyle } = LMFeedContextStyles;
  const { newPostButtonClickProps, onTapNotificationBellProp } =
    useUniversalFeedCustomisableMethodsContext();

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* header */}
      <LMHeader
        heading={APP_TITLE}
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              onTapNotificationBellProp
                ? onTapNotificationBellProp()
                : onTapNotificationBell();

              LMFeedAnalytics.track(Events.NOTIFICATION_PAGE_OPENED);
            }}
          >
            <Image
              source={require("../../assets/images/notification_bell.png")}
              style={{ width: 24, height: 24, resizeMode: "contain" }}
            />
            {unreadNotificationCount > 0 && (
              <View
                style={{
                  backgroundColor: "#FB1609",
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 18,
                  height: 18,
                  position: "absolute",
                  top: -8,
                  right: -5,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>
                  {unreadNotificationCount < 100
                    ? unreadNotificationCount
                    : `99+`}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        }
        {...universalFeedStyle?.screenHeader}
      />
      {/* post uploading section */}
      {postUploading && (
        <View style={styles.postUploadingView}>
          <View style={styles.uploadingPostContentView}>
            {/* post uploading media preview */}
            {uploadingMediaAttachmentType === IMAGE_ATTACHMENT_TYPE && (
              <LMImage
                imageUrl={uploadingMediaAttachment}
                imageStyle={styles.uploadingImageStyle}
                boxStyle={styles.uploadingImageVideoBox}
                width={styles.uploadingImageVideoBox.width}
                height={styles.uploadingImageVideoBox.height}
              />
            )}
            {uploadingMediaAttachmentType === VIDEO_ATTACHMENT_TYPE && (
              <LMVideo
                videoUrl={uploadingMediaAttachment}
                videoStyle={styles.uploadingVideoStyle}
                boxStyle={styles.uploadingImageVideoBox}
                width={styles.uploadingImageVideoBox.width}
                height={styles.uploadingImageVideoBox.height}
                showControls={false}
                boxFit="contain"
              />
            )}
            {uploadingMediaAttachmentType === DOCUMENT_ATTACHMENT_TYPE && (
              <LMIcon
                assetPath={require("../../assets/images/pdf_icon3x.png")}
                iconStyle={styles.uploadingDocumentStyle}
                height={styles.uploadingPdfIconSize.height}
                width={styles.uploadingPdfIconSize.width}
              />
            )}
            <Text style={styles.postUploadingText}>{POST_UPLOADING}</Text>
          </View>
          {/* progress loader */}
          <LMLoader
            size={
              Platform.OS === "ios"
                ? STYLES.$LMLoaderSizeiOS
                : STYLES.$LMLoaderSizeAndroid
            }
          />
        </View>
      )}
      {/* posts list section */}
      <PostsList />
      {/* create post button section */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.newPostButtonView,
          showCreatePost
            ? styles.newPostButtonEnable
            : styles.newPostButtonDisable,
          universalFeedStyle?.newPostButtonStyle,
        ]}
        // handles post uploading status and member rights to create post
        onPress={() => {
          newPostButtonClickProps
            ? newPostButtonClickProps()
            : newPostButtonClick();
          LMFeedAnalytics.track(Events.POST_CREATION_STARTED);
        }}
      >
        <Image
          source={require("../../assets/images/add_post_icon3x.png")}
          resizeMode={"contain"}
          style={styles.newPostButtonIcon}
          {...universalFeedStyle?.newPostIcon}
        />
        <Text
          style={[styles.newPostText, universalFeedStyle?.newPostButtonText]}
        >
          NEW POST
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export { UniversalFeed };
