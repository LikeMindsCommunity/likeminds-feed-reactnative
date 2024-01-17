import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { styles } from "./styles";
import { LMHeader, LMPostUI } from "likeminds_feed_reactnative_ui";
import { NavigationService } from "../../navigation";
import { APP_TITLE } from "../../constants/Strings";
import { CREATE_POST } from "../../constants/screenNames";
// @ts-ignore the lib do not have TS declarations yet
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "../../store/AppContext";
import { Client } from "../../client";
import PostsList from "../postsList";
import { useLMFeedStyles } from "../../lmFeedProvider";

const UniversalFeed = React.memo(() => {
  const myClient = Client.myClient;
  const dispatch  = useAppDispatch();
  const state  = useAppSelector();
  const feedData = state.feed.feed;
  const accessToken = state.login.community.accessToken;
  const memberData = state.login.member;
  const memberRight = state.login.memberRights;
  const [postUploading, setPostUploading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(true);
  const listRef = useRef<FlashList<LMPostUI>>(null);
  const LMFeedContextStyles = useLMFeedStyles();
  const { universalFeedStyle, loaderStyle } = LMFeedContextStyles;
  // todo: handle later
  // const {mediaAttachmemnts, linkAttachments, postContent} = useAppSelector(
  //   state => state.createPost,
  //   );
  // const uploadingMediaAttachmentType = mediaAttachmemnts[0]?.attachmentType;
  // const uploadingMediaAttachment = mediaAttachmemnts[0]?.attachmentMeta.url;

  // this calls the getFeed api whenever the page number gets changed
  useEffect(() => {
    if (accessToken) {
      // handles members right
      if (memberData?.state !== 1) {
        const members_right = memberRight?.find(
          (item: any) => item?.state === 9
        );

        if (members_right?.isSelected === false) {
          setShowCreatePost(false);
        }
      }
    }
  }, [accessToken]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* header */}
      <LMHeader heading={APP_TITLE} {...universalFeedStyle?.screenHeader} />
      {/* posts list section */}
      <PostsList />
      {/* create post button section */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={feedData?.length >= 0 ? false : true}
        style={[
          styles.newPostButtonView,
          showCreatePost
            ? styles.newPostButtonEnable
            : styles.newPostButtonDisable,
          universalFeedStyle?.newPostButtonStyle,
        ]}
        // handles post uploading status and member rights to create post
        onPress={
          () =>
            showCreatePost
              ? postUploading
                ? dispatch()
                : // todo: handle toast later
                  // showToastMessage({
                  //   isToast: true,
                  //   message: POST_UPLOAD_INPROGRESS,
                  // }) as any,
                  NavigationService.navigate(CREATE_POST)
              : dispatch()
          // todo: handle toast later
          //   showToastMessage({
          //     isToast: true,
          //     message: CREATE_POST_PERMISSION,
          //   }) as any,
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
    </SafeAreaView>
  );
});

export default UniversalFeed;
