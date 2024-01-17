import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { loginReducer, initialState } from "./reducers/loginReducer";
import { ActionTypes } from "./actions/types";
import { feedInitialState, feedReducer } from "./reducers/feedReducer";
import { loaderReducer, loaderInitialState } from "./reducers/loaderReducer";

// Define your state type
interface AppState {
  login: initialState;
  feed: feedInitialState;
  loader: loaderInitialState;
}

export interface AppAction {
  type: ActionTypes;
  payload?: any;
}

// Combine your reducers
const rootReducer = (state: AppState, action: AppAction): AppState => ({
  login: loginReducer(state.login, action),
  feed: feedReducer(state.feed, action),
  loader: loaderReducer(state.loader, action),
});

// Create your context
const AppContext = createContext<
  { state: AppState; dispatch: React.Dispatch<AppAction> } | undefined
>(undefined);

// Create a context provider component
interface AppProviderProps {
  children: ReactNode;
}

const defaultState = {
  login: {},
  feed: [],
  loader: { count: 0 },
};

const AppProvider: React.FC<AppProviderProps> = ({
  children,
}: AppProviderProps) => {
  const [state, dispatch] = useReducer(rootReducer, defaultState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Create custom hooks to use the context
const useAppSelector = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppSelector must be used within an AppProvider");
  }
  return context.state;
};

const useAppDispatch = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppDispatch must be used within an AppProvider");
  }
  return context.dispatch;
};

export { AppProvider, useAppSelector, useAppDispatch };