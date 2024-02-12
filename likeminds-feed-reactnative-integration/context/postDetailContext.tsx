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
  LMCommentUI,
  LMPost,
  LMPostUI,
  LMUserUI,
} from "likeminds_feed_reactnative_ui";
import {
  DELETE_COMMENT_MENU_ITEM,
  DELETE_POST_MENU_ITEM,
  EDIT_COMMENT_MENU_ITEM,
  EDIT_POST_MENU_ITEM,
  NAVIGATED_FROM_COMMENT,
  PIN_POST_MENU_ITEM,
  POST_LIKES,
  REPORT_COMMENT_MENU_ITEM,
  REPORT_POST_MENU_ITEM,
  UNPIN_POST_MENU_ITEM,
} from "../constants/Strings";
import { Keyboard, TextInput } from "react-native";
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
} from "@likeminds.community/feed-js-beta";
import {
  likePost,
  likePostStateHandler,
  pinPost,
  pinPostStateHandler,
  savePost,
  savePostStateHandler,
} from "../store/actions/feed";
import _ from "lodash";
import { CREATE_POST, POST_LIKES_LIST } from "../constants/screenNames";
import {
  detectMentions,
  mentionToRouteConverter,
  routeToMentionConverter,
} from "../utils";
import { postLikesClear } from "../store/actions/postLikes";

interface PostDetailContextProps {
  children: ReactNode;
  navigation: any;
  route: any;
}

export interface PostDetailContextValues {
  navigation: any;
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
  routeParams: string;
  isKeyboardVisible: boolean;

