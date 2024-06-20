import React, { useEffect } from "react";
import { LMOverlayProviderProps } from "./types";
import { LMFeedProvider } from "../lmFeedProvider";
import { StyleSheet, View } from "react-native";
import { ContextProvider } from "../store/contextStore";
import { LMCoreCallbacks, LMSDKCallbacksImplementations } from "../setupFeed";

export const LMOverlayProvider: any = ({
  myClient,
  children,
  accessToken,
  refreshToken,
  apiKey,
  userName,
  userUniqueId,
  lmFeedInterface,
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
  callbackClass,
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
        accessToken={accessToken}
        refreshToken={refreshToken}
        apiKey={apiKey}
        userName={userName}
        userUniqueId={userUniqueId}
        universalFeedStyle={universalFeedStyle}
        postDetailStyle={postDetailStyle}
        postListStyle={postListStyle}
        postLikesListStyle={postLikesListStyle}
        loaderStyle={loaderStyle}
        createPostStyle={createPostStyle}
        notificationFeedStyle={notificationFeedStyle}
        topicsStyle={topicsStyle}
        pollStyle={pollStyle}
        createPollStyle={createPollStyle}
        lmFeedInterface={lmFeedInterface}
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
