import { Alert } from "react-native";
import { CALL_API } from "../apiMiddleware";
import {
  INITIATE_API,
  INITIATE_API_FAILED,
  INITIATE_API_SUCCESS,
  MEMBER_STATE_DATA,
  MEMBER_STATE_FAILED,
  MEMBER_STATE_SUCCESS,
} from "../types/types";
import { InitiateUserRequest } from "@likeminds.community/feed-js";
import { Client } from "../../client";

// initiateUser API action
export const initiateUser =
  (payload: InitiateUserRequest, showLoader: boolean) => () => {
    try {
      return {
        type: INITIATE_API_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.initiateUser(payload),
          body: payload,
          types: [INITIATE_API, INITIATE_API_SUCCESS, INITIATE_API_FAILED],
          showLoader: showLoader,
        },
      };
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

// get memberState API action
export const getMemberState = () => () => {
  try {
    return {
      type: MEMBER_STATE_SUCCESS,
      [CALL_API]: {
        func: Client.myClient.getMemberState(),
        body: null,
        types: [MEMBER_STATE_DATA, MEMBER_STATE_SUCCESS, MEMBER_STATE_FAILED],
        showLoader: true,
      },
    };
  } catch (error) {
    Alert.alert(`${error}`);
  }
};
