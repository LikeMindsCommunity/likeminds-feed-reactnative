import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

import {
  APP_TITLE,
  CREATE_POST_PERMISSION,
  DOCUMENT_ATTACHMENT_TYPE,
  IMAGE_ATTACHMENT_TYPE,
  POST_UPLOADING,
  POST_UPLOAD_INPROGRESS,
  VIDEO_ATTACHMENT_TYPE,
} from "../../constants/Strings";
import { CREATE_POST, TOPIC_FEED } from "../../constants/screenNames";
// @ts-ignore the lib do not have TS declarations yet
import _ from "lodash";
import { PostsList } from "../postsList";
import { useLMFeedStyles } from "../../lmFeedProvider";
import { useAppDispatch } from "../../store/store";
import {
  UniversalFeedContextProvider,
  UniversalFeedContextValues,
  UniversalFeedCustomisableMethodsContextProvider,
  useUniversalFeedContext,
  useUniversalFeedCustomisableMethodsContext,
} from "../../context";
import STYLES from "../../constants/Styles";
import { showToastMessage } from "../../store/actions/toast";
import { LMHeader, LMImage, LMLoader, LMVideo } from "../../components";
import { LMIcon } from "../../uiComponents";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LMMenuItemsUI, RootStackParamList } from "../../models";

interface UniversalFeedProps {
  children: React.ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList, "UniversalFeed">;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
  postLikeHandlerProp: (id: string) => void;
  savePostHandlerProp: (id: string, saved?: boolean) => void;
  selectPinPostProp: (id: string, pinned?: boolean) => void;
  selectEditPostProp: (id: string) => void;
  onSelectCommentCountProp: (id: string) => void;
  onTapLikeCountProps: (id: string) => void;
  handleDeletePostProps: (
    visible: boolean,
    postId: string,
    isCM: boolean
  ) => void;
  handleReportPostProps: (postId: string) => void;
  newPostButtonClickProps: () => void;
  onOverlayMenuClickProp: (
    event: {
      nativeEvent: { pageX: number; pageY: number };
    },
    menuItems: LMMenuItemsUI,
    postId: string
  ) => void;
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
  newPostButtonClickProps,
  onOverlayMenuClickProp,
}: UniversalFeedProps) => {
  return (
    <UniversalFeedCustomisableMethodsContextProvider
      postLikeHandlerProp={postLikeHandlerProp}
      savePostHandlerProp={savePostHandlerProp}
      selectEditPostProp={selectEditPostProp}
      selectPinPostProp={selectPinPostProp}
      onSelectCommentCountProp={onSelectCommentCountProp}
      onTapLikeCountProps={onTapLikeCountProps}
      handleDeletePostProps={handleDeletePostProps}
      handleReportPostProps={handleReportPostProps}
      newPostButtonClickProps={newPostButtonClickProps}
      onOverlayMenuClickProp={onOverlayMenuClickProp}
    >
      <UniversalFeedComponent />
    </UniversalFeedCustomisableMethodsContextProvider>
  );
};