  setRouteParams: Dispatch<SetStateAction<string>>;
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
  onCommentMenuItemSelect: (commentId: string, itemId?: number) => void;
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
  const modalPosition = { x: 0, y: 0 };
  const [showActionListModal, setShowActionListModal] = useState(false);
  const [selectedMenuItemPostId, setSelectedMenuItemPostId] = useState("");
  const [commentToAdd, setCommentToAdd] = useState("");
  const [selectedMenuItemCommentId, setSelectedMenuItemCommentId] =
    useState("");
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [commentPageNumber, setCommentPageNumber] = useState(1);
  const modalPositionComment = {
    x: 0,
    y: 0,
  };
  const loggedInUser = useAppSelector((state) => state.login.member);
  const [showCommentActionListModal, setShowCommentActionListModal] =
    useState(false);
  const [replyOnComment, setReplyOnComment] = useState({
    textInputFocus: false,
    commentId: "",
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
  const [routeParams, setRouteParams] = useState(
    route.params[1] === NAVIGATED_FROM_COMMENT
  );
  const isKeyboardVisible = Keyboard.isVisible();

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
        true
      )
    );
    setLocalRefresh(false);
    setRefreshing(false);
  }

  // this function closes the post action list modal
  const closePostActionListModal = () => {
    setShowActionListModal(false);
  };

  // this function closes the comment action list modal
  const closeCommentActionListModal = () => {
    setShowCommentActionListModal(false);
  };

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
        true
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
          true
        )
      );
      // todo: handle toast later
      // await dispatch(
      //   showToastMessage({
      //     isToast: true,
      //     message: saved ? POST_UNSAVED_SUCCESS : POST_SAVED_SUCCESS,
      //   }) as any,
      // );
      return savePostResponse;
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

  // this function handles the functionality on the pin option
  const handlePinPost = async (id: string, pinned?: boolean) => {
    const payload = {
      postId: id,
    };
    dispatch(pinPostStateHandler(payload.postId) as any);
    const pinPostResponse = await dispatch(
      pinPost(PinPostRequest.builder().setpostId(payload.postId).build(), true)
    );
    if (pinPostResponse) {
      // todo: handle toast later
      // dispatch(
      //   showToastMessage({
      //     isToast: true,
      //     message: pinned ? POST_UNPIN_SUCCESS : POST_PIN_SUCCESS,
      //   }) as any,
      // );
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
    }
    if (itemId === REPORT_POST_MENU_ITEM) {
      handleReportPost();
    }
    if (itemId === DELETE_POST_MENU_ITEM) {
      handleDeletePost(true);
    }
    if (itemId === EDIT_POST_MENU_ITEM) {
      navigation.navigate(CREATE_POST, postId);
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

  // this function returns the id of the item selected from menu list and handles further functionalities accordingly for comment
  const onCommentMenuItemSelect = async (
    commentId: string,
    itemId?: number
  ) => {
    setSelectedMenuItemPostId("");
    setSelectedMenuItemCommentId(commentId);
    if (itemId === REPORT_COMMENT_MENU_ITEM) {
      handleReportComment();
    }
    if (itemId === DELETE_COMMENT_MENU_ITEM) {
      handleDeleteComment(true);
    }
    if (itemId === EDIT_COMMENT_MENU_ITEM) {
      const commentDetail = getCommentDetail(postDetail?.replies, commentId);
      // converts the mentions route to mention values
      const convertedComment = routeToMentionConverter(
        commentDetail?.text ? commentDetail.text : ""
      );
      setCommentToAdd(convertedComment);
      setTimeout(() => {
        setEditCommentFocus(true);
      }, 100);
    }
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
        true
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
        true
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
        true
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
      newComment: convertedNewComment,
      tempId: `${-currentDate.getTime()}`,
    };
    setCommentToAdd("");
    setCommentFocus(false);
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
        true
      )
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
      newComment: convertedNewReply,
      tempId: `${-currentDate.getTime()}`,
      commentId: commentId,
    };
    setCommentToAdd("");
    setReplyOnComment({ textInputFocus: false, commentId: "" });
    dispatch(replyCommentStateHandler({ payload, loggedInUser }) as any);
    // call reply on comment api
    const replyAddResponse = await dispatch(
      replyComment(
        ReplyCommentRequest.builder()
          .setPostId(payload.postId)
          .setCommentId(payload.commentId)
          .setTempId(`${payload.tempId}`)
          .setText(payload.newComment)
          .build(),
        true
      )
    );
    return replyAddResponse;
  };

  // this useEffect handles the pagination of the comments
  useEffect(() => {
    getPostData();
  }, [commentPageNumber]);

  // this renders the postDetail view
  const renderPostDetail = () => {
    return (
      <LMPost
        post={postDetail}
        // header props
        headerProps={{
          post: postDetail,
          postMenu: {
            postId: postDetail?.id,
            menuItems: postDetail?.menuItems,
            modalPosition: modalPosition,
            modalVisible: showActionListModal,
            onCloseModal: closePostActionListModal,
            onSelected: (postId, itemId) =>
              onMenuItemSelect(postId, itemId, postDetail?.isPinned),
            ...postListStyle?.header?.postMenu,
          },
          onTap: () => {
            postListStyle?.header?.onTap();
          },
          showMenuIcon: postListStyle?.header?.showMenuIcon
            ? postListStyle?.header?.showMenuIcon
            : true,
          showMemberStateLabel: postListStyle?.header?.showMemberStateLabel
            ? postListStyle?.header?.showMemberStateLabel
            : true,
          profilePicture: postListStyle?.header?.profilePicture,
          titleText: postListStyle?.header?.titleText,
          createdAt: postListStyle?.header?.createdAt,
          memberStateViewStyle: postListStyle?.header?.memberStateViewStyle,
          memberStateTextStyle: postListStyle?.header?.memberStateTextStyle,
          postHeaderViewStyle: postListStyle?.header?.postHeaderViewStyle,
          pinIcon: postListStyle?.header?.pinIcon,
          menuIcon: postListStyle?.header?.menuIcon,
        }}
        // footer props
        footerProps={{
          isLiked: postDetail?.isLiked,
          isSaved: postDetail?.isSaved,
          likesCount: postDetail?.likesCount,
          commentsCount: postDetail?.commentsCount,
          showBookMarkIcon: postListStyle?.footer?.showBookMarkIcon
            ? postListStyle?.footer?.showBookMarkIco
            : true,
          showShareIcon: postListStyle?.footer?.showShareIcon
            ? postListStyle?.footer?.showShareIcon
            : true,
          likeIconButton: {
            ...postListStyle?.footer?.likeIconButton,
            onTap: () => {
              postLikeHandler(postDetail?.id);
              postListStyle?.footer?.likeIconButton?.onTap();
            },
          },
          saveButton: {
            ...postListStyle?.footer?.saveButton,
            onTap: () => {
              debouncedSaveFunction(postDetail?.id, postDetail?.isSaved);
              postListStyle?.footer?.saveButton?.onTap();
            },
          },
          likeTextButton: {
            ...postListStyle?.footer?.likeTextButton,
            onTap: () => {
              dispatch(postLikesClear())
              navigation.navigate(POST_LIKES_LIST, [POST_LIKES, postDetail?.id]);
              postListStyle?.footer?.likeTextButton?.onTap();
            },
          },
          commentButton: {
            ...postListStyle?.footer?.commentButton,
            onTap: () => {
              setCommentFocus(true);
              postListStyle?.footer?.commentButton?.onTap();
            },
          },
          shareButton: postListStyle?.footer?.shareButton,
          footerBoxStyle: postListStyle?.footer?.footerBoxStyle,
        }}
        // media props
        mediaProps={{
          attachments: postDetail?.attachments ? postDetail.attachments : [],
          imageProps: postListStyle?.media?.image,
          videoProps: {
            ...postListStyle?.media?.video,
            videoUrl: "",
            showControls: postListStyle?.media?.video?.showControls
              ? postListStyle?.media?.video?.showControls
              : true,
          },
          carouselProps: {
            ...postListStyle?.media?.carousel,
            attachments: postDetail?.attachments ? postDetail.attachments : [],
            videoItem: {
              ...postListStyle?.media?.carousel?.videoItem,
              videoUrl: "",
              showControls: postListStyle?.media?.carousel?.videoItem
                ?.showControls
                ? postListStyle?.media?.carousel?.videoItem?.showControls
                : true,
            },
          },
          documentProps: postListStyle?.media?.document,
          linkPreviewProps: postListStyle?.media?.linkPreview,
          postMediaStyle: postListStyle?.media?.postMediaStyle,
        }}
        contentProps={postListStyle?.postContent}
      />
    );
  };

  // Update localModalVisibility when showDeleteModal visibility changes
  useEffect(() => {
    setLocalModalVisibility(showDeleteModal);
  }, [showDeleteModal]);

  // this handles the view layout with keyboard visibility
  useEffect(() => {
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
          setReplyOnComment({ textInputFocus: false, commentId: "" });
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
  }, [isKeyboardVisible]);

  // this function calls the edit comment api
  const commentEdit = async () => {
    // convert the mentions to route
    const convertedEditedComment = mentionToRouteConverter(commentToAdd);
    const payload = {
      commentId: selectedMenuItemCommentId,
      commentText: convertedEditedComment,
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
        true
      )
    );
    if (editCommentResponse) {
      setEditCommentFocus(false);
      setCommentToAdd("");
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
            true
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
        true
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

  const contextValues: PostDetailContextValues = {
    navigation,
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
    isKeyboardVisible,

    setRouteParams,
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
    debouncedSaveFunction,
    savePostHandler,
    handlePinPost,
    handleReportPost,
    handleDeletePost,
    onMenuItemSelect,
    handleReportComment,
    handleDeleteComment,
    onCommentMenuItemSelect,
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
  };

  return (
    <PostDetailContext.Provider value={contextValues}>
      {children}
    </PostDetailContext.Provider>
  );
};
