import React, { createContext, ReactNode, useContext } from "react";

export interface UniversalFeedCallbacksContextProps {
  children?: ReactNode;
  postLikeHandlerProp: (id: string) => void;
  savePostHandlerProp: (id: string, saved?: boolean) => void;
  selectPinPostProp: (id: string, pinned?: boolean) => void;
  selectEditPostProp: (id: string) => void;
  onSelectCommentCountProp: (id: string) => void;
  onTapLikeCountProps: (id: string) => void;
  handleDeletePostProps: (visible: boolean) => void;
  handleReportPostProps: () => void;
  newPostButtonClickProps: () => void;
  onOverlayMenuClickProp: (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => void;
}

export interface UniversalFeedCustomisableMethodsContext {
  postLikeHandlerProp: (id: string) => void;
  savePostHandlerProp: (id: string, saved?: boolean) => void;
  selectPinPostProp: (id: string, pinned?: boolean) => void;
  selectEditPostProp: (id: string) => void;
  onSelectCommentCountProp: (id: string) => void;
  onTapLikeCountProps: (id: string) => void;
  handleDeletePostProps: (visible: boolean) => void;
  handleReportPostProps: () => void;
  newPostButtonClickProps: () => void;
  onOverlayMenuClickProp: (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => void;
}

const UniversalFeedCustomisableMethodsContext = createContext<
  UniversalFeedCustomisableMethodsContext | undefined
>(undefined);

export const useUniversalFeedCustomisableMethodsContext = () => {
  const context = useContext(UniversalFeedCustomisableMethodsContext);
  if (!context) {
    throw new Error(
      "useUniversalFeedCustomisableMethodsContext must be used within an UniversalFeedCustomisableMethodsContext"
    );
  }
  return context;
};

export const UniversalFeedCustomisableMethodsContextProvider = ({
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
  onOverlayMenuClickProp
}: UniversalFeedCallbacksContextProps) => {
  const contextValues: UniversalFeedCustomisableMethodsContext = {
    postLikeHandlerProp,
    savePostHandlerProp,
    selectPinPostProp,
    selectEditPostProp,
    onSelectCommentCountProp,
    onTapLikeCountProps,
    handleDeletePostProps,
    handleReportPostProps,
    newPostButtonClickProps,
    onOverlayMenuClickProp
  };

  return (
    <UniversalFeedCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </UniversalFeedCustomisableMethodsContext.Provider>
  );
};
