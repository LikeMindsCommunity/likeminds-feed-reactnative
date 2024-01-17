import React from "react";
import { LMFeedClient } from "@likeminds.community/feed-js";
import {
  LMButtonProps,
  LMHeaderProps,
  LMIconProps,
  LMLoaderProps,
  LMProfilePictureProps,
  LMTextProps,
} from "likeminds_feed_reactnative_ui";
import { ViewStyle, TextStyle, ImageProps, ImageStyle } from "react-native";

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
interface universalFeedStyleProps {
  newPostButtonStyle?: ViewStyle;
  newPostButtonText?: TextStyle;
  newPostIcon?: ImageProps;
  screenHeader?: LMHeaderProps;
}

// custom style interface for post's lis
interface postListStyleProps {
  header?: {
    profilePicture?: LMProfilePictureProps;
    titleText?: LMTextProps;
    createdAt?: LMTextProps;
    showMemberStateLabel?: boolean;
    memberStateViewStyle?: ViewStyle;
    memberStateTextStyle?: TextStyle;
    postHeaderViewStyle?: ViewStyle;
    pinIcon?: LMIconProps;
    menuIcon?: LMIconProps;
    onTap?: () => void;
    showMenuIcon?: boolean;
    postMenu?: {
      menuItemTextStyle?: TextStyle;
      menuViewStyle?: ViewStyle;
      backdropColor?: string;
    };
  };
  footer?: {
    showBookMarkIcon?: boolean;
    showShareIcon?: boolean;
    likeIconButton?: LMButtonProps;
    likeTextButton?: LMButtonProps;
    commentButton?: LMButtonProps;
    saveButton?: LMButtonProps;
    shareButton?: LMButtonProps;
    footerBoxStyle?: ViewStyle;
  };
  postContent?: {
    textStyle?: TextStyle;
    linkStyle?: TextStyle;
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
      playButton?: LMButtonProps;
      pauseButton?: LMButtonProps;
      autoPlay?: boolean;
      showCancel?: boolean;
      onCancel?: () => void;
    };
    carousel?: {
      carouselStyle?: ViewStyle;
      paginationBoxStyle?: ViewStyle;
      activeIndicatorStyle?: ViewStyle;
      inactiveIndicatorStyle?: ViewStyle;
      imageItem?: {
        height?: number;
        width?: number;
        imageStyle?: ImageStyle;
        boxFit?: "center" | "contain" | "cover" | "repeat" | "stretch";
        boxStyle?: ViewStyle;
        aspectRatio?:
          | 0
          | 0.1
          | 0.2
          | 0.3
          | 0.4
          | 0.5
          | 0.6
          | 0.7
          | 0.8
          | 0.9
          | 1;
        loaderWidget?: React.ReactNode;
        errorWidget?: React.ReactNode;
        showCancel?: boolean;
        onCancel?: () => void;
      };
      videoItem?: {
        height?: number;
        width?: number;
        videoStyle?: ViewStyle;
        boxFit?: "stretch" | "contain" | "cover" | "none";
        boxStyle?: ViewStyle;
        aspectRatio?:
          | 0
          | 0.1
          | 0.2
          | 0.3
          | 0.4
          | 0.5
          | 0.6
          | 0.7
          | 0.8
          | 0.9
          | 1;
        showControls?: boolean;
        looping?: boolean;
        loaderWidget?: React.ReactNode;
        errorWidget?: React.ReactNode;
        playButton?: LMButtonProps;
        pauseButton?: LMButtonProps;
        autoPlay?: boolean;
        showCancel?: boolean;
        onCancel?: () => void;
      }
      showCancel?: boolean;
      onCancel?: () => void;
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
    };
    linkPreview?: {
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
    };
  };
  noPostView?: ViewStyle;
  noPostText?: TextStyle;
  listStyle?: ViewStyle;
}

// custom style interface for loader
interface loaderStyleProps {
  loader?: LMLoaderProps;
}

export interface ThemeContextProps {
  textStyle?: TextStyles;
}

export interface LMFeedProviderProps {
  myClient: LMFeedClient;
  children: React.ReactNode;
  userName: string;
  userUniqueId: string;
  themeStyles?: ThemeStyles;
  universalFeedStyle?: universalFeedStyleProps;
  postListStyle?: postListStyleProps;
  loaderStyle?: loaderStyleProps;
}
