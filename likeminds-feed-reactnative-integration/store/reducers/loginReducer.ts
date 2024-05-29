import { INITIATE_API_SUCCESS, MEMBER_STATE_SUCCESS, VALIDATE_API_SUCCESS } from "../types/types";

export interface LoginReducerState {
  community: {};
  accessToken: 'aaa';
  memberRights: [];
  member: {};
}
export const initialState: LoginReducerState = {
  community: {},
  accessToken: 'aaa',
  memberRights: [],
  member: {},
};
export const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIATE_API_SUCCESS: {
      const { community = {} } = action.body;
      return { ...state, community: community , accessToken : action.body.accessToken};
    }
    case MEMBER_STATE_SUCCESS: {
      const { member = {}, memberRights = [] } = action.body;
      return { ...state, member: member, memberRights: memberRights };
    }
    default:
      return state;
  }
};
