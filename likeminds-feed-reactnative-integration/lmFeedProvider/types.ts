import React from "react";
import { LMFeedClient } from "@likeminds.community/feed-js";
import { ViewStyle, TextStyle, ImageProps, ImageStyle } from "react-native";
import { LMHeaderProps, LMLoaderProps } from "../components";
import {
  LMButtonProps,
  LMIconProps,
  LMProfilePictureProps,
  LMTextProps,
} from "../uiComponents";

interface TextStyles {
  fontSize: number;
  fontStyle: string;
  fontFamily: string;
}

interface ThemeStyles {
  hue?: number;
  fontColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  lightBackgroundColor?: string;
}

// custom style interface for universal feed screen
interface UniversalFeedStyleProps {
  newPostButtonStyle?: ViewStyle;
  newPostButtonText?: TextStyle;
  newPostIcon?: ImageProps;
  screenHeader?: LMHeaderProps;
}

// custom style interface for post's list
interface PostListStyleProps {
  header?: {
    profilePicture?: {
      fallbackTextStyle?: TextStyle;
      size?: number;
      onTap?: () => void;
      fallbackTextBoxStyle?: ViewStyle;
      profilePictureStyle?: ImageStyle;
    };
    titleText?: TextStyle;
    createdAt?: TextStyle;
    pinIcon?: LMIconProps;
    menuIcon?: LMIconProps;
    showMemberStateLabel?: boolean;
    memberStateViewStyle?: ViewStyle;
    memberStateTextStyle?: TextStyle;
    postHeaderViewStyle?: ViewStyle;
    showMenuIcon?: boolean;
    onTap?: () => void;
    postMenu?: {
      menuItemTextStyle?: TextStyle;
      menuViewStyle?: ViewStyle;
      backdropColor?: string;
    };
  };
  footer?: {
    showBookMarkIcon?: boolean;
    showShareIcon?: boolean;
    saveButton?: {
      text?: LMTextProps;
      icon?: LMIconProps;
      onTap?: (value?: any) => void;
      placement?: "start" | "end";
      activeIcon?: LMIconProps;
      activeText?: LMTextProps;
      buttonStyle?: ViewStyle;
      isClickable?: boolean;
    };
    shareButton?: {
      text?: LMTextProps;
      icon?: LMIconProps;
      onTap?: (value?: any) => void;
      placement?: "start" | "end";
      activeIcon?: LMIconProps;
      activeText?: LMTextProps;
      buttonStyle?: ViewStyle;
      isClickable?: boolean;
    };
    likeIconButton?: {
      icon?: LMIconProps;
      activeIcon?: LMIconProps;
      onTap?: (value?: any) => void;
      buttonStyle?: ViewStyle;
      isClickable?: boolean;
    };
    likeTextButton?: {
      text?: TextStyle;
      onTap?: (value?: any) => void;
      buttonStyle?: ViewStyle;
      isClickable?: boolean;
    };
    commentButton?: {
      text?: TextStyle;
      icon?: LMIconProps;
      onTap?: (value?: any) => void;
      placement?: "start" | "end";
      buttonStyle?: ViewStyle;
      isClickable?: boolean;
    };
    footerBoxStyle?: ViewStyle;
  };
  postContent?: {
    textStyle?: TextStyle;
    visibleLines?: number;
    showMoreText?: LMTextProps;
    postContentViewStyle?: ViewStyle;
  };
  media?: {
    postMediaStyle?: ViewStyle;
    image?: {
      height?: number;
      width?: number;
      imageStyle?: ImageStyle;
      boxFit?: "center" | "contain" | "cover" | "repeat" | "stretch";
      boxStyle?: ViewStyle;
      aspectRatio?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
      loaderWidget?: React.ReactNode;
      errorWidget?: React.ReactNode;
      showCancel?: boolean;
      onCancel?: () => void;
      cancelButton?: {
        text?: LMTextProps;
        icon?: LMIconProps;
        onTap?: (value?: any) => void;
        placement?: "start" | "end";
        buttonStyle?: ViewStyle;
        isClickable?: boolean;
      };
    };
    video?: {
      height?: number;
      width?: number;
      videoStyle?: ViewStyle;
      boxFit?: "stretch" | "contain" | "cover" | "none";
      boxStyle?: ViewStyle;
      aspectRatio?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
      showControls?: boolean;
      looping?: boolean;
      loaderWidget?: React.ReactNode;
      errorWidget?: React.ReactNode;
      playButton?: React.ReactNode;
      pauseButton?: React.ReactNode;
      autoPlay?: boolean;
      showCancel?: boolean;
      onCancel?: () => void;
      cancelButton?: {
        text?: LMTextProps;
        icon?: LMIconProps;
        onTap?: (value?: any) => void;
        placement?: "start" | "end";
        buttonStyle?: ViewStyle;
        isClickable?: boolean;
      };
    };
    carousel?: {
      carouselStyle?: ViewStyle;
      paginationBoxStyle?: ViewStyle;
      activeIndicatorStyle?: ViewStyle;
      inactiveIndicatorStyle?: ViewStyle;
      showCancel?: boolean;
      onCancel?: () => void;
      cancelButton?: {
        text?: LMTextProps;
        icon?: LMIconProps;
        onTap?: (value?: any) => void;
        placement?: "start" | "end";
        buttonStyle?: ViewStyle;
        isClickable?: boolean;
      };
    };
    document?: {
      documentIcon?: LMIconProps;
      defaultIconSize?: number;
      showPageCount?: boolean;
      showDocumentSize?: boolean;
      showDocumentFormat?: boolean;
      documentTitleStyle?: TextStyle;
      documentDetailStyle?: TextStyle;
      documentViewStyle?: ViewStyle;
      onTap?: () => void;
      showCancel?: boolean;
      onCancel?: () => void;
      showMoreText?: boolean;
      showMoreTextStyle?: TextStyle;
      cancelButton?: {
        text?: LMTextProps;
        icon?: LMIconProps;
        onTap?: (value?: any) => void;
        placement?: "start" | "end";
        buttonStyle?: ViewStyle;
        isClickable?: boolean;
      };
    };
    linkPreview?: {
      onTap?: () => void;
      showLinkUrl?: boolean;
      linkPreviewBoxStyle?: ViewStyle;
      linkTitleStyle?: TextStyle;
      linkDescriptionStyle?: TextStyle;
      linkUrlStyle?: TextStyle;
      linkImageStyle?: ImageStyle;
      showDescription?: boolean;
      showImage?: boolean;
      showTitle?: boolean;
      showCancel?: boolean;
      onCancel?: () => void;
      cancelButton?: {
        text?: LMTextProps;
        icon?: LMIconProps;
        onTap?: (value?: any) => void;
        placement?: "start" | "end";
        buttonStyle?: ViewStyle;
        isClickable?: boolean;
      };
    };
  };
  noPostView?: ViewStyle;
  noPostText?: TextStyle;
  listStyle?: ViewStyle;
}

