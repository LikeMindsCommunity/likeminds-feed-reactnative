import React, { useEffect, useState } from "react";
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
  SET_TOPICS,
} from "../../store/types/types";
import { Client } from "../../client";
import Layout from "../../constants/Layout";

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
  const myClient = Client.myClient;
  const [showTopics, setShowTopics] = useState(false);
  const LMFeedContextStyles = useLMFeedStyles();
  const { universalFeedStyle, loaderStyle, topicsStyle }: any =
    LMFeedContextStyles;
  const { newPostButtonClickProps, onTapNotificationBellProp } =
    useUniversalFeedCustomisableMethodsContext();
  const [mappedTopics, setMappedTopics] = useState([] as any);
  const [unreadNotifiCount, setUnreadNotifiCount] = useState(
    unreadNotificationCount
  );
  const selectedTopics = useAppSelector(
    (state) => state.feed.selectedTopicsForUniversalFeedScreen
  );
  const topics = useAppSelector((state) => state.feed.topics);

  const allTopicPlaceholder = topicsStyle?.allTopicPlaceholder;
  const allTopicsStyle = topicsStyle?.allTopic;
  const filteredTopicsStyle = topicsStyle?.filteredTopicsStyle;
  const crossIconStyle = topicsStyle?.crossIconStyle;
  const arrowDownStyle = topicsStyle?.arrowDownStyle;

  const getUnreadCount = async () => {
    const latestUnreadCount = await myClient?.getUnreadNotificationCount();
    /* @ts-ignore */
    setUnreadNotifiCount(parseInt(latestUnreadCount?.data?.count));
  };

  useEffect(() => {
    // Create a new state array named mappedTopics
    const filteredTopicArray = selectedTopics.map((topicId) => ({
      id: topicId,
      name: topics[topicId]?.name || "Unknown", // Use optional chaining and provide a default name if not found
    }));
    setMappedTopics(filteredTopicArray);
    getUnreadCount();
  }, [selectedTopics, topics]);

  const handleAllTopicPress = () => {
    /* @ts-ignore */
    return navigation.navigate(TOPIC_FEED);
  };

  const removeItem = (index: any) => {
    const newItems = [...mappedTopics]; // Create a copy of the array
    newItems.splice(index, 1); // Remove the item at the specified index
    setMappedTopics(newItems); // Update the state with the new array
  };

  const getTopics = async () => {
    const apiRes = await myClient?.getTopics({
      isEnabled: null,
      search: "",
      searchType: "name",
      page: 1,
      pageSize: 10,
    } as any);
    const topics = apiRes?.data?.topics;
    if (topics?.length > 0) {
      setShowTopics(true);
      const topicsObject = {};
      topics.forEach((topic) => {
        topicsObject[topic.Id] = {
          allParentIds: topic.allParentIds,
          isEnabled: topic.isEnabled,
          isSearchable: topic.isSearchable,
          level: topic.level,
          name: topic.name,
          numberOfPosts: topic.numberOfPosts,
          parentId: topic.parentId,
          parentName: topic.parentName,
          priority: topic.priority,
          totalChildCount: topic.totalChildCount,
          widgetId: topic.widgetId,
        };
      });
      dispatch({
        type: SET_TOPICS,
        body: { topics: topicsObject },
      });
    }
  };

  useEffect(() => {
    getTopics();
  }, [showTopics]);

  const [isAnyMatchFound, setIsAnyMatchFound] = useState(true);

  useEffect(() => {
    let isTopicMatched = true;

    // Loop through the items
    feedData.forEach((item: any) => {
      // Check if the item's topic matches any name in the topics array
      isTopicMatched =
        item?.topics?.length > 0 &&
        mappedTopics.length > 0 &&
        item?.topics?.some((topicId) =>
          mappedTopics.some((topic) => topic.id == topicId)
        );
    });

    // If the item matches the topic, set the flag to true
    if (!isTopicMatched && mappedTopics?.length > 0) {
      setIsAnyMatchFound(false);
    } else if (mappedTopics?.length === 0) setIsAnyMatchFound(true);
  }, [feedData, mappedTopics]);

  return (
    <View style={styles.mainContainer}>
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
            {unreadNotifiCount > 0 && (
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
                  {unreadNotifiCount < 100 ? unreadNotifiCount : `99+`}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        }
        {...universalFeedStyle?.screenHeader}
      />
      {/* all topics filter */}
      {mappedTopics.length > 0 && showTopics ? (
        <ScrollView
          style={{ flexGrow: 0, margin: Layout.normalize(10) }}
          horizontal={true}
        >
          <View style={{ flexDirection: "row" }}>
            {mappedTopics.map((item, index) => (
              <View key={index} style={{ margin: Layout.normalize(5) }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: Layout.normalize(7),
                    borderWidth: 1,
                    borderColor: "#5046E5",
                    borderRadius: Layout.normalize(5),
                  }}
                >
                  <Text
                    style={{
                      fontSize: Layout.normalize(17),
                      color: "#5046E5",
                      marginRight: Layout.normalize(8),
                      ...(filteredTopicsStyle !== undefined
                        ? filteredTopicsStyle
                        : {}),
                    }}
                  >
                    {item?.name}
                  </Text>
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    {/* Your cross icon component */}
                    <Image
                      source={require("../../assets/images/close_tag3x.png")}
                      style={{
                        tintColor: "#5046E5",
                        width: Layout.normalize(15),
                        height: Layout.normalize(15),
                        ...(crossIconStyle !== undefined ? crossIconStyle : {}),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        showTopics && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: Layout.normalize(15),
              marginTop: Layout.normalize(15),
            }}
          >
            <TouchableOpacity onPress={() => handleAllTopicPress()}>
              <View
                style={{
                  marginTop: Layout.normalize(10),
                  marginLeft: Layout.normalize(10),
                  borderRadius: Layout.normalize(5),
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: Layout.normalize(20),
                }}
              >
                <Text
                  style={{
                    fontSize: Layout.normalize(16),
                    color: "#222020",
                    marginRight: Layout.normalize(5),
                    ...(allTopicsStyle !== undefined ? allTopicsStyle : {}),
                  }}
                >
                  {allTopicPlaceholder !== undefined
                    ? allTopicPlaceholder
                    : "All Topics"}
                </Text>
                <Image
                  source={require("../../assets/images/arrow_down3x.png")}
                  style={{
                    tintColor: "#222020",
                    width: Layout.normalize(15),
                    height: Layout.normalize(15),
                    ...(arrowDownStyle !== undefined ? arrowDownStyle : {}),
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        )
      )}
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
                autoPlay={false}
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
      {!isAnyMatchFound ? (
        <View style={[styles.justifyCenter]}>
          <Text style={styles.title}>No matching post found</Text>
        </View>
      ) : (
        <></>
      )}
      <PostsList items={mappedTopics} />
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
          dispatch({
            type: CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
          });
          dispatch({
            type: CLEAR_SELECTED_TOPICS,
          });
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
    </View>
  );
};

export { UniversalFeed };
