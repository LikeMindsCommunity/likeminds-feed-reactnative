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
} from "@likeminds.community/feed-js";
import { LMFeedProviderProps, ThemeContextProps } from "./types";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getMemberState, initiateUser } from "../store/actions/login";
import { LMToast } from "../components";
import { CallBack } from "../callBacks/callBackClass";
import { Client } from "../client";
import { CommunityConfigs } from "../communityConfigs";

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
}: LMFeedProviderProps): React.JSX.Element => {
  const [isInitiated, setIsInitiated] = useState(false);
  const dispatch = useAppDispatch();
  const showToast = useAppSelector((state) => state.loader.isToast);

  useEffect(() => {
    //setting client in Client class
    Client.setMyClient(myClient);
    Credentials.setCredentials(userName, userUniqueId);
    if (lmFeedInterface) {
      CallBack.setLMFeedInterface(lmFeedInterface);
    }

    // storing myClient followed by community details
    const callInitApi = async () => {
      const initiateResponse = await dispatch(
        initiateUser(
          InitiateUserRequest.builder()
            .setUUID(Credentials.userUniqueId)
            .setIsGuest(false)
            .setUserName(Credentials.username)
            .build(),
          true
        )
      );
      if (initiateResponse !== undefined && initiateResponse !== null) {
        // calling getMemberState API
        await dispatch(getMemberState());
      }
      setIsInitiated(true);
    };
    callInitApi();
  }, []);

  useEffect(() => {
    const callGetCommunityConfigurations = async () => {
      const response = await myClient?.getCommunityConfigurations();
      CommunityConfigs.setCommunityConfigs(
        /* @ts-ignore */
        response?.data?.communityConfigurations
      );
    };
    if (isInitiated) callGetCommunityConfigurations();
  }, [isInitiated]);

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