const UniversalFeedComponent = () => {
  const dispatch = useAppDispatch();
  const {
    feedData,
    showCreatePost,
    postUploading,
    navigation,
    uploadingMediaAttachment,
    uploadingMediaAttachmentType,
    newPostButtonClick,
  }: // selectedTopics
  UniversalFeedContextValues = useUniversalFeedContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const { universalFeedStyle, loaderStyle } = LMFeedContextStyles;
  const { newPostButtonClickProps } =
    useUniversalFeedCustomisableMethodsContext();

  // console.log("selectedTopics",selectedTopics);

  // useEffect(() => {
  //   console.log("selectedTopicsUniversal",selectedTopics);
  // },[selectedTopics])

  const [items, setItems] = useState([
    {
      id: "65f306a3cde6ba99e44c3586",
      name: "topic name",
    },
    {
      id: "65f306c0cde6ba99e44c3587",
      name: "topic name-3",
    },
    {
      id: "65f306c0cde6ba99e44c3588",
      name: "topic name-1",
    },
    {
      id: "65f306c0cde6ba99e44c3589",
      name: "topic name-2",
    },
    {
      id: "66225e7a03a62c83c4e3d019",
      name: "Books hey there",
    },
  ]);

  //   const selectedTopic = [{
  //     id:1,
  //     name:'book'
  //   },
  //   {
  //     id:2,
  //     name:'country'
  //   },
  //   {
  //     id:3,
  //     name:'hello'
  //   }
  // ]

  const handleAllTopicPress = () => {
    /* @ts-ignore */
    return navigation.navigate(TOPIC_FEED);
  };

  const removeItem = (index: any) => {
    const newItems = [...items]; // Create a copy of the array
    newItems.splice(index, 1); // Remove the item at the specified index
    setItems(newItems); // Update the state with the new array
  };

  return (
    <View style={styles.mainContainer}>
      {/* header */}
      <LMHeader heading={APP_TITLE} {...universalFeedStyle?.screenHeader} />
      {/* all topics filter */}
      {items.length > 0 ? (
        <ScrollView style={{ flexGrow: 0, margin: 10 }} horizontal={true}>
          <View style={{ flexDirection: "row" }}>
            {items.map((item, index) => (
              <View key={index} style={{ margin: 5 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    padding: 10,
                  }}
                >
                  <Text style={{ marginRight: 5, color: "black" }}>
                    {item?.name}
                  </Text>
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    {/* Your cross icon component */}
                    <Text style={{ color: "black" }}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <TouchableOpacity onPress={() => handleAllTopicPress()}>
          <Text style={{ fontSize: 16, color: "#222020", margin: 20 }}>
            All Topics
          </Text>
        </TouchableOpacity>
      )}
      {/* post uploading section */}
      {postUploading && (
        <View style={styles.postUploadingView}>
          <View style={styles.uploadingPostContentView}>
            {/* post uploading media preview */}
            {uploadingMediaAttachmentType === IMAGE_ATTACHMENT_TYPE && (
              <LMImage
                imageUrl={uploadingMediaAttachment}
                imageStyle={styles.uploadingImageStyle}
                boxStyle={styles.uploadingImageVideoBox}
                width={styles.uploadingImageVideoBox.width}
                height={styles.uploadingImageVideoBox.height}
              />
            )}
            {uploadingMediaAttachmentType === VIDEO_ATTACHMENT_TYPE && (
              <LMVideo
                videoUrl={uploadingMediaAttachment}
                videoStyle={styles.uploadingVideoStyle}
                boxStyle={styles.uploadingImageVideoBox}
                width={styles.uploadingImageVideoBox.width}
                height={styles.uploadingImageVideoBox.height}
                showControls={false}
                boxFit="contain"
              />
            )}
            {uploadingMediaAttachmentType === DOCUMENT_ATTACHMENT_TYPE && (
              <LMIcon
                assetPath={require("../../assets/images/pdf_icon3x.png")}
                iconStyle={styles.uploadingDocumentStyle}
                height={styles.uploadingPdfIconSize.height}
                width={styles.uploadingPdfIconSize.width}
              />
            )}
            <Text style={styles.postUploadingText}>{POST_UPLOADING}</Text>
          </View>
          {/* progress loader */}
          <LMLoader
            size={
              Platform.OS === "ios"
                ? STYLES.$LMLoaderSizeiOS
                : STYLES.$LMLoaderSizeAndroid
            }
          />
        </View>
      )}
      {/* posts list section */}
      <PostsList items={items} />
      {/* create post button section */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.newPostButtonView,
          showCreatePost
            ? styles.newPostButtonEnable
            : styles.newPostButtonDisable,
          universalFeedStyle?.newPostButtonStyle,
        ]}
        // handles post uploading status and member rights to create post
        onPress={() =>
          newPostButtonClickProps
            ? newPostButtonClickProps()
            : newPostButtonClick()
        }
      >
        <Image
          source={require("../../assets/images/add_post_icon3x.png")}
          resizeMode={"contain"}
          style={styles.newPostButtonIcon}
          {...universalFeedStyle?.newPostIcon}
        />
        <Text
          style={[styles.newPostText, universalFeedStyle?.newPostButtonText]}
        >
          NEW POST
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export { UniversalFeed };
