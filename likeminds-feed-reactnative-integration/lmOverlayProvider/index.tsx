import React from "react";
import { LMOverlayProviderProps } from "./types";
import { LMFeedProvider } from "../lmFeedProvider";
import { StyleSheet, View } from "react-native";
import { ContextProvider } from "../store/contextStore";

export const LMOverlayProvider: any = ({
  myClient,
  children,
  accessToken,
  refreshToken,
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
}: LMOverlayProviderProps) => {
  return (
    <ContextProvider>
      <LMFeedProvider
        myClient={myClient}
        accessToken={accessToken}
        refreshToken={refreshToken}
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
