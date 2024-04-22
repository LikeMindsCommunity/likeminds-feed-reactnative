import React from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import {
  DELETE_POST_MENU_ITEM,
  EDIT_POST_MENU_ITEM,
  IMAGE_ATTACHMENT_TYPE,
  NAVIGATED_FROM_COMMENT,
  NAVIGATED_FROM_POST,
  PIN_POST_MENU_ITEM,
  POST_LIKES,
  POST_TYPE,
  REPORT_POST_MENU_ITEM,
  UNPIN_POST_MENU_ITEM,
  VIDEO_ATTACHMENT_TYPE,
} from "../../constants/Strings";
import { POST_LIKES_LIST, POST_DETAIL } from "../../constants/screenNames";
// @ts-ignore the lib do not have TS declarations yet
import _ from "lodash";
import { DeleteModal, ReportModal } from "../../customModals";
import { useLMFeedStyles } from "../../lmFeedProvider";
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
import { LMPostUI } from "../../models";
import { LMLoader } from "../../components";
import { autoPlayPostVideo } from "../../store/actions/feed";
import LMPostMenu from "../../customModals/LMPostMenu";

const PostsList = ({ route, children }: any) => {
  const { navigation }: UniversalFeedContextValues = useUniversalFeedContext();
  return <PostsListComponent />;
};

const PostsListComponent = () => {
  const dispatch = useAppDispatch();
  const {
    listRef,
    refreshing,
    onRefresh,
    localRefresh,
    keyExtractor,
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
    onTapLikeCount,
    onOverlayMenuClick,
    setPostInViewport,
  }: PostListContextValues = usePostListContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const { postListStyle, loaderStyle } = LMFeedContextStyles;
  const {
    postLikeHandlerProp,
    savePostHandlerProp,
    onSelectCommentCountProp,
    selectEditPostProp,
    selectPinPostProp,
    onTapLikeCountProps,
    handleDeletePostProps,
    handleReportPostProps,
    onOverlayMenuClickProp,
    onSharePostClicked,
  } = useUniversalFeedCustomisableMethodsContext();
  // this function returns the id of the item selected from menu list and handles further functionalities accordingly
  const onMenuItemSelect = (
    postId: string,
    itemId?: number,
    pinnedValue?: boolean,
    postDetail?: LMPostUI
  ) => {
    setSelectedMenuItemPostId(postId);
    if (itemId === PIN_POST_MENU_ITEM || itemId === UNPIN_POST_MENU_ITEM) {
      selectPinPostProp
        ? selectPinPostProp(postId, pinnedValue)
        : handlePinPost(postId, pinnedValue);
      let event = pinnedValue ? Events.POST_UNPINNED : Events.POST_PINNED;
      if (pinnedValue) {
        LMFeedAnalytics.track(
          event,
          new Map<string, string>([
            [Keys.CREATED_BY_ID, postDetail?.user?.sdkClientInfo?.uuid],
            [Keys.POST_ID, postId],
            [Keys.POST_TYPE, getPostType(postDetail?.attachments)],
          ])
        );
      }
    }
    if (itemId === REPORT_POST_MENU_ITEM) {
      handleReportPostProps
        ? handleReportPostProps(postId)
        : handleReportPost();
    }
    if (itemId === DELETE_POST_MENU_ITEM) {
      handleDeletePostProps
        ? handleDeletePostProps(true, postId)
        : handleDeletePost(true);
    }
    if (itemId === EDIT_POST_MENU_ITEM) {
      selectEditPostProp ? selectEditPostProp(postId) : handleEditPost(postId);
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

  return (
    <>
      {/* posts list section */}
      {!feedFetching ? (
        feedData?.length > 0 ? (
          <FlatList
            ref={listRef}
            refreshing={refreshing}
            style={postListStyle?.listStyle}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={feedData}
            renderItem={({ item }: { item: LMPostUI }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ backgroundColor: "#e0e0e0" }}
                onPress={() => {
                  dispatch(clearPostDetail() as any);
                  dispatch(autoPlayPostVideo(""));
                  navigation.navigate(POST_DETAIL, [
                    item?.id,
                    NAVIGATED_FROM_POST,
                  ]);
                }}
                key={item?.id}
              >
                <LMPost
                  post={item}
                  // header props
                  headerProps={{
                    onOverlayMenuClick: (event) => {
                      onOverlayMenuClickProp
                        ? onOverlayMenuClickProp(
                            event,
                            item?.menuItems,
                            item?.id
                          )
                        : onOverlayMenuClick(event, item.id);
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
                  mediaProps={{
                    videoProps: {
                      autoPlay:
                        postListStyle?.media?.video?.autoPlay != undefined
                          ? postListStyle?.media?.video?.autoPlay
                          : true,
                      videoInFeed: true,
                    },
                  }}
                />
              </TouchableOpacity>
            )}
            onEndReachedThreshold={0.3}
            onEndReached={handleLoadMore}
            keyExtractor={(item) => {
              return item?.id?.toString();
            }}
            ListFooterComponent={renderLoader}
            onViewableItemsChanged={({ changed, viewableItems }) => {
              if (changed) {
                if (viewableItems) {
                  setPostInViewport(viewableItems?.[0]?.item?.id);
                }
              }
            }}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
          />
        ) : (
          <View style={[styles.noDataView, postListStyle?.noPostView]}>
            <Text style={postListStyle?.noPostText}>No Post</Text>
          </View>
        )
      ) : (
        <View style={styles.loaderView}>
          {!localRefresh && <LMLoader {...loaderStyle?.loader} />}
        </View>
      )}

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
          closeModal={() => setShowReportModal(false)}
          reportType={POST_TYPE}
          postDetail={getPostDetail()}
        />
      )}
      {/* menu list modal */}
      {showActionListModal && (
        <LMPostMenu
          post={getPostDetail()}
          onSelected={(postId, itemId, isPinned) => {
            onMenuItemSelect(postId, itemId, isPinned);
          }}
          modalPosition={modalPosition}
          modalVisible={showActionListModal}
          onCloseModal={closePostActionListModal}
          menuItemTextStyle={postListStyle?.header?.postMenu?.menuItemTextStyle}
          menuViewStyle={postListStyle?.header?.postMenu?.menuViewStyle}
          backdropColor={postListStyle?.header?.postMenu?.backdropColor}
        />
      )}
    </>
  );
};

export { PostsList };
