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
}: LMOverlayProviderProps) => {
  return (
    <ContextProvider>
      <LMFeedProvider
        myClient={myClient}
        userName={userName}
        userUniqueId={userUniqueId}
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
