import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import {
  DeleteCommentRequest,
  DeletePostRequest,
} from "@likeminds.community/feed-js";
import DeleteReasonsModal from "../DeleteReasonsModal";
import {
  COMMENT_DELETE,
  CONFIRM_DELETE,
  DELETION_REASON,
  POST_DELETE,
  POST_TYPE,
  REASON_FOR_DELETION_PLACEHOLDER,
  SOMETHING_WENT_WRONG,
} from "../../constants/Strings";
import STYLES from "../../constants/Styles";
import { LMCommentUI, LMPostUI } from "likeminds_feed_reactnative_ui";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { deletePost, deletePostStateHandler } from "../../store/actions/feed";
import { deleteComment, deleteCommentStateHandler } from "../../store/actions/postDetail";

// delete modal's props
interface DeleteModalProps {
  visible: boolean;
  displayModal: (value: boolean) => void;
  deleteType: string;
  postDetail: LMPostUI;
  commentDetail?: LMCommentUI;
  modalBackdropColor?: string;
  navigation?: any
}

const DeleteModal = ({
  visible,
  displayModal,
  deleteType,
  postDetail,
  modalBackdropColor,
  commentDetail,
  navigation
}: DeleteModalProps) => {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector(state => state.login.member);
  const [deletionReason, setDeletionReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);

  // this function calls the delete post api
  const postDelete = async () => {
    if (!deletionReason && loggedInUser.userUniqueId !== postDetail?.userId) {
      // todo: handle toast later
      // showToast();
    } else {
      const payload = {
        deleteReason: otherReason ? otherReason : deletionReason,
        postId: postDetail?.id,
      };
      displayModal(false);
      dispatch(deletePostStateHandler(payload.postId) as any);
      const deletePostResponse = await dispatch(
        deletePost(
          DeletePostRequest.builder()
            .setdeleteReason(payload.deleteReason)
            .setpostId(payload.postId)
            .build(),true
        ),
      );
      // toast message action
      if (deletePostResponse) {
        setDeletionReason("");
        navigation.goBack();
        // todo: handle toast later
        // dispatch(
        //   showToastMessage({
        //     isToast: true,
        //     message: POST_DELETE,
        //   }) as any,
        // );
      } else {
        // todo: handle toast later
        // dispatch(
        //   showToastMessage({
        //     isToast: true,
        //     message: SOMETHING_WENT_WRONG,
        //   }) as any,
        // );
      }
      return deletePostResponse;
    }
  };

  // this function calls the delete comment api
  const commentDelete = async () => {
    if (
      !deletionReason &&
      loggedInUser.userUniqueId !== commentDetail?.userId
    ) {
      // todo: handle toast later
      // showToast();
    } else {
      const payload = {
        deleteReason: otherReason ? otherReason : deletionReason,
        commentId: commentDetail?.id ? commentDetail.id : "",
        postId: commentDetail?.postId ? commentDetail.postId : "",
      };
      displayModal(false);
      dispatch(deleteCommentStateHandler(payload) as any);
      try {
        const deleteCommentResponse = await dispatch(
          deleteComment(
            DeleteCommentRequest.builder()
              .setcommentId(payload.commentId)
              .setpostId(payload.postId)
              .setreason(payload.deleteReason)
              .build(), true
          ),
        );
        setDeletionReason("");
        // todo: handle toast later
        // await dispatch(
        //   showToastMessage({
        //     isToast: true,
        //     message: COMMENT_DELETE,
        //   }) as any,
        // );
        return deleteCommentResponse;
      } catch (error) {
        // todo: handle toast later
        // dispatch(
        //   showToastMessage({
        //     isToast: true,
        //     message: SOMETHING_WENT_WRONG,
        //   }) as any,
        // );
      }
    }
  };

  // this callback function gets the reason of deletion from the reasons modal
  const selectedReasonForDelete = (val: string) => {
    setDeletionReason(val);
  };

  // todo: handle toast later
  // this show the toast message over the modal
  // const showToast = () => {
  //   Toast.show({
  //     position: 'bottom',
  //     type: 'deleteToastView',
  //     autoHide: true,
  //     visibilityTime: 1500,
  //   });
  // };
  // todo: handle toast later
  // const renderToastView = () => {
  //   return (
  //     <View>
  //       <View>
  //         <View style={styles.modalView}>
  //           <Text style={styles.filterText}>
  //             {'Please select a reason for deletion'}
  //           </Text>
  //         </View>
  //       </View>
  //     </View>
  //   );
  // };
  // delete toast message view UI
  // const toastConfig = {
  //   deleteToastView: () => renderToastView(),
  // };
  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => displayModal(false)}
      >
        <>
          {/* conditonal render of delete reason's modal and delete modal */}
          {showReasons ? (
            <DeleteReasonsModal
              visible={showReasons}
              handleDeleteModal={displayModal}
              selectedReason={selectedReasonForDelete}
              closeModal={() => setShowReasons(false)}
            />
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.modal,
                  {
                    backgroundColor: modalBackdropColor
                      ? modalBackdropColor
                      : STYLES.$BACKGROUND_COLORS.DARKTRANSPARENT,
                  },
                ]}
                onPress={() => displayModal(false)}
              >
                {/* // todo: handle toast later */}
                {/* toast component */}
                {/* <Toast config={toastConfig} /> */}
                {/* main modal section */}
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <Text style={styles.textHeading}>Delete {deleteType}?</Text>
                    <Text style={styles.text}>
                      {CONFIRM_DELETE(deleteType)}
                    </Text>

                    {/* delete reason selection section */}
                    {loggedInUser.userUniqueId !== postDetail?.userId &&
                      loggedInUser.userUniqueId !== commentDetail?.userId && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => {
                            setShowReasons(true);
                          }}
                        >
                          <View style={styles.reasonsSelectionView}>
                            {deletionReason ? (
                              <Text style={styles.text}>{deletionReason}</Text>
                            ) : (
                              <Text style={styles.reasonText}>
                                {DELETION_REASON}
                                <Text style={styles.asteriskTextStyle}>*</Text>
                              </Text>
                            )}
                            <Image
                              source={require("../../assets/images/dropdown_icon3x.png")}
                              style={styles.dropdownIcon}
                            />
                          </View>
                        </TouchableOpacity>
                      )}

                    {/* text input view for other reason text*/}
                    {deletionReason === "Others" ? (
                      <TextInput
                        onChangeText={(e) => {
                          setOtherReason(e);
                        }}
                        style={styles.otherTextInput}
                        placeholder={REASON_FOR_DELETION_PLACEHOLDER}
                        value={otherReason}
                      />
                    ) : null}

                    <View style={styles.buttonsContainer}>
                      {/* cancel button section */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          displayModal(false);
                          setDeletionReason("");
                        }}
                      >
                        <Text style={styles.cancelTextBtn}>CANCEL</Text>
                      </TouchableOpacity>
                      {/* delete button section  */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                          deleteType === POST_TYPE
                            ? postDelete()
                            : commentDelete()
                        }
                      >
                        <Text style={styles.deleteTextBtn}>DELETE</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </>
          )}
        </>
      </Modal>
    </>
  );
};

export default DeleteModal;
