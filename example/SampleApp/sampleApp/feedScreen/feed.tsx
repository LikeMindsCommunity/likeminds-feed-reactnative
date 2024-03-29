import React from 'react';
import { UniversalFeed, usePostListContext, useUniversalFeedContext} from '@likeminds.community/feed-rn-core';

const Feed = ({route}) => {
  const {
    postLikeHandler,
    savePostHandler,
    handleEditPost,
    handlePinPost,
    onTapCommentCount,
    onTapLikeCount,
    handleDeletePost,
    handleReportPost,
    onOverlayMenuClick
  } = usePostListContext();
  const {navigation, newPostButtonClick} = useUniversalFeedContext()

  const customPostLike = (postId) => {
    console.log('before like ');
    postLikeHandler(postId);
    console.log('after like', postId);
  }; const customPostSave = (postId, saved) => {
    console.log('before save');
    savePostHandler(postId, saved);
    console.log('after save', postId, saved);
  }; const customHandleEdit = (postId) => {
    console.log('before edit select');
    handleEditPost(postId);
    console.log('after edit select', postId);
  }; const customHandlePin = (postId, pinned) => {
    console.log('before pin select');
    handlePinPost(postId, pinned);
    console.log('after pin select', postId, pinned);
  }; 
  const customHandleCommentClick = (postId) => {
    console.log('before comment select');
    onTapCommentCount(postId);
    console.log('after comment select', postId);
  };
  const customHandleLikeCountClick = (postId) => {
    console.log('before like count select');
    onTapLikeCount(postId);
    console.log('after like count select', postId);
  };
  const customHandleDelete = (visible, postId) => {
    //todo: isCM
    console.log('before delete select',postId);
    handleDeletePost(visible);
    console.log('after delete select', visible);
  };
  const customHandleReport = (postId) => {
    console.log('before report select', postId);
    handleReportPost();
    console.log('after report select');
  };
  const customHandleNewPostButton = () => {
    console.log('before new post');
    newPostButtonClick();
    console.log('after new post');
  };
  const customOverlayMenuCick = (event, menuItems, postId) => {
    console.log('before menuItemClick', menuItems, postId);
    onOverlayMenuClick(event);
    console.log('after menuItemClick');
  };
  return (
      <UniversalFeed
        navigation={navigation}
        route={route}
        postLikeHandlerProp={(id) => customPostLike(id)}
        savePostHandlerProp={(id, saved) => customPostSave(id, saved)}
        onSelectCommentCountProp={(id) => customHandleCommentClick(id)}
        selectEditPostProp={(id) => customHandleEdit(id)}
        selectPinPostProp={(id, pinned) => customHandlePin(id, pinned)}
        onTapLikeCountProps={(id) => customHandleLikeCountClick(id)}
        handleDeletePostProps={(visible, postId) => customHandleDelete(visible, postId)}
        handleReportPostProps={(postId) => customHandleReport(postId)}
        newPostButtonClickProps={() => customHandleNewPostButton()}
        onOverlayMenuClickProp={(event, menuItems, postId) => customOverlayMenuCick(event, menuItems, postId)}
      >
      </UniversalFeed>
  );
};

export default Feed;
