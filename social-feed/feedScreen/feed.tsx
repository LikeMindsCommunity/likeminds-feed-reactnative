import React, {useEffect, useState} from 'react';
import {
  LMCreatePostButton,
  LMFilterTopics,
  LMPostUploadIndicator,
  LMUniversalFeedHeader,
  PostsList,
  UniversalFeed,
  usePostListContext,
  useUniversalFeedContext,
} from '@likeminds.community/feed-rn-core';
import {getUniqueId} from 'react-native-device-info';
import {Alert, Platform, Share} from 'react-native';
import {validateRegisterDeviceRequest} from '../registerDeviceApi';
import {pushAPI, token} from '../pushNotification';
import {useAppSelector} from '@likeminds.community/feed-rn-core/store/store';
import FilterTopics from '../components/FilterTopics';
import CreatePostButton from '../components/CreatePostButton';

const Feed = () => {
  const {
    postLikeHandler,
    savePostHandler,
    handleEditPost,
    handlePinPost,
    onTapCommentCount,
    onTapLikeCount,
    handleDeletePost,
    handleReportPost,
    onOverlayMenuClick,
  } = usePostListContext();
  const {
    newPostButtonClick,
    onTapNotificationBell,
    addPollOption,
    setSelectedPollOptions,
    submitPoll,
  } = useUniversalFeedContext();
  const mappedTopics = useAppSelector(state => state.feed.mappedTopics);
  const [FCMToken, setFCMToken] = useState('');

  const customPostLike = postId => {
    console.log('before like ');
    postLikeHandler(postId);
    console.log('after like', postId);
  };
  const customPostSave = (postId, saved) => {
    console.log('before save');
    savePostHandler(postId, saved);
    console.log('after save', postId, saved);
  };
  const customHandleEdit = (postId, post) => {
    console.log('before edit select', post);
    handleEditPost(postId, post);
    console.log('after edit select', postId);
  };
  const customHandlePin = (postId, pinned) => {
    console.log('before pin select');
    handlePinPost(postId, pinned);
    console.log('after pin select', postId, pinned);
  };
  const customHandleCommentClick = postId => {
    console.log('before comment select');
    onTapCommentCount(postId);
    console.log('after comment select', postId);
  };
  const customHandleLikeCountClick = postId => {
    console.log('before like count select');
    onTapLikeCount(postId);
    console.log('after like count select', postId);
  };
  const customHandleDelete = (visible, postId) => {
    //todo: isCM
    console.log('before delete select', postId);
    handleDeletePost(visible);
    console.log('after delete select', visible);
  };
  const customHandleReport = postId => {
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
    onOverlayMenuClick(event, postId);
    console.log('after menuItemClick');
  };
  const customNotificationBellTap = () => {
    console.log('before notification icon tap');
    onTapNotificationBell();
    console.log('after notification icon tap');
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

  /// Setup notifications
  useEffect(() => {
    token().then(res => {
      if (!!res) {
        setFCMToken(res);
      }
    });
  }, []);

  // useEffect(() => {
  //   if (FCMToken) {
  //     pushAPI(FCMToken, accessToken);
  //   }
  // }, [FCMToken]);

  return (
    <UniversalFeed
      postLikeHandlerProp={id => customPostLike(id)}
      savePostHandlerProp={(id, saved) => customPostSave(id, saved)}
      onSelectCommentCountProp={id => customHandleCommentClick(id)}
      selectEditPostProp={(id, post) => customHandleEdit(id, post)}
      selectPinPostProp={(id, pinned) => customHandlePin(id, pinned)}
      onTapLikeCountProps={id => customHandleLikeCountClick(id)}
      handleDeletePostProps={(visible, postId) =>
        customHandleDelete(visible, postId)
      }
      handleReportPostProps={postId => customHandleReport(postId)}
      newPostButtonClickProps={() => customHandleNewPostButton()}
      onOverlayMenuClickProp={(event, menuItems, postId) =>
        customOverlayMenuCick(event, menuItems, postId)
      }
      onTapNotificationBellProp={() => customNotificationBellTap()}
      onSharePostClicked={id => customShareTap(id)}
      onSubmitButtonClicked={customPollSubmitButtonClick}
      onAddPollOptionsClicked={customAddPollOptionsClick}
      onPollOptionClicked={customPollOptionClicked}>
      <LMUniversalFeedHeader />
      <LMFilterTopics />
      <LMPostUploadIndicator />
      <PostsList items={mappedTopics} />
      <LMCreatePostButton />
    </UniversalFeed>
  );
};

export default Feed;
