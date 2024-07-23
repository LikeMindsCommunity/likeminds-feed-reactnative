import {Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useUniversalFeedContext} from '@likeminds.community/feed-rn-core';
import {
  UniversalFeedContextValues,
} from '@likeminds.community/feed-rn-core/context';
import {useLMFeedStyles} from '@likeminds.community/feed-rn-core/lmFeedProvider';
import {styles} from '@likeminds.community/feed-rn-core/screens/universalFeed/styles';
import CreatePostTypeModal from '../CreatePostTypeModal';

const CreatePostButton = () => {
  const [actionAlertModalVisible, setActionAlertModalVisible] = useState(false);
  const {showCreatePost}: UniversalFeedContextValues =
    useUniversalFeedContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const {universalFeedStyle}: any = LMFeedContextStyles;

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
            universalFeedStyle?.newPostButtonStyle,
          ]}
          // handles post uploading status and member rights to create post
          onPress={() => {
            showActionModal();
          }}>
          <Text
            style={[styles.newPostText, universalFeedStyle?.newPostButtonText]}>
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
