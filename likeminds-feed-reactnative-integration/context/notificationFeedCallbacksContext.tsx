import { LMActivityViewData } from "../models";
import React, { createContext, ReactNode, useContext } from "react";

export interface NotificationFeedCallbacksContextProps {
  children?: ReactNode;
  onNotificationItemClickedProp?: (notification: LMActivityViewData) => void;
  handleScreenBackPressProp?: () => void;
}

export interface NotificationFeedCustomisableMethodsContext {
  onNotificationItemClickedProp?: (notification: LMActivityViewData) => void;
  handleScreenBackPressProp?: () => void;
}

const NotificationFeedCustomisableMethodsContext = createContext<
  NotificationFeedCustomisableMethodsContext | undefined
>(undefined);

export const useNotificationFeedCustomisableMethodsContext = () => {
  const context = useContext(NotificationFeedCustomisableMethodsContext);
  if (!context) {
    throw new Error(
      "useNotificationFeedCustomisableMethodsContext must be used within an NotificationFeedCustomisableMethodsContext"
    );
  }
  return context;
};

export const NotificationFeedCustomisableMethodsContextProvider = ({
  children,
  onNotificationItemClickedProp,
  handleScreenBackPressProp,
}: NotificationFeedCallbacksContextProps) => {
  const contextValues: NotificationFeedCustomisableMethodsContext = {
    onNotificationItemClickedProp,
    handleScreenBackPressProp,
  };

  return (
    <NotificationFeedCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </NotificationFeedCustomisableMethodsContext.Provider>
  );
};
