import {
  BackHandler,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { POST_LIKES_LIST, UNIVERSAL_FEED } from "../../constants/screenNames";
import {
  COMMENT_LIKES,
  COMMENT_TYPE,
  DELETE_COMMENT_MENU_ITEM,
  EDIT_COMMENT_MENU_ITEM,
  POST_LIKES,
  POST_TYPE,
  REPORT_COMMENT_MENU_ITEM,
  VIEW_MORE_TEXT,
} from "../../constants/Strings";
import { DeleteModal, ReportModal } from "../../customModals";
import { styles } from "./styles";
import Layout from "../../constants/Layout";
import {
  nameInitials,
  replaceLastMention,
  routeToMentionConverter,
} from "../../utils";
import { useLMFeedStyles } from "../../lmFeedProvider";
import { useAppDispatch } from "../../store/store";
import { clearComments, clearPostDetail } from "../../store/actions/postDetail";
import {
  PostDetailContextProvider,
  PostDetailContextValues,
  PostDetailCustomisableMethodsContextProvider,
  usePostDetailContext,
  usePostDetailCustomisableMethodsContext,
} from "../../context";
import { postLikesClear } from "../../store/actions/postLikes";
import { SafeAreaView } from "react-native-safe-area-context";
import { LMCommentItem, LMHeader, LMLoader, LMPost } from "../../components";
import { LMMenuItemsUI, LMUserUI, RootStackParamList } from "../../models";
import {
  LMIcon,
  LMInputText,
  LMProfilePicture,
  LMText,
} from "../../uiComponents";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LMPostMenu from "../../customModals/LMPostMenu";
import { LMFeedAnalytics } from "../../analytics/LMFeedAnalytics";
import { Events } from "../../enums/Events";
import { Keys } from "../../enums/Keys";
import { PollCustomisableMethodsContextProvider } from "../../context/pollCustomisableCallback";
import { ScreenNames } from "../../enums/ScreenNames";

interface PostDetailProps {
  children: React.ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList, "PostDetail">;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
  getCommentsRepliesProp: (
    postId: string,
    commentId: string,
    repliesResponseCallback: any,
    pageNo: number
  ) => void;
  addNewCommentProp: (postId: string) => void;
  addNewReplyProp: (postId: string, commentId: string) => void;
  commentLikeHandlerProp: (postId: string, commentId: string) => void;
  handleReportCommentProp: (commentId: string) => void;
  handleDeleteCommentProp: (visible: boolean, commentId: string) => void;
  handleEditCommentProp: (commentId: string) => void;
  handleScreenBackPressProp: () => void;
  onCommentOverflowMenuClickProp: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    menuItems: LMMenuItemsUI[],
    commentId: string
  ) => void;
  onSharePostClicked: (id: string) => void;
  onSubmitButtonClicked: any;
  onAddPollOptionsClicked: any;
  onPollOptionClicked: any;
}

const PostDetail = ({
  navigation,
  route,
  children,
  getCommentsRepliesProp,
  commentLikeHandlerProp,
  addNewCommentProp,
  addNewReplyProp,
  handleDeleteCommentProp,
  handleEditCommentProp,
  handleReportCommentProp,
  handleScreenBackPressProp,
  onCommentOverflowMenuClickProp,
  onSharePostClicked,
  onSubmitButtonClicked,
  onAddPollOptionsClicked,
  onPollOptionClicked,
}: PostDetailProps) => {
  return (
    <PollCustomisableMethodsContextProvider
      onSubmitButtonClicked={onSubmitButtonClicked}
      onAddPollOptionsClicked={onAddPollOptionsClicked}
      onPollOptionClicked={onPollOptionClicked}
    >
      <PostDetailCustomisableMethodsContextProvider
        getCommentsRepliesProp={getCommentsRepliesProp}
        commentLikeHandlerProp={commentLikeHandlerProp}
        addNewCommentProp={addNewCommentProp}
        addNewReplyProp={addNewReplyProp}
        handleDeleteCommentProp={handleDeleteCommentProp}
        handleEditCommentProp={handleEditCommentProp}
        handleReportCommentProp={handleReportCommentProp}
        handleScreenBackPressProp={handleScreenBackPressProp}
        onCommentOverflowMenuClickProp={onCommentOverflowMenuClickProp}
        onSharePostClicked={onSharePostClicked}
      >
        <PostDetailComponent />
      </PostDetailCustomisableMethodsContextProvider>
    </PollCustomisableMethodsContextProvider>
  );
};

