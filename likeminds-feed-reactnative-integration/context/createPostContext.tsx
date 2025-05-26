import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useRef,
  MutableRefObject,
} from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { Alert, Keyboard, Platform, TextInput } from "react-native";
import {
  NetworkUtil,
  detectMentions,
  detectURLs,
  mentionToRouteConverter,
  requestStoragePermission,
  routeToMentionConverter,
  selectDocument,
  selectImageVideo,
} from "../utils";
import {
  DOCUMENT_ATTACHMENT_TYPE,
  FILE_UPLOAD_IMAGE_SIZE_VALIDATION,
  FILE_UPLOAD_SIZE_VALIDATION,
  FILE_UPLOAD_VIDEO_SIZE_VALIDATION,
  IMAGE_ATTACHMENT_TYPE,
  KEYBOARD_DID_HIDE,
  KEYBOARD_DID_SHOW,
  MAX_FILE_SIZE,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  MEDIA_UPLOAD_COUNT_VALIDATION,
  MIN_FILE_SIZE,
  POLL_ATTACHMENT_TYPE,
  VIDEO_ATTACHMENT_TYPE,
} from "../constants/Strings";
import {
  convertDocumentMetaData,
  convertImageVideoMetaData,
  convertLinkMetaData,
  convertPollMetaData,
  convertToLMPostViewData,
  convertToTemporaryPost,
} from "../viewDataModels";
import {
  editPost,
  getDecodedUrl,
  setUploadAttachments,
} from "../store/actions/createPost";
import {
  AttachmentType,
  DecodeURLRequest,
  EditPostRequest,
  GetPostRequest,
  GetTaggingListRequest,
} from "@likeminds.community/feed-rn";
import { getPost, getTaggingList } from "../store/actions/postDetail";
import { showToastMessage } from "../store/actions/toast";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../models/RootStackParamsList";
import {
  LMAttachmentViewData,
  LMOGTagsViewData,
  LMPostViewData,
  LMUserViewData,
} from "../models";
import {
  ADD_SELECTED_TOPICS,
  CLEAR_POLL,
  CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
  SET_POST_UPLOADING_CREATE_SCREEN,
  SET_FLOW_TO_CREATE_POST_SCREEN,
  SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
} from "../store/types/types";
import { LMFeedAnalytics } from "../analytics/LMFeedAnalytics";
import { Events } from "../enums/Events";
import { Keys } from "../enums/Keys";
import { CommunityConfigs } from "../communityConfigs";
import { CREATE_POLL_SCREEN } from "../constants/screenNames";
import STYLES from "../constants/Styles";
import { Video, getVideoMetaData, Image, getImageMetaData } from "react-native-compressor";
import { Client } from "../client";
import _ from "lodash";


interface CreatePostContextProps {
  children?: ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList, "CreatePost">;
  route: {
    key: string;
    name: string;
    params: { postId: string };
    path: undefined;
  };
}

