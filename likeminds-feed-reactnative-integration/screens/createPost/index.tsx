import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  TextStyle,
  Image,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NetworkUtil, nameInitials, replaceLastMention } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  ADD_FILES,
  ADD_IMAGES,
  ADD_MORE_MEDIA,
  ADD_POLL,
  ADD_POST_TEXT,
  ADD_VIDEOS,
  CREATE_POST_PLACEHOLDER_TEXT,
  DOCUMENT_ATTACHMENT_TYPE,
  IMAGE_ATTACHMENT_TYPE,
  SAVE_POST_TEXT,
  SELECT_BOTH,
  SELECT_FILE,
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
import LMCarousel from "../../components/LMMedia/LMCarousel";
import LMDocument from "../../components/LMMedia/LMDocument";
import LMImage from "../../components/LMMedia/LMImage";
import LMLinkPreview from "../../components/LMMedia/LMLinkPreview";
import LMVideo from "../../components/LMMedia/LMVideo";
import LMLoader from "../../components/LMLoader";
import LMHeader from "../../components/LMHeader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TOPIC_FEED } from "../../constants/screenNames";
import {
  ADD_SELECTED_TOPICS,
  CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
  SET_DISABLED_TOPICS,
  SET_FLOW_TO_CREATE_POST_SCREEN,
  SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
} from "../../store/types/types";
import { LMFeedAnalytics } from "../../analytics/LMFeedAnalytics";
import { Events } from "../../enums/Events";
import { Keys } from "../../enums/Keys";
import { userTaggingDecoder } from "../../utils/decodeMentions";
import { Client } from "../../client";
import Layout from "../../constants/Layout";
import { LMPostPollView } from "../../components/LMPoll";
import { useRoute } from "@react-navigation/native";
import STYLES from "../../constants/Styles";
import { PollCustomisableMethodsContextProvider } from "../../context/pollCustomisableCallback";

interface CreatePostProps {
  children?: React.ReactNode;
  navigation?: NativeStackNavigationProp<RootStackParamList, "CreatePost">;
  route?: {
    key: string;
    name: string;
    params: { postId: string };
    path: undefined;
  };
  handleGalleryProp?: (type: string) => void;
  handleDocumentProp?: () => void;
  handlePollProp?: () => void;
  onPostClickProp?: (
    allMedia: Array<LMAttachmentUI>,
    linkData: Array<LMAttachmentUI>,
    content: string,
    topics: string[],
    poll: any
  ) => void;
  handleScreenBackPressProp?: () => void;
  onPollEditClicked: any;
  onPollClearClicked: any;
}

const CreatePost = ({
  navigation,
  route,
  children,
  handleDocumentProp,
  handlePollProp,
  handleGalleryProp,
  onPostClickProp,
  handleScreenBackPressProp,
  onPollEditClicked,
  onPollClearClicked,
}: CreatePostProps) => {
  return (
    <PollCustomisableMethodsContextProvider
      onPollEditClicked={onPollEditClicked}
      onPollClearClicked={onPollClearClicked}
    >
      <CreatePostCustomisableMethodsContextProvider
        handleDocumentProp={handleDocumentProp}
        handlePollProp={handlePollProp}
        handleGalleryProp={handleGalleryProp}
        onPostClickProp={onPostClickProp}
        handleScreenBackPressProp={handleScreenBackPressProp}
      >
        <CreatePostComponent />
      </CreatePostCustomisableMethodsContextProvider>
    </PollCustomisableMethodsContextProvider>
  );
};