// custom style interface for loader
interface LoaderStyleProps {
  loader?: LMLoaderProps;
}

// custom style interface for post detail screen
interface PostDetailStyleProps {
  screenHeader?: LMHeaderProps;
  commentItemStyle?: {
    onTapViewMore?: () => void;
    commentUserNameStyle?: TextStyle;
    commentContentProps?: LMTextProps;
    replyTextProps?: {
      text?: LMTextProps;
      icon?: LMIconProps;
      onTap?: (value?: any) => void;
      placement?: "start" | "end";
      buttonStyle?: ViewStyle;
      isClickable?: boolean;
    };
    repliesCountTextStyle?: TextStyle;
    timeStampStyle?: TextStyle;
    viewMoreRepliesProps?: LMTextProps;
    onTapReplies?: () => void;
  };
  commentCountHeadingText?: TextStyle;
  noCommentViewStyle?: ViewStyle;
  noCommentHeadingTextStyle?: TextStyle;
  noCommentSubHeadingTextStyle?: TextStyle;
  replyingViewStyle?: {
    replyingView?: ViewStyle;
    replyingText?: LMTextProps;
    cancelReplyIcon?: LMIconProps;
  };
  userTaggingListStyle?: {
    taggingListView?: ViewStyle;
    userTagView?: ViewStyle;
    userTagNameStyle?: TextStyle;
  };
  commentTextInputStyle?: {
    inputTextStyle?: TextStyle;
    placeholderText?: string;
    placeholderTextColor?: string;
    disabled?: boolean;
    rightIcon?: {
      text?: LMTextProps;
      icon?: LMIconProps;
      onTap?: (value?: any) => void;
      placement?: "start" | "end";
      buttonStyle?: ViewStyle;
      isClickable?: boolean;
    };
    textValueStyle?: TextStyle;
    mentionTextStyle?: TextStyle;
    multilineField?: boolean;
  };
}

