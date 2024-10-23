import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  JSX,
} from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  autoPlayPostVideo,
  getFeed,
  hidePost,
  likePost,
  likePostStateHandler,
  pinPost,
  pinPostStateHandler,
  savePost,
  savePostStateHandler,
} from "../store/actions/feed";
import {
  GetFeedRequest,
  HidePostRequest,
  LikePostRequest,
  PinPostRequest,
  SavePostRequest,
} from "@likeminds.community/feed-rn";
import _ from "lodash";
import {
  DELETE_POST_MENU_ITEM,
  EDIT_POST_MENU_ITEM,
  NAVIGATED_FROM_COMMENT,
  PIN_POST_MENU_ITEM,
  POST_HIDDEN,
  POST_LIKES,
  POST_PIN_SUCCESS,
  POST_SAVED_SUCCESS,
  POST_UNHIDDEN,
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
import { showToastMessage } from "../store/actions/toast";
import { RootStackParamList } from "../models/RootStackParamsList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LMPostViewData } from "../models";
import LMLoader from "../components/LMLoader";
import { clearPostDetail } from "../store/actions/postDetail";
import { postLikesClear } from "../store/actions/postLikes";
import { ActivityIndicator, View } from "react-native";
import Layout from "../constants/Layout";
import STYLES from "../constants/Styles";
import { useUniversalFeedContext } from "../context/universalFeedContext";
import { useIsFocused } from "@react-navigation/native";
import { HIDE_POST_STATE, SET_CURRENT_ID_OF_VIDEO } from "../store/types/types";
import { SHOW_TOAST } from "..//store/types/loader";
import pluralizeOrCapitalize from "../utils/variables";
import { WordAction } from "../enums/Variables";
import { CommunityConfigs } from "../communityConfigs";

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
  feedData: Array<LMPostViewData>;
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
  renderLoader: () => JSX.Element | null;
  getPostDetail: () => LMPostViewData;
  handleDeletePost: (visible: boolean) => void;
  handleEditPost: (id: string, post: LMPostViewData | undefined) => void;
  handleHidePost: (postId: string) => void;
  fetchFeed: (page: number) => Promise<any>;
  handleLoadMore: () => void;
  postLikeHandler: (id: string) => void;
  savePostHandler: (id: string, saved?: boolean) => void;
  debouncedSaveFunction: (id: string, saved?: boolean) => void;
  debouncedLikeFunction: (id: string) => void;
  closePostActionListModal: () => void;
  handlePinPost: (id: string, pinned?: boolean) => void;
  handleReportPost: () => void;
  onTapCommentCount: (id: string) => void;
  onTapLikeCount: (id: string) => void;
  onOverlayMenuClick: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    postId: string
  ) => void;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isPaginationStopped, setIsPaginationStopped] = useState(false);
  const loaderStyle = STYLES.$LOADER_STYLE
  const { localRefresh } = useUniversalFeedContext();

  const PAGE_SIZE = 20;
  const [postInViewport, setPostInViewport] = useState("");
  const isFocus = useIsFocused();

  // handles the auto play/pause of video in viewport
  useEffect(() => {
    if (postInViewport && isFocus) {
      dispatch({
        type: SET_CURRENT_ID_OF_VIDEO,
        body: { currentIdOfVideo: postInViewport },
      });
      dispatch(autoPlayPostVideo(postInViewport));
    }
  }, [postInViewport, isFocus]);

  // this functions gets universal feed data
  const fetchFeed = async (page: number) => {
    const payload = {
      page: page,
      pageSize: PAGE_SIZE,
    };

    // calling getFeed API
    const getFeedResponse = await dispatch(
      getFeed(
        GetFeedRequest.builder()
          .setPage(payload.page)
          .setPageSize(payload.pageSize)
          .build(),
        false
      )
    );
    setFeedFetching(false);
    return getFeedResponse;
  };

  const loadData = async (newPage: number) => {
    setIsLoading(true);
    setTimeout(async () => {
      const res: any = await fetchFeed(newPage);
      if (res) {
        if (res?.posts?.length === 0 || !res?.posts) {
          setIsPaginationStopped(true);
          setIsLoading(false);
        }
      }
    }, 200);
  };

  const handleLoadMore = async () => {
    if (!isLoading && !isPaginationStopped) {
      const newPage = feedPageNumber + 1;
      setFeedPageNumber((page) => {
        return page + 1;
      });
      loadData(newPage);
    }
  };

  useEffect(() => {
    if (localRefresh) {
      setFeedPageNumber(1);
      setIsPaginationStopped(false);
    }
  }, [localRefresh]);

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
        LikePostRequest.builder().setPostId(payload.postId).build(),
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
          SavePostRequest.builder().setPostId(payload.postId).build(),
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
      const initialPage = 1;
      fetchFeed(initialPage);
    }
  }, [accessToken]);

  // this function closes the post action list modal
  const closePostActionListModal = () => {
    setShowActionListModal(false);
  };

  // this function is executed on the click of menu icon & handles the position and visibility of the modal
  const onOverlayMenuClick = (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    postId: string
  ) => {
    setSelectedMenuItemPostId(postId);
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
      pinPost(PinPostRequest.builder().setPostId(payload.postId).build(), false)
    );
    if (pinPostResponse !== undefined) {
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
    dispatch(autoPlayPostVideo(""));
    setShowReportModal(true);
  };

  // this function handles the functionality on the delete option
  const handleDeletePost = async (visible: boolean) => {
    setDeleteModal(visible);
  };

  // this function handles the click on edit option of overlayMenu
  const handleEditPost = (postId, post) => {
    dispatch(autoPlayPostVideo(""));
    navigation.navigate(CREATE_POST, { postId, post });
  };

  // this function handles hide/unhide post
  const handleHidePost = async (postId) => {
    try {
      const post = (feedData as LMPostViewData[])?.find(
        (post) => post.id == postId
      );
      const isPostHidden = post?.menuItems?.find((menuItem) => menuItem.id == 13);
      await dispatch(hidePost(
        HidePostRequest.
        builder()
        .setPostId(postId)
        .build(),
        false
      ))
      dispatch({
        type: HIDE_POST_STATE,
        body: {
          postId: postId,
          title: `${isPostHidden ? "Hide" : "Unhide"} This ${pluralizeOrCapitalize(
            (CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.post ?? "post",
            WordAction.firstLetterCapitalSingular)}`
        }
      })
      dispatch({
        type: SHOW_TOAST,
        body: {
          isToast: true,
          message: isPostHidden ? POST_UNHIDDEN : POST_HIDDEN,
        },
      });
    } catch (error) {
      console.log("error while hiding post")
    }
  }

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
      (item: LMPostViewData) => item.id === selectedMenuItemPostId
    );
    return postDetail;
  };

  //pagination loader in the footer
  const renderLoader = () => {
    return isLoading ? (
      <View style={{ paddingVertical: Layout.normalize(20) }}>
        <LMLoader {...loaderStyle?.loader} />
      </View>
    ) : null;
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
    handleHidePost,
    fetchFeed,
    handleLoadMore,
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
    setPostInViewport,
  };

  return (
    <PostListContext.Provider value={contextValues}>
      {children}
    </PostListContext.Provider>
  );
};