export interface CreatePostContextValues {
  navigation: NativeStackNavigationProp<RootStackParamList, "CreatePost">;
  route: {
    key: string;
    name: string;
    params: { postId: string };
    path: undefined;
  };
  memberData: LMUserViewData;
  formattedDocumentAttachments: Array<LMAttachmentViewData>;
  formattedMediaAttachments: Array<LMAttachmentViewData>;
  formattedLinkAttachments: Array<LMAttachmentViewData>;
  formattedPollAttachments: Array<LMAttachmentViewData>;
  showLinkPreview: boolean;
  closedOnce: boolean;
  showOptions: boolean;
  showSelecting: boolean;
  postToEdit: any;
  postDetail: LMPostViewData;
  postContentText: string;
  myRef: any;
  taggedUserName: string;
  debounceTimeout: NodeJS.Timeout | null;
  page: number;
  userTaggingListHeight: number;
  allTags: Array<LMUserViewData>;
  isUserTagging: boolean;
  isLoading: boolean;
  heading: string;
  isKeyboardVisible: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsUserTagging: Dispatch<SetStateAction<boolean>>;
  setAllTags: Dispatch<SetStateAction<Array<LMUserViewData>>>;
  setUserTaggingListHeight: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
  setDebounceTimeout: Dispatch<SetStateAction<NodeJS.Timeout | null>>;
  setTaggedUserName: Dispatch<SetStateAction<string>>;
  setPostContentText: Dispatch<SetStateAction<string>>;
  setPostDetail: Dispatch<SetStateAction<LMPostViewData>>;
  setShowSelecting: Dispatch<SetStateAction<boolean>>;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
  setClosedOnce: Dispatch<SetStateAction<boolean>>;
  setShowLinkPreview: Dispatch<SetStateAction<boolean>>;
  setFormattedLinkAttachments: Dispatch<
    SetStateAction<Array<LMAttachmentViewData>>
  >;
  setFormattedMediaAttachments: Dispatch<
    SetStateAction<Array<LMAttachmentViewData>>
  >;
  setFormattedDocumentAttachments: Dispatch<
    SetStateAction<Array<LMAttachmentViewData>>
  >;
  setFormattedPollAttachments: Dispatch<
    SetStateAction<Array<LMAttachmentViewData>>
  >;
  setSelectedImageVideo: (type: string) => void;
  setSelectedDocuments: () => void;
  handleGallery: (type: string) => void;
  handleDocument: () => void;
  handlePoll: () => void;
  removeDocumentAttachment: (index: number) => void;
  removeMediaAttachment: (index: number) => void;
  removeSingleAttachment: () => void;
  removePollAttachment: () => void;
  editPollAttachment: () => void;
  allAttachment: Array<LMAttachmentViewData>;
  getPostData: () => void;
  postEdit: any;
  handleInputChange: (event: string) => void;
  loadData: (newPage: number) => void;
  handleLoadMore: () => void;
  onPostClick: (
    allMedia: Array<LMAttachmentViewData>,
    linkData: Array<LMAttachmentViewData>,
    content: string,
    heading: string,
    topics: string[],
    poll: any,
    isAnonymous?: boolean,
    metaData?: any
  ) => void;
  handleScreenBackPress: () => void;
  handleHeadingInputChange: (event: string) => void;
  setDisabledTopicsGlobal: any;
  disbaledTopicsGlobal: any;
  showTopics: boolean;
  setShowTopics: Dispatch<SetStateAction<boolean>>;
  mappedTopics: any;
  setMappedTopics: any;
  anonymousPost: boolean;
  handleOnAnonymousPostClicked: () => void;
  setAnonymousPost: Dispatch<SetStateAction<boolean>>;
}

const CreatePostContext = createContext<CreatePostContextValues | undefined>(
  undefined
);

export const useCreatePostContext = () => {
  const context = useContext(CreatePostContext);
  if (!context) {
    throw new Error(
      "useCreatePostContext must be used within an CreatePostContextProvider"
    );
  }
  return context;
};

