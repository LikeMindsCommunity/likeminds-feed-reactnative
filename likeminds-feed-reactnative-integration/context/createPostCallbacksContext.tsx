import { LMAttachmentViewData } from "../models";
import React, { createContext, ReactNode, useContext } from "react";

export interface CreatePostCallbacksContextProps {
  children?: ReactNode;
  handleGalleryProp?: (type: string) => void;
  handleDocumentProp?: () => void;
  handlePollProp?: () => void;
  onPostClickProp?: (
    allMedia: Array<LMAttachmentViewData>,
    linkData: Array<LMAttachmentViewData>,
    content: string,
    topics: string[],
    poll: any
  ) => void;
  handleScreenBackPressProp?: () => void;
  isHeadingEnabled: boolean;
  hideTopicsViewCreate?: boolean;
  hideTopicsViewEdit?: boolean;
}

export interface CreatePostCustomisableMethodsContext {
  handleGalleryProp?: (type: string) => void;
  handleDocumentProp?: () => void;
  handlePollProp?: () => void;
  onPostClickProp?: (
    allMedia: Array<LMAttachmentViewData>,
    linkData: Array<LMAttachmentViewData>,
    content: string,
    topics: string[],
    poll: any
  ) => void;
  handleScreenBackPressProp?: () => void;
  isHeadingEnabled: boolean;
  hideTopicsViewCreate?: boolean;
  hideTopicsViewEdit?: boolean;
}

const CreatePostCustomisableMethodsContext = createContext<
  CreatePostCustomisableMethodsContext | undefined
>(undefined);

export const useCreatePostCustomisableMethodsContext = () => {
  const context = useContext(CreatePostCustomisableMethodsContext);
  if (!context) {
    throw new Error(
      "useCreatePostCustomisableMethodsContext must be used within an CreatePostCustomisableMethodsContext"
    );
  }
  return context;
};

export const CreatePostCustomisableMethodsContextProvider = ({
  children,
  handleGalleryProp,
  handleDocumentProp,
  handlePollProp,
  onPostClickProp,
  handleScreenBackPressProp,
  isHeadingEnabled,
  hideTopicsViewCreate,
  hideTopicsViewEdit
}: CreatePostCallbacksContextProps) => {
  const contextValues: CreatePostCustomisableMethodsContext = {
    handleGalleryProp,
    handleDocumentProp,
    handlePollProp,
    onPostClickProp,
    handleScreenBackPressProp,
    isHeadingEnabled,
    hideTopicsViewCreate,
    hideTopicsViewEdit
  };

  return (
    <CreatePostCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </CreatePostCustomisableMethodsContext.Provider>
  );
};
