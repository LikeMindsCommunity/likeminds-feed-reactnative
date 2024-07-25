import { LMUserUI } from "../models";
import React, { createContext, ReactNode, useContext } from "react";

export interface PostLikesCallbacksContextProps {
  children?: ReactNode;
  onTapUserItemProp?: (user: LMUserUI) => void;
  handleScreenBackPressProp?: () => void;
}

export interface PostLikesCustomisableMethodsContext {
  onTapUserItemProp?: (user: LMUserUI) => void;
  handleScreenBackPressProp?: () => void;
}

const PostLikesCustomisableMethodsContext = createContext<
  PostLikesCustomisableMethodsContext | undefined
>(undefined);

export const usePostLikesCustomisableMethodsContext = () => {
  const context = useContext(PostLikesCustomisableMethodsContext);
  if (!context) {
    throw new Error(
      "usePostLikesCustomisableMethodsContext must be used within an PostLikesCustomisableMethodsContext"
    );
  }
  return context;
};

export const PostLikesCustomisableMethodsContextProvider = ({
  children,
  onTapUserItemProp,
  handleScreenBackPressProp,
}: PostLikesCallbacksContextProps) => {
  const contextValues: PostLikesCustomisableMethodsContext = {
    onTapUserItemProp,
    handleScreenBackPressProp,
  };

  return (
    <PostLikesCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </PostLikesCustomisableMethodsContext.Provider>
  );
};