export const CreatePostContextProvider = ({
  children,
  navigation,
  route,
}: CreatePostContextProps) => {
  const memberData = useAppSelector((state) => state.login.member);
  const poll = useAppSelector((state) => state.createPost.pollAttachment);
  const dispatch = useAppDispatch();
  const [formattedDocumentAttachments, setFormattedDocumentAttachments] =
    useState<Array<LMAttachmentViewData>>([]);
  const [formattedMediaAttachments, setFormattedMediaAttachments] = useState<
    Array<LMAttachmentViewData>
  >([]);
  const [formattedLinkAttachments, setFormattedLinkAttachments] = useState<
    Array<LMAttachmentViewData>
  >([]);
  const [formattedPollAttachments, setFormattedPollAttachments] = useState<
    Array<LMAttachmentViewData>
  >([]);
  const [showLinkPreview, setShowLinkPreview] = useState(false);
  const [anonymousPost, setAnonymousPost] = useState(false);
  const [closedOnce, setClosedOnce] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [showSelecting, setShowSelecting] = useState(false);
  const postToEdit = route?.params?.postId;
  const [postDetail, setPostDetail] = useState({} as LMPostViewData);
  const [postContentText, setPostContentText] = useState("");
  const [heading, setHeading] = useState("");
  const myRef = useRef<TextInput>(null);
  const [taggedUserName, setTaggedUserName] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [userTaggingListHeight, setUserTaggingListHeight] =
    useState<number>(116);
  const [allTags, setAllTags] = useState<Array<LMUserViewData>>([]);
  const [isUserTagging, setIsUserTagging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disbaledTopicsGlobal, setDisabledTopicsGlobal] = useState([] as any);
  const [showTopics, setShowTopics] = useState(false);
  const [mappedTopics, setMappedTopics] = useState([] as any);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  const maxHeadingWords = STYLES?.$CREATE_POST_STYLE?.headingMaxWords
    ? STYLES?.$CREATE_POST_STYLE?.headingMaxWords
    : 200;

    const selectImageVideoMethod = async (type) => {
      try {
        const res = await selectImageVideo(type);
        
        if (res?.didCancel) {
          setShowSelecting(false);
          dispatch({
            type: SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
            body: { reportModalStatus: false },
          });
          return;
        }
    
        const mediaWithSizeCheck: any = [];
        const communityConfigs = CommunityConfigs.communityConfigs;
        const mediaLimitsObject = communityConfigs.find(
          (obj) => obj.type === "media_limits"
        );
        const maxImageSize = mediaLimitsObject?.value?.maxImageSize * 1000;
        const maxVideoSize = mediaLimitsObject?.value?.maxVideoSize * 1000;
    
        // Check the size of each media
        if (res?.assets) {
          for (const media of res.assets) {
            if (
              media?.fileSize &&
              ((media?.type?.includes("image") &&
                (maxImageSize
                  ? media?.fileSize > maxImageSize
                  : media?.fileSize > MAX_IMAGE_FILE_SIZE)) ||
                (media?.type?.includes("video") &&
                  (maxVideoSize
                    ? media?.fileSize > maxVideoSize
                    : media?.fileSize > MAX_VIDEO_FILE_SIZE)))
            ) {
              dispatch(
                showToastMessage({
                  isToast: true,
                  message: media?.type?.includes("image")
                    ? FILE_UPLOAD_IMAGE_SIZE_VALIDATION.replace(
                        "<x>",
                        maxImageSize
                          ? Math.round(maxImageSize / 1000000)?.toString()
                          : Math.round(MAX_IMAGE_FILE_SIZE / 1000000)?.toString()
                      )
                    : media?.type?.includes("video")
                    ? FILE_UPLOAD_VIDEO_SIZE_VALIDATION.replace(
                        "<x>",
                        maxVideoSize
                          ? Math.round(maxVideoSize / 1000000)?.toString()
                          : Math.round(MAX_VIDEO_FILE_SIZE / 1000000)?.toString()
                      )
                    : FILE_UPLOAD_SIZE_VALIDATION,
                })
              );
            } else {
              if (media?.type?.includes("image")) {
                const uri = await Image.compress(media?.uri);
                const response = await getImageMetaData(uri);
                const convertedMedia = {
                  fileName: media?.fileName,
                  fileSize: response?.size,
                  type: media?.type,
                  height: response?.ImageHeight,
                  width: response?.ImageWidth,
                  uri
                }
                mediaWithSizeCheck.push(convertedMedia);
              } else {
                const uri = await Video.compress(media?.uri);
                const response = await getVideoMetaData(uri);
                const convertedMedia = {
                  duration: response.duration,
                  fileName: media.fileName,
                  fileSize: response.size,
                  height: response.height,
                  originalPath: null,
                  type: media.type,
                  uri: uri,
                  width: response.width,
                };

                mediaWithSizeCheck.push(convertedMedia);
              }
            }
          }
        }
    
        const selectedImagesVideos = convertImageVideoMetaData(mediaWithSizeCheck);
    
        // Check the count of media
        if (selectedImagesVideos.length + formattedMediaAttachments.length > 10) {
          setFormattedMediaAttachments([...formattedMediaAttachments]);
          setShowSelecting(false);
          dispatch({
            type: SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
            body: { reportModalStatus: false },
          });
          dispatch(
            showToastMessage({
              isToast: true,
              message: MEDIA_UPLOAD_COUNT_VALIDATION,
            })
          );
        } else {
          setShowOptions(selectedImagesVideos.length === 0 && formattedMediaAttachments.length === 0);
          setShowSelecting(false);
          dispatch({
            type: SET_REPORT_MODEL_STATUS_IN_POST_DETAIL,
            body: { reportModalStatus: false },
          });
          setFormattedMediaAttachments([
            ...formattedMediaAttachments,
            ...selectedImagesVideos,
          ]);
        }
    
        // Fire analytics events
        let imageCount = 0;
        let videoCount = 0;
        for (const media of selectedImagesVideos) {
          if (media.type === AttachmentType.IMAGE) {
            imageCount++;
          } else if (media.type === AttachmentType.VIDEO) {
            videoCount++;
          }
        }
    
        if (imageCount > 0) {
          LMFeedAnalytics.track(
            Events.IMAGE_ATTACHED_TO_POST,
            new Map([[Keys.IMAGE_COUNT, `${imageCount}`]])
          );
        }
        if (videoCount > 0) {
          LMFeedAnalytics.track(
            Events.VIDEO_ATTACHED_TO_POST,
            new Map([[Keys.VIDEO_COUNT, `${videoCount}`]])
          );
        }
    
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

  // function handles the selection of images and videos
  const setSelectedImageVideo = async (type: string) => {
    setShowSelecting(true);
    await selectImageVideoMethod(type)
  };

  // this handles the functionality of creating or editing post
  const onPostClick = async (
    allMedia: Array<LMAttachmentViewData>,
    linkData: Array<LMAttachmentViewData>,
    content: string,
    heading: string,
    topics: string[],
    poll: any,
    isAnonymous: boolean = false,
    metaData?: any
  ) => {
    dispatch({
      type: SET_POST_UPLOADING_CREATE_SCREEN,
      body: {
        uploading: true
      }
    })
    const isConnected = await NetworkUtil.isNetworkAvailable();
    if (isConnected) {
      let pollAttachment: any = [];
      if (Object.keys(poll).length > 0) {
        let updatedPollAttachment = convertPollMetaData(poll);
        pollAttachment = [...pollAttachment, updatedPollAttachment];
      }
      const attachments =
        Object.keys(metaData)?.length > 0
          ? [
            ...allMedia,
            ...linkData,
            ...pollAttachment,
            ...[{ type: AttachmentType.CUSTOM, metaData: { widgetMeta: { meta: metaData } } }],
          ]
          : [...allMedia, ...linkData, ...pollAttachment];
      const post = convertToTemporaryPost(
        attachments,
        heading,
        postContentText,
        topics,
        isAnonymous
      )
      const response = await Client?.myClient?.saveTemporaryPost({
        tempPost: {
          post: post
        }
      });
      postToEdit
        ? postEdit(topics)
        : dispatch(
            setUploadAttachments({
              mediaAttachmentData: allMedia,
              linkAttachmentData: linkData,
              postContentData: content.trim(),
              heading: heading,
              topics: topics,
              poll: poll,
              metaData: metaData,
              isAnonymous,
            })
          );
      dispatch({ type: CLEAR_POLL });
      navigation.goBack();
    } else {
      Alert.alert("", "Please check your internet connection");
    }
  };

  // function handles the slection of documents
  const setSelectedDocuments = () => {
    selectDocument()?.then((res: any) => {
      const mediaWithSizeCheck: any = [];
      // checks the size of the files
      for (const media of res) {
        if (media.size > MAX_FILE_SIZE || media.size < MIN_FILE_SIZE) {
          dispatch(
            showToastMessage({
              isToast: true,
              message: FILE_UPLOAD_SIZE_VALIDATION,
            })
          );
        } else {
          mediaWithSizeCheck.push(media);
        }
      }
      const selectedDocuments = convertDocumentMetaData(mediaWithSizeCheck);
      LMFeedAnalytics.track(
        Events.DOCUMENT_ATTACHED_TO_POST,
        new Map<string, string>([
          [Keys.DOCUMENT_COUNT, `${selectedDocuments.length}`],
        ])
      );
      // checks the count of the files attached
      if (selectedDocuments.length + formattedDocumentAttachments.length > 10) {
        setFormattedDocumentAttachments([...formattedDocumentAttachments]);
        dispatch(
          showToastMessage({
            isToast: true,
            message: MEDIA_UPLOAD_COUNT_VALIDATION,
          })
        );
      } else {
        if (
          selectedDocuments.length > 0 ||
          formattedDocumentAttachments.length > 0
        ) {
          setShowOptions(false);
        } else {
          setShowOptions(true);
        }
        setFormattedDocumentAttachments([
          ...formattedDocumentAttachments,
          ...selectedDocuments,
        ]);
      }
    });
  };

  // function handles the permission for image/video selection
  const handleGallery = async (type: string) => {
    await setSelectedImageVideo(type);
    // if (Platform.OS === "ios") {
    //   setSelectedImageVideo(type);
    // } else {
    //   const res = await requestStoragePermission();
    //   if (res === true) {
    //     setSelectedImageVideo(type);
    //   }
    // }
  };

  // function handles the permission for selection of documents
  const handleDocument = async () => {
    setSelectedDocuments();
    // if (Platform.OS === "ios") {
    //   setSelectedDocuments();
    // } else {
    //   const res = await requestStoragePermission();
    //   if (res === true) {
    //     setSelectedDocuments();
    //   }
    // }
  };

  // function handles the navigation to create poll screen
  const handlePoll = () => {
    navigation.navigate(CREATE_POLL_SCREEN, { memberData: memberData });
  };

  // function removes the selected documents
  const removeDocumentAttachment = (index: number) => {
    const newDocAttachments = [...formattedDocumentAttachments];
    if (formattedDocumentAttachments.length === 1) {
      setFormattedDocumentAttachments([]);
      setShowOptions(true);
    } else {
      newDocAttachments.splice(index, 1);
      setFormattedDocumentAttachments(newDocAttachments);
    }
  };

  // function removes multiple images/videos selected
  const removeMediaAttachment = (index: number) => {
    const newMediaAttachments = [...formattedMediaAttachments];
    newMediaAttachments.splice(index, 1);
    setFormattedMediaAttachments(newMediaAttachments);
  };

  // function removes single image and video selected
  const removeSingleAttachment = () => {
    setFormattedMediaAttachments([]);
    setShowOptions(true);
  };

  // function removes poll attachment
  const removePollAttachment = () => {
    dispatch({ type: CLEAR_POLL });
    setShowOptions(true);
  };

  const handleOnAnonymousPostClicked = () => {
    setAnonymousPost((val) => !val);
  };

  // function edits poll attachment
  const editPollAttachment = () => {
    navigation.navigate(CREATE_POLL_SCREEN, { memberData: memberData });
  };

  useEffect(() => {
    const debouncedSearch = _.debounce((text) => {
      // Perform your search or update your component's state here
      const links = detectURLs(text);

      if (links && links.length > 0) {
        const responsePromises: Promise<LMOGTagsViewData>[] = links.map(
          (item: string) => {
            return new Promise((resolve, reject) => {
              // calls the decodeUrl api
              const decodeUrlResponse: any = dispatch(
                getDecodedUrl(
                  DecodeURLRequest.builder().setURL(item).build(),
                  false
                )
              );
              decodeUrlResponse
                .then((res: any) => {
                  resolve(res?.ogTags);
                })
                .catch((error: any) => {
                  reject(error);
                });
            });
          }
        );

        Promise.all(responsePromises)
          .then(async (responses: LMOGTagsViewData[]) => {
            const filteredResponses = responses.filter(
              (response: LMOGTagsViewData) => response !== undefined
            );

            if (filteredResponses.length > 0) {
              const convertedLinkData = await convertLinkMetaData(
                filteredResponses
              );
              const link = convertedLinkData[0]?.metaData?.ogTags?.url;
              setFormattedLinkAttachments(convertedLinkData);
              if (!closedOnce) {
                setShowLinkPreview(true);
              } else {
                setFormattedLinkAttachments([]);
              }
              if (link) {
                LMFeedAnalytics.track(
                  Events.LINK_ATTACHED_IN_POST,
                  new Map<string, string>([[Keys.LINK, link]])
                );
              }
            }
            // Do something with the array of non-undefined responses
          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });
      } else {
        setFormattedLinkAttachments([]);
      }
    }, 500); // 500ms delay

    debouncedSearch(postContentText);

    return () => {
      debouncedSearch.cancel(); // Cleanup the debounced function
    };
  }, [postContentText, closedOnce]);

  useEffect(() => {
    if (Object.keys(poll)?.length > 0) {
      setShowOptions(false);
    }
  }, [poll]);

  // all image/video/document media to be uploaded
  const allAttachment = [
    ...formattedMediaAttachments,
    ...formattedDocumentAttachments,
  ];

  // this function calls the getPost api
  const getPostData = async () => {
    const getPostResponse: any = await dispatch(
      getPost(
        GetPostRequest.builder()
          .setPostId(postToEdit)
          .setPage(1)
          .setPageSize(10)
          .build(),
        false
      )
    );

    setPostDetail(
      convertToLMPostViewData(
        getPostResponse?.post,
        getPostResponse?.users,
        getPostResponse?.widgets,
        getPostResponse?.filteredComments
      )
    );

    setHeading(getPostResponse?.post?.heading);
    return getPostResponse;
  };

  // this checks if the post has to be edited or not and call the get post api
  useEffect(() => {
    if (postToEdit) {
      getPostData();
    }
  }, [postToEdit]);

  // this sets the post data in the local state to render UI
  useEffect(() => {
    if (postDetail?.text) {
      const convertedText = routeToMentionConverter(postDetail?.text);
      setPostContentText(convertedText);
    }
    if (postDetail?.attachments) {
      const imageVideoMedia: any = [];
      const documentMedia: any = [];
      const linkPreview: any = [];
      const pollPreview: any = [];
      for (const media of postDetail.attachments) {
        if (media.type === AttachmentType.IMAGE) {
          imageVideoMedia.push(media);
        } else if (media.type === AttachmentType.VIDEO) {
          imageVideoMedia.push(media);
        } else if (media.type === AttachmentType.DOCUMENT) {
          documentMedia.push(media);
        } else if (media.type === AttachmentType.POLL) {
          pollPreview.push(media);
        } else {
          linkPreview.push(media);
        }
      }
      setFormattedMediaAttachments(imageVideoMedia);
      setFormattedDocumentAttachments(documentMedia);
      setFormattedLinkAttachments(linkPreview);
      setFormattedPollAttachments(pollPreview);
    }
    if (postDetail?.topics) {
      dispatch({
        type: ADD_SELECTED_TOPICS,
        body: { topics: postDetail?.topics },
      });
    }
  }, [postDetail]);

  //  this function calls the edit post api
  const postEdit = async (topics) => {
    // replace mentions with route
    const contentText = mentionToRouteConverter(postContentText);
    const linkAttachments = showLinkPreview ? formattedLinkAttachments : [];
    const pollAttachments = convertPollMetaData(
      formattedPollAttachments[0]?.metaData
    );

    // call edit post api
    if (formattedPollAttachments[0]?.metaData) {
      const editPostResponse = dispatch(
        editPost(
          EditPostRequest.builder()
            .setHeading(heading)
            .setAttachments([
              ...allAttachment,
              ...linkAttachments,
              pollAttachments,
            ])
            .setPostId(postDetail?.id)
            .setText(contentText)
            .setTopicIds(topics)
            .build(),
          false
        )
      );
      dispatch({
        type: SET_POST_UPLOADING_CREATE_SCREEN,
        body: {
          uploading: false
        }
      })
      await Client?.myClient?.deleteTemporaryPost();
      return editPostResponse;
    } else {
      const editPostResponse = dispatch(
        editPost(
          EditPostRequest.builder()
            .setHeading(heading)
            .setAttachments([...allAttachment, ...linkAttachments])
            .setPostId(postDetail?.id)
            .setText(contentText)
            .setTopicIds(topics)
            .build(),
          false
        )
      );
      await Client?.myClient?.deleteTemporaryPost();
      dispatch({
        type: SET_POST_UPLOADING_CREATE_SCREEN,
        body: {
          uploading: false
        }
      })
      return editPostResponse;
    }
  };

  // this function is called on change text of inputText
  const handleInputChange = async (event: string) => {
    setPostContentText(event);

    const newMentions = detectMentions(event);

    if (newMentions.length > 0) {
      const length = newMentions.length;
      setTaggedUserName(newMentions[length - 1]);
    }

    // debouncing logic
    if (debounceTimeout !== null) {
      clearTimeout(debounceTimeout);
    }

    const mentionListLength = newMentions.length;
    if (mentionListLength > 0) {
      const timeoutID = setTimeout(async () => {
        setPage(1);
        const taggingListResponse: any = await dispatch(
          getTaggingList(
            GetTaggingListRequest.builder()
              .setSearchName(newMentions[mentionListLength - 1])
              .setPage(1)
              .setPageSize(10)
              .build(),
            false
          )
        );

        if (mentionListLength > 0) {
          const tagsLength = taggingListResponse?.members?.length;
          const arrLength = tagsLength;
          if (arrLength >= 5) {
            setUserTaggingListHeight(5 * 58);
          } else if (arrLength < 5) {
            const height = tagsLength * 100;
            setUserTaggingListHeight(height);
          }
          setAllTags(taggingListResponse?.members);
          setIsUserTagging(true);
        }
      }, 500);

      setDebounceTimeout(timeoutID);
    } else {
      if (isUserTagging) {
        setAllTags([]);
        setIsUserTagging(false);
      }
    }
  };

  // this function is called on change text of heading inputText
  const handleHeadingInputChange = (event: string) => {
    setHeading(event);
  };

  // this calls the tagging list api for different page number
  const loadData = async (newPage: number) => {
    setIsLoading(true);
    const taggingListResponse: any = await dispatch(
      getTaggingList(
        GetTaggingListRequest.builder()
          .setSearchName(taggedUserName)
          .setPage(newPage)
          .setPageSize(10)
          .build(),
        false
      )
    );
    if (taggingListResponse) {
      setAllTags([...allTags, ...taggingListResponse.members]);
      setIsLoading(false);
    }
  };

  // this handles the pagination of tagging list
  const handleLoadMore = () => {
    const userTaggingListLength = allTags.length;
    if (!isLoading && userTaggingListLength > 0) {
      // checking if conversations length is greater the 15 as it convered all the screen sizes of mobiles, and pagination API will never call if screen is not full messages.
      if (userTaggingListLength >= 10 * page) {
        const newPage = page + 1;
        setPage(newPage);
        loadData(newPage);
      }
    }
  };

  // this handles the functionality on back press
  const handleScreenBackPress = async () => {
    await dispatch({
      type: CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
    });
    await dispatch({
      type: CLEAR_POLL,
    });
    await dispatch({
      type: SET_FLOW_TO_CREATE_POST_SCREEN,
      body: { flowToCreatePostScreen: false },
    });
    navigation.goBack();
  };

  // this handles the view layout with keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      KEYBOARD_DID_SHOW,
      () => {
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      KEYBOARD_DID_HIDE,
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const contextValues: CreatePostContextValues = {
    navigation,
    route,
    memberData,
    formattedDocumentAttachments,
    formattedMediaAttachments,
    formattedLinkAttachments,
    formattedPollAttachments,
    showLinkPreview,
    closedOnce,
    showOptions,
    showSelecting,
    postToEdit,
    postDetail,
    postContentText,
    myRef,
    taggedUserName,
    debounceTimeout,
    page,
    userTaggingListHeight,
    allTags,
    isUserTagging,
    isLoading,
    heading,
    disbaledTopicsGlobal,
    showTopics,
    mappedTopics,
    isKeyboardVisible,
    setAnonymousPost,
    setIsLoading,
    setIsUserTagging,
    setAllTags,
    setUserTaggingListHeight,
    setPage,
    setDebounceTimeout,
    setTaggedUserName,
    setPostContentText,
    setPostDetail,
    setShowSelecting,
    setShowOptions,
    setClosedOnce,
    setShowLinkPreview,
    setFormattedLinkAttachments,
    setFormattedMediaAttachments,
    setFormattedDocumentAttachments,
    setFormattedPollAttachments,
    setSelectedImageVideo,
    setSelectedDocuments,
    handleGallery,
    handleDocument,
    handlePoll,
    removeDocumentAttachment,
    removeMediaAttachment,
    removeSingleAttachment,
    removePollAttachment,
    editPollAttachment,
    allAttachment,
    getPostData,
    postEdit,
    handleInputChange,
    handleHeadingInputChange,
    loadData,
    handleLoadMore,
    onPostClick,
    handleScreenBackPress,
    setDisabledTopicsGlobal,
    setShowTopics,
    setMappedTopics,
    anonymousPost,
    handleOnAnonymousPostClicked,
  };

  return (
    <CreatePostContext.Provider value={contextValues}>
      {children}
    </CreatePostContext.Provider>
  );
};
