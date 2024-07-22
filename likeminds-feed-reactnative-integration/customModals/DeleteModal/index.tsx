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
} from "@likeminds.community/feed-rn";
import DeleteReasonsModal from "../DeleteReasonsModal";
import {
  COMMENT_DELETE,
  CONFIRM_DELETE,
  DELETE_REASON_SELECTION,
  DELETION_REASON,
  ENTER_REASON_FOR_DELETION,
  POST_DELETE,
  POST_TYPE,
  REASON_FOR_DELETION_PLACEHOLDER,
  SOMETHING_WENT_WRONG,
} from "../../constants/Strings";
import STYLES from "../../constants/Styles";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { deletePost, deletePostStateHandler } from "../../store/actions/feed";
import {
  deleteComment,
  deleteCommentStateHandler,
} from "../../store/actions/postDetail";
import Toast from "react-native-toast-message";
import { showToastMessage } from "../../store/actions/toast";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../models/RootStackParamsList";
import { LMCommentUI, LMPostUI } from "../../models";
import { LMFeedAnalytics } from "../../analytics/LMFeedAnalytics";
import { Events } from "../../enums/Events";
import { Keys } from "../../enums/Keys";
import { getPostType } from "../../utils/analytics";
import { UNIVERSAL_FEED } from "../../constants/screenNames";
import { Client } from "@likeminds.community/feed-rn-core/client";

// delete modal's props
interface DeleteModalProps {
  visible: boolean;
  displayModal: (value: boolean) => void;
  deleteType: string;
  postDetail: LMPostUI;
  commentDetail?: LMCommentUI;
  modalBackdropColor?: string;
  parentCommentId?: string;
  navigation?: NativeStackNavigationProp<
    RootStackParamList,
    "PostDetail" | "UniversalFeed" | "PostsList"
  >;
}

const DeleteModal = ({
  visible,
  displayModal,
  deleteType,
  postDetail,
  modalBackdropColor,
  commentDetail,
  parentCommentId,
  navigation,
}: DeleteModalProps) => {
  const dispatch = useAppDispatch();
  const loggedInUser = useAppSelector((state) => state.login.member);
  const [deletionReason, setDeletionReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [showReasons, setShowReasons] = useState(false);

  // this function calls the delete post api
  const postDelete = async () => {
    if (!deletionReason && loggedInUser.userUniqueId !== postDetail?.uuid) {
      showToast();
    } else if (deletionReason === "Others" && otherReason === "") {
      showToast();
    } else {
      const payload = {
        deleteReason: otherReason ? otherReason : deletionReason,
        postId: postDetail?.id,
      };
      displayModal(false);
      dispatch(deletePostStateHandler(payload.postId));
      const deletePostPayload = DeletePostRequest.builder()
        .setdeleteReason(payload.deleteReason)
        .setpostId(payload.postId)
        .build();
      const deletePostResponse = await Client.myClient.deletePost(
        deletePostPayload
      );
      // toast message action
      if (deletePostResponse?.success == true) {
        LMFeedAnalytics.track(
          Events.POST_DELETED,
          new Map<string, string>([
            [
              Keys.USER_STATE,
              !payload.deleteReason ? "Member" : "Community Manager",
            ],
            [Keys.UUID, postDetail?.user?.sdkClientInfo.uuid],
            [Keys.POST_ID, payload?.postId],
            [Keys.POST_TYPE, getPostType(postDetail?.attachments)],
          ])
        );
        setDeletionReason("");
        if (navigation) {
          const routes = navigation?.getState()?.routes;
          const routesLength = routes?.length;
          if (
            routesLength > 0 &&
            routes[routesLength - 1]?.name !== UNIVERSAL_FEED
          ) {
            navigation?.goBack();
          }
        }
        dispatch(
          showToastMessage({
            isToast: true,
            message: POST_DELETE,
          })
        );
      } else {
        dispatch(
          showToastMessage({
            isToast: true,
            message: SOMETHING_WENT_WRONG,
          })
        );
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
      showToast();
    } else {
      const payload = {
        deleteReason: otherReason ? otherReason : deletionReason,
        commentId: commentDetail?.id ? commentDetail.id : "",
        postId: commentDetail?.postId ? commentDetail.postId : "",
      };

      displayModal(false);
      dispatch(deleteCommentStateHandler(payload));
      try {
        const deleteCommentResponse = await dispatch(
          deleteComment(
            DeleteCommentRequest.builder()
              .setcommentId(payload.commentId)
              .setpostId(payload.postId)
              .setreason(payload.deleteReason)
              .build(),
            false
          )
        );

        if (commentDetail?.level && commentDetail?.level > 0) {
          LMFeedAnalytics.track(
            Events.REPLY_DELETED,
            new Map<string, string>([
              [Keys.POST_ID, payload.postId],
              [Keys.COMMENT_ID, parentCommentId],
              [Keys.COMMENT_REPLY_ID, payload.commentId],
            ])
          );
        } else {
          LMFeedAnalytics.track(
            Events.COMMENT_DELETED,
            new Map<string, string>([
              [Keys.POST_ID, payload.postId],
              [Keys.COMMENT_ID, payload.commentId],
            ])
          );
        }
        setDeletionReason("");
        await dispatch(
          showToastMessage({
            isToast: true,
            message: COMMENT_DELETE,
          })
        );
        return deleteCommentResponse;
      } catch (error) {
        dispatch(
          showToastMessage({
            isToast: true,
            message: SOMETHING_WENT_WRONG,
          })
        );
      }
    }
  };

  // this callback function gets the reason of deletion from the reasons modal
  const selectedReasonForDelete = (val: string) => {
    setDeletionReason(val);
  };

  // this show the toast message over the modal
  const showToast = () => {
    Toast.show({
      position: "bottom",
      type: "deleteToastView",
      autoHide: true,
      visibilityTime: 1500,
    });
  };

  // toast view UI
  const renderToastView = () => {
    return (
      <View>
        <View>
          <View style={styles.modalView}>
            <Text style={styles.filterText}>
              {deletionReason === "Others"
                ? ENTER_REASON_FOR_DELETION
                : DELETE_REASON_SELECTION}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  // delete toast message view UI
  const toastConfig = {
    deleteToastView: () => renderToastView(),
  };
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
                {/* toast component */}
                {loggedInUser.userUniqueId !== postDetail?.uuid && (
                  <Toast config={toastConfig} />
                )}
                {/* main modal section */}
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <Text style={styles.textHeading}>Delete {deleteType}?</Text>
                    <Text style={styles.text}>
                      {CONFIRM_DELETE(deleteType)}
                    </Text>

                    {/* delete reason selection section */}
                    {loggedInUser.userUniqueId !== postDetail?.uuid &&
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
                        placeholderTextColor={"grey"}
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
