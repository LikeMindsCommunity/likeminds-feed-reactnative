import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import React from "react";
import { NetworkUtil, nameInitials, replaceLastMention } from "../../utils";
import { useAppDispatch } from "../../store/store";
import {
  ADD_FILES,
  ADD_IMAGES,
  ADD_MORE_MEDIA,
  ADD_POST_TEXT,
  ADD_VIDEOS,
  CREATE_POST_PLACEHOLDER_TEXT,
  IMAGE_ATTACHMENT_TYPE,
  SAVE_POST_TEXT,
  SELECT_BOTH,
  SELECT_IMAGE,
  SELECT_VIDEO,
  VIDEO_ATTACHMENT_TYPE,
} from "../../constants/Strings";
import { setUploadAttachments } from "../../store/actions/createPost";
import { styles } from "./styles";
import {
  CreatePostContextProvider,
  CreatePostContextValues,
  CreatePostCustomisableMethodsContextProvider,
  useCreatePostContext,
  useCreatePostCustomisableMethodsContext,
} from "../../context";
import { useLMFeedStyles } from "../../lmFeedProvider";
import {
  LMButton,
  LMIcon,
  LMInputText,
  LMProfilePicture,
  LMText,
} from "../../uiComponents";
import { LMAttachmentUI, LMUserUI, RootStackParamList } from "../../models";
import {
  LMCarousel,
  LMDocument,
  LMHeader,
  LMImage,
  LMLinkPreview,
  LMLoader,
  LMVideo,
} from "../../components";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface CreatePostProps {
  children: React.ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList, "CreatePost">;
  route: {
    key: string;
    name: string;
    params: { postId: string };
    path: undefined;
  };
  handleGalleryProp: (type: string) => void;
  handleDocumentProp: () => void;
  onPostClickProp: (allMedia:Array<LMAttachmentUI>, linkData: Array<LMAttachmentUI>, content: string) => void;
  handleScreenBackPressProp: () => void;
}

const CreatePost = ({
  navigation,
  route,
  children,
  handleDocumentProp,
  handleGalleryProp,
  onPostClickProp,
  handleScreenBackPressProp
}: CreatePostProps) => {
  return (
  
      <CreatePostCustomisableMethodsContextProvider
        handleDocumentProp={handleDocumentProp}
        handleGalleryProp={handleGalleryProp}
        onPostClickProp={onPostClickProp}
        handleScreenBackPressProp={handleScreenBackPressProp}
      >
        <CreatePostComponent />
      </CreatePostCustomisableMethodsContextProvider>
  );
};

