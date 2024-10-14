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
    topics: string[],
    poll: any
  ) => void;
  handleScreenBackPressProp?: () => void;
  onPollEditClicked: any;
  onPollClearClicked: any;
  isHeadingEnabled: boolean;
}

const CreatePost = ({
  handleDocumentProp,
  handlePollProp,
  handleGalleryProp,
  onPostClickProp,
  handleScreenBackPressProp,
  onPollEditClicked,
  onPollClearClicked,
  isHeadingEnabled = false,
}: CreatePostProps) => {
  return (
    <PollCustomisableMethodsContextProvider
      onPollEditClicked={onPollEditClicked}
      onPollClearClicked={onPollClearClicked}
    >
      <CreatePostCustomisableMethodsContextProvider
        isHeadingEnabled={isHeadingEnabled}
        handleDocumentProp={handleDocumentProp}
        handlePollProp={handlePollProp}
        handleGalleryProp={handleGalleryProp}
        onPostClickProp={onPostClickProp}
        handleScreenBackPressProp={handleScreenBackPressProp}
      >
        <CreatePostComponent />
      </CreatePostCustomisableMethodsContextProvider>
    </PollCustomisableMethodsContextProvider>
  );
};

const CreatePostComponent = () => {
  let { postToEdit, showOptions, postDetail }: CreatePostContextValues =
    useCreatePostContext();

  // this renders the post detail UI
  const uiRenderForPost = () => {
    return (
      <ScrollView
        style={
          postToEdit
            ? styles.scrollViewStyleWithoutOptions
            : showOptions
            ? styles.scrollViewStyleWithOptions
            : styles.scrollViewStyleWithoutOptions
        }
      >
        {/* user profile section */}
        <LMUserProfileSection />

        {/* post topics section */}
        <LMCreatePostTopics />

        {/* post heading section */}
        <LMCreatePostHeading />

        {/* text input field */}
        <LMCreatePostTextInput />

        {/* users tagging list */}
        <LMCreatePostUserTagging />

        {/* selected media section */}
        <LMCreatePostMedia />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* screen header section*/}
      <LMCreatePostHeader />

      {/* handles the UI to be rendered for edit post and create post */}
      {!postToEdit ? (
        uiRenderForPost()
      ) : postDetail?.id ? (
        uiRenderForPost()
      ) : (
        // loader view section
        <View style={styles.rowAlignMent}>
          <LMLoader />
        </View>
      )}
      {/* selection options section */}
      <LMCreatePostAttachmentSelection />
    </SafeAreaView>
  );
};

export { CreatePost };
