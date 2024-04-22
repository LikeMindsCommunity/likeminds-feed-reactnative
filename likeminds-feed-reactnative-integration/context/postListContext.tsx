import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  autoPlayPostVideo,
  getFeed,
  likePost,
  likePostStateHandler,
  pinPost,
  pinPostStateHandler,
  savePost,
  savePostStateHandler,
} from "../store/actions/feed";
import {
  GetFeedRequest,
  LikePostRequest,
  PinPostRequest,
  SavePostRequest,
} from "@likeminds.community/feed-js";
import _ from "lodash";
import {
  DELETE_POST_MENU_ITEM,
  EDIT_POST_MENU_ITEM,
  NAVIGATED_FROM_COMMENT,
  PIN_POST_MENU_ITEM,
  POST_LIKES,
  POST_PIN_SUCCESS,
  POST_SAVED_SUCCESS,
  POST_UNPIN_SUCCESS,
  POST_UNSAVED_SUCCESS,
  REPORT_POST_MENU_ITEM,
  SOMETHING_WENT_WRONG,
  UNPIN_POST_MENU_ITEM,
} from "../constants/Strings";
import {
  CREATE_POST,
  POST_DETAIL,
  POST_LIKES_LIST,
} from "../constants/screenNames";
import { useLMFeedStyles } from "../lmFeedProvider";
import { showToastMessage } from "../store/actions/toast";
import { RootStackParamList } from "../models/RootStackParamsList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LMPostUI } from "../models";
import { LMLoader } from "../components";
import { clearPostDetail } from "../store/actions/postDetail";
import { postLikesClear } from "../store/actions/postLikes";
import { useIsFocused } from "@react-navigation/native";

interface PostListContextProps {
  children: ReactNode;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PostsList" | "UniversalFeed"
  >;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
}

export interface PostListContextValues {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "PostsList" | "UniversalFeed"
  >;
  feedData: Array<LMPostUI>;
  accessToken: string;
  showLoader: number;
  feedPageNumber: number;
  modalPosition: { x: number; y: number };
  showActionListModal: boolean;
  selectedMenuItemPostId: string;
  showDeleteModal: boolean;
  showReportModal: boolean;
  feedFetching: boolean;
  postInViewport: string;
  setPostInViewport: Dispatch<SetStateAction<string>>;
  setFeedFetching: Dispatch<SetStateAction<boolean>>;
  setModalPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
  setShowReportModal: Dispatch<SetStateAction<boolean>>;
  setDeleteModal: Dispatch<SetStateAction<boolean>>;
  setSelectedMenuItemPostId: Dispatch<SetStateAction<string>>;
  setShowActionListModal: Dispatch<SetStateAction<boolean>>;
  setFeedPageNumber: Dispatch<SetStateAction<number>>;
  renderLoader: () => void;
  getPostDetail: () => LMPostUI;
  handleDeletePost: (visible: boolean) => void;
  handleEditPost: (id: string) => void;
  fetchFeed: () => void;
  postLikeHandler: (id: string) => void;
  savePostHandler: (id: string, saved?: boolean) => void;
  debouncedSaveFunction: (id: string, saved?: boolean) => void;
  debouncedLikeFunction: (id: string) => void;
  closePostActionListModal: () => void;
  handlePinPost: (id: string, pinned?: boolean) => void;
  handleReportPost: () => void;
  onTapCommentCount: (id: string) => void;
  onTapLikeCount: (id: string) => void;
  onOverlayMenuClick: (event: {
    nativeEvent: { pageX: number; pageY: number };
  }, postId: string) => void;
}

const PostListContext = createContext<PostListContextValues | undefined>(
  undefined
);

export const usePostListContext = () => {
  const context = useContext(PostListContext);
  if (!context) {
    throw new Error(
      "usePostListContext must be used within an PostListContextProvider"
    );
  }
  return context;
};

