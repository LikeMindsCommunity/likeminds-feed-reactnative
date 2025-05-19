import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native'
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LMMenuItemsViewData, RootStackParamList } from "../../models";
import { SearchFeedCustomisableMethodsContextProvider } from '../../context/searchFeedCallbacksContext';
import React, { useCallback, useEffect, useLayoutEffect, useState, ReactNode, useMemo } from 'react'
import STYLES from "../../constants/Styles"
import { LMHeader, LMLoader, LMPost } from '../../components'
import { LMIcon, LMInputText, LMText } from '../../uiComponents'
import { LMPostViewData } from '../../models'
import {
    DELETE_POST_MENU_ITEM, EDIT_POST_MENU_ITEM,
    HIDE_POST_MENU_ITEM, NAVIGATED_FROM_POST,
    PIN_POST_MENU_ITEM, POST_TYPE,
    REPORT_POST_MENU_ITEM, UNHIDE_POST_MENU_ITEM,
    UNPIN_POST_MENU_ITEM
} from '../../constants/Strings'
import { Events } from '../../enums/Events'
import { LMFeedAnalytics } from '../../analytics/LMFeedAnalytics'
import { Keys } from '../../enums/Keys'
import { getPostType } from '../../utils/analytics'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { SET_FLOW_TO_POST_DETAIL_SCREEN } from '../../store/types/types'
import { clearPostDetail } from '../../store/actions/postDetail'
import { POST_DETAIL } from '../../constants/screenNames'
import LMPostMenu from '../../customModals/LMPostMenu'
import { autoPlayPostVideo } from '../../store/actions/feed'
import { DeleteModal, ReportModal } from '../../customModals'
import { useSearchFeedCustomisableMethodsContext } from '../../context/searchFeedCallbacksContext'
import { SearchedPostListContextValues, useSearchedPostListContext } from '../../context/searchedPostListContext'
import { styles } from "./styles"
import { PollCustomisableMethodsContextProvider } from '../../context/pollCustomisableCallback';
import FlashList from '@shopify/flash-list/src/FlashList';
import Layout from '../../constants/Layout';

interface SearchFeedProps {
    children?: React.ReactNode;
    navigation?: NativeStackNavigationProp<RootStackParamList, "UniversalFeed">;
    route?: {
        key: string;
        name: string;
        params: Array<string>;
        path: undefined;
    };
    isHeadingEnabled?: boolean;
    isTopResponse?: boolean;
    postLikeHandlerProp?: (id: string) => void;
    savePostHandlerProp?: (id: string, saved?: boolean) => void;
    selectPinPostProp?: (id: string, pinned?: boolean) => void;
    selectEditPostProp?: (id: string, post: any) => void;
    onSelectCommentCountProp?: (id: string) => void;
    onTapLikeCountProps?: (id: string) => void;
    handleDeletePostProps?: (visible: boolean, postId: string) => void;
    handleReportPostProps?: (postId: string) => void;
    handleHidePostProp?: (postId: string) => void,
    newPostButtonClickProps?: () => void;
    onBackArrowPressProp?: () => void;
    onCrossPressProp?: () => void;
    onOverlayMenuClickProp?: (
        event: {
            nativeEvent: { pageX: number; pageY: number };
        },
        menuItems: LMMenuItemsViewData[],
        postId: string
    ) => void;
    onTapNotificationBellProp?: () => void;
    onSharePostClicked?: (id: string) => void;
    onSubmitButtonClicked?: any;
    onAddPollOptionsClicked?: any;
    onPollOptionClicked?: any;
    hideTopicsView?: boolean;
    lmPostCustomFooter?: any;
    customWidgetPostView?: any;
}


