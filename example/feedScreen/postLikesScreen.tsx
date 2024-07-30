import React from 'react';
import {
  PostLikesList,
  usePostLikesListContext,
} from '@likeminds.community/feed-rn-core';

const LikesScreen = ({route}) => {
  const {navigation, handleScreenBackPress} = usePostLikesListContext();
  const customHandleUserClick = user => {
    console.log('liked user', user);
  };
  const customBackHandler = () => {
    console.log('before back click');
    handleScreenBackPress();
    console.log('after back click');
  };
  return (
    <PostLikesList
      route={route}
      onTapUserItemProp={user => customHandleUserClick(user)}
      navigation={navigation}
      handleScreenBackPressProp={() => customBackHandler()}
    />
  );
};

export default LikesScreen;
