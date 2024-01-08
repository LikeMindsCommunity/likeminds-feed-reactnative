import { AppAction } from "../AppContext";
import { INIT_API_SUCCESS, PROFILE_DATA_SUCCESS } from "../actions/types";

export interface initialState {
  community: {};
  memberRights: [];
  member: {};
}
export const loginReducer = (
  state: initialState,
  action: AppAction
): initialState => {
  switch (action.type) {
    case INIT_API_SUCCESS: {
      const {community = {}} = action.payload;
      return {...state, community: community};
    }
    case PROFILE_DATA_SUCCESS: {
      const {member = {}, memberRights = []} = action.payload;      
      return {...state, member: member, memberRights: memberRights};
    }
    default:
      return state;
  }
};