const LMFeedSearchScreen = ({
    navigation,
    route,
    children,
    postLikeHandlerProp,
    savePostHandlerProp,
    selectPinPostProp,
    selectEditPostProp,
    onSelectCommentCountProp,
    onTapLikeCountProps,
    handleDeletePostProps,
    handleReportPostProps,
    handleHidePostProp,
    newPostButtonClickProps,
    onOverlayMenuClickProp,
    onTapNotificationBellProp,
    onSharePostClicked,
    onBackArrowPressProp,
    onCrossPressProp,
    onSubmitButtonClicked,
    onAddPollOptionsClicked,
    onPollOptionClicked,
    lmPostCustomFooter,
    customWidgetPostView,
    isHeadingEnabled = false,
    isTopResponse = false,
    hideTopicsView = false
}: SearchFeedProps) => {
    return (
        <PollCustomisableMethodsContextProvider
            onSubmitButtonClicked={onSubmitButtonClicked}
            onAddPollOptionsClicked={onAddPollOptionsClicked}
            onPollOptionClicked={onPollOptionClicked}
        >
            <SearchFeedCustomisableMethodsContextProvider
                postLikeHandlerProp={postLikeHandlerProp}
                savePostHandlerProp={savePostHandlerProp}
                selectEditPostProp={selectEditPostProp}
                selectPinPostProp={selectPinPostProp}
                onSelectCommentCountProp={onSelectCommentCountProp}
                onTapLikeCountProps={onTapLikeCountProps}
                handleHidePostProp={handleHidePostProp}
                handleDeletePostProps={handleDeletePostProps}
                handleReportPostProps={handleReportPostProps}
                newPostButtonClickProps={newPostButtonClickProps}
                onOverlayMenuClickProp={onOverlayMenuClickProp}
                onTapNotificationBellProp={onTapNotificationBellProp}
                onBackArrowPressProp={onBackArrowPressProp}
                onCrossPressProp={onCrossPressProp}
                onSharePostClicked={onSharePostClicked}
                isHeadingEnabled={isHeadingEnabled}
                isTopResponse={isTopResponse}
                hideTopicsView={hideTopicsView}
            >
                <LMFeedSearchScreenComponent
                    navigation={navigation}
                    route={route}
                    lmPostCustomFooter={lmPostCustomFooter}
                    customWidgetPostView={customWidgetPostView}
                />
            </SearchFeedCustomisableMethodsContextProvider>
        </PollCustomisableMethodsContextProvider>
    )
}


