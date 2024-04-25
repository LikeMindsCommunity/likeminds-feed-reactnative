import React from "react";
import { LMOverlayProviderProps } from "./types";
import { LMFeedProvider } from "../lmFeedProvider";
import { StyleSheet, View } from "react-native";
import { ContextProvider } from "../store/contextStore";

export const LMOverlayProvider = ({
  myClient,
  children,
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
}: LMOverlayProviderProps) => {
  return (
    <ContextProvider>
      <LMFeedProvider
        myClient={myClient}
        userName={userName}
        userUniqueId={userUniqueId}
        universalFeedStyle={universalFeedStyle}
        postDetailStyle={postDetailStyle}
        postListStyle={postListStyle}
        postLikesListStyle={postLikesListStyle}
        loaderStyle={loaderStyle}
        createPostStyle={createPostStyle}
        notificationFeedStyle={notificationFeedStyle}
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
