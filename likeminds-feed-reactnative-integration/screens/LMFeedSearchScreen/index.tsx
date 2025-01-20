import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, RefreshControl, FlatList, ActivityIndicator } from 'react-native'
import React, { useCallback, useLayoutEffect } from 'react'
import STYLES from "../../constants/Styles"
import { LMHeader, LMLoader, LMPost } from '../../components'
import { LMIcon, LMInputText, LMText } from '../../uiComponents'
import { SearchPostContextProvider } from '../../context'
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

const LMFeedSearchScreen = ({ navigation, route }) => {
    return (
        <SearchPostContextProvider navigation={navigation} route={route}>
            <LMFeedSearchScreenComponent navigation={navigation} route={route} />
        </SearchPostContextProvider>
    )
}

const LMFeedSearchScreenComponent = ({ navigation, route }) => {
    const dispatch = useAppDispatch();
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
        onCrossPress
    }: SearchedPostListContextValues = useSearchedPostListContext();
    const postListStyle = STYLES.$POST_LIST_STYLE;
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
        isHeadingEnabled,
        isTopResponse,
        hideTopicsView,
    } = useSearchFeedCustomisableMethodsContext();

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
            handleReportPostProps
                ? handleReportPostProps(postId)
                : handleReportPost();
        }
        if (itemId === DELETE_POST_MENU_ITEM) {
            handleDeletePostProps
                ? handleDeletePostProps(true, postId)
                : handleDeletePost(true);
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
                        />
                    </TouchableOpacity>
                    {!postListStyle.shouldHideSeparator &&
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
            searchFeedData
        ]
    );


    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.borderBottomView}>
                <View style={styles.innerView}>
                    <TouchableOpacity onPress={onBackArrowPress} style={styles.touchableOpacity}>
                        <LMIcon
                            height={24}
                            width={24}
                            assetPath={require("../../assets/images/backArrow_icon3x.png")}
                        />
                    </TouchableOpacity>
                    <View style={styles.flexView}>
                        <LMInputText textValueStyle={styles.textValueStyle}
                            rightIcon={{
                                icon: {
                                    assetPath: require("../../assets/images/cross_icon3x.png"),
                                    height: 18,
                                    width: 18
                                },
                                onTap: onCrossPress,
                            }}
                            inputTextStyle={styles.inputTextStyle}
                            inputText={searchPostQuery}
                            onType={setSearchPostQuery} />
                    </View>
                </View>
            </View>
            { searchPostQuery?.length > 0 ?
                feedFetching ? 
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <LMLoader {...loaderStyle?.loader} />
                </View> :
                searchFeedData?.length > 0 ?
                <View>
                <FlatList
                    style={postListStyle?.listStyle}
                    data={searchFeedData}
                    extraData={searchFeedData}
                    renderItem={renderItem}
                    onEndReachedThreshold={0.9}
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
                </View> :
                <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
                    <LMText textStyle={{
                        fontSize: 16
                    }}>No Matching Posts Found</LMText>
                </View> :
                <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
                    <LMText textStyle={{
                        fontSize: 16
                    }}>Search Your Query</LMText>
                </View>
            }

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

export default LMFeedSearchScreen

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: STYLES.$IS_DARK_THEME ? STYLES.$BACKGROUND_COLORS.DARK : STYLES.$BACKGROUND_COLORS.LIGHT
    },
    borderBottomView: {
        borderBottomColor: "#00000011",
        borderBottomWidth: 2
    },
    innerView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    touchableOpacity: {
        marginLeft: 12
    },
    flexView: {
        flex: 1
    },
    textValueStyle: {
        fontSize: 16
    },
    inputTextStyle: {
        height: 40,
        elevation: 0,
        paddingVertical: 0,
        borderRadius: 0,
        fontSize: 16,
    }
})