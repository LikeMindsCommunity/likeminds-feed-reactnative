import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAppDispatch, useAppSelector } from "../store/store";

import {
  DELETE_COMMENT_MENU_ITEM,
  DELETE_POST_MENU_ITEM,
  EDIT_COMMENT_MENU_ITEM,
  EDIT_POST_MENU_ITEM,
  NAVIGATED_FROM_COMMENT,
  PIN_POST_MENU_ITEM,
  POST_LIKES,
  POST_PIN_SUCCESS,
  POST_SAVED_SUCCESS,
  POST_UNPIN_SUCCESS,
  POST_UNSAVED_SUCCESS,
  REPORT_COMMENT_MENU_ITEM,
  REPORT_POST_MENU_ITEM,
  SOMETHING_WENT_WRONG,
  UNPIN_POST_MENU_ITEM,
} from "../constants/Strings";
import { Keyboard, Platform, TextInput } from "react-native";
import { useLMFeedStyles } from "../lmFeedProvider";
import {
  addComment,
  addCommentStateHandler,
  editComment,
  editCommentStateHandler,
  getComments,
  getPost,
  getTaggingList,
  likeComment,
  refreshPostDetail,
  replyComment,
  replyCommentStateHandler,
} from "../store/actions/postDetail";
import {
  AddCommentRequest,
  EditCommentRequest,
  GetCommentRequest,
  GetPostRequest,
  GetTaggingListRequest,
  LikeCommentRequest,
  LikePostRequest,
  PinPostRequest,
  ReplyCommentRequest,
  SavePostRequest,
} from "@likeminds.community/feed-js";
import {
  likePost,
  likePostStateHandler,
  pinPost,
  pinPostStateHandler,
  savePost,
  savePostStateHandler,
} from "../store/actions/feed";
import _ from "lodash";
import {
  CREATE_POST,
  POST_LIKES_LIST,
  UNIVERSAL_FEED,
} from "../constants/screenNames";
import {
  detectMentions,
  mentionToRouteConverter,
  routeToMentionConverter,
} from "../utils";
import { postLikesClear } from "../store/actions/postLikes";
import { showToastMessage } from "../store/actions/toast";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../models/RootStackParamsList";
import LMPost from "../components/LMPost/LMPost";
import { LMCommentUI, LMPostUI, LMUserUI } from "../models";
import { LMFeedAnalytics } from "../analytics/LMChatAnalytics";
import { Events } from "../enums/Events";
import { Keys } from "../enums/Keys";
import { getPostType } from "../utils/analytics";

interface PostDetailContextProps {
  children: ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList, "PostDetail">;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
}

