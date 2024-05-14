import { LMAttachmentUI } from "../models";
import React, { createContext, ReactNode, useContext } from "react";

export interface CreatePostCallbacksContextProps {
  children?: ReactNode;
  handleGalleryProp: (type: string) => void;
  handleDocumentProp: () => void;
  handlePollProp: () => void;
  onPostClickProp: (
    allMedia: Array<LMAttachmentUI>,
    linkData: Array<LMAttachmentUI>,
    content: string,
    topics: string[]
  ) => void;
  handleScreenBackPressProp: () => void;
}

export interface CreatePostCustomisableMethodsContext {
  handleGalleryProp: (type: string) => void;
  handleDocumentProp: () => void;
  handlePollProp: () => void;
  onPostClickProp: (
    allMedia: Array<LMAttachmentUI>,
    linkData: Array<LMAttachmentUI>,
    content: string,
    topics: string[]
  ) => void;
  handleScreenBackPressProp: () => void;
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
}: CreatePostCallbacksContextProps) => {
  const contextValues: CreatePostCustomisableMethodsContext = {
    handleGalleryProp,
    handleDocumentProp,
    handlePollProp,
    onPostClickProp,
    handleScreenBackPressProp,
  };

  return (
    <CreatePostCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </CreatePostCustomisableMethodsContext.Provider>
  );
};
