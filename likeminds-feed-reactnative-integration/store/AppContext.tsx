import React, {createContext, useReducer, useContext, ReactNode} from 'react';
import {loginReducer, initialState} from './reducers/loginReducer';
import { ActionTypes } from './actions/types';

// Define your state type
interface AppState {
  login: initialState;
}

export interface AppAction {
  type: ActionTypes;
  payload?: any;
}

// Combine your reducers
const rootReducer = (state: AppState, action: AppAction): AppState => ({
  login: loginReducer(state.login, action),
});

// Create your context
const AppContext = createContext<
  {state: AppState; dispatch: React.Dispatch<AppAction>} | undefined
>(undefined);

// Create a context provider component
interface AppProviderProps {
  children: ReactNode;
}

const defaultState = {
  login: {}
};

const AppProvider: React.FC<AppProviderProps> = ({
  children,
}: AppProviderProps) => {
  const [state, dispatch] = useReducer(rootReducer, defaultState);

  return (
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook to use the context
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export {AppProvider, useAppContext};
