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
  useLayoutEffect,
} from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { mentionToRouteConverter, uploadFilesToAWS } from "../utils";
import { addPost, setUploadAttachments } from "../store/actions/createPost";
import {
  AddPostRequest,
  GetFeedRequest,
  GetPersonalisedFeedRequest,
  Post,
  PostSeenRequest,
} from "@likeminds.community/feed-rn";
import {
  autoPlayPostVideo,
  refreshFeed,
  refreshPersonalisedFeed,
} from "../store/actions/feed";
import {
  CREATE_POST_PERMISSION,
  POLLS_OPTIONS_LIMIT_WARNING,
  POLLS_OPTIONS_WARNING,
  POLL_ENDED_WARNING,
  POLL_SUBMITTED_SUCCESSFULLY,
  POST_UPLOADED,
  POST_UPLOADED_ANONYMOUSLY,
  POST_UPLOAD_INPROGRESS,
  RIGHT_CREATE_POST,
  SOMETHING_WENT_WRONG,
  STATE_ADMIN,
} from "../constants/Strings";
import { RootStackParamList } from "../models/RootStackParamsList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { showToastMessage } from "../store/actions/toast";
import { FlatList } from "react-native";
import { LMAttachmentViewData, LMPostViewData } from "../models";
import {
  CREATE_POST,
  NOTIFICATION_FEED,
  SEARCH_SCREEN,
  UNIVERSAL_FEED,
} from "../constants/screenNames";
import {
  getUnreadNotificationCount,
  notificationFeedClear,
} from "../store/actions/notification";
import { LMFeedAnalytics } from "../analytics/LMFeedAnalytics";
import { Events } from "../enums/Events";
import { Keys } from "../enums/Keys";
import { convertPollMetaData } from "../viewDataModels";
import { useRoute } from "@react-navigation/native";
import { SHOW_TOAST } from "../store/types/loader";
import { Client } from "../client";
import { PollMultiSelectState, PollType } from "../enums/Poll";
import {
  REFRESH_FROM_ONBOARDING_SCREEN,
  SET_FLOW_TO_CREATE_POST_SCREEN,
  SET_PAUSED_STATUS,
  SET_POST_UPLOADING_CREATE_SCREEN,
} from "../store/types/types";
import { useLMFeed } from "../lmFeedProvider";
import { FeedType } from "../enums/FeedType";
import { AddPollOptionParams, SetSelectedPollOptionsParams, SubmitPollParams } from "../constants/types";
import RNVideoThumbnail from "../optionalDependencies/RNVideoThumbnail";
import expoVideoThumbnail from "../optionalDependencies/ExpoVideoThumbnail";
interface UniversalFeedContextProps {
  children?: ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList, "UniversalFeed">;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
  predefinedTopics?: string[];
}

export interface UniversalFeedContextValues {
  navigation: NativeStackNavigationProp<RootStackParamList, "UniversalFeed">;
  feedData: Array<LMPostViewData>;
  accessToken: string;
  memberData: {};
  memberRight: [];
  postUploading: boolean;
  showCreatePost: boolean;
  refreshing: boolean;
  localRefresh: boolean;
  listRef: MutableRefObject<FlatList<LMPostViewData> | null>;
  mediaAttachmemnts: [];
  linkAttachments: [];
  postContent: string;
  uploadProgress: number;
  uploadingMediaAttachmentType: number;
  uploadingMediaAttachment: string;
  unreadNotificationCount: number;
  temporaryPost?: Post | null;
  setTemporaryPost?: Dispatch<SetStateAction<Post | null>>;
  setLocalRefresh: Dispatch<SetStateAction<boolean>>;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  setPostUploading: Dispatch<SetStateAction<boolean>>;
  setShowCreatePost: Dispatch<SetStateAction<boolean>>;
  onRefresh: () => void;
  postAdd: () => void;
  keyExtractor: (val) => string;
  newPostButtonClick: (hidePoll?: boolean) => void;
  getNotificationsCount: () => void;
  onTapNotificationBell: () => void;
  addPollOption: any;
  setSelectedPollOptions: any;
  submitPoll: any;
  isAnyMatchingPost: boolean;
  setIsAnyMatchingPost: Dispatch<SetStateAction<boolean>>;
  feedPageNumber: number;
  setFeedPageNumber: Dispatch<SetStateAction<number>>;
  isPaginationStopped: boolean;
  setIsPaginationStopped: Dispatch<SetStateAction<boolean>>;
  predefinedTopics?: string[];
  onSearchIconClick: () => void;
  postSeen: (initialPosts?: string[]) => void;
  feedType?: FeedType;
  addTemporaryPost: () => void;
  abortRetry: () => void;
  onRetryPress?: () => void;
  onCancelPress?: () => void;
}

