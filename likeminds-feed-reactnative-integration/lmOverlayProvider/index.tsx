
import React from "react";
import { LMOverlayProviderProps } from "./types";
import {LMFeedProvider} from '../lmFeedProvider'
import { StyleSheet, View } from "react-native";
import { ContextProvider } from "../store/contextStore";

export const LMOverlayProvider = ({
  myClient,
  children,
  userName,
  userUniqueId,
  universalFeedStyle,
  postListStyle,
  loaderStyle,
  postDetailStyle,
  postLikesListStyle,
  createPostStyle,
  notificationFeedStyle
}: LMOverlayProviderProps) => {
  return (
    <ContextProvider children={children}>
      <LMFeedProvider
        myClient={myClient}
        userName={userName}
        userUniqueId={userUniqueId}
        children={children}
        universalFeedStyle={universalFeedStyle}
        postDetailStyle={postDetailStyle}
        postListStyle={postListStyle}
        postLikesListStyle={postLikesListStyle}
        loaderStyle={loaderStyle}
        createPostStyle={createPostStyle}
        notificationFeedStyle={notificationFeedStyle}
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
