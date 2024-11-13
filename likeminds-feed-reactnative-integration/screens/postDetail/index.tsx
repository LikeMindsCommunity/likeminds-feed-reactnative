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
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, ReactNode } from "react";
import { POST_LIKES_LIST } from "../../constants/screenNames";
import {
  COMMENT_LIKES,
  COMMENT_TYPE,
  DELETE_COMMENT_MENU_ITEM,
  EDIT_COMMENT_MENU_ITEM,
  POST_LIKES,
  POST_TYPE,
  REPLY_TYPE,
  REPORT_COMMENT_MENU_ITEM,
  STATE_ADMIN,
  VIEW_MORE_TEXT,
} from "../../constants/Strings";
import { DeleteModal, ReportModal } from "../../customModals";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "./styles";
import Layout from "../../constants/Layout";
import {
  nameInitials,
  replaceLastMention,
  routeToMentionConverter,
} from "../../utils";
import { autoPlayPostVideo } from "../../store/actions/feed";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { clearComments, clearPostDetail } from "../../store/actions/postDetail";
import {
  PostDetailContextProvider,
  PostDetailContextValues,
  PostDetailCustomisableMethodsContextProvider,
  usePostDetailContext,
  usePostDetailCustomisableMethodsContext,
} from "../../context";
import { postLikesClear } from "../../store/actions/postLikes";
import LMHeader from "../../components/LMHeader";
import LMLoader from "../../components/LMLoader";
import LMCommentItem from "../../components/LMCommentItem";
import LMPost from "../../components/LMPost/LMPost";
import {
  LMMenuItemsViewData,
  LMUserViewData,
  RootStackParamList,
} from "../../models";
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
import {
  SET_FLOW_TO_POST_DETAIL_SCREEN,
  SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
} from "../../store/types/types";
import STYLES from "../../constants/Styles";
import pluralizeOrCapitalize from "../../utils/variables";
import { CommunityConfigs } from "../../communityConfigs";
import { WordAction } from "../..//enums/Variables";