const UniversalFeedContext = createContext<
  UniversalFeedContextValues | undefined
>(undefined);

export const useUniversalFeedContext = () => {
  const context = useContext(UniversalFeedContext);
  if (!context) {
    throw new Error(
      "useUniversalFeedContext must be used within an UniversalFeedContextProvider"
    );
  }
  return context;
};

export const UniversalFeedContextProvider = ({
  children,
  navigation,
  predefinedTopics,
}: UniversalFeedContextProps) => {
  const dispatch = useAppDispatch();
  const feedData = useAppSelector((state) => state.feed.feed);
  const accessToken = useAppSelector((state) => state.login.accessToken);
  const memberData = useAppSelector((state) => state.login.member);
  const memberRight = useAppSelector((state) => state.login.memberRights);
  const selectedTopics = useAppSelector(
    (state) => state.feed.selectedTopicsForUniversalFeedScreen
  );
  const [postUploading, setPostUploading] = useState(false);


  const [feedPageNumber, setFeedPageNumber] = useState(1);
  const [isPaginationStopped, setIsPaginationStopped] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(true);
  const [isAnyMatchingPost, setIsAnyMatchingPost] = useState(false);
  const [temporaryPost, setTemporaryPost] = useState<any>();
  const {
    mediaAttachmemnts,
    linkAttachments,
    postContent,
    heading,
    topics,
    metaData,
    isAnonymous,
  } = useAppSelector((state) => state.createPost);
  const poll = useAppSelector((state) => state.createPost.poll);
  const unreadNotificationCount = useAppSelector(
    (state) => state.notification.activitiesCount
  );
  const uploadingMediaAttachmentType = mediaAttachmemnts[0]?.attachmentType;
  const uploadingMediaAttachment = mediaAttachmemnts[0]?.attachmentMeta.url;

  const [refreshing, setRefreshing] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const listRef = useRef<FlatList<LMPostViewData>>(null);
  const route = useRoute();
  const params = route.params as {
    feedType?: FeedType;
  };
  const feedType = params?.feedType;
  const myClient = Client.myClient;

  useLayoutEffect(() => {
    (async () => {
      const response = await Client?.myClient?.getTemporaryPost();
      const locallyStoredPost = response.getData()?.tempPost?.post;
      if (locallyStoredPost) {
        setTemporaryPost(locallyStoredPost)
      }
    })();
  }, [])

  useEffect(() => {
    if (accessToken) {
      // handles members right
      if (memberData?.state !== STATE_ADMIN) {
        const members_right = memberRight?.find(
          (item) => item?.state === RIGHT_CREATE_POST
        );

        if (members_right?.isSelected === false) {
          setShowCreatePost(false);
        }
      }
    }
  }, [accessToken]);

  // this function is executed on pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setLocalRefresh(true);
    // calling getFeed API
    const topicIds =
      selectedTopics?.length > 0 && selectedTopics[0] != "0"
        ? selectedTopics
        : [];

    if (feedType === FeedType.PERSONALISED_FEED) {
      const getPersonalisedResponse = await dispatch(
        refreshPersonalisedFeed(
          GetPersonalisedFeedRequest.builder()
            .setPage(1)
            .setPageSize(20)
            .setShouldRecompute(true)
            .setShouldReorder(true)
            .build(),
          false
        )
      );
      await postSeen();
    } else {
      await dispatch(
        refreshFeed(
          GetFeedRequest.builder()
            .setPage(1)
            .setPageSize(20)
            .setTopicIds(predefinedTopics ? predefinedTopics : topicIds)
            .build(),
          false
        )
      );
    }
    dispatch({
      type: REFRESH_FROM_ONBOARDING_SCREEN,
      body: { refresh: false },
    });
    setLocalRefresh(false);
    setRefreshing(false);
  };

  // Analytics event
  useEffect(() => {
    LMFeedAnalytics.track(
      Events.FEED_OPENED,
      new Map<string, string>([[Keys.FEED_TYPE, Keys.UNIVERSAL_FEED]])
    );
  }, []);

  const abortRetry = async () => {
    await Client?.myClient?.deleteTemporaryPost();
    setTemporaryPost(null);
  }

  const addTemporaryPost = async () => {
    setUploadProgress(0);
    setPostUploading(true);
    // replace the mentions with route
    const postContentText = mentionToRouteConverter(temporaryPost?.text ?? "");
    const headingText = temporaryPost?.heading;
    const topics = temporaryPost?.topics;

    const mediaAttachmemnts = temporaryPost?.attachments?.filter(item => {
      return item?.attachmentType == 1 || item?.attachmentType == 2 || item?.attachmentType == 3
    }) ?? []

    const otherAttachments = temporaryPost?.attachments?.filter(item => {
      return item?.attachmentType == 4 || item?.attachmentType == 5 || item?.attachmentType == 6
    }) ?? []

    let progressArray = new Array(mediaAttachmemnts?.length ?? 0).fill(0);
    const updateTotalProgress = () => {
      const totalProgress =
        progressArray.reduce((acc, val) => acc + val, 0) / mediaAttachmemnts?.length;
      setUploadProgress(totalProgress);
    };

    // upload media to aws
    const uploadPromises = mediaAttachmemnts?.map(
      async (item: LMAttachmentViewData, index) => {
        if (item?.attachmentType == 2) {
          if (RNVideoThumbnail) {
            await RNVideoThumbnail.createThumbnail({
              url: item?.attachmentMeta?.url,
              timeStamp: 1000
            }).then(async (response) => {
              const newName =
                item.attachmentMeta.name &&
                item.attachmentMeta.name.substring(
                  0,
                  item.attachmentMeta.name.lastIndexOf(".")
                ) + ".jpeg";
              const thumbnailMeta = {
                ...item.attachmentMeta,
                name: newName,
                format: "image/jpeg",
                thumbnailUrl: response?.path,
              };
              const thumbnailRes = await uploadFilesToAWS(
                thumbnailMeta,
                memberData.userUniqueId,
                response?.path
              );
              item.attachmentMeta.thumbnailUrl = thumbnailRes.Location;
            })
              .catch((res) => { });
          } else if (expoVideoThumbnail) {
            await expoVideoThumbnail.getThumbnailAsync(
              item?.attachmentMeta?.url,
              {
                time: 1000
              }
            ).then(async (response) => {
              const newName =
                item.attachmentMeta.name &&
                item.attachmentMeta.name.substring(
                  0,
                  item.attachmentMeta.name.lastIndexOf(".")
                ) + ".jpeg";
              const thumbnailMeta = {
                ...item.attachmentMeta,
                name: newName,
                format: "image/jpeg",
                thumbnailUrl: response?.path,
              };
              const thumbnailRes = await uploadFilesToAWS(
                thumbnailMeta,
                memberData.userUniqueId,
                response?.path
              );
              item.attachmentMeta.thumbnailUrl = thumbnailRes.Location;
            })
              .catch((res) => { });
          }
        }
        return uploadFilesToAWS(
          item.attachmentMeta,
          memberData.userUniqueId,
          item.attachmentMeta?.url,
          undefined,
          (progress) => {
            progressArray[index] = progress; // Update progress of this file
            updateTotalProgress(); // Recalculate total progress
          }
        ).then((res) => {
          item.attachmentMeta.url = res.Location;
          return item; // Return the updated item
        });
      }
    );

    // Wait for all upload operations to complete
    const updatedAttachments = await Promise.all(uploadPromises ?? []);

    const attachments = [...updatedAttachments, ...otherAttachments];

    const addPostResponse: any = await dispatch(
      addPost(
        AddPostRequest.builder()
          .setAttachments(attachments)
          .setText(postContentText)
          .setHeading(headingText)
          .setTopicIds(topics)
          .setIsAnonymous(isAnonymous ?? false)
          .build(),
        false
      )
    );
    if (addPostResponse !== undefined) {
      setPostUploading(false);
      setTemporaryPost(null);
      listRef.current?.scrollToIndex({ animated: true, index: 0 });
      if (addPostResponse?.name == "Error") {
        dispatch(
          showToastMessage({
            isToast: true,
            message: SOMETHING_WENT_WRONG,
          })
        );
        return addPostResponse;
      }
      dispatch(
        showToastMessage({
          isToast: true,
          message: isAnonymous ? POST_UPLOADED_ANONYMOUSLY : POST_UPLOADED,
        })
      );
      await Client?.myClient?.deleteTemporaryPost();
    }
    dispatch({
      type: SET_POST_UPLOADING_CREATE_SCREEN,
      body: {
        uploading: false
      }
    })
    return addPostResponse;

  }

  // this function adds a new post
  const postAdd = async () => {
    setUploadProgress(0);
    // replace the mentions with route
    const postContentText = mentionToRouteConverter(postContent);
    const headingText = heading;

    let progressArray = new Array(mediaAttachmemnts?.length ?? 0).fill(0);
    const updateTotalProgress = () => {
      const totalProgress =
        progressArray.reduce((acc, val) => acc + val, 0) / mediaAttachmemnts?.length;
      setUploadProgress(totalProgress);
    };

    // upload media to aws
    const uploadPromises = mediaAttachmemnts?.map(
      async (item: LMAttachmentViewData, index) => {
        if (item?.attachmentType == 2) {
          if (RNVideoThumbnail) {
            await RNVideoThumbnail.createThumbnail({
              url: item?.attachmentMeta?.url,
              timeStamp: 1000
            }).then(async (response) => {
              const newName =
                item.attachmentMeta.name &&
                item.attachmentMeta.name.substring(
                  0,
                  item.attachmentMeta.name.lastIndexOf(".")
                ) + ".jpeg";
              const thumbnailMeta = {
                ...item.attachmentMeta,
                name: newName,
                format: "image/jpeg",
                thumbnailUrl: response?.path,
              };
              const thumbnailRes = await uploadFilesToAWS(
                thumbnailMeta,
                memberData.userUniqueId,
                response?.path
              );
              item.attachmentMeta.thumbnailUrl = thumbnailRes.Location;
            })
              .catch((res) => { });
          } else if (expoVideoThumbnail) {
            await expoVideoThumbnail.getThumbnailAsync(
              item?.attachmentMeta?.url,
              {
                time: 1000
              }
            ).then(async (response) => {
              const newName =
                item.attachmentMeta.name &&
                item.attachmentMeta.name.substring(
                  0,
                  item.attachmentMeta.name.lastIndexOf(".")
                ) + ".jpeg";
              const thumbnailMeta = {
                ...item.attachmentMeta,
                name: newName,
                format: "image/jpeg",
                thumbnailUrl: response?.path,
              };
              const thumbnailRes = await uploadFilesToAWS(
                thumbnailMeta,
                memberData.userUniqueId,
                response?.path
              );
              item.attachmentMeta.thumbnailUrl = thumbnailRes.Location;
            })
              .catch((res) => { });
          }
        }
        return uploadFilesToAWS(
          item.attachmentMeta,
          memberData.userUniqueId,
          item.attachmentMeta?.url,
          undefined,
          (progress) => {
            progressArray[index] = progress; // Update progress of this file
            updateTotalProgress(); // Recalculate total progress
          }
        ).then((res) => {
          item.attachmentMeta.url = res.Location;
          return item; // Return the updated item
        });
      }
    );
    // Wait for all upload operations to complete
    const updatedAttachments = await Promise.all(uploadPromises);

    let pollAttachment: any = [];
    if (Object.keys(poll).length > 0) {
      let updatedPollAttachment = convertPollMetaData(poll);
      pollAttachment = [...pollAttachment, updatedPollAttachment];
    }
    const attachments =
      Object.keys(metaData)?.length > 0
        ? [
          ...updatedAttachments,
          ...linkAttachments,
          ...pollAttachment,
          ...[{ attachmentType: 5, attachmentMeta: { meta: metaData } }],
        ]
        : [...updatedAttachments, ...linkAttachments, ...pollAttachment];
    const addPostResponse: any = await dispatch(
      addPost(
        AddPostRequest.builder()
          .setAttachments(attachments)
          .setText(postContentText)
          .setHeading(headingText)
          .setTopicIds(topics)
          .setIsAnonymous(isAnonymous ?? false)
          .build(),
        false
      )
    );
    if (addPostResponse !== undefined) {
      setPostUploading(false);
      await Client?.myClient?.deleteTemporaryPost();
      setTemporaryPost(null);
      dispatch(
        setUploadAttachments({
          allAttachment: [],
          linkData: [],
          conText: "",
          topics: [],
        })
      );
      listRef.current?.scrollToIndex({ animated: true, index: 0 });
      if (addPostResponse?.name == "Error") {
        dispatch(
          showToastMessage({
            isToast: true,
            message: SOMETHING_WENT_WRONG,
          })
        );
        return addPostResponse;
      }
      dispatch(
        showToastMessage({
          isToast: true,
          message: isAnonymous ? POST_UPLOADED_ANONYMOUSLY : POST_UPLOADED,
        })
      );
    }
    dispatch({
      type: SET_POST_UPLOADING_CREATE_SCREEN,
      body: {
        uploading: false
      }
    })
    return addPostResponse;
  };

  // this handles the functionality of new post button
  const newPostButtonClick = async (hidePoll?: boolean) => {
    dispatch(autoPlayPostVideo(""));

    if (showCreatePost) {
      if (postUploading || temporaryPost) {
        dispatch(
          showToastMessage({
            isToast: true,
            message: POST_UPLOAD_INPROGRESS,
          })
        );
      } else {
        await dispatch({
          type: SET_PAUSED_STATUS,
          body: { paused: true },
        });
        await dispatch({
          type: SET_FLOW_TO_CREATE_POST_SCREEN,
          body: { flowToCreatePostScreen: true },
        });

        navigation.navigate(CREATE_POST, {
          hidePoll: hidePoll ? hidePoll : false,
        });
      }
    } else {
      dispatch(
        showToastMessage({
          isToast: true,
          message: CREATE_POST_PERMISSION,
        })
      );
    }
  };

  // this useEffect handles the execution of addPost api
  useEffect(() => {
    // this checks if any media is selected to be posted and then executes the addPost api

    if (
      (mediaAttachmemnts.length > 0 ||
        linkAttachments.length > 0 ||
        postContent !== "" ||
        heading !== "" ||
        topics?.length > 0 ||
        Object.keys(poll).length > 0) &&
      route.name === UNIVERSAL_FEED
    ) {
      setPostUploading(true);
      postAdd();
    }
  }, [mediaAttachmemnts, linkAttachments, postContent, heading, topics, poll]);

  // keyExtractor of feed list
  const keyExtractor = (item: LMPostViewData) => {
    const id = item?.id;
    const itemLiked = item?.isLiked;
    const itemPinned = item?.isPinned;
    const itemComments = item?.commentsCount;
    const itemSaved = item?.isSaved;
    const itemText = item?.text;

    return `${id}`;
  };

  const getNotificationsCount = async () => {
    const unreadNotificationCountResponse = await dispatch(
      getUnreadNotificationCount()
    );
    return unreadNotificationCountResponse;
  };

  useEffect(() => {
    getNotificationsCount();
  }, []);

  const onTapNotificationBell = () => {
    dispatch(notificationFeedClear());
    dispatch(autoPlayPostVideo(""));
    navigation.navigate(NOTIFICATION_FEED);
  };

  // this function call an API which adds a poll option in existing poll
  async function addPollOption({
    addOptionInputField,
    options: pollsArr,
    poll,
    setIsAddPollOptionModalVisible,
    setAddOptionInputField,
    reloadPost,
  }: AddPollOptionParams) {
    const item = poll?.attachments[0]?.attachmentMeta;
    try {
      if (addOptionInputField.trim().length === 0) {
        return;
      } else if (pollsArr.length >= 10) {
        setIsAddPollOptionModalVisible(false);
        setAddOptionInputField("");
        dispatch({
          type: SHOW_TOAST,
          body: { isToast: true, message: POLLS_OPTIONS_LIMIT_WARNING },
        });
        return;
      }

      let shouldBreak = false;
      const polls = pollsArr.map((item: any) => {
        if (item?.text === addOptionInputField) {
          setIsAddPollOptionModalVisible(false);
          setAddOptionInputField("");
          dispatch({
            type: SHOW_TOAST,
            body: { isToast: true, message: POLLS_OPTIONS_WARNING },
          });
          shouldBreak = true;
        }
      });

      if (shouldBreak) {
        return;
      }

      setIsAddPollOptionModalVisible(false);
      setAddOptionInputField("");

      const payload = {
        pollId: item?.id,
        text: addOptionInputField,
      };
      await myClient.addPollOption(payload);
      await reloadPost();
    } catch (error) {
      // process error
    }
  }

  // this function used we interact with poll options
  async function setSelectedPollOptions({
    pollIndex,
    poll,
    selectedPolls,
    options,
    shouldShowVotes,
    isMultiChoicePoll,
    reloadPost,
    setSelectedPolls,
  }: SetSelectedPollOptionsParams) {
    const item = poll?.attachments[0]?.attachmentMeta;
    if (Date.now() > item?.expiryTime) {
      dispatch({
        type: SHOW_TOAST,
        body: { isToast: true, message: POLL_ENDED_WARNING },
      });
      return;
    }
    const newSelectedPolls = [...selectedPolls];
    const isPollIndexIncluded = newSelectedPolls.includes(pollIndex);

    if (isPollIndexIncluded) {
      // if poll item is already selected
      const isSelected = item?.options?.some((poll: any) => {
        return poll?.isSelected;
      });
      const selectedIndex = newSelectedPolls.findIndex(
        (index) => index === pollIndex
      );
      newSelectedPolls.splice(selectedIndex, 1);
    } else {
      const isSelected = options?.some((poll: any) => {
        return poll?.isSelected;
      });

      // Already submitted poll condition
      if (isSelected && item?.pollType === PollType.INSTANT) {
        return;
      } else if (item?.pollType === PollType.DEFERRED && shouldShowVotes) {
        return;
      }

      // if only one option is allowed
      if (
        !isMultiChoicePoll(
          item?.multipleSelectNumber,
          item?.multipleSelectState
        ) &&
        (item?.multipleSelectNumber === 1 || !item?.multipleSelectNumber)
      ) {
        // can change selected ouptput in deferred poll
        if (item?.pollType === PollType.DEFERRED) {
          const pollSubmissionCall = await myClient.submitPollVote({
            pollId: item?.id,
            votes: [item?.options[pollIndex]?.id],
          });
          await reloadPost();
          dispatch({
            type: SHOW_TOAST,
            body: { isToast: true, message: POLL_SUBMITTED_SUCCESSFULLY },
          });
        } else {
          // for instant poll selection only for once

          // if not selected
          if (!isSelected) {
            const pollSubmissionCall = await myClient.submitPollVote({
              pollId: item?.id,
              votes: [item?.options[pollIndex]?.id],
            });
            await reloadPost();
            dispatch({
              type: SHOW_TOAST,
              body: { isToast: true, message: POLL_SUBMITTED_SUCCESSFULLY },
            });
          }
        }
        return;
      }

      // multiple options are allowed
      switch (item?.multipleSelectState) {
        case PollMultiSelectState.EXACTLY: {
          if (selectedPolls.length === item?.multipleSelectNumber) {
            dispatch({
              type: SHOW_TOAST,
              body: {
                isToast: true,
                message: `Select exactly ${item?.multipleSelectNumber} options`,
              },
            });
            return;
          }
          break;
        }
        case PollMultiSelectState.AT_MAX: {
          if (selectedPolls.length == item?.multipleSelectNumber) {
            dispatch({
              type: SHOW_TOAST,
              body: {
                isToast: true,
                message: `Select at most ${item?.multipleSelectNumber} options`,
              },
            });
            return;
          }
          break;
        }
      }
      newSelectedPolls.push(pollIndex);
    }
    setSelectedPolls(newSelectedPolls);
  }

  // this function call submit poll button API
  async function submitPoll({
    shouldShowSubmitPollButton,
    selectedPolls,
    poll,
    reloadPost,
    setShouldShowVotes,
    setSelectedPolls,
    stringManipulation,
  }: SubmitPollParams) {
    const item = poll?.attachments[0]?.attachmentMeta;
    if (shouldShowSubmitPollButton) {
      try {
        const votes = selectedPolls?.map((itemIndex: any) => {
          return item?.options[itemIndex]?.id;
        });
        const pollSubmissionCall = await myClient.submitPollVote({
          pollId: item?.id,
          votes: votes,
        });
        await reloadPost();
        setShouldShowVotes(true);
        setSelectedPolls([]);
        dispatch({
          type: SHOW_TOAST,
          body: { isToast: true, message: POLL_SUBMITTED_SUCCESSFULLY },
        });
      } catch (error) {
        // process error
      }
    } else {
      const string = stringManipulation(true);
      dispatch({
        type: SHOW_TOAST,
        body: {
          isToast: true,
          message: string,
        },
      });
    }
  }

  async function onSearchIconClick() {
    navigation.navigate(SEARCH_SCREEN)
  }

  async function onRetryPress() {
    await addTemporaryPost();
  }

  async function onCancelPress() {
    await abortRetry();
  }

  // Function to send seenPost to the backend
  const postSeen = async (initialPosts: string[] = []) => {
    try {
      const savedSeenPost = await Client.myClient.getSeenPost();
      const seenPostToSend = savedSeenPost
        ? [...JSON.parse(savedSeenPost), ...initialPosts]
        : [...initialPosts];

      if (seenPostToSend.length > 0) {
        // Simulate API call
        await Client.myClient.postSeen(
          PostSeenRequest.builder().setPostIds(seenPostToSend).build()
        );
        // Clear local storage on success
        await Client.myClient.clearSeenPost();
      }
    } catch (error) {
      console.error("Error sending seenPost:", error);
    }
  };

  const contextValues: UniversalFeedContextValues = {
    navigation,
    feedData,
    accessToken,
    memberData,
    memberRight,
    postUploading,
    showCreatePost,
    setPostUploading,
    setShowCreatePost,
    refreshing,
    uploadProgress,
    localRefresh,
    listRef,
    mediaAttachmemnts,
    linkAttachments,
    temporaryPost,
    setTemporaryPost,
    postContent,
    uploadingMediaAttachmentType,
    uploadingMediaAttachment,
    setLocalRefresh,
    setRefreshing,
    onRefresh,
    postAdd,
    keyExtractor,
    newPostButtonClick,
    getNotificationsCount,
    unreadNotificationCount,
    onTapNotificationBell,
    addPollOption,
    setSelectedPollOptions,
    submitPoll,
    isAnyMatchingPost,
    setIsAnyMatchingPost,
    feedPageNumber,
    setFeedPageNumber,
    isPaginationStopped,
    setIsPaginationStopped,
    predefinedTopics,
    onSearchIconClick,
    postSeen,
    feedType,
    addTemporaryPost,
    abortRetry,
    onCancelPress,
    onRetryPress
  };

  return (
    <UniversalFeedContext.Provider value={contextValues}>
      {children}
    </UniversalFeedContext.Provider>
  );
};
