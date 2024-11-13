import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { LMPostPollView } from "../LMPoll";
import LMLoader from "../LMLoader";
import {
  LMCreatePostCarousel,
  LMDocument,
  LMImage,
  LMLinkPreview,
} from "../LMMedia";
import LMCreatePostVideo from '../LMMedia/LMCreatePostVideo'
import {
  CreatePostContextValues,
  useCreatePostContext,
  useCreatePostCustomisableMethodsContext,
} from "../../context";
import { useRoute } from "@react-navigation/native";
import { useAppSelector } from "../../store/store";
import STYLES from "../../constants/Styles";
import {
  ADD_MORE_MEDIA,
  IMAGE_ATTACHMENT_TYPE,
  SELECT_BOTH,
  VIDEO_ATTACHMENT_TYPE,
} from "../../constants/Strings";
import { styles } from "../../screens/createPost/styles";
import { LMButton } from "../../uiComponents";

const LMCreatePostMedia = () => {
  const postListStyle = STYLES.$POST_LIST_STYLE;
  const createPostStyle = STYLES.$CREATE_POST_STYLE;
  const customAddMoreAttachmentsButton =
    createPostStyle?.addMoreAttachmentsButton;
  const postMediaStyle: any = postListStyle?.media;
  let {
    postToEdit,
    memberData,
    handleDocument,
    handleGallery,
    allAttachment,
    setClosedOnce,
    setFormattedLinkAttachments,
    showSelecting,
    formattedDocumentAttachments,
    formattedLinkAttachments,
    formattedMediaAttachments,
    formattedPollAttachments,
    removeDocumentAttachment,
    removeMediaAttachment,
    removeSingleAttachment,
    removePollAttachment,
    editPollAttachment,
    showLinkPreview,
    setShowLinkPreview,
  }: CreatePostContextValues = useCreatePostContext();

  const poll = useAppSelector((state) => state.createPost.pollAttachment);
  const route: any = useRoute();
  const post = route?.params?.post;

  const { handleDocumentProp, handleGalleryProp } =
    useCreatePostCustomisableMethodsContext();
  return (
    <View>
      <View>
        {/* poll media for create post preview */}
        {Object.keys(poll).length > 0 ? (
          <View
            style={{
              padding: 20,
              marginHorizontal: 20,
              borderRadius: 5,
              borderColor: "#c5c5c5",
              borderWidth: 1,
            }}
          >
            <LMPostPollView
              item={poll}
              removePollAttachment={removePollAttachment}
              editPollAttachment={editPollAttachment}
              post={post}
            />
          </View>
        ) : null}

        {/* poll media for edit post preview */}
        {formattedPollAttachments.length > 0 ? (
          <View
            style={{
              padding: 20,
              marginHorizontal: 20,
              borderRadius: 5,
              borderColor: "#c5c5c5",
              borderWidth: 1,
            }}
          >
            <LMPostPollView
              item={{
                ...formattedPollAttachments[0]?.attachmentMeta,
                disabled: true,
              }}
              post={post}
            />
          </View>
        ) : null}

        {/* multi media selection section */}
        {showSelecting ? (
          <View style={styles.selectingMediaView}>
            <LMLoader size={"small"} />
            <Text style={styles.selectingMediaText}>Fetching Media</Text>
          </View>
        ) : formattedMediaAttachments ? (
          formattedMediaAttachments?.length > 1 ? (
            <LMCreatePostCarousel
              {...postMediaStyle?.carousel}
              attachments={formattedMediaAttachments}
              post={{
                attachments: formattedMediaAttachments,
                user: memberData,
              }}
              showCancel={
                postMediaStyle?.carousel?.showCancel != undefined
                  ? postMediaStyle?.carousel?.showCancel
                  : postToEdit
                  ? false
                  : true
              }
              onCancel={(index) => {
                removeMediaAttachment(index);
                postMediaStyle?.carousel?.onCancel();
              }}
            />
          ) : (
            <>
              {/* single image selected section */}
              {formattedMediaAttachments[0]?.attachmentType ===
                IMAGE_ATTACHMENT_TYPE && (
                <LMImage
                  {...postMediaStyle?.image}
                  imageUrl={`${formattedMediaAttachments[0]?.attachmentMeta.url}`}
                  showCancel={
                    postMediaStyle?.image?.showCancel != undefined
                      ? postMediaStyle?.image?.showCancel
                      : postToEdit
                      ? false
                      : true
                  }
                  onCancel={() => {
                    removeSingleAttachment();
                    postMediaStyle?.image?.onCancel();
                  }}
                />
              )}
              {/* single video selected section  */}
              {formattedMediaAttachments[0]?.attachmentType ===
                VIDEO_ATTACHMENT_TYPE && (
                <LMCreatePostVideo
                  {...postMediaStyle?.video}
                  videoUrl={`${formattedMediaAttachments[0]?.attachmentMeta.url}`}
                  showCancel={
                    postMediaStyle?.video?.showCancel != undefined
                      ? postMediaStyle?.video?.showCancel
                      : postToEdit
                      ? false
                      : true
                  }
                  showControls={
                    postMediaStyle?.video?.showControls != undefined
                      ? postMediaStyle?.video?.showControls
                      : true
                  }
                  looping={
                    postMediaStyle?.video?.looping != undefined
                      ? postMediaStyle?.video?.looping
                      : false
                  }
                  onCancel={() => {
                    removeSingleAttachment();
                    postMediaStyle?.video?.onCancel();
                  }}
                  autoPlay={
                    postMediaStyle?.video?.autoPlay != undefined
                      ? postMediaStyle?.video?.autoPlay
                      : true
                  }
                  videoInFeed={false}
                />
              )}
            </>
          )
        ) : null}
        {/* selected document view section */}
        {formattedDocumentAttachments &&
          formattedDocumentAttachments.length >= 1 && (
            <LMDocument
              {...postMediaStyle?.document}
              attachments={formattedDocumentAttachments}
              showCancel={
                postMediaStyle?.document?.showCancel != undefined
                  ? postMediaStyle?.document?.showCancel
                  : postToEdit
                  ? false
                  : true
              }
              showMoreText={
                postMediaStyle?.document?.showMoreText != undefined
                  ? postMediaStyle?.document?.showMoreText
                  : false
              }
              onCancel={(index) => {
                removeDocumentAttachment(index);
                postMediaStyle?.document?.onCancel();
              }}
            />
          )}
        {/* added link preview section */}
        {formattedMediaAttachments.length <= 0 &&
          formattedDocumentAttachments.length <= 0 &&
          showLinkPreview &&
          formattedLinkAttachments.length >= 1 && (
            <LMLinkPreview
              {...postMediaStyle?.linkPreview}
              attachments={formattedLinkAttachments}
              showCancel={
                postMediaStyle?.linkPreview?.showCancel != undefined
                  ? postMediaStyle?.linkPreview?.showCancel
                  : true
              }
              onCancel={() => {
                setShowLinkPreview(false);
                setClosedOnce(true);
                setFormattedLinkAttachments([]);
                postMediaStyle?.linkPreview?.onCancel();
              }}
            />
          )}
      </View>
      {/* add more media button section */}
      {!postToEdit && allAttachment.length > 0 && allAttachment.length < 10 && (
        <LMButton
          onTap={() => {
            formattedMediaAttachments.length > 0
              ? handleGalleryProp
                ? handleGalleryProp(SELECT_BOTH)
                : handleGallery(SELECT_BOTH)
              : formattedDocumentAttachments.length > 0
              ? handleDocumentProp
                ? handleDocumentProp()
                : handleDocument()
              : {},
              customAddMoreAttachmentsButton?.onTap();
          }}
          icon={{
            assetPath: require("../../assets/images/plusAdd_icon3x.png"),
            height: 20,
            width: 20,
            color: STYLES.$COLORS.PRIMARY,
            ...customAddMoreAttachmentsButton?.icon,
          }}
          text={{
            children: (
              <Text style={{ fontFamily: STYLES.$FONT_TYPES.LIGHT }}>
                {ADD_MORE_MEDIA}
              </Text>
            ),
            textStyle: styles.addMoreButtonText,
            ...customAddMoreAttachmentsButton?.text,
          }}
          buttonStyle={StyleSheet.flatten([
            styles.addMoreButtonView,
            customAddMoreAttachmentsButton?.buttonStyle,
          ])}
          placement={customAddMoreAttachmentsButton?.placement}
          isClickable={customAddMoreAttachmentsButton?.isClickable}
        />
      )}
    </View>
  );
};

export default LMCreatePostMedia;
