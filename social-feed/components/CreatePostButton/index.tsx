import {Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useFeedContext} from '@likeminds.community/feed-rn-core';
import {
  FeedContextValues,
} from '@likeminds.community/feed-rn-core/context';
import {styles} from '@likeminds.community/feed-rn-core/screens/feed/styles';
import CreatePostTypeModal from '../CreatePostTypeModal';
import STYLES from '@likeminds.community/feed-rn-core/constants/Styles';

const CreatePostButton = () => {
  const [actionAlertModalVisible, setActionAlertModalVisible] = useState(false);
  const {showCreatePost}: FeedContextValues =
    useFeedContext();
  const feedStyle = STYLES.$FEED_STYLE;

  const hideActionModal = () => {
    setActionAlertModalVisible(false);
  };

  const showActionModal = () => {
    setActionAlertModalVisible(true);
  };
  return (
    <>
      {!actionAlertModalVisible ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.newPostButtonView,
            showCreatePost
              ? styles.newPostButtonEnable
              : styles.newPostButtonDisable,
            feedStyle?.newPostButtonStyle,
          ]}
          // handles post uploading status and member rights to create post
          onPress={() => {
            showActionModal();
          }}>
          <Text
            style={[styles.newPostText, feedStyle?.newPostButtonText]}>
            NEW POST
          </Text>
        </TouchableOpacity>
      ) : null}

      <CreatePostTypeModal
        actionAlertModalVisible={actionAlertModalVisible}
        hideActionModal={hideActionModal}
      />
    </>
  );
};

export default CreatePostButton;
