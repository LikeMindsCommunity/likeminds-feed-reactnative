import { Alert } from "react-native";
import { CALL_API } from "../apiMiddleware";
import {
  INITIATE_API,
  INITIATE_API_FAILED,
  INITIATE_API_SUCCESS,
  MEMBER_STATE_DATA,
  MEMBER_STATE_FAILED,
  MEMBER_STATE_SUCCESS,
  VALIDATE_API,
  VALIDATE_API_FAILED,
  VALIDATE_API_SUCCESS,
} from "../types/types";
import { ValidateUserRequest } from "@likeminds.community/feed-js";
import { Client } from "../../client";

// validateUser API action
export const validateUser =
  (payload: ValidateUserRequest, showLoader: boolean) => () => {
    try {
      return {
        type: VALIDATE_API_SUCCESS,
        [CALL_API]: {
          func: Client.myClient.validateUser(payload),
          body: payload,
          types: [VALIDATE_API, VALIDATE_API_SUCCESS, VALIDATE_API_FAILED],
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
