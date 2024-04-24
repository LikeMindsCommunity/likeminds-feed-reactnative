import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from "react";
import {  initialState as LoginInitialState, LoginReducerState } from "./reducers/loginReducer";
import { initialState as FeedInitialState, FeedReducerState, feedReducer } from "./reducers/feedReducer";
import {  initialState as LoaderInitialState, LoaderReducerState } from "./reducers/loaderReducer";
import { initialState as PostDetailInitialState, PostDetailReducerState, postDetailReducer } from "./reducers/postDetailReducer";
import { useReducerWithMiddleware } from "../hooks/useReducerWithMiddleware";
import { rootReducer } from "./store";
import { CreatePostReducerState , initialState as CreatePostInitialState} from "./reducers/createPostReducer";
import { PostLikesReducerState, initialState as PostLikesInitialState } from "./reducers/postLikesReducer";
import { NotificationReducerState , initialState as NotificationInitialState} from "./reducers/notificationReducer";

// Define your state type
export interface ContextState {
  login: LoginReducerState;
  feed: FeedReducerState;
  loader: LoaderReducerState;
  postDetail: PostDetailReducerState;
  createPost: CreatePostReducerState;
  postLikes: PostLikesReducerState;
  notification: NotificationReducerState
}
interface AppContextProps {
  state: ContextState;
  dispatch: Dispatch<any>;
}

// Create your context
const Context = createContext<AppContextProps | undefined>(undefined);


export const ContextProvider = ({ children }) => {
  const initialState: ContextState = {
    login: LoginInitialState,
    feed: FeedInitialState,
    loader: LoaderInitialState,
    postDetail: PostDetailInitialState,
    createPost: CreatePostInitialState,
    postLikes: PostLikesInitialState,
    notification: NotificationInitialState
  };

  const [state, dispatch] = useReducerWithMiddleware(rootReducer as any, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};


// Custom hook to access the combined state and dispatch function
export const useContextState = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useCombinedState must be used within a CombinedStateProvider"
    );
  }
  return context;
};