import React, { createContext, ReactNode, useContext } from "react";

export interface PollCallbacksContextProps {
  children?: ReactNode;
  onSubmitButtonClicked?: any;
  onAddPollOptionsClicked?: any;
  onPollOptionClicked?: any;
  onPollEditClicked?: any;
  onPollClearClicked?: any;
}

export interface PollCustomisableMethodsContext {
  onSubmitButtonClicked?: any;
  onAddPollOptionsClicked?: any;
  onPollOptionClicked?: any;
  onPollEditClicked?: any;
  onPollClearClicked?: any;
}

const PollCustomisableMethodsContext = createContext<
  PollCustomisableMethodsContext | undefined
>(undefined);

export const usePollCustomisableMethodsContext = () => {
  const context = useContext(PollCustomisableMethodsContext);
  if (!context) {
    throw new Error(
      "usePollCustomisableMethodsContext must be used within an PollCustomisableMethodsContext"
    );
  }
  return context;
};

export const PollCustomisableMethodsContextProvider = ({
  children,
  onSubmitButtonClicked,
  onAddPollOptionsClicked,
  onPollOptionClicked,
  onPollEditClicked,
  onPollClearClicked,
}: PollCallbacksContextProps) => {
  const contextValues: PollCustomisableMethodsContext = {
    onSubmitButtonClicked,
    onAddPollOptionsClicked,
    onPollOptionClicked,
    onPollEditClicked,
    onPollClearClicked,
  };

  return (
    <PollCustomisableMethodsContext.Provider value={contextValues}>
      {children}
    </PollCustomisableMethodsContext.Provider>
  );
};