export interface PostDetailContextValues {
  navigation: NativeStackNavigationProp<RootStackParamList, "PostDetail">;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
  postDetail: LMPostUI;
  modalPosition: {};
  showActionListModal: false;
  selectedMenuItemPostId: string;
  commentToAdd: string;
  selectedMenuItemCommentId: string;
  showDeleteModal: boolean;
  showReportModal: boolean;
  commentPageNumber: number;
  modalPositionComment: { x: number; y: number };
  loggedInUser: {};
  showCommentActionListModal: boolean;
  replyOnComment: {
    textInputFocus: false;
    commentId: string;
    userId: string;
  };
  replyToUsername: "";
  localModalVisibility: boolean;
  keyboardIsVisible: boolean;
  editCommentFocus: boolean;
  myRef: null;
  taggedUserName: string;
  debounceTimeout: null;
  page: number;
  userTaggingListHeight: number;
  allTags: Array<LMUserUI>;
  isUserTagging: boolean;
  isLoading: boolean;
  refreshing: boolean;
  localRefresh: boolean;
  commentFocus: boolean;
  routeParams: boolean;
  navigatedFromComments: boolean;
  isKeyboardVisible: boolean;
  keyboardFocusOnReply: boolean;
  setKeyboardFocusOnReply: Dispatch<SetStateAction<boolean>>;
  setModalPositionComment: Dispatch<SetStateAction<{ x: number; y: number }>>;
  setModalPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
  setRouteParams: Dispatch<SetStateAction<boolean>>;
  setNavigatedFromComments: Dispatch<SetStateAction<boolean>>;
  setCommentFocus: Dispatch<SetStateAction<boolean>>;
  setLocalRefresh: Dispatch<SetStateAction<boolean>>;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsUserTagging: Dispatch<SetStateAction<boolean>>;
  setAllTags: Dispatch<SetStateAction<Array<LMUserUI>>>;
  setUserTaggingListHeight: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
  setDebounceTimeout: Dispatch<SetStateAction<null>>;
  setTaggedUserName: Dispatch<SetStateAction<string>>;
  setEditCommentFocus: Dispatch<SetStateAction<boolean>>;
  setKeyboardIsVisible: Dispatch<SetStateAction<boolean>>;
  setLocalModalVisibility: Dispatch<SetStateAction<boolean>>;
  setReplyToUsername: Dispatch<SetStateAction<string>>;
  setReplyOnComment: Dispatch<SetStateAction<object>>;
  setShowCommentActionListModal: Dispatch<SetStateAction<boolean>>;
  setCommentPageNumber: Dispatch<SetStateAction<number>>;
  setShowReportModal: Dispatch<SetStateAction<boolean>>;
  setDeleteModal: Dispatch<SetStateAction<boolean>>;
  setSelectedMenuItemCommentId: Dispatch<SetStateAction<string>>;
  setCommentToAdd: Dispatch<SetStateAction<string>>;
  setSelectedMenuItemPostId: Dispatch<SetStateAction<string>>;
  setShowActionListModal: Dispatch<SetStateAction<boolean>>;
  onRefresh: () => void;
  closePostActionListModal: () => void;
  closeCommentActionListModal: () => void;
  postLikeHandler: (id: string) => void;
  debouncedLikeFunction: (id: string) => void;
  debouncedSaveFunction: (id: string, saved?: boolean) => void;
  savePostHandler: (id: string, saved?: boolean) => void;
  handlePinPost: (id: string, pinned?: boolean) => void;
  handleReportPost: () => void;
  handleDeletePost: (visible: boolean) => void;
  onMenuItemSelect: (
    postId: string,
    itemId?: number,
    pinnedValue?: boolean
  ) => void;
  handleReportComment: () => void;
  handleDeleteComment: (visible: boolean) => void;
  handleEditComment: (commentId: string) => void;
  getCommentDetail: (
    comments?: LMCommentUI[],
    id?: string
  ) => LMCommentUI | undefined;
  getPostData: () => void;
  getCommentsReplies: (
    postId: string,
    commentId: string,
    repliesResponseCallback: any,
    pageNo: number
  ) => void;
  commentLikeHandler: (postId: string, commentId: string) => void;
  addNewComment: (postId: string) => void;
  addNewReply: (postId: string, commentId: string) => void;
  renderPostDetail: () => void;
  commentEdit: () => void;
  handleInputChange: (event: string) => void;
  loadData: (newPage: number) => void;
  handleLoadMore: () => void;
  showRepliesOfCommentId: string;
  setShowRepliesOfCommentId: Dispatch<SetStateAction<string>>;
  handleScreenBackPress: () => void;
  onCommentOverflowMenuClick: (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => void;
}

const PostDetailContext = createContext<PostDetailContextValues | undefined>(
  undefined
);

export const usePostDetailContext = () => {
  const context = useContext(PostDetailContext);
  if (!context) {
    throw new Error(
      "usePostDetailContext must be used within an PostDetailContextProvider"
    );
  }
  return context;
};

export const PostDetailContextProvider = ({
  children,
  navigation,
  route,
}: PostDetailContextProps) => {
  const dispatch = useAppDispatch();
  const postDetail = useAppSelector((state) => state.postDetail.postDetail);
  const [modalPosition, setModalPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showActionListModal, setShowActionListModal] = useState(false);
  const [selectedMenuItemPostId, setSelectedMenuItemPostId] = useState("");
  const [commentToAdd, setCommentToAdd] = useState("");
  const [selectedMenuItemCommentId, setSelectedMenuItemCommentId] =
    useState("");
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [commentPageNumber, setCommentPageNumber] = useState(1);
  const [modalPositionComment, setModalPositionComment] = useState({
    x: 0,
    y: 0,
  });
  const loggedInUser = useAppSelector((state) => state.login.member);
  const [showCommentActionListModal, setShowCommentActionListModal] =
    useState(false);
  const [replyOnComment, setReplyOnComment] = useState({
    textInputFocus: false,
    commentId: "",
    userId: "",
  });
  const [replyToUsername, setReplyToUsername] = useState("");
  const [localModalVisibility, setLocalModalVisibility] =
    useState(showDeleteModal);
  const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);
  const [editCommentFocus, setEditCommentFocus] = useState(false);
  const myRef = useRef<TextInput>(null);
  const [taggedUserName, setTaggedUserName] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<null>(null);
  // NodeJS.Timeout |
  const [page, setPage] = useState(1);
  const [userTaggingListHeight, setUserTaggingListHeight] =
    useState<number>(116);
  const [allTags, setAllTags] = useState<Array<LMUserUI>>([]);
  const [isUserTagging, setIsUserTagging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(false);
  const [commentFocus, setCommentFocus] = useState(false);
  const [keyboardFocusOnReply, setKeyboardFocusOnReply] = useState(false);
  const [routeParams, setRouteParams] = useState(
    route.params[1] === NAVIGATED_FROM_COMMENT
  );
  const [navigatedFromComments, setNavigatedFromComments] = useState(
    route.params[1] === NAVIGATED_FROM_COMMENT
  );
  const isKeyboardVisible = Keyboard.isVisible();
  const [showRepliesOfCommentId, setShowRepliesOfCommentId] = useState("");

  const LMFeedContextStyles = useLMFeedStyles();
  const { postListStyle } = LMFeedContextStyles;

  // this function is executed on pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setLocalRefresh(true);
    // calling getPost API
    await dispatch(
      refreshPostDetail(
        GetPostRequest.builder()
          .setpostId(route.params[0])
          .setpage(1)
          .setpageSize(10)
          .build(),
        false
      )
    );
    setLocalRefresh(false);
    setRefreshing(false);
  };

