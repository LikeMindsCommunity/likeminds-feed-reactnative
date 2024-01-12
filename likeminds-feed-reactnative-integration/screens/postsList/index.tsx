import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
  } from "react";
  import {
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import {
    AddPostRequest,
    GetFeedRequest,
    LikePostRequest,
    PinPostRequest,
    SavePostRequest,
  } from "@likeminds.community/feed-js-beta";
  import { FlashList } from "@shopify/flash-list";
  import { styles } from "./styles";
  import {
    LMPost,
    LMPostUI,
  } from "likeminds_feed_reactnative_ui";
  import { NavigationService } from "../../navigation";
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
  import { LMLoader } from "likeminds_feed_reactnative_ui";
  import {
    CREATE_POST,
    LIKES_LIST,
    POST_DETAIL,
  } from "../../constants/screenNames";
  // @ts-ignore the lib do not have TS declarations yet
  import _ from "lodash";
  import { useAppContext } from "../../store/AppContext";
  import { Client } from "../../client";
  import {
    PIN_POST_STATE,
    START_LOADING,
    STOP_LOADING,
    UNIVERSAL_FEED_REFRESH_SUCCESS,
    UNIVERSAL_FEED_SUCCESS,
  } from "../../store/actions/types";
  import { DeleteModal, ReportModal } from "../../customModals";
  
  const PostsList = React.memo(() => {
    const myClient = Client.myClient;
    const { state, dispatch } = useAppContext();
    const feedData = state.feed.feed;
    const accessToken = state.login.community.accessToken;
    const showLoader = state.loader.count;
    const [feedPageNumber, setFeedPageNumber] = useState(1);
    const modalPosition = { x: 0, y: 0 };
    const [showActionListModal, setShowActionListModal] = useState(false);
    const [selectedMenuItemPostId, setSelectedMenuItemPostId] = useState("");
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [localRefresh, setLocalRefresh] = useState(false);
    const [feedFetching, setFeedFetching] = useState(false);
    const listRef = useRef<FlatList<LMPostUI>>(null);
  
    // this functions gets universal feed data
    const fetchFeed = useCallback(async () => {
      const payload = {
        page: feedPageNumber,
        pageSize: 20,
      };
      // calling getFeed API
      dispatch({
        type: START_LOADING,
      });
      const getFeedResponse = await myClient?.getFeed(
        GetFeedRequest.builder()
          .setpage(payload.page)
          .setpageSize(payload.pageSize)
          .build()
      );
      if (getFeedResponse) {
        dispatch({
          type: STOP_LOADING,
        });
      }
      await dispatch({
        type: UNIVERSAL_FEED_SUCCESS,
        payload: getFeedResponse.getData(),
      });
      setFeedFetching(false);
      return getFeedResponse;
    }, [dispatch, feedPageNumber]);
  
    // this function is executed on pull to refresh
    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      setLocalRefresh(true);
      // calling getFeed API
      const refreshFeedResponse = await myClient?.getFeed(
        GetFeedRequest.builder().setpage(1).setpageSize(20).build()
      );
      await dispatch({
        type: UNIVERSAL_FEED_REFRESH_SUCCESS,
        payload: refreshFeedResponse.getData(),
      });
      setLocalRefresh(false);
      setRefreshing(false);
    }, [dispatch]);
  
  
    // debounce on like post function
    const debouncedLikeFunction = _.debounce(postLikeHandler, 500); // Adjust the debounce time (in milliseconds) as needed
  
    // useEffect hook to clean up the debounced function
    useEffect(() => {
      return () => {
        debouncedLikeFunction.cancel(); // Cancel any pending debounced executions when the component unmounts
      };
    }, [debouncedLikeFunction]);
  
    // this functions hanldes the post like functionality
    async function postLikeHandler(id: string) {
      const payload = {
        postId: id,
      };
      // calling like post api
      const postLikeResponse = await myClient?.likePost(
        LikePostRequest.builder().setpostId(payload.postId).build()
      );
      return postLikeResponse;
    }
  
    // debounce on save post function
    const debouncedSaveFunction = _.debounce(savePostHandler, 500); // Adjust the debounce time (in milliseconds) as needed
  
    // useEffect hook to clean up the debounced function
    useEffect(() => {
      return () => {
        debouncedSaveFunction.cancel(); // Cancel any pending debounced executions when the component unmounts
      };
    }, [debouncedSaveFunction]);
  
    // this functions hanldes the post save functionality
    async function savePostHandler(id: string, saved?: boolean) {
      const payload = {
        postId: id,
      };
      try {
        // calling the save post api
        const savePostResponse = await myClient?.savePost(
          SavePostRequest.builder().setpostId(payload.postId).build()
        );
        // await dispatch(
        //   showToastMessage({
        //     isToast: true,
        //     message: saved ? POST_UNSAVED_SUCCESS : POST_SAVED_SUCCESS,
        //   }) as any,
        // );
        return savePostResponse;
      } catch (error) {
        // dispatch(
        //   showToastMessage({
        //     isToast: true,
        //     message: SOMETHING_WENT_WRONG,
        //   }) as any,
        // );
      }
    }
  
    useEffect(() => {
      setFeedFetching(true);
    }, []);
    // this calls the getFeed api whenever the page number gets changed
    useEffect(() => {
      if (accessToken) {
        // fetch feed
        fetchFeed();       
      }
    }, [accessToken, feedPageNumber, fetchFeed]);
  
    // this function closes the post action list modal
    const closePostActionListModal = () => {
      setShowActionListModal(false);
    };
  
    // this function handles the functionality on the pin option
    const handlePinPost = async (id: string, pinned?: boolean) => {
      const payload = {
        postId: id,
      };
      dispatch({
        type: PIN_POST_STATE,
        payload: payload.postId,
      });
      const pinPostResponse = await myClient?.pinPost(
        PinPostRequest.builder().setpostId(payload.postId).build()
      );
      if (pinPostResponse) {
        // dispatch(
        //   showToastMessage({
        //     isToast: true,
        //     message: pinned ? POST_UNPIN_SUCCESS : POST_PIN_SUCCESS,
        //   }) as any,
        // );
      }
      return pinPostResponse;
    };
  
    // this function handles the functionality on the report option
    const handleReportPost = async () => {
      setShowReportModal(true);
    };
  
    // this function handles the functionality on the delete option
    const handleDeletePost = async (visible: boolean) => {
      setDeleteModal(visible);
    };
  
    // this function returns the id of the item selected from menu list and handles further functionalities accordingly
    const onMenuItemSelect = (
      postId: string,
      itemId?: number,
      pinnedValue?: boolean
    ) => {
      setSelectedMenuItemPostId(postId);
      if (itemId === PIN_POST_MENU_ITEM || itemId === UNPIN_POST_MENU_ITEM) {
        handlePinPost(postId, pinnedValue);
      }
      if (itemId === REPORT_POST_MENU_ITEM) {
        handleReportPost();
      }
      if (itemId === DELETE_POST_MENU_ITEM) {
        handleDeletePost(true);
      }
      if (itemId === EDIT_POST_MENU_ITEM) {
        NavigationService.navigate(CREATE_POST, postId);
      }
    };
  
    // this function gets the detail pf post whose menu item is clicked
    const getPostDetail = () => {
      const postDetail = feedData.find(
        (item: LMPostUI) => item.id === selectedMenuItemPostId
      );
      return postDetail;
    };
  
    // keyExtractor of feed list
    // const keyExtractor = (item: LMPostUI) => {
    //   const id = item?.id;
    //   const itemLiked = item?.isLiked;
    //   const itemPinned = item?.isPinned;
    //   const itemComments = item?.commentsCount;
    //   const itemSaved = item?.isSaved;
    //   const itemText = item?.text;
  
    //   return `${id}${itemLiked}${itemPinned}${itemComments}${itemSaved}${itemText}`;
    // };
  
    const renderLoader = () => {
      return <LMLoader />;
    };
  
    return (<>     
        {/* posts list section */}
        {!feedFetching ? (
          feedData?.length > 0 ? (
            <FlatList
              ref={listRef}
              refreshing={refreshing}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={feedData}
              renderItem={({ item }: { item: LMPostUI }) => (
                <TouchableOpacity
                  disabled={
                    item?.attachments &&
                    item?.attachments?.filter(
                      (media) =>
                        media?.attachmentType === IMAGE_ATTACHMENT_TYPE ||
                        media?.attachmentType === VIDEO_ATTACHMENT_TYPE
                    ).length >= 2
                      ? true
                      : false
                  }
                  activeOpacity={0.8}
                  style={{ marginBottom: 10, backgroundColor: "#e0e0e0" }}
                  onPress={() => {
                    // dispatch(clearPostDetail() as any);
                    NavigationService.navigate(POST_DETAIL, [
                      item?.id,
                      NAVIGATED_FROM_POST,
                    ]);
                  }}
                >
                  <LMPost
                    post={item}
                    // header props
                    headerProps={{
                      post: item,
                      postMenu: {
                        postId: item?.id,
                        menuItems: item?.menuItems,
                        modalPosition: modalPosition,
                        modalVisible: showActionListModal,
                        onCloseModal: closePostActionListModal,
                        onSelected: (postId, itemId) =>
                          onMenuItemSelect(postId, itemId, item?.isPinned),
                      },
                      onTap: () => {},
                      showMenuIcon: true,
                      showMemberStateLabel: true,
                    }}
                    // footer props
                    footerProps={{
                      isLiked: item?.isLiked,
                      isSaved: item?.isSaved,
                      likesCount: item?.likesCount,
                      commentsCount: item?.commentsCount,
                      showBookMarkIcon: true,
                      showShareIcon: true,
                      likeIconButton: {
                        onTap: () => {
                          debouncedLikeFunction(item?.id);
                        },
                      },
                      saveButton: {
                        onTap: () => {
                          debouncedSaveFunction(item?.id, item?.isSaved);
                        },
                      },
                      likeTextButton: {
                        onTap: () => {
                          //   dispatch(postLikesClear() as any);
                          NavigationService.navigate(LIKES_LIST, [
                            POST_LIKES,
                            item?.id,
                          ]);
                        },
                      },
                      commentButton: {
                        onTap: () => {
                          //   dispatch(clearPostDetail() as any);
                          NavigationService.navigate(POST_DETAIL, [
                            item?.id,
                            NAVIGATED_FROM_COMMENT,
                          ]);
                        },
                      },
                    }}
                    mediaProps={{
                      attachments: item?.attachments ? item.attachments : [],
                      videoProps: { videoUrl: "", showControls: true },
                      carouselProps: {
                        attachments: item?.attachments ? item.attachments : [],
                        videoItem: { videoUrl: "", showControls: true },
                      },
                    }}
                  />
                </TouchableOpacity>
              )}
              // keyExtractor={item => keyExtractor(item)}
              // estimatedItemSize={500}
              onEndReachedThreshold={0.3}
              onEndReached={() => {
                setFeedPageNumber(feedPageNumber + 1);
              }}
              ListFooterComponent={<>{showLoader > 0 && renderLoader()}</>}
              // onViewableItemsChanged={({changed, viewableItems}) => {
              //   if (changed) {
              //     if (viewableItems) {
              //       // dispatch(
              //       //   autoPlayPostVideo(viewableItems?.[0]?.item?.id) as any,
              //       // );
              //     }
              //   }
              // }}
              // viewabilityConfig={{viewAreaCoveragePercentThreshold: 60}}
            />
          ) : (
            <View style={styles.noDataView}>
              <Text>No Post</Text>
            </View>
          )
        ) : (
          <View style={styles.loaderView}>{!localRefresh && <LMLoader />}</View>
        )}

        {/* delete post modal */}
        {showDeleteModal && (
          <DeleteModal
            visible={showDeleteModal}
            displayModal={(visible) => handleDeletePost(visible)}
            deleteType={POST_TYPE}
            postDetail={getPostDetail()}
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
  
  export default PostsList;
  