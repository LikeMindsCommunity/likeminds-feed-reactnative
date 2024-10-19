import { LMMenuItemsViewData } from "../models";
import React, { createContext, ReactNode, useContext } from "react";

export interface PostDetailCallbacksContextProps {
  children?: ReactNode;
  getCommentsRepliesProp?: (
    postId: string,
    commentId: string,
    repliesResponseCallback: any,
    pageNo: number
  ) => void;
  addNewCommentProp?: (postId: string) => void;
  addNewReplyProp?: (postId: string, commentId: string) => void;
  commentLikeHandlerProp?: (postId: string, commentId: string) => void;
  handleReportCommentProp?: (commentId: string) => void;
  handleDeleteCommentProp?: (visible: boolean, commentId: string) => void;
  handleEditCommentProp?: (commentId: string) => void;
  handleScreenBackPressProp?: () => void;
  onCommentOverflowMenuClickProp?: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    menuItems: LMMenuItemsViewData[],
    commentId: string
  ) => void;
  onSharePostClicked?: (id: string) => void;
  isHeadingEnabled?: boolean;
  isTopResponse?: boolean;
  lmPostCustomFooter?: ReactNode;
  hideTopicsView?: boolean;
}

export interface PostDetailCustomisableMethodsContext {
  getCommentsRepliesProp?: (
    postId: string,
    commentId: string,
    repliesResponseCallback: any,
    pageNo: number
  ) => void;
  addNewCommentProp?: (postId: string) => void;
  addNewReplyProp?: (postId: string, commentId: string) => void;
  commentLikeHandlerProp?: (postId: string, commentId: string) => void;
  handleReportCommentProp?: (commentId: string) => void;
  handleDeleteCommentProp?: (visible: boolean, commentId: string) => void;
  handleEditCommentProp?: (commentId: string) => void;
  handleScreenBackPressProp?: () => void;
  onCommentOverflowMenuClickProp?: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    menuItems: LMMenuItemsViewData[],
    commentId: string
  ) => void;
  onSharePostClicked?: (id: string) => void;
  isHeadingEnabled?: boolean;
  isTopResponse?: boolean;
  lmPostCustomFooter?: ReactNode;
  hideTopicsView?: boolean;
}

const PostDetailCustomisableMethodsContext = createContext<
  PostDetailCustomisableMethodsContext | undefined
>(undefined);

export const usePostDetailCustomisableMethodsContext = () => {
  const context = useContext(PostDetailCustomisableMethodsContext);
  if (!context) {
    throw new Error(
      "usePostDetailCustomisableMethodsContext must be used within an PostDetailCustomisableMethodsContext"
    );
  }
  return context;
};

export const PostDetailCustomisableMethodsContextProvider = ({
  children,
  getCommentsRepliesProp,
  commentLikeHandlerProp,
  addNewCommentProp,
  addNewReplyProp,
  handleDeleteCommentProp,
  handleEditCommentProp,
  handleReportCommentProp,
  handleScreenBackPressProp,
  onCommentOverflowMenuClickProp,
  onSharePostClicked,
  isHeadingEnabled,
  isTopResponse,
  lmPostCustomFooter,
  hideTopicsView
}: PostDetailCallbacksContextProps) => {
  const contextValues: PostDetailCustomisableMethodsContext = {
    getCommentsRepliesProp,
    commentLikeHandlerProp,
    addNewCommentProp,
    addNewReplyProp,
    handleDeleteCommentProp,
    handleEditCommentProp,
    handleReportCommentProp,
    handleScreenBackPressProp,
    onCommentOverflowMenuClickProp,
    onSharePostClicked,
    isHeadingEnabled,
    isTopResponse,
    lmPostCustomFooter,
    hideTopicsView
  };

  return (
    <PostDetailCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </PostDetailCustomisableMethodsContext.Provider>
  );
};
