import React from 'react';
import {PostDetail, usePostDetailContext} from '@likeminds.community/feed-rn-core';

const DetailScreen = ({navigation}) => {
  const {route, getCommentsReplies, addNewComment, addNewReply, commentLikeHandler, handleDeleteComment, handleEditComment, handleReportComment, handleScreenBackPress, onCommentOverflowMenuClick} = usePostDetailContext();

  const customGetCommentsRepliesProp = (postId, commentId, repliesResponseCallback, pageNo) => {
    console.log('before getComment');
    getCommentsReplies(postId, commentId, repliesResponseCallback, pageNo);
    console.log('after getComment');
  };
  const customAddNewCommentProp = (postId) => {
    console.log('before new comment');
    addNewComment(postId);
    console.log('after new comment', postId);
  };
  const customAddNewReplyProp = (postId, commentId) => {
    console.log('before add reply');
    addNewReply(postId, commentId);
    console.log('after add reply',);
  };
  const customCommentLikeHandlerProp = (postId, commentId) => {
    console.log('before like comment');
    commentLikeHandler(postId, commentId);
    console.log('after like comment');
  };
  const customOnCommentDelete = (visible, commentId) => {
    //todo: isCM
    console.log('before comment delete',commentId);
    handleDeleteComment(visible);
    console.log('after comment delete');
  };
  const customOnCommentEdit = (commentId) => {
    console.log('before comment edit');
    handleEditComment(commentId);
    console.log('after comment edit');
  };
  const customOnCommentReport = (commentId) => {
    console.log('before comment report',commentId);
    handleReportComment();
    console.log('after comment report');
  };
  const customBackHandler = () => {
    console.log('before back click');
    handleScreenBackPress()
    console.log('after back click');
  };
  const customCommentOverlayMenuCick = (event, menuItems, commentId) => {
    console.log('before comment menuItemClick',commentId, menuItems);
    onCommentOverflowMenuClick(event);
    console.log('after comment menuItemClick');
  };
  return (
    <PostDetail
      route={route}
      navigation={navigation}
      getCommentsRepliesProp={(postId, commentId, repliesResponseCallback, pageNo) => customGetCommentsRepliesProp(postId, commentId, repliesResponseCallback, pageNo)}
      addNewCommentProp={(id) => customAddNewCommentProp(id)}
      addNewReplyProp={(postId, commentId) => customAddNewReplyProp(postId, commentId)}
      commentLikeHandlerProp={(postId, commentId) => customCommentLikeHandlerProp(postId, commentId)}
      handleDeleteCommentProp={(visible,commentId) => customOnCommentDelete(visible,commentId)}
      handleEditCommentProp={(id) => customOnCommentEdit(id)}
      handleReportCommentProp={(commentId) => customOnCommentReport(commentId)}
      handleScreenBackPressProp={() => customBackHandler()}
      onCommentOverflowMenuClickProp={(event, menuItems, commentId) => customCommentOverlayMenuCick(event, menuItems, commentId)}
    />
  );
};

export default DetailScreen;
