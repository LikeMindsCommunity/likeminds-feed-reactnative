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
} from "@likeminds.community/feed-rn";
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
import { CommunityConfigs } from "../communityConfigs";
import { updateVariables } from "../constants/Strings";
import {
  VideoCallback,
  VideoCarouselCallback,
} from "../components/LMMedia/LMVideo/types";
import { useNavigation } from "@react-navigation/native";
import { USER_ONBOARDING_SCREEN } from "../constants/screenNames";

interface LMFeedContextProps {
  myClient: LMFeedClient;
  videoCallback?: VideoCallback;
  videoCarouselCallback?: VideoCarouselCallback;
  onBoardUser: boolean;
  isUserOnboardingRequired?: boolean;
  apiKey?: string;
  userUniqueId?: string;
  isInitiated: boolean;
  setIsInitiated: React.Dispatch<React.SetStateAction<boolean>>;
  setOnboardUser: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnBoardingUserGestureBackPress?: () => void;
  withAPIKeySecurity?: boolean;
  setWithAPIKeySecurity?: React.Dispatch<React.SetStateAction<boolean>>;
  callInitiateAPI: (
    onBoardingUserName?: string,
    imageUrl?: string,
    isUserOnboarded?: boolean
  ) => void;
  callGetCommunityConfigurations: () => void;
  callIsUserOnboardingDone: () => Promise<boolean>;
}

// Create a context for LMFeedProvider
const LMFeedContext = createContext<LMFeedContextProps | undefined>(undefined);

// Create a hook to use the LMFeedContext
export const useLMFeed = () => {
  const context = useContext(LMFeedContext);
  if (!context) {
    throw new Error("useLMFeed must be used within an LMFeedProvider");
  }
  return context;
};

export const LMFeedProvider = ({
  myClient,
  children,
  apiKey,
  userName,
  userUniqueId,
  accessToken,
  refreshToken,
  lmFeedInterface,
  videoCallback,
  videoCarouselCallback,
  isUserOnboardingRequired = false,
  handleOnBoardingUserGestureBackPress,
}: LMFeedProviderProps): React.JSX.Element => {
  const [isInitiated, setIsInitiated] = useState(false);
  const [onBoardUser, setOnboardUser] = useState(false);
  const [withAPIKeySecurity, setWithAPIKeySecurity] = useState(false);
  const dispatch = useAppDispatch();
  const showToast = useAppSelector((state) => state.loader.isToast);

  const callGetCommunityConfigurations = async () => {
    const response = await myClient?.getCommunityConfigurations();
    CommunityConfigs.setCommunityConfigs(
      /* @ts-ignore */
      response?.data?.communityConfigurations
    );
    /*@ts-ignore*/
    updateVariables(response?.data?.communityConfigurations);
  };

  const callIsUserOnboardingDone = async () => {
    try {
      let isUserSet: any = await Client.myClient?.getIsUserOnboardingDone();
      if (isUserSet?.data == null) return false;
      return isUserSet.data;
    } catch (error) {
      return false;
    }
  };

  const callValidateApi = async (
    accessToken,
    refreshToken,
    isUserOnboarded = false
  ) => {
    const validateResponse = await dispatch(
      validateUser(
        ValidateUserRequest.builder()
          .setAccessToken(accessToken)
          .setRefreshToken(refreshToken)
          .build(),
        true
      )
    );

    if (validateResponse !== undefined && validateResponse !== null) {
      // calling getMemberState API
      if (isUserOnboardingRequired && !isUserOnboarded) {
        setOnboardUser(true);
      } else {
        await dispatch(getMemberState());
        await callGetCommunityConfigurations();
        setIsInitiated(true);
      }
    }
  };

  async function callInitiateAPI(
    onBoardingUserName?: string,
    imageUrl?: string,
    isUserOnboarded: boolean = false
  ) {
    const { accessToken, refreshToken } = await myClient?.getTokens();
    if (accessToken && refreshToken) {
      callValidateApi(accessToken, refreshToken, isUserOnboarded);
      return;
    }
    const initiateResponse: any = await dispatch(
      initiateUser(
        isUserOnboardingRequired
          ? InitiateUserRequest.builder()
              .setUserName(onBoardingUserName ? onBoardingUserName : "")
              .setImageUrl(imageUrl ? imageUrl : "")
              .setApiKey(apiKey ? apiKey : "")
              .setUUID(userUniqueId ? userUniqueId : "")
              .build()
          : InitiateUserRequest.builder()
              .setUserName(userName ? userName : "")
              .setApiKey(apiKey ? apiKey : "")
              .setUUID(userUniqueId ? userUniqueId : "")
              .build(),
        true
      )
    );
    if (initiateResponse !== undefined && initiateResponse !== null) {
      // calling getMemberState API
      await dispatch(getMemberState());
      await myClient.setTokens(
        initiateResponse?.accessToken,
        initiateResponse?.refreshToken
      );
      await callGetCommunityConfigurations();
      setIsInitiated(true);
    }
  }

  useEffect(() => {
    //setting client in Client class
    Client.setMyClient(myClient);
    if (lmFeedInterface) {
      CallBack.setLMFeedInterface(lmFeedInterface);
    }
    // storing myClient followed by community details

    (async () => {
      if (isUserOnboardingRequired) {
        const isUserOnboarded = await callIsUserOnboardingDone();

        if (apiKey && userUniqueId) {
          setWithAPIKeySecurity(false);
          setOnboardUser(true);
        } else if (accessToken && refreshToken) {
          setWithAPIKeySecurity(true);
          callValidateApi(accessToken, refreshToken, isUserOnboarded);
        }
      } else if (apiKey && userName && userUniqueId) {
        callInitiateAPI();
      } else if (accessToken && refreshToken) {
        callValidateApi(accessToken, refreshToken);
      }
    })();
  }, [accessToken, refreshToken]);

  const contextValues: LMFeedContextProps = {
    myClient: myClient,
    videoCallback: videoCallback,
    videoCarouselCallback: videoCarouselCallback,
    onBoardUser,
    isUserOnboardingRequired,
    isInitiated,
    withAPIKeySecurity,
    apiKey,
    userUniqueId,

    setOnboardUser,
    setIsInitiated,
    setWithAPIKeySecurity,
    callInitiateAPI,
    callGetCommunityConfigurations,
    callIsUserOnboardingDone,
    handleOnBoardingUserGestureBackPress,
  };

  return isInitiated || (isUserOnboardingRequired && onBoardUser) ? (
    <LMFeedContext.Provider value={contextValues}>
      <View style={styles.flexStyling}>{children}</View>
      {showToast && <LMToast />}
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
