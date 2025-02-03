import { LMMenuItemsViewData, LMPostViewData } from "../models";
import React, { createContext, ReactNode, useContext } from "react";

export interface FeedCallbacksContextProps {
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
}

export interface FeedCustomisableMethodsContext {
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

const FeedCustomisableMethodsContext = createContext<
  FeedCustomisableMethodsContext | undefined
>(undefined);

export const useFeedCustomisableMethodsContext = () => {
  const context = useContext(FeedCustomisableMethodsContext);
  if (!context) {
    throw new Error(
      "useFeedCustomisableMethodsContext must be used within an FeedCustomisableMethodsContext"
    );
  }
  return context;
};

export const FeedCustomisableMethodsContextProvider = ({
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
}: FeedCallbacksContextProps) => {
  const contextValues: FeedCustomisableMethodsContext = {
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
    <FeedCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </FeedCustomisableMethodsContext.Provider>
  );
};
