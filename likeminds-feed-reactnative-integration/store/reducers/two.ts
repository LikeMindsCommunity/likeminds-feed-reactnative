import {AppAction } from "../AppContext";

// reducer2.ts

    // Add more action types as needed
  export interface userInit {
    user: {name: string} | null,
    age:number
  }

  export const userReducer = (
  state: userInit,
  action: AppAction,
): userInit => {
  switch (action.type) {
    case 'SET_USER':
      return {...state, user: { name: action.payload }};
      case 'SET_AGE':
        return {...state, age: action.payload};
    default:
      return state;
  }
};
  