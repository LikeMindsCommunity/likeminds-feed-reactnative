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
import { Client } from "../client";
import { LMFeedProviderProps, ThemeContextProps } from "./types";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getMemberState, initiateUser } from "../store/actions/login";
import { LMToast } from "../components";

// Create the theme context
export const LMFeedStylesContext = createContext<ThemeContextProps | undefined>(
  undefined
);

// Create a context for LMChatProvider
const LMFeedContext = createContext<LMFeedClient | undefined>(undefined);

// Create a hook to use the LMChatContext
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
  themeStyles,
  universalFeedStyle,
  postListStyle,
  loaderStyle,
  postDetailStyle,
  postLikesListStyle,
  createPostStyle
}: LMFeedProviderProps): React.JSX.Element => {
  const [isInitiated, setIsInitiated] = useState(false);
  const dispatch  = useAppDispatch();
  const showToast = useAppSelector(state => state.loader.isToast);

  useEffect(() => {
    //setting client in Client class
    Client.setMyClient(myClient);
    Credentials.setCredentials(userName, userUniqueId);

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
      if (initiateResponse) {
        // calling getMemberState API
        await dispatch(getMemberState());
      }
      setIsInitiated(true);
    };
    callInitApi();
  }, []);

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
          createPostStyle
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
