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
import { LMFeedClient } from "@likeminds.community/feed-js";
import { Client } from "../client";
import { LMFeedProviderProps, ThemeContextProps } from "./types";
import { useAppDispatch, useAppSelector } from "../store/AppContext";
import { INIT_API_SUCCESS, PROFILE_DATA_SUCCESS } from "../store/actions/types";
import { UniversalFeed} from "../screens";

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
  loaderStyle
}: LMFeedProviderProps): React.JSX.Element => {
  const [isInitiated, setIsInitiated] = useState(false);
  const dispatch  = useAppDispatch();
  const state  = useAppSelector();

  useEffect(() => {
    //setting client in Client class
    Client.setMyClient(myClient);

    // storing myClient followed by community details
    const callInitApi = async () => {
      const payload = {
        uuid: userUniqueId, // uuid
        userName: userName, // user name
        isGuest: false,
      };

      Credentials.setCredentials(userName, userUniqueId);

      const initiateApiResponse = await myClient?.initiateUser(payload);

      dispatch({
        type: INIT_API_SUCCESS,
        payload: { community: initiateApiResponse.getData() },
      });

      const getMemberStateResponse = await myClient?.getMemberState();

      dispatch({
        type: PROFILE_DATA_SUCCESS,
        payload: {
          member: getMemberStateResponse.getData()?.member,
          memberRights: getMemberStateResponse.getData()?.member_rights,
        },
      });
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
      <LMFeedStylesContext.Provider value={{ universalFeedStyle, postListStyle, loaderStyle }}>
        <UniversalFeed />
        <View style={styles.flexStyling}>{children}</View>
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
