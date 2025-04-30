import { View, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import React from "react";
import { styles } from "./styles";
import {
  CreatePostContextValues,
  CreatePostCustomisableMethodsContextProvider,
  useCreatePostContext,
} from "../../context";
import { LMAttachmentViewData, RootStackParamList } from "../../models";
import LMLoader from "../../components/LMLoader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PollCustomisableMethodsContextProvider } from "../../context/pollCustomisableCallback";
import { CommunityConfigs } from "../../communityConfigs";
import pluralizeOrCapitalize from "../../utils/variables";
import { WordAction } from "../../enums/Variables";
import LMCreatePostAttachmentSelection from "../../components/LMCreatePost/LMCreatePostAttachmentSelection";
import LMCreatePostHeader from "../../components/LMCreatePost/LMCreatePostHeader";
import LMUserProfileSection from "../../components/LMCreatePost/LMUserProfileSection";
import LMCreatePostTopics from "../../components/LMCreatePost/LMCreatePostTopics";
import LMCreatePostHeading from "../../components/LMCreatePost/LMCreatePostHeading";
import LMCreatePostMedia from "../../components/LMCreatePost/LMCreatePostMedia";
import LMCreatePostTextInput from "../../components/LMCreatePost/LMCreatePostTextInput";
import LMCreatePostUserTagging from "../../components/LMCreatePost/LMCreatePostUserTagging";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import STYLES from "../../constants/Styles";

interface CreatePostProps {
  children?: React.ReactNode;
  navigation?: NativeStackNavigationProp<RootStackParamList, "CreatePost">;
  route?: {
    key: string;
    name: string;
    params: { postId: string };
    path: undefined;
  };
  handleGalleryProp?: (type: string) => void;
  handleDocumentProp?: () => void;
  handlePollProp?: () => void;
  onPostClickProp?: (
    allMedia: Array<LMAttachmentViewData>,
    linkData: Array<LMAttachmentViewData>,
    content: string,
    heading: string,
    topics: string[],
    poll: any,
    isAnonymous?: boolean
  ) => void;
  handleScreenBackPressProp?: () => void;
  onPollEditClicked?: any;
  onPollClearClicked?: any;
  isHeadingEnabled: boolean;
  hideTopicsViewCreate?: boolean;
  hideTopicsViewEdit?: boolean;
  isAnonymousPostAllowed?: boolean;
  handleOnAnonymousPostClickedProp?: () => void,
  hintTextForAnonymous?: string
}

const CreatePost = ({
  children,
  handleDocumentProp,
  handlePollProp,
  handleGalleryProp,
  onPostClickProp,
  handleScreenBackPressProp,
  onPollEditClicked,
  onPollClearClicked,
  isHeadingEnabled = false,
  hideTopicsViewCreate = false,
  hideTopicsViewEdit = false,
  isAnonymousPostAllowed = false,
  handleOnAnonymousPostClickedProp,
  hintTextForAnonymous
}: CreatePostProps) => {
  return (
    <PollCustomisableMethodsContextProvider
      onPollEditClicked={onPollEditClicked}
      onPollClearClicked={onPollClearClicked}
    >
      <CreatePostCustomisableMethodsContextProvider
        isHeadingEnabled={isHeadingEnabled}
        isAnonymousPostAllowed={isAnonymousPostAllowed}
        handleDocumentProp={handleDocumentProp}
        handlePollProp={handlePollProp}
        handleGalleryProp={handleGalleryProp}
        onPostClickProp={onPostClickProp}
        handleScreenBackPressProp={handleScreenBackPressProp}
        hideTopicsViewCreate={hideTopicsViewCreate}
        hideTopicsViewEdit={hideTopicsViewEdit}
        handleOnAnonymousPostClickedProp={handleOnAnonymousPostClickedProp}
        hintTextForAnonymous={hintTextForAnonymous}
      >
        <CreatePostComponent children={children} />
      </CreatePostCustomisableMethodsContextProvider>
    </PollCustomisableMethodsContextProvider>
  );
};


const CreatePostComponent = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ViewWrapper>
        {children}
      </ViewWrapper>
    </SafeAreaView>
  )
};


export { CreatePost };

function ViewWrapper({ children }: any) {
  const { isKeyboardVisible } = useCreatePostContext();
  
  const {
    iOSKeyboardAvoidingViewOffset,
    androidKeyboardAvoidingViewOffset,
    applyKeyboardAvoidingViewOffset,
    disableKeyboardAvoidingViewCreatePostScreen,
    addZeroOffsetOnKeyboardHidIOS,
    addZeroOffsetOnKeyboardHideAndroid
  } = STYLES.$KeyboardAvoidingViewOffset;

  const { top } = useSafeAreaInsets()

  if (disableKeyboardAvoidingViewCreatePostScreen) {
    return (
      <View style={styles.container}>
        {children}
      </View>
    )
  } else {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={(Platform.OS == "android" && !addZeroOffsetOnKeyboardHideAndroid) ? (isKeyboardVisible) : true}
        behavior={Platform.OS == "android" ? "height" : "padding"}
        keyboardVerticalOffset={
          applyKeyboardAvoidingViewOffset ?
            Platform.OS == "ios" ?
              addZeroOffsetOnKeyboardHidIOS ?
                (isKeyboardVisible ? iOSKeyboardAvoidingViewOffset ?? top : 0) :
                (iOSKeyboardAvoidingViewOffset ?? top) :
              addZeroOffsetOnKeyboardHideAndroid ?
                (isKeyboardVisible ? androidKeyboardAvoidingViewOffset ?? StatusBar.currentHeight : 0) :
                (androidKeyboardAvoidingViewOffset ?? StatusBar.currentHeight)
            : 0
        }
      >
        {children}
      </KeyboardAvoidingView>
    )
  }
}

