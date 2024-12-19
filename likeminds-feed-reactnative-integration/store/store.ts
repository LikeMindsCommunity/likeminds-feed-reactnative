import { useContextState } from "./contextStore";
import { createPostReducer } from "./reducers/createPostReducer";
import { feedReducer } from "./reducers/feedReducer";
import { loaderReducer } from "./reducers/loaderReducer";
import { loginReducer } from "./reducers/loginReducer";
import { notificationReducer } from "./reducers/notificationReducer";
import { postDetailReducer } from "./reducers/postDetailReducer";
import { postLikesReducer } from "./reducers/postLikesReducer";

// Combine multiple reducers into one
const combineReducers = (reducers) => (state, action) => {
  if (action.type === 'LM_RESET_STORE') {
    // Reset all reducers to their initial state
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](undefined, action); // Pass `undefined` to reset state
      return nextState;
    }, {});
  }

  return Object.keys(reducers).reduce((nextState, key) => {
    nextState[key] = reducers[key](state[key], action);
    return nextState;
  }, {});
};

export const rootReducer = combineReducers({
    feed: feedReducer,
    login: loginReducer,
    loader: loaderReducer,
    postDetail: postDetailReducer,
    createPost: createPostReducer,
    postLikes: postLikesReducer,
    notification: notificationReducer
});

export const useAppSelector = (selector) => {
  const { state } = useContextState();
  return selector(state);
};

export const useAppDispatch = () => {
  const { dispatch } = useContextState();
  return dispatch;
};