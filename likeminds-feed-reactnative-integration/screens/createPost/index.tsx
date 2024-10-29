import { View, SafeAreaView, ScrollView } from "react-native";
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
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};


export { CreatePost };
