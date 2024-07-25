import React, { createContext, ReactNode, useContext } from "react";

export interface CreatePollCallbacksContextProps {
  children?: ReactNode;
  onPollExpiryTimeClicked?: () => void;
  onAddOptionClicked?: () => void;
  onPollOptionCleared?: (index: any) => void;
  onPollCompleteClicked?: () => void;
}

export interface CreatePollCustomisableMethodsContext {
  onPollExpiryTimeClicked?: () => void;
  onAddOptionClicked?: () => void;
  onPollOptionCleared?: (index: any) => void;
  onPollCompleteClicked?: () => void;
}

const CreatePollCustomisableMethodsContext = createContext<
  CreatePollCustomisableMethodsContext | undefined
>(undefined);

export const useCreatePollCustomisableMethodsContext = () => {
  const context = useContext(CreatePollCustomisableMethodsContext);
  if (!context) {
    throw new Error(
      "useCreatePollCustomisableMethodsContext must be used within a CreatePollCustomisableMethodsContextProvider"
    );
  }
  return context;
};

export const CreatePollCustomisableMethodsContextProvider = ({
  children,
  onPollExpiryTimeClicked,
  onAddOptionClicked,
  onPollOptionCleared,
  onPollCompleteClicked,
}: CreatePollCallbacksContextProps) => {
  const contextValues: CreatePollCustomisableMethodsContext = {
    onPollExpiryTimeClicked,
    onAddOptionClicked,
    onPollOptionCleared,
    onPollCompleteClicked,
  };

  return (
    <CreatePollCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </CreatePollCustomisableMethodsContext.Provider>
  );
};
