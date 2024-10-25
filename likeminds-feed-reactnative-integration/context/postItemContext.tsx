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
  headerProps?: LMPostHeaderProps;
  footerProps?: LMPostFooterProps;
  contentProps?: LMPostContentProps;
  mediaProps?: LMPostMediaProps;
  isHeadingEnabled: boolean;
  isTopResponse: boolean;
  customFooter?: ReactNode;
}

export interface LMPostContextValues {
  navigation: any;
  children?: ReactNode;
  post: LMPostViewData;
  headerProps?: LMPostHeaderProps;
  footerProps?: LMPostFooterProps;
  contentProps?: LMPostContentProps;
  mediaProps?: LMPostMediaProps;
  isHeadingEnabled: boolean;
  isTopResponse: boolean;
  customFooter?: ReactNode;
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
  headerProps,
  footerProps,
  contentProps,
  mediaProps,
  isHeadingEnabled = false,
  isTopResponse = false,
  customFooter,
}: LMPostContextProps) => {
  const contextValues: LMPostContextValues = {
    navigation,
    children,
    post,
    headerProps,
    contentProps,
    footerProps,
    mediaProps,
    isHeadingEnabled,
    isTopResponse,
    customFooter,
  };

  return (
    <LMPostContext.Provider value={contextValues}>
      {children}
    </LMPostContext.Provider>
  );
};
