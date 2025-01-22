import React, { useEffect } from "react";
import { LMOverlayProviderProps } from "./types";
import { LMFeedProvider } from "../lmFeedProvider";
import { StyleSheet, View } from "react-native";
import { ContextProvider } from "../store/contextStore";
import { LMCoreCallbacks, LMSDKCallbacksImplementations } from "../setupFeed";

export const LMOverlayProvider: any = ({
  myClient,
  children,
  apiKey,
  userName,
  userUniqueId,
  accessToken,
  refreshToken,
  lmFeedInterface,
  callbackClass,
  videoCallback,
  videoCarouselCallback,
  isUserOnboardingRequired = false,
  handleOnBoardingUserGestureBackPress,
}: // Create a prop for passing LMCoreCallbacks
LMOverlayProviderProps) => {
  useEffect(() => {
    myClient.setLMSDKCallbacks(
      new LMSDKCallbacksImplementations(callbackClass, myClient)
    );
  }, [callbackClass, myClient]);
  return (
    <ContextProvider>
      <LMFeedProvider
        myClient={myClient}
        apiKey={apiKey}
        userName={userName}
        userUniqueId={userUniqueId}
        accessToken={accessToken}
        refreshToken={refreshToken}
        lmFeedInterface={lmFeedInterface}
        videoCallback={videoCallback}
        videoCarouselCallback={videoCarouselCallback}
        isUserOnboardingRequired={isUserOnboardingRequired}
        handleOnBoardingUserGestureBackPress={
          handleOnBoardingUserGestureBackPress
        }
        // add a prop for adding lmcorecallbacks
      >
        <View style={styles.flexStyling}>{children}</View>
      </LMFeedProvider>
    </ContextProvider>
  );
};

const styles = StyleSheet.create({
  flexStyling: {
    flex: 1,
  },
});
