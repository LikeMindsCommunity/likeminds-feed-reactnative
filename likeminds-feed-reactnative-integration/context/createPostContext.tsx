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
import { Alert, Platform, TextInput } from "react-native";
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
  FILE_UPLOAD_SIZE_VALIDATION,
  IMAGE_ATTACHMENT_TYPE,
  MAX_FILE_SIZE,
  MEDIA_UPLOAD_COUNT_VALIDATION,
  MIN_FILE_SIZE,
  VIDEO_ATTACHMENT_TYPE,
} from "../constants/Strings";
import {
  convertDocumentMetaData,
  convertImageVideoMetaData,
  convertLinkMetaData,
  convertToLMPostUI,
} from "../viewDataModels";
import _ from "lodash";
import {
  editPost,
  getDecodedUrl,
  setUploadAttachments,
} from "../store/actions/createPost";
import {
  DecodeURLRequest,
  EditPostRequest,
  GetPostRequest,
  GetTaggingListRequest,
} from "@likeminds.community/feed-js";
import { getPost, getTaggingList } from "../store/actions/postDetail";
import { showToastMessage } from "../store/actions/toast";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../models/RootStackParamsList";
import { LMAttachmentUI, LMOGTagsUI, LMPostUI, LMUserUI } from "../models";
import {
  ADD_SELECTED_TOPICS,
  CLEAR_SELECTED_TOPICS_FOR_CREATE_POST_SCREEN,
} from "../store/types/types";
import { LMFeedAnalytics } from "../analytics/LMFeedAnalytics";
import { Events } from "../enums/Events";
import { Keys } from "../enums/Keys";
import { CREATE_POLL_SCREEN } from "../constants/screenNames";