const LMFeedSearchScreenComponent = ({
    navigation,
    route,
    lmPostCustomFooter,
    customWidgetPostView
}: any) => {
    const dispatch = useAppDispatch();
    const [debounceId, setDebounceId] = useState<number | null>(null);
    const {
        searchFeedData,
        feedFetching,
        modalPosition,
        showActionListModal,
        closePostActionListModal,
        postLikeHandler,
        debouncedSaveFunction,
        savePostHandler,
        handleLoadMore,
        renderLoader,
        showLoader,
        showDeleteModal,
        showReportModal,
        getPostDetail,
        setShowReportModal,
        handleDeletePost,
        onTapCommentCount,
        debouncedLikeFunction,
        setSelectedMenuItemPostId,
        handlePinPost,
        handleReportPost,
        handleEditPost,
        handleHidePost,
        onTapLikeCount,
        onOverlayMenuClick,
        setPostInViewport,
        searchPostQuery,
        setSearchPostQuery,
        onBackArrowPress,
        onCrossPress,
        displayEmptyComponent
    }: SearchedPostListContextValues = useSearchedPostListContext();
    const postListStyle = STYLES.$SEARCH_FEED_STYLES?.postListStyle;
    const searchFeedStyles = STYLES.$SEARCH_FEED_STYLES
    const loaderStyle = STYLES.$LOADER_STYLE;
    const {
        postLikeHandlerProp,
        savePostHandlerProp,
        onSelectCommentCountProp,
        selectEditPostProp,
        selectPinPostProp,
        onTapLikeCountProps,
        handleDeletePostProps,
        handleReportPostProps,
        handleHidePostProp,
        onOverlayMenuClickProp,
        onSharePostClicked,
        onBackArrowPressProp,
        onCrossPressProp,
        isHeadingEnabled,
        isTopResponse,
        hideTopicsView,
    } = useSearchFeedCustomisableMethodsContext();


    // this function returns the id of the item selected from menu list and handles further functionalities accordingly
    const onMenuItemSelect = (
        postId: string,
        itemId?: number,
        pinnedValue?: boolean,
        postDetail?: LMPostViewData
    ) => {
        setSelectedMenuItemPostId(postId);
        if (itemId === PIN_POST_MENU_ITEM || itemId === UNPIN_POST_MENU_ITEM) {
            selectPinPostProp
                ? selectPinPostProp(postId, pinnedValue)
                : handlePinPost(postId, pinnedValue);
            let event = pinnedValue ? Events.POST_UNPINNED : Events.POST_PINNED;
            LMFeedAnalytics.track(
                event,
                new Map<string, string>([
                    [Keys.UUID, postDetail?.user?.sdkClientInfo?.uuid],
                    [Keys.POST_ID, postId],
                    [Keys.POST_TYPE, getPostType(postDetail?.attachments)],
                ])
            );
        }
        if (itemId === REPORT_POST_MENU_ITEM) {
            if (Platform.OS == "ios") {
                setTimeout(() => {
                    handleReportPostProps
                        ? handleReportPostProps(postId)
                        : handleReportPost();
                }, 500)
            } else {
                handleReportPostProps
                    ? handleReportPostProps(postId)
                    : handleReportPost();
            }
        }
        if (itemId === DELETE_POST_MENU_ITEM) {
            if (Platform.OS == "ios") {
                setTimeout(() => {
                    handleDeletePostProps
                        ? handleDeletePostProps(true, postId)
                        : handleDeletePost(true);
                }, 500)
            } else {
                handleDeletePostProps
                    ? handleDeletePostProps(true, postId)
                    : handleDeletePost(true);
            }
        }
        if (itemId === HIDE_POST_MENU_ITEM || itemId === UNHIDE_POST_MENU_ITEM) {
            handleHidePostProp ? handleHidePostProp(postId) : handleHidePost(postId);
        }

        if (itemId === EDIT_POST_MENU_ITEM) {
            selectEditPostProp
                ? selectEditPostProp(postId, postDetail)
                : handleEditPost(postId, postDetail);
            LMFeedAnalytics.track(
                Events.POST_EDITED,
                new Map<string, string>([
                    [Keys.UUID, postDetail?.user?.sdkClientInfo.uuid],
                    [Keys.POST_ID, postId],
                    [Keys.POST_TYPE, getPostType(postDetail?.attachments)],
                ])
            );
        }
    };
    const currentVideoId = useAppSelector((state) => state.feed.currentIdOfVideo);


    // Post component to be rendered in the post list
    const renderItem = useCallback(
        ({ item, index }: { item: LMPostViewData; index: number }) => {
            return (
                <>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: STYLES.$IS_DARK_THEME
                                ? STYLES.$BACKGROUND_COLORS.DARK
                                : STYLES.$BACKGROUND_COLORS.LIGHT,
                        }}
                        onPress={() => {
                            dispatch(clearPostDetail() as any);
                            dispatch({
                                type: SET_FLOW_TO_POST_DETAIL_SCREEN,
                                body: { flowToPostDetailScreen: true },
                            });
                            navigation.navigate(POST_DETAIL, [
                                item?.id,
                                NAVIGATED_FROM_POST,
                            ]);
                        }}
                        key={item?.id}
                    >
                        <LMPost
                            highlight={searchPostQuery}
                            isHeadingEnabled={isHeadingEnabled}
                            isTopResponse={isTopResponse}
                            post={item}
                            // header props
                            headerProps={{
                                postMenu: {
                                    modalPosition: modalPosition,
                                    modalVisible: showActionListModal,
                                    onCloseModal: closePostActionListModal,
                                    onSelected: (postId, itemId) => {
                                        onMenuItemSelect(postId, itemId, item?.isPinned);
                                    },
                                },
                                onOverlayMenuClick: (event) => {
                                    onOverlayMenuClickProp
                                        ? onOverlayMenuClickProp(event, item?.menuItems, item?.id)
                                        : onOverlayMenuClick(event, item?.id);
                                },
                            }}
                            // footer props
                            footerProps={{
                                likeIconButton: {
                                    onTap: () => {
                                        postLikeHandlerProp
                                            ? postLikeHandlerProp(item?.id)
                                            : postLikeHandler(item?.id);
                                    },
                                },
                                saveButton: {
                                    onTap: () => {
                                        savePostHandlerProp
                                            ? savePostHandlerProp(item?.id, item?.isSaved)
                                            : savePostHandler(item?.id, item?.isSaved);
                                    },
                                },
                                likeTextButton: {
                                    onTap: () => {
                                        onTapLikeCountProps
                                            ? onTapLikeCountProps(item?.id)
                                            : onTapLikeCount(item?.id);
                                    },
                                },
                                commentButton: {
                                    onTap: () => {
                                        onSelectCommentCountProp
                                            ? onSelectCommentCountProp(item?.id)
                                            : onTapCommentCount(item?.id);
                                    },
                                },
                                shareButton: {
                                    onTap: () => {
                                        onSharePostClicked ? onSharePostClicked(item?.id) : {};
                                    },
                                },
                            }}
                            hideTopicsView={hideTopicsView ?? false}
                            customFooter={lmPostCustomFooter}
                            customWidgetPostView={customWidgetPostView}
                        />
                    </TouchableOpacity>
                    {!postListStyle?.shouldHideSeparator &&
                        index != searchFeedData.length - 1 ? (
                        <View
                            style={{
                                height: 11,
                                backgroundColor: STYLES.$IS_DARK_THEME
                                    ? STYLES.$SEPARATOR_COLORS.DARK
                                    : STYLES.$SEPARATOR_COLORS.LIGHT,
                            }}
                        />
                    ) : null}
                </>
            );
        },
        [
            isHeadingEnabled,
            isTopResponse,
            hideTopicsView,
            searchFeedData,
            searchPostQuery
        ]
    );


    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.borderBottomView}>
                <View style={styles.innerView}>
                    <TouchableOpacity onPress={onBackArrowPressProp ? onBackArrowPressProp : onBackArrowPress} style={styles.touchableOpacity}>
                        <LMIcon
                            height={24}
                            width={24}
                            color={STYLES.$IS_DARK_THEME ? "white" : "black"}
                            assetPath={require("../../assets/images/backArrow_icon3x.png")}
                            {...searchFeedStyles?.backIconStyle}
                        />
                    </TouchableOpacity>
                    <View style={styles.flexView}>
                        <LMInputText autoFocus={true} textValueStyle={StyleSheet.flatten([
                            styles.textValueStyle,
                            {
                                color: STYLES.$IS_DARK_THEME ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT
                            },
                            searchFeedStyles?.searchQueryTextStyle
                        ])}
                            rightIcon={
                                searchPostQuery?.length > 0 ?
                                    {
                                        icon: {
                                            assetPath: require("../../assets/images/cross_icon3x.png"),
                                            height: 18,
                                            width: 18,
                                            color: STYLES.$IS_DARK_THEME ? "white" : "black",
                                            ...searchFeedStyles?.crossIconStyle
                                        },
                                        onTap: onCrossPressProp ? onCrossPressProp : onCrossPress,
                                    } :
                                    undefined
                            }
                            inputTextStyle={StyleSheet.flatten([
                                styles.inputTextStyle,
                                searchFeedStyles?.inputBoxStyle
                            ])}
                            inputText={searchPostQuery}
                            onType={setSearchPostQuery}
                            placeholderText={searchFeedStyles?.placeholderText ? searchFeedStyles?.placeholderText : "Search..."}
                            placeholderTextColor={searchFeedStyles?.placeholderTextColor ? searchFeedStyles?.placeholderTextColor :
                                STYLES.$IS_DARK_THEME ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT
                            }
                        />
                    </View>
                </View>
            </View>
            <FlashList
                data={searchFeedData}
                extraData={[]}
                estimatedItemSize={
                    (Layout.window.height) / 3
                }
                disableIntervalMomentum={true}
                decelerationRate={Platform.OS == "android" ? 0.96 : 0.994}
                renderItem={renderItem}
                ListEmptyComponent={() => {
                    if (feedFetching) {
                        return (
                            <View style={{ height: Layout.window.height - 250, justifyContent: 'center', alignItems: 'center' }}>
                                <LMLoader {...loaderStyle?.loader} />
                            </View>
                        )
                    } else if (searchPostQuery?.length > 0 && !feedFetching && searchFeedData?.length == 0) {
                        return displayEmptyComponent && (
                            <View style={{ height: Layout.window.height - 250, justifyContent: 'center', alignItems: 'center' }}>
                                <LMIcon height={100} width={100}
                                    assetPath={require("../../assets/images/nothing3x.png")}
                                    {...searchFeedStyles?.listEmptyStyle?.listEmptyImageStyle} />
                                <Text style={
                                    StyleSheet.flatten([
                                        {
                                            color: STYLES.$IS_DARK_THEME ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
                                            marginVertical: 10
                                        },
                                        searchFeedStyles?.listEmptyStyle?.listEmptyTextStyle
                                    ])
                                }>
                                    Found no matching posts
                                </Text>
                            </View>
                        )
                    }
                }}
                onEndReachedThreshold={0.3}
                onEndReached={handleLoadMore}
                removeClippedSubviews={true}
                keyExtractor={(item) => {
                    return item?.id?.toString();
                }}
                ListFooterComponent={renderLoader}
                onViewableItemsChanged={({ changed, viewableItems }) => {
                    if (changed) {
                        if (viewableItems) {
                            setPostInViewport(viewableItems?.[0]?.item?.id);
                        }
                    }
                }}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
            />

            {/* delete post modal */}
            {showDeleteModal && (
                <DeleteModal
                    visible={showDeleteModal}
                    displayModal={(visible) => handleDeletePost(visible)}
                    deleteType={POST_TYPE}
                    postDetail={getPostDetail()}
                    navigation={navigation}
                />
            )}
            {/* report post modal */}
            {showReportModal && (
                <ReportModal
                    visible={showReportModal}
                    closeModal={() => {
                        dispatch(autoPlayPostVideo(currentVideoId));
                        setShowReportModal(false);
                    }}
                    reportType={POST_TYPE}
                    postDetail={getPostDetail()}
                />
            )}
            {/* menu list modal */}
            {showActionListModal && (
                <LMPostMenu
                    post={getPostDetail()}
                    onSelected={(postId, itemId, isPinned) => {
                        onMenuItemSelect(postId, itemId, isPinned, getPostDetail());
                    }}
                    modalPosition={modalPosition}
                    modalVisible={showActionListModal}
                    onCloseModal={closePostActionListModal}
                    menuItemTextStyle={postListStyle?.header?.postMenu?.menuItemTextStyle}
                    menuViewStyle={postListStyle?.header?.postMenu?.menuViewStyle}
                    backdropColor={postListStyle?.header?.postMenu?.backdropColor}
                />
            )}
        </SafeAreaView>
    )
}

export default LMFeedSearchScreen;
