import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {
  useAppDispatch,
  useAppSelector,
} from '@likeminds.community/feed-rn-core/store/store';
import {
  UniversalFeedContextValues,
  useUniversalFeedContext,
  useUniversalFeedCustomisableMethodsContext,
} from '@likeminds.community/feed-rn-core/context';
import {SET_PREDEFINED_TOPICS} from '@likeminds.community/feed-rn-core/store/types/types';
import {LMFeedAnalytics} from '@likeminds.community/feed-rn-core';
import {Events} from '@likeminds.community/feed-rn-core/enums/Events';

const CreatePostTypeModal = ({actionAlertModalVisible, hideActionModal}) => {
  const dispatch = useAppDispatch();
  const {showCreatePost, newPostButtonClick}: UniversalFeedContextValues =
    useUniversalFeedContext();
  const {newPostButtonClickProps} =
    useUniversalFeedCustomisableMethodsContext();
  const topics = useAppSelector(state => state.feed.topics);
  return (
    <View>
      <Modal
        transparent={true}
        visible={actionAlertModalVisible}
        onRequestClose={hideActionModal}>
        <Pressable style={styles.centeredView} onPress={hideActionModal}>
          <View>
            <Pressable onPress={() => {}} style={[styles.modalView]}>
                <View style={{padding: 15, paddingBottom:10}}>
                    <View style={{width: 40, height:5, backgroundColor:'grey', borderRadius:10}} />
                </View>
              <ScrollView style={{display: 'flex', flexDirection: 'column'}}>
                {Object.keys(topics)?.map(item => {
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        dispatch({
                          type: SET_PREDEFINED_TOPICS,
                          body: {topics: [item]},
                        });

                        newPostButtonClickProps
                          ? newPostButtonClickProps()
                          : newPostButtonClick();
                        LMFeedAnalytics.track(Events.POST_CREATION_STARTED);
                        hideActionModal();
                      }}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 10,
                      }}>
                      <Text style={{color: 'black', fontSize: 16}}>
                        {topics[item]?.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity
                  onPress={() => {
                    hideActionModal();
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  <Text style={{color: 'blue', fontSize: 16}}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default CreatePostTypeModal;