const PostDetailComponent = React.memo(() => {
  const dispatch = useAppDispatch();
  const {
    keyboardIsVisible,
    postDetail,
    navigation,
    allTags,
    isUserTagging,
    refreshing,
    replyOnComment,
    onRefresh,
    getCommentDetail,
    getCommentsReplies,
    setReplyOnComment,
    setReplyToUsername,
    modalPositionComment,
    localModalVisibility,
    showCommentActionListModal,
    commentLikeHandler,
    setCommentPageNumber,
    commentPageNumber,
    localRefresh,
    replyToUsername,
    setCommentToAdd,
    commentToAdd,
    taggedUserName,
    setAllTags,
    setIsUserTagging,
    handleLoadMore,
    isLoading,
    handleInputChange,
    routeParams,
    navigatedFromComments,
    showReportModal,
    setShowReportModal,
    showDeleteModal,
    selectedMenuItemPostId,
    userTaggingListHeight,
    editCommentFocus,
    commentFocus,
    commentEdit,
    addNewComment,
    handleDeleteComment,
    addNewReply,
    handleDeletePost,
    myRef,
    keyboardFocusOnReply,
    setKeyboardFocusOnReply,
    showRepliesOfCommentId,
    setSelectedMenuItemCommentId,
    setSelectedMenuItemPostId,
    handleReportComment,
    handleEditComment,
    handleScreenBackPress,
    onCommentOverflowMenuClick,
    modalPosition,
    showActionListModal,
    closePostActionListModal,
    onMenuItemSelect,
    overlayMenuType,
    handlePostLoadMore,
    renderLoader,
    setCommentFocus,
    onOverlayMenuClick,
    postLikeHandler,
    savePostHandler,
    showLoader,
    setShowLoader,
    setShowRepliesOfCommentId,
  }: PostDetailContextValues = usePostDetailContext();

  const LMFeedContextStyles = useLMFeedStyles();
  const { postDetailStyle, postListStyle }: any = LMFeedContextStyles;
  const {
    getCommentsRepliesProp,
    commentLikeHandlerProp,
    addNewCommentProp,
    addNewReplyProp,
    handleDeleteCommentProp,
    handleEditCommentProp,
    handleReportCommentProp,
    handleScreenBackPressProp,
    onCommentOverflowMenuClickProp,
    onSharePostClicked,
  } = usePostDetailCustomisableMethodsContext();
  const postHeaderStyle: any = postListStyle?.header;
  const customScreenHeader: any = postDetailStyle?.screenHeader;
  const customCommentItemStyle: any = postDetailStyle?.commentItemStyle;
  const customReplyingViewStyle: any = postDetailStyle?.replyingViewStyle;
  const customCommentTextInput: any = postDetailStyle?.commentTextInputStyle;

  // this function returns the id of the item selected from menu list and handles further functionalities accordingly for comment
  const onCommentMenuItemSelect = async (
    commentId: string,
    itemId?: number
  ) => {
    setSelectedMenuItemPostId("");
    setSelectedMenuItemCommentId(commentId);
    if (itemId === REPORT_COMMENT_MENU_ITEM) {
      handleReportCommentProp
        ? handleReportCommentProp(commentId)
        : handleReportComment();
    }
    if (itemId === DELETE_COMMENT_MENU_ITEM) {
      handleDeleteCommentProp
        ? handleDeleteCommentProp(true, commentId)
        : handleDeleteComment(true);
    }
    if (itemId === EDIT_COMMENT_MENU_ITEM) {
      handleEditCommentProp
        ? handleEditCommentProp(commentId)
        : handleEditComment(commentId);
    }
  };

  // this renders the postDetail view
  const renderPostDetail = () => {
    return (
      <LMPost
        post={postDetail}
        // header props
        headerProps={{
          onOverlayMenuClick: (event) =>
            onOverlayMenuClick(event, postDetail?.id),
        }}
        // footer props
        footerProps={{
          likeIconButton: {
            onTap: () => {
              postLikeHandler(postDetail?.id);
            },
          },
          saveButton: {
            onTap: () => {
              savePostHandler(postDetail?.id, postDetail?.isSaved);
            },
          },
          likeTextButton: {
            onTap: () => {
              dispatch(postLikesClear());
              navigation.navigate(POST_LIKES_LIST, [
                POST_LIKES,
                postDetail?.id,
              ]);
            },
          },
          commentButton: {
            onTap: () => {
              setCommentFocus(true);
            },
          },
          shareButton: {
            onTap: () => {
              onSharePostClicked ? onSharePostClicked(postDetail?.id) : {};
            },
          },
        }}
        mediaProps={{
          videoProps: {
            autoPlay:
              postListStyle?.media?.video?.autoPlay != undefined
                ? postListStyle?.media?.video?.autoPlay
                : true,
            videoInFeed: false,
          },
        }}
      />
    );
  };

  useEffect(() => {
    if (postDetail?.replies?.length > 0) {
      LMFeedAnalytics.track(
        Events.COMMENT_LIST_OPEN,
        new Map<string, string>([
          [Keys.SCREEN_NAME, ScreenNames.POST_DETAIL_SCREEN],
          [Keys.POST_ID, postDetail?.id],
        ])
      );
    }
  }, [postDetail?.replies?.length]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        dispatch(clearPostDetail());
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 1000);
  }, []);
  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.flexView}>
      <KeyboardAvoidingView
        enabled={true}
        behavior={"height"}
        style={styles.flexView}
      >
        {/* header view */}
        <LMHeader
          showBackArrow={
            customScreenHeader?.showBackArrow != undefined
              ? customScreenHeader?.showBackArrow
              : true
          }
          heading={
            customScreenHeader?.heading ? customScreenHeader?.heading : "Post"
          }
          subHeading={
            customScreenHeader?.subHeading
              ? customScreenHeader?.subHeading
              : postDetail?.id
              ? postDetail?.commentsCount > 1
                ? `${postDetail?.commentsCount} comments`
                : `${postDetail?.commentsCount} comment`
              : ""
          }
          onBackPress={() => {
            handleScreenBackPressProp
              ? handleScreenBackPressProp()
              : handleScreenBackPress();
          }}
          rightComponent={customScreenHeader?.rightComponent}
          backIcon={customScreenHeader?.backIcon}
          subHeadingTextStyle={customScreenHeader?.subHeadingTextStyle}
          headingTextStyle={customScreenHeader?.headingTextStyle}
          headingViewStyle={customScreenHeader?.headingViewStyle}
        />
        {/* {postDetail?.id != '' ? < */}
        {showLoader ? (
          <View style={styles.loaderView}>
            <LMLoader />
          </View>
        ) : null}
        {postDetail?.id && !showLoader ? (
          <>
            {Object.keys(postDetail).length > 0 ? (
              <View
                style={StyleSheet.flatten([
                  styles.mainContainer,
                  {
                    paddingBottom:
                      allTags && isUserTagging
                        ? 0
                        : replyOnComment.textInputFocus
                        ? Platform.OS === "android"
                          ? keyboardFocusOnReply
                            ? //  navigatedFromComments
                              //   ? Layout.normalize(119)
                              //   :
                              Layout.normalize(119)
                            : Layout.normalize(64)
                          : Layout.normalize(64)
                        : Layout.normalize(89),
                  },
                ])}
              >
                <>
                  {/* this renders when the post has commentsCount greater than 0 */}
                  <View>
                    <FlatList
                      refreshing={refreshing}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                        />
                      }
                      keyboardShouldPersistTaps={"handled"}
                      ListHeaderComponent={
                        // this renders the post section
                        <>
                          {renderPostDetail()}
                          {postDetail?.commentsCount > 0 && (
                            <Text
                              style={[
                                styles.commentCountText,
                                postDetailStyle?.commentCountHeadingText,
                              ]}
                            >
                              {postDetail.commentsCount > 1
                                ? `${postDetail.commentsCount} Comments`
                                : `${postDetail.commentsCount} Comment`}
                            </Text>
                          )}
                        </>
                      }
                      data={postDetail?.replies}
                      renderItem={({ item }) => {
                        // this renders the comments section
                        return (
                          <>
                            {item && (
                              <LMCommentItem
                                comment={item}
                                isRepliesVisible={
                                  item?.id === showRepliesOfCommentId
                                }
                                // this calls the getCommentsReplies function on click of number of child replies text
                                onTapReplies={(
                                  repliesResponseCallback,
                                  commentIdOfReplies
                                ) => {
                                  dispatch(clearComments(item?.id));
                                  setShowRepliesOfCommentId(commentIdOfReplies);
                                  getCommentsRepliesProp
                                    ? getCommentsRepliesProp(
                                        item?.postId,
                                        item?.id,
                                        repliesResponseCallback,
                                        1
                                      )
                                    : getCommentsReplies(
                                        item?.postId,
                                        item?.id,
                                        repliesResponseCallback,
                                        1
                                      );
                                  customCommentItemStyle?.onTapReplies &&
                                    customCommentItemStyle?.onTapReplies();
                                }}
                                // this handles the pagination of child replies on click of view more
                                onTapViewMore={(
                                  pageValue,
                                  repliesResponseCallback
                                ) => {
                                  getCommentsReplies(
                                    item?.postId,
                                    item?.id,
                                    repliesResponseCallback,
                                    pageValue
                                  );
                                  customCommentItemStyle?.onTapViewMore &&
                                    customCommentItemStyle?.onTapViewMore();
                                }}
                                // this hanldes the functionality on click of reply text to add reply to an comment
                                replyTextProps={{
                                  ...customCommentItemStyle?.replyTextProps,
                                  onTap: () => {
                                    setKeyboardFocusOnReply(true);
                                    setReplyOnComment({
                                      textInputFocus: true,
                                      commentId: item?.id,
                                    });
                                    setReplyToUsername(item?.user?.name);
                                    customCommentItemStyle?.replyTextProps
                                      ?.onTap &&
                                      customCommentItemStyle?.replyTextProps?.onTap();
                                  },
                                }}
                                // view more text style
                                viewMoreRepliesProps={{
                                  ...customCommentItemStyle?.viewMoreRepliesProps,
                                  children: customCommentItemStyle
                                    ?.viewMoreRepliesProps?.children ? (
                                    customCommentItemStyle?.viewMoreRepliesProps
                                      ?.children
                                  ) : (
                                    <Text>{VIEW_MORE_TEXT}</Text>
                                  ),
                                  textStyle: customCommentItemStyle
                                    ?.viewMoreRepliesProps?.textStyle
                                    ? customCommentItemStyle
                                        ?.viewMoreRepliesProps?.textStyle
                                    : styles.viewMoreText,
                                }}
                                menuIcon={{
                                  ...postHeaderStyle?.menuIcon,
                                  onTap: () => {
                                    setReplyOnComment({
                                      textInputFocus: false,
                                      commentId: "",
                                    });
                                    postHeaderStyle?.menuIcon?.onTap();
                                  },
                                }}
                                // this executes on click of like icon of comment
                                likeIconButton={{
                                  ...postListStyle?.footer?.likeIconButton,
                                  onTap: (id) => {
                                    commentLikeHandlerProp
                                      ? commentLikeHandlerProp(item?.postId, id)
                                      : commentLikeHandler(item?.postId, id);
                                    postListStyle?.footer?.likeIconButton?.onTap();
                                  },
                                }}
                                // this executes on click of like text of comment
                                likeTextButton={{
                                  ...postListStyle?.footer?.likeTextButton,
                                  onTap: (id) => {
                                    dispatch(postLikesClear());
                                    navigation.navigate(POST_LIKES_LIST, [
                                      COMMENT_LIKES,
                                      id,
                                      item?.postId,
                                    ]);
                                    postListStyle?.footer?.likeTextButton?.onTap();
                                  },
                                }}
                                commentUserNameStyle={
                                  customCommentItemStyle?.commentUserNameStyle
                                }
                                commentContentProps={
                                  customCommentItemStyle?.commentContentProps
                                }
                                showMoreProps={
                                  postListStyle?.postContent?.showMoreText
                                }
                                repliesCountTextStyle={
                                  customCommentItemStyle?.repliesCountTextStyle
                                }
                                timeStampStyle={
                                  customCommentItemStyle?.timeStampStyle
                                }
                                onCommentOverflowMenuClick={(
                                  event,
                                  commentId
                                ) => {
                                  onCommentOverflowMenuClickProp
                                    ? onCommentOverflowMenuClickProp(
                                        event,
                                        item?.menuItems,
                                        commentId
                                      )
                                    : onCommentOverflowMenuClick(
                                        event,
                                        commentId
                                      );
                                }}
                              />
                            )}
                          </>
                        );
                      }}
                      ListEmptyComponent={
                        <View
                          style={[
                            styles.noCommentSection,
                            postDetailStyle?.noCommentViewStyle,
                          ]}
                        >
                          <Text
                            style={[
                              styles.noCommentText,
                              postDetailStyle?.noCommentHeadingTextStyle,
                            ]}
                          >
                            No comment found
                          </Text>
                          <Text
                            style={[
                              styles.lightGreyColorText,
                              postDetailStyle?.noCommentSubHeadingTextStyle,
                            ]}
                          >
                            Be the first one to comment
                          </Text>
                        </View>
                      }
                      onEndReachedThreshold={0.3}
                      onEndReached={() => {
                        handlePostLoadMore();
                      }}
                      ListFooterComponent={renderLoader}
                    />
                  </View>
                </>
              </View>
            ) : (
              <View style={styles.loaderView}>
                {!localRefresh && <LMLoader />}
              </View>
            )}
            {/* replying to username view which renders when the user is adding a reply to a comment */}
            {replyOnComment.textInputFocus && (
              <View
                style={[
                  styles.replyCommentSection,
                  {
                    bottom:
                      Platform.OS === "android"
                        ? keyboardIsVisible
                          ? // navigatedFromComments
                            //   ? Layout.normalize(89)
                            //   :
                            Layout.normalize(89)
                          : Layout.normalize(64)
                        : Layout.normalize(64),
                  },
                  customReplyingViewStyle?.replyingView,
                ]}
              >
                {customReplyingViewStyle?.replyingText?.children ? (
                  <LMText {...customReplyingViewStyle?.replyingText} />
                ) : (
                  <Text
                    style={[
                      styles.lightGreyColorText,
                      customReplyingViewStyle?.replyingText?.textStyle,
                    ]}
                  >
                    Replying to {replyToUsername}
                  </Text>
                )}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setReplyOnComment({
                      textInputFocus: false,
                      commentId: "",
                    })
                  }
                  style={customReplyingViewStyle?.cancelReplyIcon?.boxStyle}
                >
                  {customReplyingViewStyle?.cancelReplyIcon?.assetPath ||
                  customReplyingViewStyle?.cancelReplyIcon?.iconUrl ? (
                    <LMIcon {...customReplyingViewStyle?.cancelReplyIcon} />
                  ) : (
                    <Image
                      source={require("../../assets/images/close_icon3x.png")}
                      style={[
                        customReplyingViewStyle?.cancelReplyIcon?.iconStyle,
                        {
                          width: customReplyingViewStyle?.cancelReplyIcon?.width
                            ? customReplyingViewStyle?.cancelReplyIcon?.width
                            : styles.crossIconStyle?.width,
                          height: customReplyingViewStyle?.cancelReplyIcon
                            ?.height
                            ? customReplyingViewStyle?.cancelReplyIcon?.height
                            : styles.crossIconStyle?.height,
                        },
                      ]}
                      tintColor={
                        customReplyingViewStyle?.cancelReplyIcon?.color
                          ? customReplyingViewStyle?.cancelReplyIcon?.color
                          : styles.crossIconStyle?.tintColor
                      }
                      resizeMode={
                        customReplyingViewStyle?.cancelReplyIcon?.boxFit
                      }
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
            {/* users tagging list */}
            {allTags && isUserTagging ? (
              <View
                style={[
                  styles.taggingListView,
                  {
                    paddingBottom: replyOnComment.textInputFocus
                      ? // navigatedFromComments
                        //   ? Layout.normalize(119)
                        //   :
                        Layout.normalize(119)
                      : keyboardIsVisible
                      ? // navigatedFromComments
                        //   ? Layout.normalize(89)
                        //   :
                        Layout.normalize(89)
                      : Layout.normalize(64),
                    maxHeight: 300,
                  },
                  postDetailStyle?.userTaggingListStyle?.taggingListView,
                ]}
              >
                <FlatList
                  data={[...allTags]}
                  renderItem={({ item }: { item: LMUserUI }) => {
                    return (
                      <Pressable
                        onPress={() => {
                          const uuid = item?.sdkClientInfo?.uuid;
                          const res = replaceLastMention(
                            commentToAdd,
                            taggedUserName,
                            item?.name,
                            uuid ? `user_profile/${uuid}` : uuid
                          );
                          setCommentToAdd(res);
                          setAllTags([]);
                          setIsUserTagging(false);
                        }}
                        style={[
                          styles.taggingListItem,
                          postDetailStyle?.userTaggingListStyle?.userTagView,
                        ]}
                        key={item?.id}
                      >
                        <LMProfilePicture
                          {...postHeaderStyle?.profilePicture}
                          fallbackText={{
                            ...postHeaderStyle?.profilePicture?.fallbackText,
                            children: postHeaderStyle?.profilePicture
                              ?.fallbackText?.children ? (
                              postHeaderStyle?.profilePicture?.fallbackText
                                ?.children
                            ) : (
                              <Text>{nameInitials(item?.name)}</Text>
                            ),
                          }}
                          fallbackTextBoxStyle={[
                            styles.taggingListProfileBoxStyle,
                            postHeaderStyle?.profilePicture
                              ?.fallbackTextBoxStyle,
                          ]}
                          size={
                            postHeaderStyle?.profilePicture?.size
                              ? postHeaderStyle?.profilePicture?.size
                              : 40
                          }
                        />

                        <View style={styles.taggingListItemTextView}>
                          <Text
                            style={[
                              styles.taggingListText,
                              postDetailStyle?.userTaggingListStyle
                                ?.userTagNameStyle,
                            ]}
                            numberOfLines={1}
                          >
                            {item?.name}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  }}
                  extraData={{
                    value: [commentToAdd, allTags],
                  }}
                  keyboardShouldPersistTaps={"handled"}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={1}
                  bounces={false}
                  ListFooterComponent={
                    isLoading ? (
                      <View style={styles.taggingLoaderView}>
                        <LMLoader size={15} />
                      </View>
                    ) : null
                  }
                  keyExtractor={(item: any, index) => {
                    return index?.toString();
                  }}
                />
              </View>
            ) : null}
          </>
        ) : !showLoader ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Deleted Post</Text>
          </View>
        ) : null}
        {/* input field */}
        {postDetail?.id && (
          <LMInputText
            {...customCommentTextInput}
            inputText={commentToAdd}
            onType={handleInputChange}
            inputTextStyle={[
              styles.textInputStyle,
              {
                bottom: keyboardIsVisible
                  ? // navigatedFromComments
                    //   ? Layout.normalize(0)
                    //   :
                    Layout.normalize(25)
                  : 0,
              },
              customCommentTextInput?.inputTextStyle,
            ]}
            autoFocus={
              customCommentTextInput?.autoFocus != undefined
                ? customCommentTextInput?.autoFocus
                : routeParams
                ? true
                : keyboardFocusOnReply
                ? true
                : editCommentFocus
                ? true
                : commentFocus
            }
            placeholderText={
              customCommentTextInput?.placeholderText
                ? customCommentTextInput?.placeholderText
                : "Write a comment"
            }
            placeholderTextColor={
              customCommentTextInput?.placeholderTextColor
                ? customCommentTextInput?.placeholderTextColor
                : "#9B9B9B"
            }
            inputRef={myRef}
            rightIcon={{
              ...customCommentTextInput?.rightIcon,
              onTap: () => {
                customCommentTextInput?.rightIcon?.onTap();
                commentToAdd
                  ? editCommentFocus
                    ? commentEdit()
                    : replyOnComment.textInputFocus
                    ? addNewReplyProp
                      ? addNewReplyProp(
                          postDetail?.id,
                          replyOnComment.commentId
                        )
                      : addNewReply(postDetail?.id, replyOnComment.commentId)
                    : addNewCommentProp
                    ? addNewCommentProp(postDetail?.id)
                    : addNewComment(postDetail?.id)
                  : {};
                setAllTags([]);
                setIsUserTagging(false);
              },
              icon: {
                assetPath: require("../../assets/images/send_icon3x.png"),
                iconStyle: { opacity: commentToAdd ? 1 : 0.7 },
                ...customCommentTextInput?.rightIcon?.icon,
              },
              isClickable: commentToAdd
                ? customCommentTextInput?.rightIcon?.isClickable != undefined
                  ? customCommentTextInput?.rightIcon?.isClickable
                  : true
                : false,
            }}
            multilineField={
              customCommentTextInput?.multilineField != undefined
                ? customCommentTextInput?.multilineField
                : true
            }
            partTypes={[
              {
                trigger: "@", // Should be a single character like '@' or '#'
                textStyle: {
                  color: "blue",
                  ...customCommentTextInput?.mentionTextStyle,
                }, // The mention style in the input
              },
            ]}
          />
        )}
      </KeyboardAvoidingView>

      {/* delete post modal */}
      {localModalVisibility && (
        <DeleteModal
          visible={showDeleteModal}
          displayModal={(visible) =>
            selectedMenuItemPostId
              ? handleDeletePost(visible)
              : handleDeleteComment(visible)
          }
          deleteType={selectedMenuItemPostId ? POST_TYPE : COMMENT_TYPE}
          postDetail={postDetail}
          commentDetail={getCommentDetail(postDetail?.replies)?.commentDetail}
          parentCommentId={
            getCommentDetail(postDetail?.replies)?.parentCommentId
          }
          navigation={navigation}
        />
      )}
      {/* report post modal */}
      {showReportModal && (
        <ReportModal
          visible={showReportModal}
          closeModal={() => setShowReportModal(false)}
          reportType={selectedMenuItemPostId ? POST_TYPE : COMMENT_TYPE}
          postDetail={postDetail}
          commentDetail={getCommentDetail(postDetail?.replies)?.commentDetail}
        />
      )}
      {/* menu list modal */}
      {showActionListModal && (
        <LMPostMenu
          post={
            overlayMenuType === POST_TYPE
              ? postDetail
              : getCommentDetail(postDetail?.replies)?.commentDetail
          }
          onSelected={(postId, itemId, isPinned) => {
            overlayMenuType === POST_TYPE
              ? onMenuItemSelect(postId, itemId, isPinned)
              : onCommentMenuItemSelect(postId, itemId);
          }}
          /* @ts-ignore */
          modalPosition={modalPosition}
          modalVisible={showActionListModal}
          onCloseModal={closePostActionListModal}
          menuItemTextStyle={postListStyle?.header?.postMenu?.menuItemTextStyle}
          menuViewStyle={postListStyle?.header?.postMenu?.menuViewStyle}
          backdropColor={postListStyle?.header?.postMenu?.backdropColor}
        />
      )}
    </SafeAreaView>
  );
});

export { PostDetail };
