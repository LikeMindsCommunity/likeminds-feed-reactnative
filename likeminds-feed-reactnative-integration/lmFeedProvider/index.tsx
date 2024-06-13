import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import STYLES from "../constants/Styles";
import { StyleSheet, View } from "react-native";
import { Credentials } from "../credentials";
import {
  InitiateUserRequest,
  LMFeedClient,
  ValidateUserRequest,
} from "@likeminds.community/feed-rn-beta";
import { LMFeedProviderProps, ThemeContextProps } from "./types";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  getMemberState,
  initiateUser,
  validateUser,
} from "../store/actions/login";
import { LMToast } from "../components";
import { CallBack } from "../callBacks/callBackClass";
import { Client } from "../client";
import { LMCoreCallbacks, LMSDKCallbacksImplementations } from "../setupFeed";

// Create the theme context
export const LMFeedStylesContext = createContext<ThemeContextProps | undefined>(
  undefined
);

// Create a context for LMFeedProvider
const LMFeedContext = createContext<LMFeedClient | undefined>(undefined);

// Create a hook to use the LMFeedContext
export const useLMFeed = () => {
  const context = useContext(LMFeedContext);
  if (!context) {
    throw new Error("useLMFeed must be used within an LMFeedProvider");
  }
  return context;
};

export const useLMFeedStyles = () => {
  const context = useContext(LMFeedStylesContext);
  if (!context) {
    throw new Error("useLMFeedStyles must be used within an LMFeedProvider");
  }
  return context;
};

export const LMFeedProvider = ({
  myClient,
  children,
  accessToken,
  refreshToken,
  apiKey,
  userName,
  userUniqueId,
  lmFeedInterface,
  themeStyles,
  universalFeedStyle,
  postListStyle,
  loaderStyle,
  postDetailStyle,
  postLikesListStyle,
  createPostStyle,
  notificationFeedStyle,
  topicsStyle,
  pollStyle,
  createPollStyle,
  getUserFromLocalDB
}: LMFeedProviderProps): React.JSX.Element => {
  const [isInitiated, setIsInitiated] = useState(false);
  const dispatch = useAppDispatch();
  const showToast = useAppSelector((state) => state.loader.isToast);
  // useEffect(() => {
  //   // add lmcorecallbacks which you recieved from prop to client
  //   // myClient.setLMSDKCallbacks() is function m set krdio
  // });

  // useEffect(() => {
  //   const lmSdkImplementation = new LMSDKCallbacksImplementations(
  //     // TODO this below implementation of LMCoreCallbacks. This class will be decalred on example layer and the instance of which will be passed as prop
  //     new LMCoreCallbacks(
  //       (a: string, b: string) => {
  //         console.log("its working");
  //       },
  //       // In this function there will be implementation of initiateuser from client
  //       async () => {
  //         return {
  //           accessToken: accessToken,
  //           refreshToken: refreshToken,
  //         };
  //       }
  //     ),
  //     myClient as any
  //   );
  //   return myClient.setLMSDKCallbacks(
  //     lmSdkImplementation.onAccessTokenExpiredAndRefreshed(
  //       accessToken as string,
  //       refreshToken as string
  //     ),
  //     lmSdkImplementation.onRefreshTokenExpired(getUserFromLocalDB)
  //   );
  // }, []);

  useEffect(() => {
    //setting client in Client class
    Client.setMyClient(myClient);
    if (lmFeedInterface) {
      CallBack.setLMFeedInterface(lmFeedInterface);
    }
    // storing myClient followed by community details
    const callValidateApi = async () => {
      const validateResponse = await dispatch(
        validateUser(
          ValidateUserRequest.builder()
            .setaccessToken(accessToken)
            .setrefreshToken(refreshToken)
            .build(),
          true
        )
      );

      if (validateResponse !== undefined && validateResponse !== null) {
        // calling getMemberState API
        await dispatch(getMemberState());
      }
      setIsInitiated(true);
    };

    async function callInitiateAPI() {
      const initiateResponse: any = await dispatch(
        initiateUser(
          InitiateUserRequest.builder()
            .setUserName(userName)
            .setApiKey(apiKey)
            .setUUID(userUniqueId)
            .build(),
          true
        )
      );
      if (initiateResponse !== undefined && initiateResponse !== null) {
        await myClient.setAccessTokenInLocalStorage(
          initiateResponse?.accessToken
        );
        await myClient.setRefreshTokenInLocalStorage(
          initiateResponse?.refreshToken
        );
      }
    }

    if (accessToken && refreshToken) {
      callValidateApi();
    } else if (apiKey && userName && userUniqueId) {
      callInitiateAPI();
    }
  }, [accessToken, refreshToken]);

  useMemo(() => {
    if (themeStyles) {
      STYLES.setTheme(themeStyles);
    }
  }, []);

  return isInitiated ? (
    <LMFeedContext.Provider value={myClient}>
      <LMFeedStylesContext.Provider
        value={{
          universalFeedStyle,
          postListStyle,
          loaderStyle,
          postDetailStyle,
          postLikesListStyle,
          createPostStyle,
          notificationFeedStyle,
          topicsStyle,
          pollStyle,
          createPollStyle,
        }}
      >
        <View style={styles.flexStyling}>{children}</View>
        {showToast && <LMToast />}
      </LMFeedStylesContext.Provider>
    </LMFeedContext.Provider>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  flexStyling: {
    flex: 1,
  },
});