export const PostListContextProvider = ({
  children,
  navigation,
}: PostListContextProps) => {
  const dispatch = useAppDispatch();
  const feedData = useAppSelector((state) => state.feed.feed);
  const accessToken = useAppSelector((state) => state.login.accessToken);
  const showLoader = useAppSelector((state) => state.loader.count);
  const [feedPageNumber, setFeedPageNumber] = useState(1);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [showActionListModal, setShowActionListModal] = useState(false);
  const [selectedMenuItemPostId, setSelectedMenuItemPostId] = useState("");
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [feedFetching, setFeedFetching] = useState(false);
  const LMFeedContextStyles = useLMFeedStyles();
  const { loaderStyle } = LMFeedContextStyles;
  const [postInViewport, setPostInViewport] = useState("");
  const isFocus = useIsFocused();

  // handles the auto play/pause of video in viewport
  useEffect(() => {
    if (postInViewport && isFocus) {
      dispatch(autoPlayPostVideo(postInViewport));
    }
  }, [postInViewport, isFocus]);

  // this functions gets universal feed data
  const fetchFeed = async () => {
    const payload = {
      page: feedPageNumber,
      pageSize: 20,
    };
    // calling getFeed API
    const getFeedResponse = await dispatch(
      getFeed(
        GetFeedRequest.builder()
          .setpage(payload.page)
          .setpageSize(payload.pageSize)
          .build(),
        false
      )
    );
    setFeedFetching(false);
    return getFeedResponse;
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

  useEffect(() => {
    setFeedFetching(true);
  }, []);
  // this calls the getFeed api whenever the page number gets changed
  useEffect(() => {
    if (accessToken) {
      // fetch feed
      fetchFeed();
    }
  }, [accessToken, feedPageNumber]);

  // this function closes the post action list modal
  const closePostActionListModal = () => {
    setShowActionListModal(false);
  };

  // this function is executed on the click of menu icon & handles the position and visibility of the modal
  const onOverlayMenuClick = (event: {
    nativeEvent: { pageX: number; pageY: number };
  }, postId : string) => {
    setSelectedMenuItemPostId(postId)
    const { pageX, pageY } = event.nativeEvent;
    setShowActionListModal(true);
    setModalPosition({ x: pageX, y: pageY });
  };

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

  // this function handles the functionality on the report option
  const handleReportPost = async () => {
    dispatch(autoPlayPostVideo(''))
    setShowReportModal(true);
  };

  // this function handles the functionality on the delete option
  const handleDeletePost = async (visible: boolean) => {
    setDeleteModal(visible);
  };

  // this function handles the click on edit option of overlayMenu
  const handleEditPost = (postId) => {
    dispatch(autoPlayPostVideo(''))
    navigation.navigate(CREATE_POST, { postId });
  };

  // this handles the click on comment count section of footer
  const onTapCommentCount = (postId) => {
    dispatch(clearPostDetail());
    dispatch(autoPlayPostVideo(""));
    navigation.navigate(POST_DETAIL, [postId, NAVIGATED_FROM_COMMENT]);
  };

  const onTapLikeCount = (id) => {
    dispatch(postLikesClear());
    dispatch(autoPlayPostVideo(""));
    navigation.navigate(POST_LIKES_LIST, [POST_LIKES, id]);
  };

  // this function gets the detail pf post whose menu item is clicked
  const getPostDetail = () => {
    const postDetail = feedData.find(
      (item: LMPostUI) => item.id === selectedMenuItemPostId
    );
    return postDetail;
  };

  const renderLoader = () => {
    return <LMLoader {...loaderStyle?.loader} />;
  };

  const contextValues: PostListContextValues = {
    navigation,
    feedData,
    accessToken,
    showLoader,
    feedPageNumber,
    modalPosition,
    showActionListModal,
    selectedMenuItemPostId,
    showDeleteModal,
    showReportModal,
    feedFetching,
    setFeedFetching,
    setShowReportModal,
    setDeleteModal,
    setSelectedMenuItemPostId,
    setShowActionListModal,
    setFeedPageNumber,
    renderLoader,
    getPostDetail,
    handleDeletePost,
    handleEditPost,
    fetchFeed,
    postLikeHandler,
    debouncedLikeFunction,
    debouncedSaveFunction,
    closePostActionListModal,
    handlePinPost,
    handleReportPost,
    savePostHandler,
    onTapCommentCount,
    onTapLikeCount,
    onOverlayMenuClick,
    setModalPosition,
    postInViewport,
    setPostInViewport
  };

  return (
    <PostListContext.Provider value={contextValues}>
      {children}
    </PostListContext.Provider>
  );
};
