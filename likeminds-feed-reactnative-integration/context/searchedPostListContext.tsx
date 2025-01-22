import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
    JSX,
    useLayoutEffect,
} from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
    autoPlayPostVideo,
    getFeed,
    getPaginatedSearchedPosts,
    getSearchedPosts,
    getTopicsFeed,
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
import { useIsFocused } from "@react-navigation/native";
import { CLEAR_SEARCH, HIDE_POST_STATE, SET_CURRENT_ID_OF_VIDEO } from "../store/types/types";
import { SHOW_TOAST } from "..//store/types/loader";
import pluralizeOrCapitalize from "../utils/variables";
import { WordAction } from "../enums/Variables";
import { CommunityConfigs } from "../communityConfigs";
import { SearchPostsRequest } from "@likeminds.community/feed-rn"

interface SearchedPostListContextProps {
    children?: ReactNode;
    navigation: NativeStackNavigationProp<
        RootStackParamList,
        "LMFeedSearchScreen"
    >;
    route: {
        key: string;
        name: string;
        params: Array<string>;
        path: undefined;
    };
}

export interface SearchedPostListContextValues {
    navigation: NativeStackNavigationProp<
        RootStackParamList,
        "LMFeedSearchScreen"
    >;
    searchFeedData: Array<LMPostViewData>;
    showLoader: number;
    feedPageNumber?: number;
    modalPosition: { x: number; y: number };
    showActionListModal: boolean;
    selectedMenuItemPostId: string;
    showDeleteModal: boolean;
    showReportModal: boolean;
    feedFetching: boolean;
    postInViewport: string;
    displayEmptyComponent: boolean;
    onBackArrowPress: () => void;
    onCrossPress: () => void;
    setPostInViewport: Dispatch<SetStateAction<string>>;
    setFeedFetching: Dispatch<SetStateAction<boolean>>;
    setModalPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
    setShowReportModal: Dispatch<SetStateAction<boolean>>;
    setDeleteModal: Dispatch<SetStateAction<boolean>>;
    setSelectedMenuItemPostId: Dispatch<SetStateAction<string>>;
    setShowActionListModal: Dispatch<SetStateAction<boolean>>;
    setFeedPageNumber?: Dispatch<SetStateAction<number>>;
    setSearchPostQuery: Dispatch<SetStateAction<string>>;
    searchPostQuery: string;
    renderLoader: () => JSX.Element | null;
    getPostDetail: () => LMPostViewData;
    handleDeletePost: (visible: boolean) => void;
    handleEditPost: (id: string, post: LMPostViewData | undefined) => void;
    handleHidePost: (postId: string) => void;
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

const SearchedPostListContext = createContext<SearchedPostListContextValues | undefined>(
    undefined
);

export const useSearchedPostListContext = () => {
    const context = useContext(SearchedPostListContext);
    if (!context) {
        throw new Error(
            "useSearchedPostListContext must be used within an SearchedPostListContextProvider"
        );
    }
    return context;
};

export const SearchedPostListContextProvider = ({
    children,
    navigation,
}: SearchedPostListContextProps) => {
    const dispatch = useAppDispatch();
    const searchFeedData = useAppSelector((state) => state.feed.searchedPosts);
    const showLoader = useAppSelector((state) => state.loader.count);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [showActionListModal, setShowActionListModal] = useState(false);
    const [selectedMenuItemPostId, setSelectedMenuItemPostId] = useState("");
    const [showDeleteModal, setDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [feedFetching, setFeedFetching] = useState(false);
    const [isPaginationStopped, setIsPaginationStopped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchPostQuery, setSearchPostQuery] = useState<string>("");
    const [debounceId, setDebounceId] = useState<number | null>(null);
    const [feedPageNumber, setFeedPageNumber] = useState(1);
    const [displayEmptyComponent, setDisplayEmptyComponent] = useState(false);
    const searchedPostsData = useAppSelector(state => state.feed.searchedPosts);
    
    const loaderStyle = STYLES.$LOADER_STYLE;
    const PAGE_SIZE = 5;
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
    const fetchSearchFeed = async (page) => {
        setFeedFetching(true);
        let response;
        if (page == 1) {
            response = await dispatch(
                getSearchedPosts(
                    SearchPostsRequest.builder()
                        .setPage(1)
                        .setPageSize(PAGE_SIZE)
                        .setSearch(searchPostQuery)
                        .setSearchType("text")
                        .build()
                )
            )
            if (response?.posts?.length === 0 || !response?.posts) {
                setDisplayEmptyComponent(true);    
            } else {
                setDisplayEmptyComponent(false);   
            }
        } else {
            response = await dispatch(
                getPaginatedSearchedPosts(
                    SearchPostsRequest.builder()
                        .setPage(page)
                        .setPageSize(PAGE_SIZE)
                        .setSearch(searchPostQuery)
                        .setSearchType("text")
                        .build()
                )
            )
        }
        setFeedFetching(false);
        return response;
    };

    const loadData = async (newPage: number) => {
          setIsLoading(true);
          setTimeout(async () => {
            const res: any = await fetchSearchFeed(newPage);
            if (res) {
              if (res?.posts?.length === 0 || !res?.posts) {
                setIsPaginationStopped(true);
                setIsLoading(false);
              } else {
                setIsLoading(false);
              }
            }
          }, 200);
    };

    const handleLoadMore = async () => {
          if (!isLoading && !isPaginationStopped && searchPostQuery?.length > 0) {
            console.log("PAGINATING");
            const newPage = feedPageNumber + 1;
            setFeedPageNumber((page) => {
              return page + 1;
            });
            loadData(newPage);
          }
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
        if (debounceId) {
            clearTimeout(debounceId);
        }

        if (searchPostQuery?.length == 0) {
            dispatch({
                type: CLEAR_SEARCH
            })
            return;
        }

        let id = setTimeout(() => {
            dispatch({
                type: CLEAR_SEARCH
            })
            setFeedPageNumber(1);
            setIsPaginationStopped(false);
            setIsLoading(false);
            fetchSearchFeed(1);
        }, 500)

        setDebounceId(id);
    }, [searchPostQuery])


    const onBackArrowPress = () => {
        navigation.goBack();
    }

    const onCrossPress = () => {
        setSearchPostQuery("");
        setIsPaginationStopped(false);
        setFeedFetching(false);
        setFeedPageNumber(1);
        dispatch({
            type: CLEAR_SEARCH
        })
    }

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
        const post = (searchFeedData as LMPostViewData[])?.find((item) => item.id == id);
        if (post?.isHidden) {
            dispatch(
                showToastMessage({
                    isToast: true,
                    message: "Something went wrong",
                })
            );
            return undefined;
        }
        const pinPostResponse = await dispatch(
            pinPost(PinPostRequest.builder().setPostId(payload.postId).build(), false)
        );

        dispatch(pinPostStateHandler(payload.postId));

        dispatch(
            showToastMessage({
                isToast: true,
                message: pinned ? POST_UNPIN_SUCCESS : POST_PIN_SUCCESS,
            })
        );

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
            const post = (searchFeedData as LMPostViewData[])?.find(
                (post) => post.id == postId
            );
            const isPostHidden = post?.menuItems?.find(
                (menuItem) => menuItem.id == 13
            );
            await dispatch(
                hidePost(HidePostRequest.builder().setPostId(postId).build(), false)
            );
            dispatch({
                type: HIDE_POST_STATE,
                body: {
                    postId: postId,
                    title: `${isPostHidden ? "Hide" : "Unhide"
                        } This ${pluralizeOrCapitalize(
                            CommunityConfigs?.getCommunityConfigs("feed_metadata")?.value
                                ?.post ?? "post",
                            WordAction.firstLetterCapitalSingular
                        )}`,
                },
            });
            dispatch({
                type: SHOW_TOAST,
                body: {
                    isToast: true,
                    message: isPostHidden ? POST_UNHIDDEN : POST_HIDDEN,
                },
            });
        } catch (error) {
            console.log("error while hiding post");
        }
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
        const postDetail = searchedPostsData.find(
            (item: LMPostViewData) => item.id === selectedMenuItemPostId
        );
        return postDetail;
    };

    //pagination loader in the footer
    const renderLoader = () => {
        return isLoading && searchFeedData?.length > 0 ? (
            <View style={{ height: Layout.normalize(100) }}>
                <LMLoader {...loaderStyle?.loader} />
            </View>
        ) : null;
    };

    const contextValues: SearchedPostListContextValues = {
        navigation,
        searchFeedData,
        showLoader,
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
        searchPostQuery,
        handleLoadMore,
        postLikeHandler,
        debouncedLikeFunction,
        debouncedSaveFunction,
        closePostActionListModal,
        handlePinPost,
        handleReportPost,
        savePostHandler,
        onTapCommentCount,
        onBackArrowPress,
        onCrossPress,
        onTapLikeCount,
        onOverlayMenuClick,
        setModalPosition,
        postInViewport,
        setPostInViewport,
        setSearchPostQuery,
        displayEmptyComponent
    };

    return (
        <SearchedPostListContext.Provider value={contextValues}>
            {children}
        </SearchedPostListContext.Provider>
    );
};