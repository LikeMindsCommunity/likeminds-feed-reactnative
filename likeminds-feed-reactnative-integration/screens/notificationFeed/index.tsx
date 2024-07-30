import { SafeAreaView } from "react-native";
import React from "react";
import {
  NotificationFeedContextProvider,
  NotificationFeedCustomisableMethodsContextProvider,
  useNotificationFeedContext,
  useNotificationFeedCustomisableMethodsContext,
} from "../../context";
import { LMFeedNotificationFeedListView } from "../notificationsList";
import LMHeader from "../../components/LMHeader";
import { LMActivityUI, RootStackParamList } from "../../models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { styles } from "./styles";
import { useLMFeedStyles } from "../../lmFeedProvider";

interface NotificationFeedProps {
  children?: React.ReactNode;
  navigation?: NativeStackNavigationProp<
    RootStackParamList,
    "NotificationFeed"
  >;
  route?: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
  onNotificationItemClickedProp?: (notification: LMActivityUI) => void;
  handleScreenBackPressProp?: () => void;
}

const LMFeedNotificationFeedScreen = ({
  onNotificationItemClickedProp,
  handleScreenBackPressProp,
}: NotificationFeedProps) => {
  return (
    <NotificationFeedCustomisableMethodsContextProvider
      onNotificationItemClickedProp={onNotificationItemClickedProp}
      handleScreenBackPressProp={handleScreenBackPressProp}
    >
      <NotificationFeed />
    </NotificationFeedCustomisableMethodsContextProvider>
  );
};
const NotificationFeed = () => {
  const { handleScreenBackPress } = useNotificationFeedContext();
  const { handleScreenBackPressProp } =
    useNotificationFeedCustomisableMethodsContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const { notificationFeedStyle } = LMFeedContextStyles;
  const customScreenHeader = notificationFeedStyle?.screenHeader;
  return (
    <SafeAreaView style={styles.mainContainer}>
      {notificationFeedStyle?.customScreenHeader ? (
        notificationFeedStyle?.customScreenHeader
      ) : (
        <LMHeader
          {...customScreenHeader}
          showBackArrow={
            customScreenHeader?.showBackArrow != undefined
              ? customScreenHeader?.showBackArrow
              : true
          }
          heading={
            customScreenHeader?.heading
              ? customScreenHeader?.heading
              : "Notifications"
          }
          onBackPress={() => {
            handleScreenBackPressProp
              ? handleScreenBackPressProp()
              : handleScreenBackPress();
          }}
        />
      )}
      <LMFeedNotificationFeedListView />
    </SafeAreaView>
  );
};

export { LMFeedNotificationFeedScreen };