interface PostDetailProps {
  children?: React.ReactNode;
  navigation?: NativeStackNavigationProp<RootStackParamList, "PostDetail">;
  route?: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
  getCommentsRepliesProp?: (
    postId: string,
    commentId: string,
    repliesResponseCallback: any,
    pageNo: number
  ) => void;
  addNewCommentProp?: (postId: string) => void;
  addNewReplyProp?: (postId: string, commentId: string) => void;
  commentLikeHandlerProp?: (postId: string, commentId: string) => void;
  handleReportCommentProp?: (commentId: string) => void;
  handleDeleteCommentProp?: (visible: boolean, commentId: string) => void;
  handleEditCommentProp?: (commentId: string) => void;
  handleScreenBackPressProp?: () => void;
  onCommentOverflowMenuClickProp?: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    menuItems: LMMenuItemsViewData[],
    commentId: string
  ) => void;
  onSharePostClicked?: (id: string) => void;
  onSubmitButtonClicked: any;
  onAddPollOptionsClicked: any;
  onPollOptionClicked: any;
  isHeadingEnabled?: boolean;
  isTopResponse?: boolean;
  lmPostCustomFooter?: ReactNode;
  customWidgetPostView?: ReactNode;
  hideTopicsView?: boolean;
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
  isHeadingEnabled,
  isTopResponse,
  lmPostCustomFooter,
  customWidgetPostView,
  hideTopicsView = false
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
        isHeadingEnabled={isHeadingEnabled}
        isTopResponse={isTopResponse}
        lmPostCustomFooter={lmPostCustomFooter}
        hideTopicsView={hideTopicsView}
        customWidgetPostView={customWidgetPostView}
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
    setCommentOnFocus,
    commentOnFocus,
  }: PostDetailContextValues = usePostDetailContext();
  const postListStyle = STYLES.$POST_LIST_STYLE;
  const postDetailStyle = STYLES.$POST_DETAIL_STYLE;
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
    isHeadingEnabled,
    isTopResponse,
    lmPostCustomFooter,
    hideTopicsView,
    customWidgetPostView,
  } = usePostDetailCustomisableMethodsContext();
  const postHeaderStyle: any = postListStyle?.header;
  const customScreenHeader: any = postDetailStyle?.screenHeader;
  const customCommentItemStyle: any = postDetailStyle?.commentItemStyle;
  const customReplyingViewStyle: any = postDetailStyle?.replyingViewStyle;
  const customCommentTextInput: any = postDetailStyle?.commentTextInputStyle;
  const loggedInUserMemberRights = useAppSelector(
    (state) => state.login.memberRights
  );
  const commentingRight = loggedInUserMemberRights.find(
    (item) => item.state === 10
  );
  const memberData = useAppSelector((state) => state.login.member);
  const isCM = memberData?.state === STATE_ADMIN;
  const { repliesArrayUnderComments } = usePostDetailContext();

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
        isHeadingEnabled={isHeadingEnabled}
        isTopResponse={isTopResponse}
        customFooter={lmPostCustomFooter}
        hideTopicsView={hideTopicsView ?? false}
        customWidgetPostView={customWidgetPostView}
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
        new Map<string, string>([[Keys.POST_ID, postDetail?.id]])
      );
    }
  }, [postDetail?.replies?.length]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        dispatch({
          type: SET_FLOW_TO_POST_DETAIL_SCREEN,
          body: { flowToPostDetailScreen: false },
        });
        return true;
      }
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.flexView}>
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
            customScreenHeader?.heading ? customScreenHeader?.heading : (pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.post ?? "post",WordAction.firstLetterCapitalSingular))
          }
          subHeading={
            customScreenHeader?.subHeading
              ? customScreenHeader?.subHeading
              : postDetail?.id
              ? postDetail?.commentsCount > 1
                ? `${postDetail?.commentsCount} ${(pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalPlural))}`
                : `${postDetail?.commentsCount} ${(pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalSingular))}`
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

                          {/* Divider */}

                          {!postDetailStyle.shouldHideSeparator ? (
                            <View
                              style={{
                                height: 11,
                                backgroundColor: STYLES.$IS_DARK_THEME
                                  ? STYLES.$SEPARATOR_COLORS.DARK
                                  : STYLES.$SEPARATOR_COLORS.LIGHT,
                              }}
                            />
                          ) : null}

                          {postDetail?.commentsCount > 0 && (
                            <Text
                              style={[
                                styles.commentCountText,
                                postDetailStyle?.commentCountHeadingText,
                              ]}
                            >
                              {postDetail.commentsCount > 1
                                ? `${postDetail.commentsCount} ${(pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalPlural))}`
                                : `${postDetail.commentsCount} ${(pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalSingular))}`}
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
                                    <Text
                                      style={{
                                        fontFamily: STYLES.$FONT_TYPES.MEDIUM,
                                      }}
                                    >
                                      View more {(pluralizeOrCapitalize((CommunityConfigs.getCommunityConfigs("feed_metadata"))?.value.comment ?? "comment",WordAction.firstLetterCapitalPlural))}
                                    </Text>
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
                            No {(pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalSingular))} found
                          </Text>
                          <Text
                            style={[
                              styles.lightGreyColorText,
                              postDetailStyle?.noCommentSubHeadingTextStyle,
                            ]}
                          >
                            Be the first one to create a {(pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalSingular))}
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
                  renderItem={({ item }: { item: LMUserViewData }) => {
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
                              <Text
                                style={{
                                  fontFamily: STYLES.$FONT_TYPES.MEDIUM,
                                }}
                              >
                                {nameInitials(item?.name)}
                              </Text>
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
                        <LMLoader size={"small"} />
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
            <Text
              style={{
                color: STYLES.$IS_DARK_THEME
                  ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                  : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
                fontFamily: STYLES.$FONT_TYPES.LIGHT,
              }}
            >
              Deleted {pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.post ?? "post",WordAction.allSmallSingular)}
            </Text>
          </View>
        ) : null}
        {/* input field */}
        {postDetail?.id && !showLoader ? (
          isCM ? (
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
                  : `Write a ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.allSmallSingular)}`
              }
              placeholderTextColor={
                customCommentTextInput?.placeholderTextColor
                  ? customCommentTextInput?.placeholderTextColor
                  : STYLES.$IS_DARK_THEME
                  ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                  : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
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
                  iconStyle: {
                    opacity: commentToAdd ? 1 : 0.7,
                  },
                  color: STYLES.$COLORS.PRIMARY,
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
                  : false
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
          ) : commentingRight?.isSelected ? (
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
                  : `Write a ${(pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalSingular))}`
              }
              placeholderTextColor={
                customCommentTextInput?.placeholderTextColor
                  ? customCommentTextInput?.placeholderTextColor
                  : STYLES.$IS_DARK_THEME
                  ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                  : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
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
                  iconStyle: {
                    opacity: commentToAdd ? 1 : 0.7,
                  },
                  color: STYLES.$COLORS.PRIMARY,
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
                  : false
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
          ) : (
            !showLoader && (
              <View style={styles.textContainer}>
                <Text style={styles.disabledText}>
                  You don't have permission to {(pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalSingular))}
                </Text>
              </View>
            )
          )
        ) : null}
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
          repliesArrayUnderComments={repliesArrayUnderComments}
        />
      )}
      {/* report post modal */}
      {showReportModal && (
        <ReportModal
          visible={showReportModal}
          closeModal={() => {
            dispatch({
              type: SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
              body: { reportModalStatus: false },
            });
            setShowReportModal(false);
          }}
          reportType={
            selectedMenuItemPostId
              ? POST_TYPE
              : commentOnFocus?.level > 0
              ? REPLY_TYPE
              : COMMENT_TYPE
          }
          postDetail={postDetail}
          commentDetail={getCommentDetail(postDetail?.replies)?.commentDetail}
        />
      )}
      {/* menu list modal */}
      {showActionListModal && (
        <LMPostMenu
          post={overlayMenuType === POST_TYPE ? postDetail : commentOnFocus}
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