interface CreatePostContextProps {
  children: ReactNode;
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
  memberData: LMUserUI;
  formattedDocumentAttachments: Array<LMAttachmentUI>;
  formattedMediaAttachments: Array<LMAttachmentUI>;
  formattedLinkAttachments: Array<LMAttachmentUI>;
  showLinkPreview: boolean;
  closedOnce: boolean;
  showOptions: boolean;
  showSelecting: boolean;
  postToEdit: any;
  postDetail: LMPostUI;
  postContentText: string;
  myRef: any;
  taggedUserName: string;
  debounceTimeout: NodeJS.Timeout | null;
  page: number;
  userTaggingListHeight: number;
  allTags: Array<LMUserUI>;
  isUserTagging: boolean;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsUserTagging: Dispatch<SetStateAction<boolean>>;
  setAllTags: Dispatch<SetStateAction<Array<LMUserUI>>>;
  setUserTaggingListHeight: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
  setDebounceTimeout: Dispatch<SetStateAction<NodeJS.Timeout | null>>;
  setTaggedUserName: Dispatch<SetStateAction<string>>;
  setPostContentText: Dispatch<SetStateAction<string>>;
  setPostDetail: Dispatch<SetStateAction<LMPostUI>>;
  setShowSelecting: Dispatch<SetStateAction<boolean>>;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
  setClosedOnce: Dispatch<SetStateAction<boolean>>;
  setShowLinkPreview: Dispatch<SetStateAction<boolean>>;
  setFormattedLinkAttachments: Dispatch<SetStateAction<Array<LMAttachmentUI>>>;
  setFormattedMediaAttachments: Dispatch<SetStateAction<Array<LMAttachmentUI>>>;
  setFormattedDocumentAttachments: Dispatch<
    SetStateAction<Array<LMAttachmentUI>>
  >;
  setSelectedImageVideo: (type: string) => void;
  setSelectedDocuments: () => void;
  handleGallery: (type: string) => void;
  handleDocument: () => void;
  handlePoll: () => void;
  removeDocumentAttachment: (index: number) => void;
  removeMediaAttachment: (index: number) => void;
  removeSingleAttachment: () => void;
  allAttachment: Array<LMAttachmentUI>;
  getPostData: () => void;
  postEdit: any;
  handleInputChange: (event: string) => void;
  loadData: (newPage: number) => void;
  handleLoadMore: () => void;
  onPostClick: (
    allMedia: Array<LMAttachmentUI>,
    linkData: Array<LMAttachmentUI>,
    content: string,
    topics: string[]
  ) => void;
  handleScreenBackPress: () => void;
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
  const dispatch = useAppDispatch();
  const [formattedDocumentAttachments, setFormattedDocumentAttachments] =
    useState<Array<LMAttachmentUI>>([]);
  const [formattedMediaAttachments, setFormattedMediaAttachments] = useState<
    Array<LMAttachmentUI>
  >([]);
  const [formattedLinkAttachments, setFormattedLinkAttachments] = useState<
    Array<LMAttachmentUI>
  >([]);
  const [showLinkPreview, setShowLinkPreview] = useState(false);
  const [closedOnce, setClosedOnce] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [showSelecting, setShowSelecting] = useState(false);
  const postToEdit = route?.params?.postId;
  const [postDetail, setPostDetail] = useState({} as LMPostUI);
  const [postContentText, setPostContentText] = useState("");
  const myRef = useRef<TextInput>(null);
  const [taggedUserName, setTaggedUserName] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [userTaggingListHeight, setUserTaggingListHeight] =
    useState<number>(116);
  const [allTags, setAllTags] = useState<Array<LMUserUI>>([]);
  const [isUserTagging, setIsUserTagging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // function handles the selection of images and videos
  const setSelectedImageVideo = (type: string) => {
    setShowSelecting(true);
    selectImageVideo(type)?.then((res) => {
      if (res?.didCancel) {
        setShowSelecting(false);
      } else {
        const mediaWithSizeCheck: any = [];
        // checks the size of media
        if (res?.assets) {
          for (const media of res.assets) {
            if (
              media?.fileSize &&
              (media?.fileSize > MAX_FILE_SIZE ||
                media?.fileSize < MIN_FILE_SIZE)
            ) {
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
        }
        const selectedImagesVideos =
          convertImageVideoMetaData(mediaWithSizeCheck);
        // checks ths count of the media
        if (
          selectedImagesVideos.length + formattedMediaAttachments.length >
          10
        ) {
          setFormattedMediaAttachments([...formattedMediaAttachments]);
          setShowSelecting(false);
          dispatch(
            showToastMessage({
              isToast: true,
              message: MEDIA_UPLOAD_COUNT_VALIDATION,
            })
          );
        } else {
          if (
            selectedImagesVideos.length > 0 ||
            formattedMediaAttachments.length > 0
          ) {
            setShowOptions(false);
          } else {
            setShowOptions(true);
          }
          setShowSelecting(false);
          setFormattedMediaAttachments([
            ...formattedMediaAttachments,
            ...selectedImagesVideos,
          ]);
        }

        // To fire analytics event
        let imageCount = 0;
        let videoCount = 0;
        for (let i = 0; i < selectedImagesVideos.length; i++) {
          if (
            selectedImagesVideos[i].attachmentType === IMAGE_ATTACHMENT_TYPE
          ) {
            imageCount++;
          } else if (
            selectedImagesVideos[i].attachmentType === VIDEO_ATTACHMENT_TYPE
          ) {
            videoCount++;
          }
        }

        // sends image attached event if imageCount > 0
        if (imageCount > 0) {
          LMFeedAnalytics.track(
            Events.IMAGE_ATTACHED_TO_POST,
            new Map<string, string>([[Keys.IMAGE_COUNT, `${imageCount}`]])
          );
        }
        // sends image attached event if videoCount > 0
        if (videoCount > 0) {
          LMFeedAnalytics.track(
            Events.VIDEO_ATTACHED_TO_POST,
            new Map<string, string>([[Keys.VIDEO_COUNT, `${videoCount}`]])
          );
        }
      }
    });
  };

  // this handles the functionality of creating or editing post
  const onPostClick = async (
    allMedia: Array<LMAttachmentUI>,
    linkData: Array<LMAttachmentUI>,
    content: string,
    topics: string[]
  ) => {
    const isConnected = await NetworkUtil.isNetworkAvailable();
    if (isConnected) {
      postToEdit
        ? postEdit(topics)
        : dispatch(
            setUploadAttachments({
              mediaAttachmentData: allMedia,
              linkAttachmentData: linkData,
              postContentData: content.trim(),
              topics: topics,
            })
          );
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
    if (Platform.OS === "ios") {
      setSelectedImageVideo(type);
    } else {
      const res = await requestStoragePermission();
      if (res === true) {
        setSelectedImageVideo(type);
      }
    }
  };

  // function handles the permission for selection of documents
  const handleDocument = async () => {
    if (Platform.OS === "ios") {
      setSelectedDocuments();
    } else {
      const res = await requestStoragePermission();
      if (res === true) {
        setSelectedDocuments();
      }
    }
  };

  // function handles the navigation to create poll screen
  const handlePoll = () => {
    navigation.navigate(CREATE_POLL_SCREEN);
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

  useEffect(() => {
    const debouncedSearch = _.debounce((text) => {
      // Perform your search or update your component's state here
      const links = detectURLs(text);

      if (links && links.length > 0) {
        const responsePromises: Promise<LMOGTagsUI>[] = links.map(
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
                  resolve(res?.og_tags);
                })
                .catch((error: any) => {
                  reject(error);
                });
            });
          }
        );

        Promise.all(responsePromises)
          .then(async (responses: LMOGTagsUI[]) => {
            const filteredResponses = responses.filter(
              (response: LMOGTagsUI) => response !== undefined
            );

            if (filteredResponses.length > 0) {
              const convertedLinkData = await convertLinkMetaData(
                filteredResponses
              );
              const link = convertedLinkData[0]?.attachmentMeta?.ogTags?.url;
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
          .setpostId(postToEdit)
          .setpage(1)
          .setpageSize(10)
          .build(),
        false
      )
    );

    setPostDetail(
      convertToLMPostUI(getPostResponse?.post, getPostResponse?.users)
    );
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
      for (const media of postDetail.attachments) {
        if (media.attachmentType === IMAGE_ATTACHMENT_TYPE) {
          imageVideoMedia.push(media);
        } else if (media.attachmentType === VIDEO_ATTACHMENT_TYPE) {
          imageVideoMedia.push(media);
        } else if (media.attachmentType === DOCUMENT_ATTACHMENT_TYPE) {
          documentMedia.push(media);
        } else {
          linkPreview.push(media);
        }
      }
      setFormattedMediaAttachments(imageVideoMedia);
      setFormattedDocumentAttachments(documentMedia);
      setFormattedLinkAttachments(linkPreview);
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
    // call edit post api
    const editPostResponse = dispatch(
      editPost(
        EditPostRequest.builder()
          .setHeading("")
          .setattachments([...allAttachment, ...linkAttachments])
          .setpostId(postDetail?.id)
          .settext(contentText)
          .setTopicIds(topics)
          .build(),
        false
      )
    );

    return editPostResponse;
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
              .setsearchName(newMentions[mentionListLength - 1])
              .setpage(1)
              .setpageSize(10)
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

  // this calls the tagging list api for different page number
  const loadData = async (newPage: number) => {
    setIsLoading(true);
    const taggingListResponse: any = await dispatch(
      getTaggingList(
        GetTaggingListRequest.builder()
          .setsearchName(taggedUserName)
          .setpage(newPage)
          .setpageSize(10)
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
    navigation.goBack();
  };

  const contextValues: CreatePostContextValues = {
    navigation,
    route,
    memberData,
    formattedDocumentAttachments,
    formattedMediaAttachments,
    formattedLinkAttachments,
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
    setSelectedImageVideo,
    setSelectedDocuments,
    handleGallery,
    handleDocument,
    handlePoll,
    removeDocumentAttachment,
    removeMediaAttachment,
    removeSingleAttachment,
    allAttachment,
    getPostData,
    postEdit,
    handleInputChange,
    loadData,
    handleLoadMore,
    onPostClick,
    handleScreenBackPress,
  };

  return (
    <CreatePostContext.Provider value={contextValues}>
      {children}
    </CreatePostContext.Provider>
  );
};
