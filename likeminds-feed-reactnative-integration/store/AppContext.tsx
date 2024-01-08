import React, {createContext, useReducer, useContext, ReactNode} from 'react';
import {counterReducer, initialState} from './reducers/one';
import {userInit, userReducer} from './reducers/two';
import { ActionTypes } from './actions/types';

// Define your state type
interface AppState {
  counter: initialState;
  user: userInit;
}

export interface AppAction {
  type: ActionTypes;
  payload?: any;
}

// Combine your reducers
const rootReducer = (state: AppState, action: AppAction): AppState => ({
  counter: counterReducer(state.counter, action),
  user: userReducer(state.user, action),
});

// Create your context
const AppContext = createContext<
  {state: AppState; dispatch: React.Dispatch<AppAction>} | undefined
>(undefined);

// Create a context provider component
interface AppProviderProps {
  children: ReactNode;
}

const initState = {
  counter: {count: 0, type: ''},
  user: {user: null, age: 0},
};

const AppProvider: React.FC<AppProviderProps> = ({
  children,
}: AppProviderProps) => {
  const [state, dispatch] = useReducer(rootReducer, initState);

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