interface CreatePostStyleProps {
  userNameTextStyle?: TextStyle;
  createPostScreenHeader?: {
    showBackArrow?: boolean;
    onBackPress?: () => void;
    editPostHeading?: string;
    createPostHeading?: string;
    rightComponent?: React.ReactNode;
    subHeading?: string;
    backIcon?: LMIconProps;
    subHeadingTextStyle?: TextStyle;
    headingTextStyle?: TextStyle;
    headingViewStyle?: ViewStyle;
  };
  createPostTextInputStyle?: {
    inputTextStyle?: TextStyle;
    placeholderText?: string;
    placeholderTextColor?: string;
    disabled?: boolean;
    rightIcon?: {
      text?: LMTextProps;
      icon?: LMIconProps;
      onTap?: (value?: any) => void;
      placement?: "start" | "end";
      buttonStyle?: ViewStyle;
      isClickable?: boolean;
    };
    textValueStyle?: TextStyle;
    mentionTextStyle?: TextStyle;
    multilineField?: boolean;
  };
  attachmentOptionsStyle?: {
    attachmentOptionsView?: ViewStyle;
    photoAttachmentView?: ViewStyle;
    photoAttachmentIcon?: LMIconProps;
    photoAttachmentTextStyle?: LMTextProps;
    onPhotoAttachmentOptionClick?: () => void;
    videoAttachmentView?: ViewStyle;
    videoAttachmentIcon?: LMIconProps;
    videoAttachmentTextStyle?: LMTextProps;
    onVideoAttachmentOptionClick?: () => void;
    filesAttachmentView?: ViewStyle;
    filesAttachmentIcon?: LMIconProps;
    filesAttachmentTextStyle?: LMTextProps;
    onFilesAttachmentOptionClick?: () => void;
  };
  addMoreAttachmentsButton?: {
    text?: LMTextProps;
    icon?: LMIconProps;
    onTap?: (value?: any) => void;
    placement?: "start" | "end";
    buttonStyle?: ViewStyle;
    isClickable?: boolean;
  };
}

interface PostLikesListStyleProps {
  screenHeader?: LMHeaderProps;
  likeListItemStyle?: ViewStyle;
  userNameTextStyle?: TextStyle;
  userDesignationTextStyle?: TextStyle
}

export interface ThemeContextProps {
  textStyle?: TextStyles;
  universalFeedStyle?: UniversalFeedStyleProps;
  postListStyle?: PostListStyleProps;
  loaderStyle?: LoaderStyleProps;
  postDetailStyle?: PostDetailStyleProps;
  createPostStyle?: CreatePostStyleProps;
  postLikesListStyle?: PostLikesListStyleProps;
}

export interface LMFeedProviderProps {
  myClient: LMFeedClient;
  children: React.ReactNode;
  userName: string;
  userUniqueId: string;
  themeStyles?: ThemeStyles;
  universalFeedStyle?: UniversalFeedStyleProps;
  postListStyle?: PostListStyleProps;
  loaderStyle?: LoaderStyleProps;
  postDetailStyle?: PostDetailStyleProps;
  createPostStyle?: CreatePostStyleProps;
  postLikesListStyle?: PostLikesListStyleProps;
}
