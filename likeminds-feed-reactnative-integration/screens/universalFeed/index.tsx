import React, { ReactNode } from "react";
import { View } from "react-native";
import { styles } from "./styles";
import { UniversalFeedCustomisableMethodsContextProvider } from "../../context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LMMenuItemsViewData, RootStackParamList } from "../../models";
import { PollCustomisableMethodsContextProvider } from "../../context/pollCustomisableCallback";

interface UniversalFeedProps {
  children?: React.ReactNode;
  navigation?: NativeStackNavigationProp<RootStackParamList, "UniversalFeed">;
  route?: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
  isHeadingEnabled?: boolean;
  isTopResponse?: boolean;
  postLikeHandlerProp?: (id: string) => void;
  savePostHandlerProp?: (id: string, saved?: boolean) => void;
  selectPinPostProp?: (id: string, pinned?: boolean) => void;
  selectEditPostProp?: (id: string, post: any) => void;
  onSelectCommentCountProp?: (id: string) => void;
  onTapLikeCountProps?: (id: string) => void;
  handleDeletePostProps?: (visible: boolean, postId: string) => void;
  handleReportPostProps?: (postId: string) => void;
  handleHidePostProp?: (postId: string) => void,
  newPostButtonClickProps?: () => void;
  onSearchIconClickProp?: () => void;
  onOverlayMenuClickProp?: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    menuItems: LMMenuItemsViewData[],
    postId: string
  ) => void;
  onTapNotificationBellProp?: () => void;
  onSharePostClicked?: (id: string) => void;
  onSubmitButtonClicked?: any;
  onAddPollOptionsClicked?: any;
  onPollOptionClicked?: any;
  hideTopicsView?: boolean;
  onRetryPressProp?: () => void;
  onCancelPressProp?: () => void;
}

interface UniversalFeedComponentProps {
  children: ReactNode;
}

const UniversalFeed = ({
  navigation,
  route,
  children,
  postLikeHandlerProp,
  savePostHandlerProp,
  selectPinPostProp,
  selectEditPostProp,
  onSelectCommentCountProp,
  onTapLikeCountProps,
  handleDeletePostProps,
  handleReportPostProps,
  handleHidePostProp,
  newPostButtonClickProps,
  onOverlayMenuClickProp,
  onTapNotificationBellProp,
  onSharePostClicked,
  onSearchIconClickProp,
  onSubmitButtonClicked,
  onAddPollOptionsClicked,
  onCancelPressProp,
  onRetryPressProp,
  onPollOptionClicked,
  isHeadingEnabled = false,
  isTopResponse = false,
  hideTopicsView = false
}: UniversalFeedProps) => {
  return (
    <PollCustomisableMethodsContextProvider
      onSubmitButtonClicked={onSubmitButtonClicked}
      onAddPollOptionsClicked={onAddPollOptionsClicked}
      onPollOptionClicked={onPollOptionClicked}
    >
      <UniversalFeedCustomisableMethodsContextProvider
        postLikeHandlerProp={postLikeHandlerProp}
        savePostHandlerProp={savePostHandlerProp}
        selectEditPostProp={selectEditPostProp}
        selectPinPostProp={selectPinPostProp}
        onSelectCommentCountProp={onSelectCommentCountProp}
        onTapLikeCountProps={onTapLikeCountProps}
        handleHidePostProp={handleHidePostProp}
        onSearchIconClickProp={onSearchIconClickProp}
        handleDeletePostProps={handleDeletePostProps}
        handleReportPostProps={handleReportPostProps}
        newPostButtonClickProps={newPostButtonClickProps}
        onCancelPressProp={onCancelPressProp}
        onRetryPressProp={onRetryPressProp}
        onOverlayMenuClickProp={onOverlayMenuClickProp}
        onTapNotificationBellProp={onTapNotificationBellProp}
        onSharePostClicked={onSharePostClicked}
        isHeadingEnabled={isHeadingEnabled}
        isTopResponse={isTopResponse}
        hideTopicsView={hideTopicsView}
      >
        <UniversalFeedComponent children={children} />
      </UniversalFeedCustomisableMethodsContextProvider>
    </PollCustomisableMethodsContextProvider>
  );
};

const UniversalFeedComponent = ({ children }) => {
  return <View style={styles.mainContainer}>{children}</View>;
};

export { UniversalFeed };
