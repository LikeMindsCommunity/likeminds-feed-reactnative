import React, { useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import {
  DELETE_POST_MENU_ITEM,
  EDIT_POST_MENU_ITEM,
  HIDE_POST_MENU_ITEM,
  IMAGE_ATTACHMENT_TYPE,
  NAVIGATED_FROM_COMMENT,
  NAVIGATED_FROM_POST,
  PIN_POST_MENU_ITEM,
  POST_LIKES,
  POST_TYPE,
  REPORT_POST_MENU_ITEM,
  UNHIDE_POST_MENU_ITEM,
  UNPIN_POST_MENU_ITEM,
  VIDEO_ATTACHMENT_TYPE,
} from "../../constants/Strings";
import { POST_LIKES_LIST, POST_DETAIL } from "../../constants/screenNames";
// @ts-ignore the lib do not have TS declarations yet
import _ from "lodash";
import { DeleteModal, ReportModal } from "../../customModals";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { clearPostDetail } from "../../store/actions/postDetail";
import {
  PostListContextProvider,
  PostListContextValues,
  UniversalFeedContextValues,
  usePostListContext,
  useUniversalFeedContext,
  useUniversalFeedCustomisableMethodsContext,
} from "../../context";
import { postLikesClear } from "../../store/actions/postLikes";
import LMPost from "../../components/LMPost/LMPost";
import { LMPostViewData } from "../../models";
import LMLoader from "../../components/LMLoader";
import { autoPlayPostVideo } from "../../store/actions/feed";
import LMPostMenu from "../../customModals/LMPostMenu";
import { Events } from "../../enums/Events";
import { LMFeedAnalytics } from "../../analytics/LMFeedAnalytics";
import { Keys } from "../../enums/Keys";
import { getPostType } from "../../utils/analytics";
import { SET_FLOW_TO_POST_DETAIL_SCREEN, SET_PAUSED_STATUS } from "../../store/types/types";
import STYLES from "../../constants/Styles";
import { CommunityConfigs } from "../../communityConfigs";
import { WordAction } from "../../enums/Variables";
import pluralizeOrCapitalize from "../../utils/variables";
import { useIsFocused } from "@react-navigation/native";
import { useLMFeed } from "../../lmFeedProvider";
import { debounce } from "../../utils/debounce";
import { FeedType } from "../../enums/FeedType";

const PostsList = ({
  route,
  children,
  items,
  lmPostCustomFooter,
  customWidgetPostView,
}: any) => {
  return (
    <PostsListComponent
      topics={items}
      lmPostCustomFooter={lmPostCustomFooter}
      customWidgetPostView={customWidgetPostView}
    />
  );
};

const PostsListComponent = ({
  topics: mappedTopics,
  lmPostCustomFooter,
  customWidgetPostView,
}: any) => {
  const dispatch = useAppDispatch();
  const focused = useIsFocused();
  const refreshFromOnboardingScreen = useAppSelector(
    (state) => state.feed.refreshScreenFromOnboardingScreen
  );
  const {
    listRef,
    refreshing,
    onRefresh,
    localRefresh,
    postSeen,
    feedType,
  }: UniversalFeedContextValues = useUniversalFeedContext();
  const {
    navigation,
    feedData,
    feedFetching,
    modalPosition,
    showActionListModal,
    closePostActionListModal,
    postLikeHandler,
    debouncedSaveFunction,
    savePostHandler,
    handleLoadMore,
    renderLoader,
    showLoader,
    showDeleteModal,
    showReportModal,
    getPostDetail,
    setShowReportModal,
    handleDeletePost,
    onTapCommentCount,
    debouncedLikeFunction,
    setSelectedMenuItemPostId,
    handlePinPost,
    handleReportPost,
    handleEditPost,
    handleHidePost,
    onTapLikeCount,
    onOverlayMenuClick,
    setPostInViewport,
    seenPost,
    saveSeenPost,
  }: PostListContextValues = usePostListContext();

  const postListStyle = STYLES.$POST_LIST_STYLE;
  const loaderStyle = STYLES.$LOADER_STYLE;
  const {
    postLikeHandlerProp,
    savePostHandlerProp,
    onSelectCommentCountProp,
    selectEditPostProp,
    selectPinPostProp,
    onTapLikeCountProps,
    handleDeletePostProps,
    handleReportPostProps,
    handleHidePostProp,
    onOverlayMenuClickProp,
    onSharePostClicked,
    isHeadingEnabled,
    isTopResponse,
    hideTopicsView,
  } = useUniversalFeedCustomisableMethodsContext();

  const hasFetched = useRef(false);

  // this function returns the id of the item selected from menu list and handles further functionalities accordingly
  const onMenuItemSelect = (
    postId: string,
    itemId?: number,
    pinnedValue?: boolean,
    postDetail?: LMPostViewData
  ) => {
    setSelectedMenuItemPostId(postId);
    if (itemId === PIN_POST_MENU_ITEM || itemId === UNPIN_POST_MENU_ITEM) {
      selectPinPostProp
        ? selectPinPostProp(postId, pinnedValue)
        : handlePinPost(postId, pinnedValue);
      let event = pinnedValue ? Events.POST_UNPINNED : Events.POST_PINNED;
      LMFeedAnalytics.track(
        event,
        new Map<string, string>([
          [Keys.UUID, postDetail?.user?.sdkClientInfo?.uuid],
          [Keys.POST_ID, postId],
          [Keys.POST_TYPE, getPostType(postDetail?.attachments)],
        ])
      );
    }
    if (itemId === REPORT_POST_MENU_ITEM) {
      if (Platform.OS == "ios") {
        setTimeout(() => {
          handleReportPostProps
          ? handleReportPostProps(postId)
          : handleReportPost();
        }, 500)
      } else {
        handleReportPostProps
        ? handleReportPostProps(postId)
        : handleReportPost();
      }
    }
    if (itemId === DELETE_POST_MENU_ITEM) {
      if (Platform.OS == "ios") {
        setTimeout(() => {
          handleDeletePostProps
          ? handleDeletePostProps(true, postId)
          : handleDeletePost(true);
        }, 500)
      } else {
        handleDeletePostProps
          ? handleDeletePostProps(true, postId)
          : handleDeletePost(true);
      }
    }
    if (itemId === HIDE_POST_MENU_ITEM || itemId === UNHIDE_POST_MENU_ITEM) {
      handleHidePostProp ? handleHidePostProp(postId) : handleHidePost(postId);
    }

    if (itemId === EDIT_POST_MENU_ITEM) {
      selectEditPostProp
        ? selectEditPostProp(postId, postDetail)
        : handleEditPost(postId, postDetail);
      LMFeedAnalytics.track(
        Events.POST_EDITED,
        new Map<string, string>([
          [Keys.UUID, postDetail?.user?.sdkClientInfo.uuid],
          [Keys.POST_ID, postId],
          [Keys.POST_TYPE, getPostType(postDetail?.attachments)],
        ])
      );
    }
  };
  const currentVideoId = useAppSelector((state) => state.feed.currentIdOfVideo);

  const renderItem = useCallback(
    ({ item, index }: { item: LMPostViewData; index: number }) => {
      // Check if the item's topic matches any name in the topics array
      const topics = mappedTopics ? mappedTopics : [];
      const isTopicMatched =
        item?.topics?.length > 0 &&
        topics.length > 0 &&
        item?.topics?.some((topicId) =>
          topics.some((topic) => topic.id === topicId)
        );

      if (isTopicMatched || topics.length === 0) {
        return (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                backgroundColor: STYLES.$IS_DARK_THEME
                  ? STYLES.$BACKGROUND_COLORS.DARK
                  : STYLES.$BACKGROUND_COLORS.LIGHT,
              }}
              onPress={() => {
                dispatch(clearPostDetail() as any);
                dispatch({
                  type: SET_FLOW_TO_POST_DETAIL_SCREEN,
                  body: { flowToPostDetailScreen: true },
                });
                navigation.navigate(POST_DETAIL, [
                  item?.id,
                  NAVIGATED_FROM_POST,
                ]);
              }}
              key={item?.id}
            >
              <LMPost
                isHeadingEnabled={isHeadingEnabled}
                isTopResponse={isTopResponse}
                post={item}
                // header props
                headerProps={{
                  postMenu: {
                    modalPosition: modalPosition,
                    modalVisible: showActionListModal,
                    onCloseModal: closePostActionListModal,
                    onSelected: (postId, itemId) => {
                      onMenuItemSelect(postId, itemId, item?.isPinned);
                    },
                  },
                  onOverlayMenuClick: (event) => {
                    onOverlayMenuClickProp
                      ? onOverlayMenuClickProp(event, item?.menuItems, item?.id)
                      : onOverlayMenuClick(event, item?.id);
                  },
                }}
                // footer props
                footerProps={{
                  likeIconButton: {
                    onTap: () => {
                      postLikeHandlerProp
                        ? postLikeHandlerProp(item?.id)
                        : postLikeHandler(item?.id);
                    },
                  },
                  saveButton: {
                    onTap: () => {
                      savePostHandlerProp
                        ? savePostHandlerProp(item?.id, item?.isSaved)
                        : savePostHandler(item?.id, item?.isSaved);
                    },
                  },
                  likeTextButton: {
                    onTap: () => {
                      onTapLikeCountProps
                        ? onTapLikeCountProps(item?.id)
                        : onTapLikeCount(item?.id);
                    },
                  },
                  commentButton: {
                    onTap: () => {
                      onSelectCommentCountProp
                        ? onSelectCommentCountProp(item?.id)
                        : onTapCommentCount(item?.id);
                    },
                  },
                  shareButton: {
                    onTap: () => {
                      onSharePostClicked ? onSharePostClicked(item?.id) : {};
                    },
                  },
                }}
                customFooter={lmPostCustomFooter}
                customWidgetPostView={customWidgetPostView}
                hideTopicsView={hideTopicsView ?? false}
              />
            </TouchableOpacity>
            {!postListStyle.shouldHideSeparator &&
            index != feedData.length - 1 ? (
              <View
                style={{
                  height: 11,
                  backgroundColor: STYLES.$IS_DARK_THEME
                    ? STYLES.$SEPARATOR_COLORS.DARK
                    : STYLES.$SEPARATOR_COLORS.LIGHT,
                }}
              />
            ) : null}
          </>
        );
      } else {
        return null;
      }
    },
    [
      mappedTopics,
      isHeadingEnabled,
      isTopResponse,
      lmPostCustomFooter,
      customWidgetPostView,
      hideTopicsView,
    ]
  );

  useEffect(() => {
    if (!focused) {
      dispatch({
        type: "CLEAR_FLOWS_AND_ID"
      })
    }
  }, [focused])

  useEffect(() => {
    if (refreshFromOnboardingScreen) {
      onRefresh();
    }
  }, [refreshFromOnboardingScreen]);

  // Detect viewable posts
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (feedType === FeedType.PERSONALISED_FEED) {
      if (!hasFetched.current) {
        const visiblePostIds = viewableItems.map((item) => item.item.id);
        postSeen(visiblePostIds);
        hasFetched.current = true; // Set flag to true after first call
      } else {
        viewableItems?.forEach((item) => seenPost.current.add(item.item.id));
      }
    }
  };

  // Monitor scroll state
  const onMomentumScrollEnd = async ({ nativeEvent }) => {
    if (nativeEvent?.velocity?.y === 0 && feedType === FeedType.PERSONALISED_FEED) {
      await saveSeenPost();
      await postSeen();
    }
  };

  // debouced on momentum scroll end
  const debouncedOnMomentumScrollEnd = async ({ nativeEvent }) => {
    debounce(onMomentumScrollEnd, 5000)({ nativeEvent });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: STYLES.$IS_DARK_THEME
          ? STYLES.$BACKGROUND_COLORS.DARK
          : STYLES.$BACKGROUND_COLORS.LIGHT,
      }}
    >
      {/* posts list section */}
      <>
        {!feedFetching ? (
          feedData?.length > 0 ? (
            <FlatList
              ref={listRef}
              refreshing={refreshing}
              style={postListStyle?.listStyle}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing || refreshFromOnboardingScreen}
                  onRefresh={onRefresh}
                />
              }
              data={feedData}
              renderItem={renderItem}
              onEndReachedThreshold={0.3}
              onEndReached={handleLoadMore}
              removeClippedSubviews={true}
              keyExtractor={(item) => {
                return item?.id?.toString();
              }}
              ListFooterComponent={renderLoader}
              onViewableItemsChanged={({ changed, viewableItems }) => {
                if (changed) {
                  if (viewableItems) {
                    setPostInViewport(viewableItems?.[0]?.item?.id);
                    onViewableItemsChanged({ viewableItems });
                  }
                }
              }}
              viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
              onMomentumScrollEnd={debouncedOnMomentumScrollEnd}
            />
          ) : (
            <View style={[styles.noDataView, postListStyle?.noPostView]}>
              <Text
                style={[
                  {
                    color: STYLES.$IS_DARK_THEME
                      ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                      : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
                    fontFamily: STYLES.$FONT_TYPES.LIGHT,
                  },
                  postListStyle?.noPostText,
                ]}
              >
                No{" "}
                {pluralizeOrCapitalize(
                  CommunityConfigs?.getCommunityConfigs("feed_metadata")?.value
                    ?.post ?? "post",
                  WordAction.firstLetterCapitalSingular
                )}
              </Text>
            </View>
          )
        ) : (
          <View style={styles.loaderView}>
            {!localRefresh && <LMLoader {...loaderStyle?.loader} />}
          </View>
        )}
      </>

      {/* delete post modal */}
      {showDeleteModal && (
        <DeleteModal
          visible={showDeleteModal}
          displayModal={(visible) => handleDeletePost(visible)}
          deleteType={POST_TYPE}
          postDetail={getPostDetail()}
          navigation={navigation}
        />
      )}
      {/* report post modal */}
      {showReportModal && (
        <ReportModal
          visible={showReportModal}
          closeModal={() => {
            dispatch(autoPlayPostVideo(currentVideoId));
            setShowReportModal(false);
          }}
          reportType={POST_TYPE}
          postDetail={getPostDetail()}
        />
      )}
      {/* menu list modal */}
      {showActionListModal && (
        <LMPostMenu
          post={getPostDetail()}
          onSelected={(postId, itemId, isPinned) => {
            onMenuItemSelect(postId, itemId, isPinned, getPostDetail());
          }}
          modalPosition={modalPosition}
          modalVisible={showActionListModal}
          onCloseModal={closePostActionListModal}
          menuItemTextStyle={postListStyle?.header?.postMenu?.menuItemTextStyle}
          menuViewStyle={postListStyle?.header?.postMenu?.menuViewStyle}
          backdropColor={postListStyle?.header?.postMenu?.backdropColor}
        />
      )}
    </View>
  );
};

export { PostsList };