  // this function closes the post action list modal
  const closePostActionListModal = () => {
    setShowActionListModal(false);
  };

  // this function closes the comment action list modal
  const closeCommentActionListModal = () => {
    setShowCommentActionListModal(false);
  };

  // this function is executed on the click of menu icon & handles the position and visibility of the modal
  const onCommentOverflowMenuClick = (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => {
    const { pageX, pageY } = event.nativeEvent;
    setShowCommentActionListModal(true);
    setModalPositionComment({ x: pageX, y: pageY });
  };

  // debounce on like post function
  const debouncedLikeFunction = _.debounce(postLikeHandler, 500); // Adjust the debounce time (in milliseconds) as needed

  // useEffect hook to clean up the debounced function
  useEffect(() => {
    return () => {
      debouncedLikeFunction.cancel(); // Cancel any pending debounced executions when the component unmounts
    };
  }, [debouncedLikeFunction]);

  // this functions hanldes the post like functionality
  async function postLikeHandler(id: string) {
    const payload = {
      postId: id,
    };
    dispatch(likePostStateHandler(payload.postId));
    // calling like post api
    const postLikeResponse = await dispatch(
      likePost(
        LikePostRequest.builder().setpostId(payload.postId).build(),
        false
      )
    );
    return postLikeResponse;
  }

  // debounce on save post function
  const debouncedSaveFunction = _.debounce(savePostHandler, 500); // Adjust the debounce time (in milliseconds) as needed

  // useEffect hook to clean up the debounced function
  useEffect(() => {
    return () => {
      debouncedSaveFunction.cancel(); // Cancel any pending debounced executions when the component unmounts
    };
  }, [debouncedSaveFunction]);

  // this functions hanldes the post save functionality
  async function savePostHandler(id: string, saved?: boolean) {
    const payload = {
      postId: id,
    };
    try {
      dispatch(savePostStateHandler(payload.postId));
      // calling the save post api
      const savePostResponse = await dispatch(
        savePost(
          SavePostRequest.builder().setpostId(payload.postId).build(),
          false
        )
      );
      await dispatch(
        showToastMessage({
          isToast: true,
          message: saved ? POST_UNSAVED_SUCCESS : POST_SAVED_SUCCESS,
        })
      );
      return savePostResponse;
    } catch (error) {
      dispatch(
        showToastMessage({
          isToast: true,
          message: SOMETHING_WENT_WRONG,
        })
      );
    }
  }

  // this function handles the functionality on the pin option
  const handlePinPost = async (id: string, pinned?: boolean) => {
    const payload = {
      postId: id,
    };
    dispatch(pinPostStateHandler(payload.postId));
    const pinPostResponse = await dispatch(
      pinPost(PinPostRequest.builder().setpostId(payload.postId).build(), false)
    );
    if (pinPostResponse) {
      dispatch(
        showToastMessage({
          isToast: true,
          message: pinned ? POST_UNPIN_SUCCESS : POST_PIN_SUCCESS,
        })
      );
    }
    return pinPostResponse;
  };

  // this function handles the functionality on the report option of post
  const handleReportPost = async () => {
    setShowReportModal(true);
  };

  // this function handles the functionality on the delete option of post
  const handleDeletePost = async (visible: boolean) => {
    setDeleteModal(visible);
  };

  // this function returns the id of the item selected from menu list and handles further functionalities accordingly for post
  const onMenuItemSelect = (
    postId: string,
    itemId?: number,
    pinnedValue?: boolean
  ) => {
    setSelectedMenuItemCommentId("");
    setSelectedMenuItemPostId(postId);
    if (itemId === PIN_POST_MENU_ITEM || itemId === UNPIN_POST_MENU_ITEM) {
      handlePinPost(postId, pinnedValue);
      let event = pinnedValue ? Events.POST_UNPINNED : Events.POST_PINNED;
      if (pinnedValue) {
        LMFeedAnalytics.track(
          event,
          new Map<string, string>([
            [Keys.CREATED_BY_ID, postDetail?.user?.sdkClientInfo?.uuid],
            [Keys.POST_ID, postId],
            [Keys.POST_TYPE, getPostType(postDetail?.attachments)],
          ])
        );
      }
    }
    if (itemId === REPORT_POST_MENU_ITEM) {
      handleReportPost();
    }
    if (itemId === DELETE_POST_MENU_ITEM) {
      handleDeletePost(true);
    }
    if (itemId === EDIT_POST_MENU_ITEM) {
      navigation.navigate(CREATE_POST, { postId });
      LMFeedAnalytics.track(
        Events.POST_EDITED,
        new Map<string, string>([
          [Keys.UUID, postDetail?.user?.sdkClientInfo?.uuid],
          [Keys.POST_ID, postId],
          [Keys.POST_TYPE, getPostType(postDetail?.attachments)],
        ])
      );
    }
  };

  // this function handles the functionality on the report option of comment
  const handleReportComment = async () => {
    setShowReportModal(true);
  };

  // this function handles the functionality on the delete option of comment
  const handleDeleteComment = async (visible: boolean) => {
    setDeleteModal(visible);
  };

  const handleEditComment = async (commentId) => {
    const commentDetail = getCommentDetail(postDetail?.replies, commentId);
    // converts the mentions route to mention values
    const convertedComment = routeToMentionConverter(
      commentDetail?.text ? commentDetail.text : ""
    );
    setCommentToAdd(convertedComment);
    setTimeout(() => {
      setEditCommentFocus(true);
    }, 100);
  };

  // this function gets the detail of comment whose menu item is clicked
  const getCommentDetail = (
    comments?: LMCommentUI[],
    id?: string
  ): LMCommentUI | undefined => {
    const commentId = id ? id : selectedMenuItemCommentId;
    if (comments) {
      for (const reply of comments) {
        if (reply.id === commentId) {
          return reply; // Found the reply in the current level
        }
        if (reply.replies && reply.replies.length > 0) {
          const nestedReply = getCommentDetail(reply.replies, commentId);
          if (nestedReply) {
            return nestedReply; // Found the reply in the child replies
          }
        }
      }
    }
    return undefined; // Reply not found
  };

  // this function calls the getPost api
  const getPostData = async () => {
    const getPostResponse = await dispatch(
      getPost(
        GetPostRequest.builder()
          .setpostId(route.params[0])
          .setpage(commentPageNumber)
          .setpageSize(10)
          .build(),
        false
      )
    );
    return getPostResponse;
  };

  // this function calls the getComments api
  const getCommentsReplies = async (
    postId: string,
    commentId: string,
    repliesResponseCallback: any,
    pageNo: number
  ) => {
    const commentsRepliesResponse = await dispatch(
      getComments(
        GetCommentRequest.builder()
          .setpostId(postId)
          .setcommentId(commentId)
          .setpage(pageNo)
          .setpageSize(10)
          .build(),
        false
      )
    );

    // sets the api response in the callback function
    repliesResponseCallback(
      postDetail?.replies &&
        postDetail?.replies[
          postDetail.replies?.findIndex(
            (item: LMCommentUI) => item.id === commentId
          )
        ]?.replies
    );
    return commentsRepliesResponse;
  };

  // this functions hanldes the comment like functionality
  const commentLikeHandler = async (postId: string, commentId: string) => {
    const payload = {
      postId: postId,
      commentId: commentId,
    };
    const commentLikeResponse = await dispatch(
      likeComment(
        LikeCommentRequest.builder()
          .setcommentId(payload.commentId)
          .setpostId(payload.postId)
          .build(),
        false
      )
    );
    return commentLikeResponse;
  };

  // this functions calls the add new comment api
  const addNewComment = async (postId: string) => {
    // convert the mentions to route
    const convertedNewComment = mentionToRouteConverter(commentToAdd);
    const currentDate = new Date();
    const payload = {
      postId: postId,
      newComment: convertedNewComment.trim(),
      tempId: `${-currentDate.getTime()}`,
    };
    setCommentToAdd("");
    setCommentFocus(false);
    setKeyboardFocusOnReply(false);
    setEditCommentFocus(false);
    setRouteParams(false);
    // handles adding comment locally
    dispatch(addCommentStateHandler({ payload, loggedInUser }));
    // calls new comment api
    const commentAddResponse = await dispatch(
      addComment(
        AddCommentRequest.builder()
          .setpostId(payload.postId)
          .settext(payload.newComment)
          .setTempId(`${payload.tempId}`)
          .build(),
        false
      )
    );
    Keyboard.dismiss();
    LMFeedAnalytics.track(
      Events.COMMENT_POSTED,
      new Map<string, string>([
        [Keys.POST_ID, postDetail?.id],
        [Keys.COMMENT_ID, commentAddResponse?.comment?.Id],
      ])
    );
    return commentAddResponse;
  };

  // this functions calls the add new reply to a comment api
  const addNewReply = async (postId: string, commentId: string) => {
    // convert the mentions to route
    const convertedNewReply = mentionToRouteConverter(commentToAdd);
    const currentDate = new Date();
    const payload = {
      postId: postId,
      newComment: convertedNewReply.trim(),
      tempId: `${-currentDate.getTime()}`,
      commentId: commentId,
    };
    setShowRepliesOfCommentId(replyOnComment?.commentId);
    setCommentToAdd("");
    setReplyOnComment({ textInputFocus: false, commentId: "", userId: "" });
    setKeyboardFocusOnReply(false);
    setEditCommentFocus(false);
    setCommentFocus(false);
    setRouteParams(false);
    dispatch(replyCommentStateHandler({ payload, loggedInUser }));
    // call reply on comment api
    const replyAddResponse = await dispatch(
      replyComment(
        ReplyCommentRequest.builder()
          .setPostId(payload.postId)
          .setCommentId(payload.commentId)
          .setTempId(`${payload.tempId}`)
          .setText(payload.newComment)
          .build(),
        false
      )
    );
    Keyboard.dismiss();

    LMFeedAnalytics.track(
      Events.REPLY_POSTED,
      new Map<string, string>([
        [Keys.UUID, replyOnComment?.userId],
        [Keys.POST_ID, postDetail?.id],
        [Keys.COMMENT_ID, replyOnComment?.commentId],
        [Keys.COMMENT_REPLY_ID, replyAddResponse?.comment?.Id],
      ])
    );
    return replyAddResponse;
  };

  // this useEffect handles the pagination of the comments
  useEffect(() => {
    getPostData();
  }, [commentPageNumber, route.params[0]]);

  // this function is executed on the click of menu icon & handles the position and visibility of the modal
  const onOverlayMenuClick = (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => {
    const { pageX, pageY } = event.nativeEvent;
    setShowActionListModal(true);
    setModalPosition({ x: pageX, y: pageY });
  };

  // this renders the postDetail view
  const renderPostDetail = () => {
    return (
      <LMPost
        post={postDetail}
        // header props
        headerProps={{
          postMenu: {
            modalPosition: modalPosition,
            modalVisible: showActionListModal,
            onCloseModal: closePostActionListModal,
            onSelected: (postId, itemId) =>
              onMenuItemSelect(postId, itemId, postDetail?.isPinned),
          },
          onOverlayMenuClick: (event) => onOverlayMenuClick(event),
        }}
        // footer props
        footerProps={{
          likeIconButton: {
            onTap: () => {
              postLikeHandler(postDetail?.id);
            },
          },
          saveButton: {
            onTap: () => {
              savePostHandler(postDetail?.id, postDetail?.isSaved);
            },
          },
          likeTextButton: {
            onTap: () => {
              dispatch(postLikesClear());
              navigation.navigate(POST_LIKES_LIST, [
                POST_LIKES,
                postDetail?.id,
              ]);
            },
          },
          commentButton: {
            onTap: () => {
              setCommentFocus(true);
            },
          },
        }}
        mediaProps={{
          videoProps: {
            autoPlay:
              postListStyle?.media?.video?.autoPlay != undefined
                ? postListStyle?.media?.video?.autoPlay
                : true,
            videoInFeed: false,
          },
        }}
      />
    );
  };

  // Update localModalVisibility when showDeleteModal visibility changes
  useEffect(() => {
    setLocalModalVisibility(showDeleteModal);
  }, [showDeleteModal]);

  // this handles the view layout with keyboard visibility
  useEffect(() => {
    setLocalModalVisibility(showDeleteModal);
  }, [showDeleteModal]);

  // this handles the view layout with keyboard visibility
  useEffect(() => {
    if (Platform.OS === "android") {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setKeyboardIsVisible(true);
        }
      );

      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardIsVisible(false);
          if (Keyboard.isVisible() === false) {
            Keyboard.dismiss();
            setKeyboardFocusOnReply(false);
            setEditCommentFocus(false);
            setCommentFocus(false);
            setRouteParams(false);
          }
        }
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, [isKeyboardVisible]);

  // this function calls the edit comment api
  const commentEdit = async () => {
    // convert the mentions to route
    const convertedEditedComment = mentionToRouteConverter(commentToAdd);
    const payload = {
      commentId: selectedMenuItemCommentId,
      commentText: convertedEditedComment.trim(),
    };
    await dispatch(editCommentStateHandler(payload));
    // call edit comment api
    const editCommentResponse = await dispatch(
      editComment(
        EditCommentRequest.builder()
          .setcommentId(selectedMenuItemCommentId)
          .setpostId(postDetail?.id)
          .settext(payload.commentText)
          .build(),
        false
      )
    );
    if (editCommentResponse) {
      setEditCommentFocus(false);
      setCommentToAdd("");
      setKeyboardFocusOnReply(false);
      setCommentFocus(false);
      setRouteParams(false);
      Keyboard.dismiss();
    }
    return editCommentResponse;
  };

  // this function is called on change text of textInput
  const handleInputChange = async (event: string) => {
    setCommentToAdd(event);

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
        const taggingListResponse = await dispatch(
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
    const taggingListResponse = await dispatch(
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

  const handleScreenBackPress = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  const contextValues: PostDetailContextValues = {
    navigation,
    route,
    postDetail,
    modalPosition,
    showActionListModal,
    selectedMenuItemPostId,
    commentToAdd,
    selectedMenuItemCommentId,
    showDeleteModal,
    showReportModal,
    commentPageNumber,
    modalPositionComment,
    loggedInUser,
    showCommentActionListModal,
    replyOnComment,
    replyToUsername,
    localModalVisibility,
    keyboardIsVisible,
    editCommentFocus,
    myRef,
    taggedUserName,
    debounceTimeout,
    page,
    userTaggingListHeight,
    allTags,
    isUserTagging,
    isLoading,
    refreshing,
    localRefresh,
    commentFocus,
    routeParams,
    navigatedFromComments,
    isKeyboardVisible,
    keyboardFocusOnReply,
    setKeyboardFocusOnReply,

    setRouteParams,
    setNavigatedFromComments,
    setCommentFocus,
    setLocalRefresh,
    setRefreshing,
    setIsLoading,
    setIsUserTagging,
    setAllTags,
    setUserTaggingListHeight,
    setPage,
    setDebounceTimeout,
    setTaggedUserName,
    setEditCommentFocus,
    setKeyboardIsVisible,
    setLocalModalVisibility,
    setReplyToUsername,
    setReplyOnComment,
    setShowCommentActionListModal,
    setCommentPageNumber,
    setShowReportModal,
    setDeleteModal,
    setSelectedMenuItemCommentId,
    setCommentToAdd,
    setSelectedMenuItemPostId,
    setShowActionListModal,
    onRefresh,
    closePostActionListModal,
    closeCommentActionListModal,
    postLikeHandler,
    debouncedLikeFunction,
    debouncedSaveFunction,
    savePostHandler,
    handlePinPost,
    handleReportPost,
    handleDeletePost,
    onMenuItemSelect,
    handleReportComment,
    handleDeleteComment,
    getCommentDetail,
    getPostData,
    getCommentsReplies,
    commentLikeHandler,
    addNewComment,
    addNewReply,
    renderPostDetail,
    commentEdit,
    handleInputChange,
    loadData,
    handleLoadMore,
    showRepliesOfCommentId,
    setShowRepliesOfCommentId,
    handleEditComment,
    handleScreenBackPress,
    setModalPositionComment,
    setModalPosition,
    onCommentOverflowMenuClick,
  };

  return (
    <PostDetailContext.Provider value={contextValues}>
      {children}
    </PostDetailContext.Provider>
  );
};