const CreatePostComponent = () => {
  const dispatch = useAppDispatch();
  const LMFeedContextStyles = useLMFeedStyles();
  const predefinedTopics = useAppSelector(
    (state) => state.createPost.predefinedTopics
  );
  const { postListStyle, createPostStyle, postDetailStyle, topicsStyle }: any =
    LMFeedContextStyles;
  const customTextInputStyle = createPostStyle?.createPostTextInputStyle;
  const customAddMoreAttachmentsButton =
    createPostStyle?.addMoreAttachmentsButton;
  const customCreatePostScreenHeader = createPostStyle?.createPostScreenHeader;
  const customAttachmentOptionsStyle = createPostStyle?.attachmentOptionsStyle;
  const postHeaderStyle = postListStyle?.header;
  const postMediaStyle = postListStyle?.media;
  const selectTopicPlaceholder = topicsStyle?.selectTopicPlaceholder;
  const selectedTopicsStyle = topicsStyle?.selectedTopicsStyle;
  const plusIconStyle = topicsStyle?.plusIconStyle;
  let {
    navigation,
    postToEdit,
    showOptions,
    memberData,
    myRef,
    postContentText,
    handleInputChange,
    handleDocument,
    handlePoll,
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
    formattedPollAttachments,
    removeDocumentAttachment,
    removeMediaAttachment,
    removeSingleAttachment,
    removePollAttachment,
    editPollAttachment,
    showLinkPreview,
    setShowLinkPreview,
    postDetail,
    postEdit,
    onPostClick,
    handleScreenBackPress,
  }: CreatePostContextValues = useCreatePostContext();

  const handleAllTopicPress = () => {
    const arrayOfIds = mappedTopics.map((obj) => obj.id);
    dispatch({
      type: ADD_SELECTED_TOPICS,
      body: { topics: arrayOfIds },
    });
    /* @ts-ignore */
    return navigation.navigate(TOPIC_FEED);
  };

  const myClient = Client.myClient;
  const [showTopics, setShowTopics] = useState(false);
  const [mappedTopics, setMappedTopics] = useState([] as any);
  const [disbaledTopicsGlobal, setDisabledTopicsGlobal] = useState([] as any);
  const selectedTopics = useAppSelector(
    (state) => state.feed.selectedTopicsForCreatePostScreen
  );
  const topics = useAppSelector((state) => state.feed.topics);
  const poll = useAppSelector((state) => state.createPost.pollAttachment);
  const topicsSelected = useAppSelector(
    (state) => state.createPost.selectedTopics
  );
  const route: any = useRoute();
  const post = route?.params?.post;
  const hidePoll = route?.params?.hidePoll;

  let isImage =
    formattedMediaAttachments[0]?.attachmentType === IMAGE_ATTACHMENT_TYPE
      ? true
      : false;

  const getTopics = async () => {
    const apiRes = await myClient?.getTopics({
      isEnabled: null,
      search: "",
      searchType: "name",
      page: 1,
      pageSize: 10,
    } as any);
    const topics: any = apiRes?.data?.topics;
    if (topics?.length > 0) {
      setShowTopics(true);
    }
  };

  useEffect(() => {
    getTopics();
  }, [showTopics]);

  const filterEnabledFalse = (topicId) => {
    const topic = topics[topicId];
    return topic && !topic.isEnabled; // Check if isEnabled is false
  };

  useEffect(() => {
    // Create a new state array named mappedTopics
    if (topicsSelected.length > 0) {
      const filteredTopicArray = topicsSelected.map((topicId) => ({
        id: topicId,
        name: topics[topicId]?.name || "Unknown", // Use optional chaining and provide a default name if not found
      }));
      const disabledTopics = filteredTopicArray.filter((topic) =>
        filterEnabledFalse(topic.id)
      );
      setDisabledTopicsGlobal(disabledTopics);

      setMappedTopics(filteredTopicArray);
      dispatch({
        type: SET_DISABLED_TOPICS,
        body: { topics: disabledTopics },
      });
    } else {
      const filteredTopicArray = selectedTopics.map((topicId) => ({
        id: topicId,
        name: topics[topicId]?.name || "Unknown", // Use optional chaining and provide a default name if not found
      }));
      const disabledTopics = filteredTopicArray.filter((topic) =>
        filterEnabledFalse(topic.id)
      );
      setDisabledTopicsGlobal(disabledTopics);

      setMappedTopics(filteredTopicArray);
      dispatch({
        type: SET_DISABLED_TOPICS,
        body: { topics: disabledTopics },
      });
    }
  }, [selectedTopics, topicsSelected]);

  const handleAcceptedOnPress = () => {
    const idValuesArray = mappedTopics.map((topic) => topic.id);
    onPostClickProp
      ? onPostClickProp(
          allAttachment,
          formattedLinkAttachments,
          postContentText,
          predefinedTopics ? [...predefinedTopics] : idValuesArray,
          poll
        )
      : onPostClick(
          allAttachment,
          formattedLinkAttachments,
          postContentText,
          predefinedTopics ? [...predefinedTopics] : idValuesArray,
          poll
        );
    if (!postToEdit) {
      const map: Map<string | undefined, string | undefined> = new Map();
      const taggedUsers: any = userTaggingDecoder(postContentText);

      const ogTags = formattedLinkAttachments[0]?.attachmentMeta?.ogTags;

      // To fire user tagged analytics event
      if (taggedUsers?.length > 0) {
        map.set(Keys.USER_TAGGED, Keys.YES);
        map.set(Keys.TAGGED_USER_COUNT, taggedUsers?.length.toString());
        const taggedUserIds = taggedUsers.map((user) => user.route).join(", ");
        map.set(Keys.TAGGED_USER_UUID, taggedUserIds);
      } else {
        map.set(Keys.USER_TAGGED, Keys.NO);
      }

      // To fire link analytics event
      if (ogTags) {
        map.set(Keys.LINK_ATTACHED, Keys.YES);
        map.set(Keys.LINK, ogTags?.url ?? "");
      } else {
        map.set(Keys.LINK_ATTACHED, Keys.NO);
      }

      // To fire media analytics event
      let imageCount = 0;
      let videoCount = 0;
      let documentCount = 0;
      for (let i = 0; i < allAttachment.length; i++) {
        if (allAttachment[i].attachmentType === IMAGE_ATTACHMENT_TYPE) {
          imageCount++;
        } else if (allAttachment[i].attachmentType === VIDEO_ATTACHMENT_TYPE) {
          videoCount++;
        } else if (
          allAttachment[i].attachmentType === DOCUMENT_ATTACHMENT_TYPE
        ) {
          documentCount++;
        }
      }

      // sends image attached event if imageCount > 0
      if (imageCount > 0) {
        map.set(Keys.IMAGE_ATTACHED, Keys.YES);
        map.set(Keys.IMAGE_COUNT, `${imageCount}`);
      } else {
        map.set(Keys.IMAGE_ATTACHED, Keys.NO);
      }
      // sends video attached event if videoCount > 0
      if (videoCount > 0) {
        map.set(Keys.VIDEO_ATTACHED, Keys.YES);
        map.set(Keys.VIDEO_COUNT, `${videoCount}`);
      } else {
        map.set(Keys.VIDEO_ATTACHED, Keys.NO);
      }

      // sends document attached event if documentCount > 0
      if (documentCount > 0) {
        map.set(Keys.DOCUMENT_ATTACHED, Keys.YES);
        map.set(Keys.DOCUMENT_COUNT, `${documentCount}`);
      } else {
        map.set(Keys.DOCUMENT_ATTACHED, Keys.NO);
      }

      if (showTopics) {
        map.set(
          Keys.TOPICS,
          predefinedTopics ? predefinedTopics : mappedTopics
        );
      } else {
        map.set(Keys.TOPICS, "");
      }

      LMFeedAnalytics.track(Events.POST_CREATION_COMPLETED, map);
    }

    dispatch({
      type: CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
    });
  };

  const handleOnPress = () => {
    const disabledTopicNames = disbaledTopicsGlobal.map((topic) => topic.name);

    // Joining the names together with commas
    const selectedTopicsString = disabledTopicNames.join(", ");

    const isPlural = disabledTopicNames.length > 1 ? "are" : "is";

    if (disbaledTopicsGlobal.length > 0) {
      Alert.alert(
        "Disabled Topics Alert",
        `The selected topics ${selectedTopicsString} ${isPlural} disabled. Do you want to continue?`,
        [
          {
            text: "Yes",
            onPress: () => handleAcceptedOnPress(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } else {
      handleAcceptedOnPress();
    }
  };

  const {
    handleDocumentProp,
    handlePollProp,
    handleGalleryProp,
    onPostClickProp,
    handleScreenBackPressProp,
  } = useCreatePostCustomisableMethodsContext();

  // this renders the post detail UI
  const uiRenderForPost = () => {
    return (
      <ScrollView
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

        {mappedTopics.length > 0 &&
        showTopics &&
        !(predefinedTopics.length > 0) ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginLeft: Layout.normalize(10),
              marginTop: Layout.normalize(15),
            }}
          >
            {mappedTopics.map((item, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: Layout.normalize(17),
                      color: STYLES.$COLORS.PRIMARY,
                      paddingVertical: Layout.normalize(5),
                      backgroundColor: `hsla(${STYLES.$HUE}, 75%, 59%, 0.1)`,
                      borderRadius: Layout.normalize(5),
                      paddingHorizontal: Layout.normalize(12),
                      margin: Layout.normalize(5),
                      ...(selectedTopicsStyle !== undefined
                        ? selectedTopicsStyle
                        : {}),
                    }}
                  >
                    {item?.name}
                  </Text>
                </View>
                {index === mappedTopics.length - 1 && (
                  <View>
                    <TouchableOpacity
                      onPress={() => handleAllTopicPress()}
                      style={{
                        backgroundColor: `hsla(${STYLES.$HUE}, 75%, 59%, 0.1)`,
                        borderRadius: 5,
                        paddingHorizontal: 15,
                        marginLeft: 5,
                      }}
                    >
                      <Image
                        source={require("../../assets/images/edit_icon3x.png")}
                        style={styles.editIcon}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : showTopics && !(predefinedTopics.length > 0) ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: Layout.normalize(15),
              marginTop: Layout.normalize(15),
            }}
          >
            <TouchableOpacity onPress={() => handleAllTopicPress()}>
              <View
                style={{
                  paddingVertical: Layout.normalize(7),
                  backgroundColor: `hsla(${STYLES.$HUE}, 75%, 59%, 0.1)`,
                  borderRadius: Layout.normalize(5),
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: Layout.normalize(12),
                }}
              >
                <Image
                  source={require("../../assets/images/plusAdd_icon3x.png")}
                  style={{
                    tintColor: STYLES.$COLORS.PRIMARY,
                    width: Layout.normalize(15),
                    height: Layout.normalize(15),
                    marginRight: Layout.normalize(5), // Add margin to separate Image and Text
                    ...(plusIconStyle !== undefined ? plusIconStyle : {}),
                  }}
                />
                <Text
                  style={{
                    fontSize: Layout.normalize(16),
                    color: STYLES.$COLORS.PRIMARY,
                  }}
                >
                  {selectTopicPlaceholder !== undefined
                    ? selectTopicPlaceholder
                    : "Select Topics"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

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
              : STYLES.$IS_DARK_THEME
              ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
              : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
          }
          inputTextStyle={[
            styles.textInputView,
            customTextInputStyle?.inputTextStyle,
          ]}
          multilineField={
            customTextInputStyle?.multilineField != undefined
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
              allTags.length === 0 && { borderTopWidth: 0 },
              postDetailStyle?.userTaggingListStyle?.taggingListView,
            ]}
          >
            <FlatList
              data={[...allTags]}
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

                      const taggedUsers = userTaggingDecoder(res);
                      if (taggedUsers?.length > 0) {
                        const taggedUserIds = taggedUsers
                          .map((user) => user.route)
                          .join(", ");
                        LMFeedAnalytics.track(
                          Events.USER_TAGGED_IN_POST,
                          new Map<string, string>([
                            [Keys.TAGGED_USER_UUID, taggedUserIds],
                            [
                              Keys.TAGGED_USER_COUNT,
                              taggedUsers?.length.toString(),
                            ],
                          ])
                        );
                      }
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
                        children: postHeaderStyle?.profilePicture?.fallbackText
                          ?.children ? (
                          postHeaderStyle?.profilePicture?.fallbackText
                            ?.children
                        ) : (
                          <Text>{nameInitials(item?.name)}</Text>
                        ),
                      }}
                      fallbackTextBoxStyle={[
                        styles.taggingListProfileBoxStyle,
                        postHeaderStyle?.profilePicture?.fallbackTextBoxStyle,
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
                        textStyle={
                          [
                            styles.taggingListText,
                            postDetailStyle?.userTaggingListStyle
                              ?.userTagNameStyle,
                          ] as TextStyle
                        }
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
              /* @ts-ignore */
              keyExtractor={(item) => {
                return item?.id;
              }}
            />
          </View>
        ) : null}

        {/* selected media section */}
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
        {!postToEdit &&
          allAttachment.length > 0 &&
          allAttachment.length < 10 && (
            <LMButton
              onTap={() => {
                formattedMediaAttachments.length > 0
                  ? handleGalleryProp
                    ? handleGalleryProp(isImage ? SELECT_IMAGE : SELECT_VIDEO)
                    : handleGallery(isImage ? SELECT_IMAGE : SELECT_VIDEO)
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
              isClickable={customAddMoreAttachmentsButton?.isClickable}
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
          handleScreenBackPressProp
            ? handleScreenBackPressProp()
            : handleScreenBackPress();
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
                  postContentText.trim() !== "" ||
                  Object.keys(poll).length > 0
                ? false
                : true
            }
            style={
              postToEdit
                ? styles.enabledOpacity
                : allAttachment?.length > 0 ||
                  formattedLinkAttachments?.length > 0 ||
                  postContentText.trim() !== "" ||
                  Object.keys(poll).length > 0
                ? styles.enabledOpacity
                : styles.disabledOpacity
            }
            onPress={handleOnPress}
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
              handleGalleryProp
                ? handleGalleryProp(SELECT_IMAGE)
                : handleGallery(SELECT_IMAGE);

              LMFeedAnalytics.track(
                Events.CLICKED_ON_ATTACHMENT,
                new Map<string, string>([[Keys.TYPE, SELECT_IMAGE]])
              );
            }}
          >
            <LMIcon
              assetPath={require("../../assets/images/gallery_icon3x.png")}
              {...customAttachmentOptionsStyle?.photoAttachmentIcon}
            />
            <LMText
              children={<Text>{ADD_IMAGES}</Text>}
              textStyle={styles.selectionOptionstext}
              {...customAttachmentOptionsStyle?.photoAttachmentTextStyle}
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
              handleGalleryProp
                ? handleGalleryProp(SELECT_VIDEO)
                : handleGallery(SELECT_VIDEO);

              dispatch({
                type: SET_FLOW_TO_CREATE_POST_SCREEN,
                body: { flowToCreatePostScreen: false },
              });

              dispatch({
                type: SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
                body: { reportModalStatus: true },
              });

              LMFeedAnalytics.track(
                Events.CLICKED_ON_ATTACHMENT,
                new Map<string, string>([[Keys.TYPE, SELECT_VIDEO]])
              );
            }}
          >
            <LMIcon
              assetPath={require("../../assets/images/video_icon3x.png")}
              {...customAttachmentOptionsStyle?.videoAttachmentIcon}
            />
            <LMText
              children={<Text>{ADD_VIDEOS}</Text>}
              textStyle={styles.selectionOptionstext}
              {...customAttachmentOptionsStyle?.videoAttachmentTextStyle}
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

              LMFeedAnalytics.track(
                Events.CLICKED_ON_ATTACHMENT,
                new Map<string, string>([[Keys.TYPE, SELECT_FILE]])
              );
            }}
          >
            <LMIcon
              assetPath={require("../../assets/images/paperClip_icon3x.png")}
              {...customAttachmentOptionsStyle?.filesAttachmentIcon}
            />
            <LMText
              children={<Text>{ADD_FILES}</Text>}
              textStyle={styles.selectionOptionstext}
              {...customAttachmentOptionsStyle?.filesAttachmentTextStyle}
            />
          </TouchableOpacity>

          {/* poll option */}
          {hidePoll ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                {
                  ...styles.optionItemView,
                  ...(Platform.OS === "ios" && { marginBottom: 10 }),
                },
                {
                  ...customAttachmentOptionsStyle?.filesAttachmentView,
                  ...(Platform.OS === "ios" && { marginBottom: 10 }),
                },
              ]}
              onPress={() => {
                handlePollProp ? handlePollProp() : handlePoll();

                // LMFeedAnalytics.track(
                //   Events.CLICKED_ON_ATTACHMENT,
                //   new Map<string, string>([[Keys.TYPE, SELECT_FILE]])
                // );
              }}
            >
              <LMIcon
                assetPath={require("../../assets/images/poll_icon3x.png")}
                color={STYLES.$COLORS.PRIMARY}
                height={15}
                widht={15}
                {...customAttachmentOptionsStyle?.pollAttachmentIcon}
              />
              <LMText
                children={<Text>{ADD_POLL}</Text>}
                textStyle={styles.selectionOptionstext}
                {...customAttachmentOptionsStyle?.pollAttachmentTextStyle}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
};

export { CreatePost };
