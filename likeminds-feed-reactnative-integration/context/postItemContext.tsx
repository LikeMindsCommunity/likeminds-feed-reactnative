import React, { createContext, ReactNode, useContext } from "react";
import { LMPostUI } from "../models";
import { LMPostHeaderProps } from "../components/LMPost/LMPostHeader/types";
import { LMPostFooterProps } from "../components/LMPost/LMPostFooter/types";
import { LMPostContentProps } from "../components/LMPost/LMPostContent/types";
import { LMPostMediaProps } from "../components/LMPost/LMPostMedia/types";

interface LMPostContextProps {
  children?: ReactNode;
  navigation: any;
  post: LMPostUI;
  headerProps?: LMPostHeaderProps;
  footerProps?: LMPostFooterProps;
  contentProps?: LMPostContentProps;
  mediaProps?: LMPostMediaProps;
}

export interface LMPostContextValues {
  navigation: any;
  children: ReactNode;
  post: LMPostUI;
  headerProps?: LMPostHeaderProps;
  footerProps?: LMPostFooterProps;
  contentProps?: LMPostContentProps;
  mediaProps?: LMPostMediaProps;
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
}: LMPostContextProps) => {
  const contextValues: LMPostContextValues = {
    navigation,
    children,
    post,
    headerProps,
    contentProps,
    footerProps,
    mediaProps,
  };

  return (
    <LMPostContext.Provider value={contextValues}>
      {children}
    </LMPostContext.Provider>
  );
};
