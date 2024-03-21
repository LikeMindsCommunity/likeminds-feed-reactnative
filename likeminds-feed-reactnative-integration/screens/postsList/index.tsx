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
import {
  POST_LIKES_LIST,
  POST_DETAIL,
} from "../../constants/screenNames";
// @ts-ignore the lib do not have TS declarations yet
import _ from "lodash";
import { DeleteModal, ReportModal } from "../../customModals";
import { useLMFeedStyles } from "../../lmFeedProvider";
import { useAppDispatch } from "../../store/store";
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

const PostsList = ({ route, children }: any) => {
  const {
    navigation
  }: UniversalFeedContextValues = useUniversalFeedContext();
  return (
    <PostListContextProvider
      navigation={navigation}
      route={route}
      children={children}
    >
      <PostsListComponent />
    </PostListContextProvider>
  );
};

const PostsListComponent = React.memo(() => {
  const dispatch = useAppDispatch();
  const {
    listRef,
    refreshing,
    onRefresh,
    localRefresh,
    keyExtractor
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
    setFeedPageNumber,
    feedPageNumber,
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
    handleEditPost
  }: PostListContextValues = usePostListContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const { postListStyle, loaderStyle } = LMFeedContextStyles;
  const { postLikeHandlerProp, savePostHandlerProp, onSelectCommentCountProp, selectEditPostProp, selectPinPostProp} = useUniversalFeedCustomisableMethodsContext()
  
// this function returns the id of the item selected from menu list and handles further functionalities accordingly
const onMenuItemSelect = (
  postId: string,
  itemId?: number,
  pinnedValue?: boolean
) => {
  setSelectedMenuItemPostId(postId);
  if (itemId === PIN_POST_MENU_ITEM || itemId === UNPIN_POST_MENU_ITEM) {
    selectPinPostProp ? selectPinPostProp(postId, pinnedValue) : handlePinPost(postId, pinnedValue);
  }
  if (itemId === REPORT_POST_MENU_ITEM) {
     handleReportPost();
  }
  if (itemId === DELETE_POST_MENU_ITEM) {
     handleDeletePost(true);
  }
  if (itemId === EDIT_POST_MENU_ITEM) {
   selectEditPostProp ? selectEditPostProp(postId) : handleEditPost(postId)
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
                // disabled={
                //   item?.attachments &&
                //   item?.attachments?.filter(
                //     (media) =>
                //       media?.attachmentType === IMAGE_ATTACHMENT_TYPE ||
                //       media?.attachmentType === VIDEO_ATTACHMENT_TYPE
                //   ).length >= 2
                //     ? true
                //     : false
                // }
                activeOpacity={0.8}
                style={{ backgroundColor: "#e0e0e0" }}
                onPress={() => {
                  dispatch(clearPostDetail() as any);
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
                    postMenu: {
                      modalPosition: modalPosition,
                      modalVisible: showActionListModal,
                      onCloseModal: closePostActionListModal,
                      onSelected: (postId, itemId) =>
                       {
                       onMenuItemSelect(postId, itemId, item?.isPinned)},
                    },
                  }}
                  // footer props
                  footerProps={{
                    likeIconButton: {
                      onTap: () => {
                        postLikeHandlerProp ? postLikeHandlerProp(item?.id) : postLikeHandler(item?.id);
                      },
                    },
                    saveButton: {
                      onTap: () => {
                        savePostHandlerProp ? savePostHandlerProp(item?.id, item?.isSaved) : savePostHandler(item?.id, item?.isSaved);
                      },
                    },
                    likeTextButton: {
                      onTap: () => {
                          dispatch(postLikesClear());
                        navigation.navigate(POST_LIKES_LIST, [POST_LIKES, item?.id]);
                      },
                    },
                    commentButton: {
                      onTap: () => {
                        onSelectCommentCountProp ? onSelectCommentCountProp(item?.id) : onTapCommentCount(item?.id)
                      },
                    },
                  }}
                />
              </TouchableOpacity>
            )}
            onEndReachedThreshold={0.3}
            onEndReached={() => {
              setFeedPageNumber(feedPageNumber + 1);
            }}
            keyExtractor={item => keyExtractor(item)}
            ListFooterComponent={<>{showLoader > 0 && renderLoader()}</>}
            onViewableItemsChanged={({changed, viewableItems}) => {
              if (changed) {
                if (viewableItems) {
                  dispatch(
                    autoPlayPostVideo(viewableItems?.[0]?.item?.id) as any,
                  );
                }
              }
            }}
            viewabilityConfig={{viewAreaCoveragePercentThreshold: 60}}
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
    </>
  );
});

export { PostsList };
