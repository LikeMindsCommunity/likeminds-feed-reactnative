import React, { createContext, ReactNode, useContext } from "react";
import { LMPostViewData } from "../models";
import { LMPostHeaderProps } from "../components/LMPost/LMPostHeader/types";
import { LMPostFooterProps } from "../components/LMPost/LMPostFooter/types";
import { LMPostContentProps } from "../components/LMPost/LMPostContent/types";
import { LMPostMediaProps } from "../components/LMPost/LMPostMedia/types";

interface LMPostContextProps {
  children?: ReactNode;
  navigation: any;
  post: LMPostViewData;
  highlight: string;
  headerProps?: LMPostHeaderProps;
  footerProps?: LMPostFooterProps;
  contentProps?: LMPostContentProps;
  mediaProps?: LMPostMediaProps;
  isHeadingEnabled: boolean;
  isTopResponse: boolean;
  customFooter?: ReactNode;
  hideTopicsView?: boolean;
  customWidgetPostView?: ReactNode;
}

export interface LMPostContextValues {
  navigation: any;
  children?: ReactNode;
  post: LMPostViewData;
  highlight: string;
  headerProps?: LMPostHeaderProps;
  footerProps?: LMPostFooterProps;
  contentProps?: LMPostContentProps;
  mediaProps?: LMPostMediaProps;
  isHeadingEnabled: boolean;
  isTopResponse: boolean;
  customFooter?: ReactNode;
  hideTopicsView?: boolean;
  customWidgetPostView?: ReactNode;
}

const LMPostContext = createContext<LMPostContextValues | undefined>(undefined);

export const useLMPostContext = () => {
  const context = useContext(LMPostContext);
  if (!context) {
    throw new Error(
      "useLMPostContext must be used within an LMPostContextProvider"
    );
  }
  return context;
};

export const LMPostContextProvider = ({
  children,
  navigation,
  post,
  highlight = "",
  headerProps,
  footerProps,
  contentProps,
  mediaProps,
  isHeadingEnabled = false,
  isTopResponse = false,
  hideTopicsView = false,
  customFooter,
  customWidgetPostView,
}: LMPostContextProps) => {
  const contextValues: LMPostContextValues = {
    navigation,
    children,
    post,
    highlight,
    headerProps,
    contentProps,
    footerProps,
    mediaProps,
    isHeadingEnabled,
    isTopResponse,
    customFooter,
    hideTopicsView,
    customWidgetPostView,
  };

  return (
    <LMPostContext.Provider value={contextValues}>
      {children}
    </LMPostContext.Provider>
  );
};
