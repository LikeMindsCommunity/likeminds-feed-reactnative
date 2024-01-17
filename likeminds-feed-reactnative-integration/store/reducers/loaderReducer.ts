import { START_LOADING, STOP_LOADING } from "../actions/types";

export interface loaderInitialState {
  count: number,
};

export function loaderReducer(state :loaderInitialState, action: any) {
  switch (action.type) {
    case START_LOADING: {
      return {...state, count: ++state.count};
    }
    case STOP_LOADING: {
      return {...state, count: Math.max(0, --state.count)};
    }
    default:
      return state;
  }
}
