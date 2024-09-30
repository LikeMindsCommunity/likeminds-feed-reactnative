import React from 'react';
import {
  PostDetail,
  usePostDetailContext,
  useUniversalFeedContext,
} from '@likeminds.community/feed-rn-core';
import {Alert, Platform, Share} from 'react-native';

const DetailScreen = ({navigation}) => {
  const {
    route,
    getCommentsReplies,
    addNewComment,
    addNewReply,
    commentLikeHandler,
    handleDeleteComment,
    handleEditComment,
    handleReportComment,
    handleScreenBackPress,
    onCommentOverflowMenuClick,
  } = usePostDetailContext();
  const {addPollOption, setSelectedPollOptions, submitPoll} =
    useUniversalFeedContext();

  const customGetCommentsRepliesProp = (
    postId,
    commentId,
    repliesResponseCallback,
    pageNo,
  ) => {
    console.log('before getComment');
    getCommentsReplies(postId, commentId, repliesResponseCallback, pageNo);
    console.log('after getComment');
  };
  const customAddNewCommentProp = postId => {
    console.log('before new comment');
    addNewComment(postId);
    console.log('after new comment', postId);
  };
  const customAddNewReplyProp = (postId, commentId) => {
    console.log('before add reply');
    addNewReply(postId, commentId);
    console.log('after add reply');
  };
  const customCommentLikeHandlerProp = (postId, commentId) => {
    console.log('before like comment');
    commentLikeHandler(postId, commentId);
    console.log('after like comment');
  };
  const customOnCommentDelete = (visible, commentId) => {
    //todo: isCM
    console.log('before comment delete', commentId);
    handleDeleteComment(visible);
    console.log('after comment delete');
  };
  const customOnCommentEdit = commentId => {
    console.log('before comment edit');
    handleEditComment(commentId);
    console.log('after comment edit');
  };
  const customOnCommentReport = commentId => {
    console.log('before comment report', commentId);
    handleReportComment();
    console.log('after comment report');
  };
  const customBackHandler = () => {
    console.log('before back click');
    handleScreenBackPress();
    console.log('after back click');
  };
  const customCommentOverlayMenuCick = (event, menuItems, commentId) => {
    console.log('before comment menuItemClick', commentId, menuItems);
    onCommentOverflowMenuClick(event, commentId);
    console.log('after comment menuItemClick');
  };
  const customShareTap = async postId => {
    console.log('share', postId);
    try {
      const result = await Share.share({
        // todo: static data (replace with the deeplink)
        message:
          Platform.OS === 'ios'
            ? `www.sampleapp.com://post?post_id=${postId}`
            : `https://www.sampleapp.com/post?post_id=${postId}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert((error as Error).message);
    }
  };
  const customPollSubmitButtonClick = payload => {
    console.log('before sumbit poll tap');
    submitPoll(payload);
    console.log('after sumbit poll tap');
  };

  const customAddPollOptionsClick = payload => {
    console.log('before add option click');
    addPollOption(payload);
    console.log('after add option click');
  };

  const customPollOptionClicked = payload => {
    console.log('before option click');
    setSelectedPollOptions(payload);
    console.log('after option click');
  };
  return (
    <PostDetail
      route={route}
      navigation={navigation}
      getCommentsRepliesProp={(
        postId,
        commentId,
        repliesResponseCallback,
        pageNo,
      ) =>
        customGetCommentsRepliesProp(
          postId,
          commentId,
          repliesResponseCallback,
          pageNo,
        )
      }
      addNewCommentProp={id => customAddNewCommentProp(id)}
      addNewReplyProp={(postId, commentId) =>
        customAddNewReplyProp(postId, commentId)
      }
      commentLikeHandlerProp={(postId, commentId) =>
        customCommentLikeHandlerProp(postId, commentId)
      }
      handleDeleteCommentProp={(visible, commentId) =>
        customOnCommentDelete(visible, commentId)
      }
      handleEditCommentProp={id => customOnCommentEdit(id)}
      handleReportCommentProp={commentId => customOnCommentReport(commentId)}
      handleScreenBackPressProp={() => customBackHandler()}
      onCommentOverflowMenuClickProp={(event, menuItems, commentId) =>
        customCommentOverlayMenuCick(event, menuItems, commentId)
      }
      onSharePostClicked={id => customShareTap(id)}
      onSubmitButtonClicked={customPollSubmitButtonClick}
      onAddPollOptionsClicked={customAddPollOptionsClick}
      onPollOptionClicked={customPollOptionClicked}
    />
  );
};

export default DetailScreen;