const CreatePostComponent = () => {
  const dispatch = useAppDispatch();
  const LMFeedContextStyles = useLMFeedStyles();
  const { postListStyle, createPostStyle, postDetailStyle } =
    LMFeedContextStyles;
    const customTextInputStyle = createPostStyle?.createPostTextInputStyle
    const customAddMoreAttachmentsButton = createPostStyle?.addMoreAttachmentsButton
    const customCreatePostScreenHeader = createPostStyle?.createPostScreenHeader
    const customAttachmentOptionsStyle = createPostStyle?.attachmentOptionsStyle
    const postHeaderStyle = postListStyle?.header
    const postMediaStyle = postListStyle?.media
  const {
    navigation,
    postToEdit,
    showOptions,
    memberData,
    myRef,
    postContentText,
    handleInputChange,
    handleDocument,
    handleGallery,
    handleLoadMore,
    allAttachment,
    allTags,
    setAllTags,
    setClosedOnce,
    setFormattedLinkAttachments,
    isUserTagging,
    userTaggingListHeight,
    setIsUserTagging,
    taggedUserName,
    setPostContentText,
    isLoading,
    showSelecting,
    formattedDocumentAttachments,
    formattedLinkAttachments,
    formattedMediaAttachments,
    removeDocumentAttachment,
    removeMediaAttachment,
    removeSingleAttachment,
    showLinkPreview,
    setShowLinkPreview,
    postDetail,
    postEdit,
    onPostClick,
    handleScreenBackPress
  }: CreatePostContextValues = useCreatePostContext();

  const {
    handleDocumentProp,
    handleGalleryProp,
    onPostClickProp,
    handleScreenBackPressProp
  } = useCreatePostCustomisableMethodsContext();

  // this renders the post detail UI
  const uiRenderForPost = () => {
    return (
      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        style={
          postToEdit
            ? styles.scrollViewStyleWithoutOptions
            : showOptions
            ? styles.scrollViewStyleWithOptions
            : styles.scrollViewStyleWithoutOptions
        }
      >
        {/* user profile section */}
        <View style={styles.profileContainer}>
          {/* profile image */}
          <LMProfilePicture
            {...postHeaderStyle?.profilePicture}
            fallbackText={{
              children: <Text>{nameInitials(memberData.name)}</Text>,
            }}
            imageUrl={memberData.imageUrl}
          />
          {/* user name */}
          <LMText
            children={<Text>{memberData.name}</Text>}
            textStyle={
              createPostStyle?.userNameTextStyle
                ? createPostStyle?.userNameTextStyle
                : styles.userNameText
            }
          />
        </View>
        {/* text input field */}
        <LMInputText
          {...customTextInputStyle}
          placeholderText={
            customTextInputStyle?.placeholderText
              ? customTextInputStyle?.placeholderText
              : CREATE_POST_PLACEHOLDER_TEXT
          }
          placeholderTextColor={
            customTextInputStyle?.placeholderTextColor
              ? customTextInputStyle?.placeholderTextColor
              : "#0F1E3D66"
          }
          inputTextStyle={[
            styles.textInputView,
            customTextInputStyle?.inputTextStyle,
          ]}
          multilineField={
            customTextInputStyle?.multilineField !=
            undefined
              ? customTextInputStyle?.multilineField
              : true
          }
          inputRef={myRef}
          inputText={postContentText}
          onType={handleInputChange}
          autoFocus={postToEdit ? true : false}
          textValueStyle={
            customTextInputStyle?.textValueStyle
              ? customTextInputStyle?.textValueStyle
              : { fontSize: 16 }
          }
          partTypes={[
            {
              trigger: "@", // Should be a single character like '@' or '#'
              textStyle: {
                color: "#007AFF",
                ...customTextInputStyle?.mentionTextStyle,
              }, // The mention style in the input
            },
          ]}
        />

        {/* users tagging list */}
        {allTags && isUserTagging ? (
          <View
            style={[
              styles.taggingListView,
              {
                height: userTaggingListHeight,
              },
              postDetailStyle?.userTaggingListStyle?.taggingListView,
            ]}
          >
            <FlatList
              data={[...allTags]}
              nestedScrollEnabled={true}
              renderItem={({ item }: { item: LMUserUI }) => {
                return (
                  <Pressable
                    onPress={() => {
                      const uuid = item?.sdkClientInfo?.uuid;
                      const res = replaceLastMention(
                        postContentText,
                        taggedUserName,
                        item?.name,
                        uuid ? `user_profile/${uuid}` : uuid
                      );
                      setPostContentText(res);
                      setAllTags([]);
                      setIsUserTagging(false);
                    }}
                    style={[
                      styles.taggingListItem,
                      postDetailStyle?.userTaggingListStyle?.userTagView,
                    ]}
                    key={item?.id}
                  >
                    <LMProfilePicture
                      {...postHeaderStyle?.profilePicture}
                      fallbackText={{
                        ...postHeaderStyle?.profilePicture?.fallbackText,
                        children: postHeaderStyle?.profilePicture
                          ?.fallbackText?.children ? (
                          postHeaderStyle?.profilePicture?.fallbackText
                            ?.children
                        ) : (
                          <Text>{nameInitials(item?.name)}</Text>
                        ),
                      }}
                      fallbackTextBoxStyle={[
                        styles.taggingListProfileBoxStyle,
                        postHeaderStyle?.profilePicture
                          ?.fallbackTextBoxStyle,
                      ]}
                      size={
                        postHeaderStyle?.profilePicture?.size
                          ? postHeaderStyle?.profilePicture?.size
                          : 40
                      }
                    />
                    <View style={styles.taggingListItemTextView}>
                      <LMText
                        children={<Text>{item?.name}</Text>}
                        maxLines={1}
                        textStyle={[
                          styles.taggingListText,
                          postDetailStyle?.userTaggingListStyle
                            ?.userTagNameStyle,
                        ]}
                      />
                    </View>
                  </Pressable>
                );
              }}
              extraData={{
                value: [postContentText, allTags],
              }}
              keyboardShouldPersistTaps={"handled"}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={1}
              bounces={false}
              ListFooterComponent={
                isLoading ? (
                  <View style={styles.taggingLoaderView}>
                    <LMLoader size={15} />
                  </View>
                ) : null
              }
              keyExtractor={(item) => {
                return item?.id;
              }}
            />
          </View>
        ) : null}

        {/* selected media section */}
        <View>
          {/* multi media selection section */}
          {showSelecting ? (
            <View style={styles.selectingMediaView}>
              <LMLoader size={10} />
              <Text style={styles.selectingMediaText}>Fetching Media</Text>
            </View>
          ) : formattedMediaAttachments ? (
            formattedMediaAttachments?.length > 1 ? (
              <LMCarousel
                {...postMediaStyle?.carousel}
                attachments={formattedMediaAttachments}
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
                  <LMVideo
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
        {!postToEdit &&
          allAttachment.length > 0 &&
          allAttachment.length < 10 && (
            <LMButton
              onTap={() => {
                formattedMediaAttachments.length > 0
                  ? handleGalleryProp ? handleGalleryProp(SELECT_BOTH) : handleGallery(SELECT_BOTH)
                  : formattedDocumentAttachments.length > 0
                  ? handleDocumentProp ? handleDocumentProp() : handleDocument()
                  : {},
                  customAddMoreAttachmentsButton?.onTap();
              }}
              icon={{
                assetPath: require("../../assets/images/plusAdd_icon3x.png"),
                height: 20,
                width: 20,
                ...customAddMoreAttachmentsButton?.icon,
              }}
              text={{
                children: <Text>{ADD_MORE_MEDIA}</Text>,
                textStyle: styles.addMoreButtonText,
                ...customAddMoreAttachmentsButton?.text,
              }}
              buttonStyle={StyleSheet.flatten([
                styles.addMoreButtonView,
                customAddMoreAttachmentsButton?.buttonStyle,
              ])}
              placement={customAddMoreAttachmentsButton?.placement}
              isClickable={
                customAddMoreAttachmentsButton?.isClickable
              }
            />
          )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* screen header section*/}
      <LMHeader
        {...customCreatePostScreenHeader}
        showBackArrow={
          customCreatePostScreenHeader?.showBackArrow != undefined
            ? customCreatePostScreenHeader?.showBackArrow
            : true
        }
        onBackPress={() => {
          handleScreenBackPressProp ? handleScreenBackPressProp() : handleScreenBackPress()
        }}
        heading={
          postToEdit
            ? customCreatePostScreenHeader?.editPostHeading
              ? customCreatePostScreenHeader?.editPostHeading
              : "Edit Post"
            : customCreatePostScreenHeader?.createPostHeading
            ? customCreatePostScreenHeader?.createPostHeading
            : "Create a Post"
        }
        rightComponent={
          // post button section
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={
              postToEdit
                ? false
                : allAttachment?.length > 0 ||
                  formattedLinkAttachments?.length > 0 ||
                  postContentText.trim() !== ""
                ? false
                : true
            }
            style={
              postToEdit
                ? styles.enabledOpacity
                : allAttachment?.length > 0 ||
                  formattedLinkAttachments?.length > 0 ||
                  postContentText.trim() !== ""
                ? styles.enabledOpacity
                : styles.disabledOpacity
            }
            onPress={() => onPostClickProp ? onPostClickProp(allAttachment,formattedLinkAttachments, postContentText) : onPostClick(allAttachment,formattedLinkAttachments, postContentText)}
          >
            {customCreatePostScreenHeader?.rightComponent ? (
              customCreatePostScreenHeader?.rightComponent
            ) : (
              <Text style={styles.headerRightComponentText}>
                {postToEdit ? SAVE_POST_TEXT : ADD_POST_TEXT}
              </Text>
            )}
          </TouchableOpacity>
        }
      />
      {/* handles the UI to be rendered for edit post and create post */}
      {!postToEdit ? (
        uiRenderForPost()
      ) : postDetail?.id ? (
        uiRenderForPost()
      ) : (
        // loader view section
        <View style={styles.rowAlignMent}>
          <LMLoader />
        </View>
      )}
      {/* selection options section */}
      {!postToEdit && showOptions && (
        <View
          style={[
            styles.selectionOptionsView,
            customAttachmentOptionsStyle?.attachmentOptionsView,
          ]}
        >
          {/* add photos button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionItemView,
              customAttachmentOptionsStyle?.photoAttachmentView,
            ]}
            onPress={() => {
              handleGalleryProp ? handleGalleryProp(SELECT_IMAGE) :handleGallery(SELECT_IMAGE);
              customAttachmentOptionsStyle
                ?.onPhotoAttachmentOptionClick &&
                customAttachmentOptionsStyle?.onPhotoAttachmentOptionClick();
            }}
          >
            <LMIcon
              assetPath={require("../../assets/images/gallery_icon3x.png")}
              {...customAttachmentOptionsStyle?.photoAttachmentIcon}
            />
            <LMText
              children={<Text>{ADD_IMAGES}</Text>}
              textStyle={styles.selectionOptionstext}
              {...customAttachmentOptionsStyle
                ?.photoAttachmentTextStyle}
            />
          </TouchableOpacity>
          {/* add video button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionItemView,
              customAttachmentOptionsStyle?.videoAttachmentView,
            ]}
            onPress={() => {
              handleGalleryProp ? handleGalleryProp(SELECT_VIDEO) : handleGallery(SELECT_VIDEO);
              customAttachmentOptionsStyle
                ?.onVideoAttachmentOptionClick &&
                customAttachmentOptionsStyle?.onVideoAttachmentOptionClick();
            }}
          >
            <LMIcon
              assetPath={require("../../assets/images/video_icon3x.png")}
              {...customAttachmentOptionsStyle?.videoAttachmentIcon}
            />
            <LMText
              children={<Text>{ADD_VIDEOS}</Text>}
              textStyle={styles.selectionOptionstext}
              {...customAttachmentOptionsStyle
                ?.videoAttachmentTextStyle}
            />
          </TouchableOpacity>
          {/* add files button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.optionItemView,
              customAttachmentOptionsStyle?.filesAttachmentView,
            ]}
            onPress={() => {
              handleDocumentProp ? handleDocumentProp() : handleDocument();
              customAttachmentOptionsStyle
                ?.onFilesAttachmentOptionClick &&
                customAttachmentOptionsStyle?.onFilesAttachmentOptionClick();
            }}
          >
            <LMIcon
              assetPath={require("../../assets/images/paperClip_icon3x.png")}
              {...customAttachmentOptionsStyle?.filesAttachmentIcon}
            />
            <LMText
              children={<Text>{ADD_FILES}</Text>}
              textStyle={styles.selectionOptionstext}
              {...customAttachmentOptionsStyle
                ?.filesAttachmentTextStyle}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export { CreatePost };
