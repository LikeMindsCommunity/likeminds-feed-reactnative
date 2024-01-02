import {StyleSheet, View} from 'react-native';
import React from 'react';
import LMPostHeader from '../LMPostHeader';
import LMPostContent from '../LMPostContent';
import LMPostMedia from '../LMPostMedia';
import LMPostFooter from '../LMPostFooter';
import {LMPostProps} from './types';
import layout from '../../../utils/layout';
import STYLES from '../../../constants/constants';
import { ATTACHMENT_TYPE } from '../../../constants/strings';

const LMPost = ({
  post,
  headerProps,
  contentProps,
  mediaProps,
  footerProps,
}: LMPostProps) => {
  //creating header props as per customization
  const updatedHeaderProps = {
    post: post,
    profilePicture: {
      fallbackText: {children: post?.user?.name},
      imageUrl: post?.user?.imageUrl,
      size: headerProps?.profilePicture?.size,
      onTap: headerProps?.profilePicture?.onTap,
      fallbackTextBoxStyle: headerProps?.profilePicture?.fallbackTextBoxStyle,
      profilePictureStyle: headerProps?.profilePicture?.profilePictureStyle,
    },
    postMenu: {
      postId: post?.id,
      menuItems: post?.menuItems,
      onSelected: headerProps?.postMenu.onSelected
        ? headerProps.postMenu.onSelected
        : () => null,
      modalPosition: headerProps?.postMenu.modalPosition
        ? headerProps?.postMenu.modalPosition
        : {x: 0, y: 0},
      modalVisible: headerProps?.postMenu.modalVisible
        ? headerProps.postMenu.modalVisible
        : false,
      onCloseModal: headerProps?.postMenu.onCloseModal
        ? headerProps.postMenu.onCloseModal
        : () => null,
      menuItemTextStyle: headerProps?.postMenu.menuItemTextStyle,
      menuViewStyle: headerProps?.postMenu.menuViewStyle,
      backdropColor: headerProps?.postMenu.backdropColor,
    },
    onTap: headerProps?.onTap ? headerProps.onTap : () => null,
    createdAt: {
      text: `${post?.createdAt}`,
      textStyle: headerProps?.createdAt?.textStyle,
    },
    titleText: {
      text: post?.user?.name,
      textStyle: headerProps?.titleText?.textStyle,
    },
    isEdited: post?.isEdited,
    showMemberStateLabel: headerProps?.showMemberStateLabel,
    memberState: headerProps?.memberState,
    memberStateViewStyle: headerProps?.memberStateViewStyle,
    memberStateTextStyle: headerProps?.memberStateTextStyle,
    postHeaderViewStyle: headerProps?.postHeaderViewStyle,
    isPinned: post?.isPinned,
    showMenuIcon: headerProps?.showMenuIcon,
    pinIcon: headerProps?.pinIcon,
    menuIcon: headerProps?.menuIcon,
  };

  //creating footer props as per customization
  const updatedFooterProps = {
    isLiked: footerProps?.isLiked ? footerProps.isLiked : post?.isLiked,
    isSaved: post?.isSaved,
    likesCount: post?.likesCount,
    commentsCount: post?.commentsCount,
    showBookMarkIcon: footerProps?.showBookMarkIcon,
    showShareIcon: footerProps?.showShareIcon,
    footerBoxStyle: footerProps?.footerBoxStyle,
    likeIconButton: footerProps?.likeIconButton,
    commentButton: footerProps?.commentButton,
    likeTextButton: footerProps?.likeTextButton,
    saveButton: footerProps?.saveButton,
    shareButton: footerProps?.shareButton,
  };

  //creating post content props as per customization
  const updatedContentProps = {
    text: post?.text,
    linkData: post?.attachments,
    textStyle: contentProps?.textStyle,
    linkStyle: contentProps?.linkStyle,
    visibleLines: contentProps?.visibleLines,
    postContentViewStyle: contentProps?.postContentViewStyle,
    showMoreText: contentProps?.showMoreText,
  };
  //creating post media props as per customization
  const updatedMediaProps = {
    attachments: post?.attachments ? post?.attachments : [],
    postMediaStyle: mediaProps?.postMediaStyle,
    imageProps: mediaProps?.imageProps,
    videoProps: mediaProps?.videoProps,
    carouselProps: mediaProps?.carouselProps,
    documentProps: mediaProps?.documentProps,
    linkPreviewProps: mediaProps?.linkPreviewProps,
  };
  return (
    <View style={styles.mainContainer}>
      {/* post header */}
      <LMPostHeader {...updatedHeaderProps} />
      {/* post content */}
      {(post?.text ||
        post?.attachments?.find(
          item => item?.attachmentType === ATTACHMENT_TYPE.LINK,
        )?.attachmentType === ATTACHMENT_TYPE.LINK) && (
        <LMPostContent {...updatedContentProps} />
      )}
      {/* post media */}
      {post?.attachments && post?.attachments.length > 0 && (
        <LMPostMedia {...updatedMediaProps} />
      )}
      {/* post footer */}
      <LMPostFooter {...updatedFooterProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: layout.window.width,
    backgroundColor: STYLES.$BACKGROUND_COLORS.LIGHT,
    marginBottom: 10,
    paddingTop: 10,
  },
});

export default LMPost;
