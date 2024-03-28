import React, { createContext, ReactNode, useContext } from "react";

export interface PostDetailCallbacksContextProps {
  children?: ReactNode;
  getCommentsRepliesProp: (    postId: string,
    commentId: string,
    repliesResponseCallback: any,
    pageNo: number) => void;
  addNewCommentProp: (postId: string) => void;
  addNewReplyProp: (postId: string, commentId: string) => void;
  commentLikeHandlerProp: (postId: string, commentId: string) => void;
  handleReportCommentProp: () => void;
  handleDeleteCommentProp: (visible: boolean) => void;
  handleEditCommentProp: (commentId: string) => void;
  handleScreenBackPressProp: () => void;
  onCommentOverflowMenuClickProp: (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => void;
}

export interface PostDetailCustomisableMethodsContext {
  getCommentsRepliesProp: (    postId: string,
    commentId: string,
    repliesResponseCallback: any,
    pageNo: number) => void;
  addNewCommentProp: (postId: string) => void;
  addNewReplyProp: (postId: string, commentId: string) => void;
  commentLikeHandlerProp: (postId: string, commentId: string) => void;
  handleReportCommentProp: () => void;
  handleDeleteCommentProp: (visible: boolean) => void;
  handleEditCommentProp: (commentId: string) => void;
  handleScreenBackPressProp: () => void;
  onCommentOverflowMenuClickProp: (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => void;
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
  onCommentOverflowMenuClickProp
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
    onCommentOverflowMenuClickProp
  };

  return (
    <PostDetailCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </PostDetailCustomisableMethodsContext.Provider>
  );
};
