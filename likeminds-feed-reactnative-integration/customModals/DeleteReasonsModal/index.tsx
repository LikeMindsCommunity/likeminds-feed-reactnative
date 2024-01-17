import {View, Text, Modal, Pressable} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import styles from './styles';
import {GetReportTagsRequest} from '@likeminds.community/feed-js';
import STYLES from '../../constants/Styles';
import {DELETE_TAGS_TYPE, DELETION_REASON} from '../../constants/Strings';
import {LMLoader} from 'likeminds_feed_reactnative_ui';
import { Client } from '../../client';
import { useAppDispatch, useAppSelector } from '../../store/AppContext';
import { REPORT_TAGS_SUCCESS } from '../../store/actions/types';

// delete reason's modal props
interface DeleteReasonsModalProps {
  visible: boolean;
  closeModal: () => void;
  selectedReason: (value: string) => void;
  handleDeleteModal: (value: boolean) => void;
  modalBackdropColor?: string;
}

const DeleteReasonsModal = ({
  visible,
  closeModal,
  selectedReason,
  handleDeleteModal,
  modalBackdropColor,
}: DeleteReasonsModalProps) => {
  const myClient = Client.myClient;
  const dispatch  = useAppDispatch();
  const state  = useAppSelector();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const deleteTags = state.feed.reportTags

  // this function calls the get reason tags api for deletion
  const fetchReasonTags = useCallback(async () => {
    const payload = {
      type: DELETE_TAGS_TYPE, // type 0 for delete reason tags
    };
    const reasonsTagsResponse = await myClient?.getReportTags(
        GetReportTagsRequest.builder().settype(payload.type).build(),
    );
    dispatch({
      type: REPORT_TAGS_SUCCESS,
      payload: reasonsTagsResponse.getData()
    })
    return reasonsTagsResponse;
  }, [dispatch]);

  // this calls the fetchReportTags api when the modal gets visible
  useEffect(() => {
    if (visible) {
      fetchReasonTags();
    }
  }, [visible, fetchReasonTags]);

  // this is the callback function that takes the selected reason tag to the delete modal
  const reasonSelection = (selectedId: string) => {
    selectedReason(selectedId);
    setSelectedIndex(-1);
    handleDeleteModal(true);
    closeModal();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        setSelectedIndex(-1);
        closeModal();
      }}>
      {/* backdrop view */}
      <Pressable
        style={[
          styles.modal,
          {
            backgroundColor: modalBackdropColor
              ? modalBackdropColor
              : STYLES.$BACKGROUND_COLORS.DARKTRANSPARENT,
          },
        ]}
        onPress={() => closeModal()}>
        {/* modal view */}
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.textHeading}>{DELETION_REASON}</Text>

            {/* delete reasons list */}
            {deleteTags.length > 0 ? (
              deleteTags?.map((res: any, index: number) => {
                return (
                  <Pressable
                    key={res?.id}
                    style={styles.tagItem}
                    onPress={() => {
                      setSelectedIndex(index);
                      reasonSelection(res.name);
                    }}>
                    {/* radio button view */}
                    <View style={styles.radioBtnView}>
                      <View style={[styles.reasonsBtn]}>
                        <View
                          style={[
                            styles.selectedReasonBtn,
                            index === selectedIndex
                              ? styles.selectedReasonView
                              : styles.defaultReasonView,
                          ]}
                        />
                      </View>
                    </View>

                    {/* reason text view */}
                    <View style={styles.reasonTextView}>
                      <Text style={[styles.btnText]}>{res.name}</Text>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              // this renders loader until the data is fetched
              <LMLoader />
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default DeleteReasonsModal;
