import { LMMenuItemsViewData, LMPostViewData } from "../models";
import React, { createContext, ReactNode, useContext } from "react";

export interface SearchFeedCallbacksContextProps {
  children?: ReactNode;
  isHeadingEnabled: boolean;
  isTopResponse: boolean;
  hideTopicsView?: boolean;
  postLikeHandlerProp?: (id: string) => void;
  savePostHandlerProp?: (id: string, saved?: boolean) => void;
  selectPinPostProp?: (id: string, pinned?: boolean) => void;
  selectEditPostProp?: (id: string, post: LMPostViewData | undefined) => void;
  onSelectCommentCountProp?: (id: string) => void;
  onTapLikeCountProps?: (id: string) => void;
  handleDeletePostProps?: (visible: boolean, postId: string) => void;
  handleReportPostProps?: (postId: string) => void;
  handleHidePostProp?: (postId: string) => void;
  newPostButtonClickProps?: () => void;
  onOverlayMenuClickProp?: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    menuItems: LMMenuItemsViewData[],
    postId: string
  ) => void;
  onTapNotificationBellProp?: () => void;
  onSharePostClicked?: (id: string) => void;
  onSearchIconClickProp?: () => void;
}

export interface SearchFeedCustomisableMethodsContext {
  isHeadingEnabled: boolean;
  isTopResponse: boolean;
  hideTopicsView?: boolean;
  postLikeHandlerProp?: (id: string) => void;
  savePostHandlerProp?: (id: string, saved?: boolean) => void;
  selectPinPostProp?: (id: string, pinned?: boolean) => void;
  selectEditPostProp?: (id: string, post: LMPostViewData | undefined) => void;
  onSelectCommentCountProp?: (id: string) => void;
  onTapLikeCountProps?: (id: string) => void;
  handleDeletePostProps?: (visible: boolean, postId: string) => void;
  handleReportPostProps?: (postId: string) => void;
  handleHidePostProp?: (postId: string) => void;
  newPostButtonClickProps?: () => void;
  onOverlayMenuClickProp?: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    menuItems: LMMenuItemsViewData[],
    postId: string
  ) => void;
  onTapNotificationBellProp?: () => void;
  onSharePostClicked?: (id: string) => void;
}

const SearchFeedCustomisableMethodsContext = createContext<
  SearchFeedCustomisableMethodsContext | undefined
>(undefined);

export const useSearchFeedCustomisableMethodsContext = () => {
  const context = useContext(SearchFeedCustomisableMethodsContext);
  if (!context) {
    throw new Error(
      "useUniversalFeedCustomisableMethodsContext must be used within an UniversalFeedCustomisableMethodsContext"
    );
  }
  return context;
};

export const SearchFeedCustomisableMethodsContextProvider = ({
  children,
  postLikeHandlerProp,
  savePostHandlerProp,
  selectPinPostProp,
  selectEditPostProp,
  onSelectCommentCountProp,
  onTapLikeCountProps,
  handleDeletePostProps,
  handleReportPostProps,
  newPostButtonClickProps,
  onOverlayMenuClickProp,
  handleHidePostProp,
  onTapNotificationBellProp,
  onSharePostClicked,
  isHeadingEnabled = false,
  isTopResponse = false,
  hideTopicsView = false
}: SearchFeedCallbacksContextProps) => {
  const contextValues: SearchFeedCustomisableMethodsContext = {
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
    isHeadingEnabled,
    isTopResponse,
    hideTopicsView,
  };

  return (
    <SearchFeedCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </SearchFeedCustomisableMethodsContext.Provider>
  );
};