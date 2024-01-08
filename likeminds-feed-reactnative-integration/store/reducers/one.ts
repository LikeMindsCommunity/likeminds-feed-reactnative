import { AppAction } from "../AppContext";

// reducer1.ts
  export interface initialState {
    count: number;
    type: string;
  }
  export const counterReducer = (
    state: initialState,
    action: AppAction,
  ): initialState => {
    switch (action.type) {
      case 'INCREMENT':
        return {...state, count: state.count + 1};
      case 'DECREMENT':
        return {...state, count: state.count - 1};
      default:
        return state;
    }
  };
  