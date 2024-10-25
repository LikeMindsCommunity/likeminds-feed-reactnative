import React from "react";
import { LMFeedClient } from "@likeminds.community/feed-rn";
import { ViewStyle, TextStyle, ImageProps, ImageStyle } from "react-native";
import { LMHeaderProps, LMLoaderProps } from "../components";
import {
  LMButtonProps,
  LMIconProps,
  LMProfilePictureProps,
  LMTextProps,
} from "../uiComponents";
import {
  VideoCallback,
  VideoCarouselCallback,
} from "../components/LMMedia/LMVideo/types";

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
export interface UniversalFeedStyleProps {
  newPostButtonStyle?: ViewStyle;
  newPostButtonText?: TextStyle;
  newPostIcon?: ImageProps;
  screenHeader?: LMHeaderProps;
}

// custom style interface for post's list
export interface PostListStyleProps {
  header?: {
    profilePicture?: {
      fallbackTextStyle?: TextStyle;
      size?: number;
      onTap?: () => void;
      fallbackTextBoxStyle?: ViewStyle;
      profilePictureStyle?: ImageStyle;
      fallbackText?: any;
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
      text?: LMTextProps;
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
    postTopicStyle?: {
      text: TextStyle;
      box: ViewStyle;
    };
    postHeadingStyle?: TextStyle;
    postTopResponse?: {
      heading?: TextStyle;
      profilePictureStyle?: ImageStyle;
      profilePictureFallbackTextStyle?: TextStyle;
      commentBox?: ViewStyle;
      commentUserNameStyle?: TextStyle;
      commentTimeStampStyle?: TextStyle;
      commentTextStyle?: TextStyle;
    };
  };
  media?: {
    postMediaStyle?: ViewStyle;
    image?: {
      height: number;
      width: number;
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
      cancelButton?: LMButtonProps;
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
  shouldHideSeparator?: boolean;
}

// custom style interface for loader
export interface LoaderStyleProps {
  loader?: LMLoaderProps;
}

// custom style interface for post detail screen
export interface PostDetailStyleProps {
  screenHeader?: LMHeaderProps;
  shouldHideSeparator?: boolean;
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

export interface CreatePostStyleProps {
  userNameTextStyle?: TextStyle;
  headingMaxWords?: number;
  createPostScreenHeader?: {
    showBackArrow?: boolean;
    editPostHeading?: string;
    createPostHeading?: string;
    rightComponent?: React.ReactNode;
    subHeading?: string;
    backIcon?: LMIconProps;
    subHeadingTextStyle?: TextStyle;
    headingTextStyle?: TextStyle;
    headingViewStyle?: ViewStyle;
  };
  attachmentOptionsStyle?: {
    attachmentOptionsView?: ViewStyle;
    photoAttachmentView?: ViewStyle;
    photoAttachmentIcon?: LMIconProps;
    photoAttachmentTextStyle?: LMTextProps;
    videoAttachmentView?: ViewStyle;
    videoAttachmentIcon?: LMIconProps;
    videoAttachmentTextStyle?: LMTextProps;
    filesAttachmentView?: ViewStyle;
    filesAttachmentIcon?: LMIconProps;
    filesAttachmentTextStyle?: LMTextProps;
  };
  createPostTextInputStyle?: {
    inputTextStyle?: any;
    placeholderText?: string;
    placeholderTextColor?: string;
    rightIcon?: LMButtonProps;
    textValueStyle?: TextStyle;
    mentionTextStyle?: TextStyle;
    multilineField?: boolean;
  };
  addMoreAttachmentsButton?: {
    text: LMTextProps;
    icon: LMIconProps;
    onTap: (value?: any) => void;
    placement: "start" | "end";
    buttonStyle: ViewStyle;
    isClickable: boolean;
  };
}

export interface PostLikesListStyleProps {
  screenHeader?: LMHeaderProps;
  likeListItemStyle?: ViewStyle;
  userNameTextStyle?: TextStyle;
  userDesignationTextStyle?: TextStyle;
}

export interface NotificationFeedStyleProps {
  screenHeader?: LMHeaderProps;
  backgroundColor?: string;
  unreadBackgroundColor?: string;
  activityTextStyles?: TextStyle;
  timestampTextStyles?: TextStyle;
  userImageStyles?: {
    fallbackTextStyle?: TextStyle;
    size?: number;
    onTap?: () => void;
    fallbackTextBoxStyle?: ViewStyle;
    profilePictureStyle?: ImageStyle;
  };
  activityAttachmentImageStyle?: LMIconProps;
  noActivityViewText?: string;
  noActivityViewTextStyle?: TextStyle;
  noActivityViewImage?: React.ReactNode;
  noActivityViewImageStyle?: ImageStyle;
  customScreenHeader?: React.ReactNode;
  activityTextComponent?: Function;
}

export interface TopicsStyle {
  allTopic?: TextStyle;
  allTopicPlaceholder?: string;
  selectTopicHeader?: TextStyle;
  selectTopicHeaderPlaceholder?: string;
  searchTextStyle?: TextStyle;
  searchTextPlaceholder?: string;
  topicListStyle?: TextStyle;
  selectTopic?: TextStyle;
  selectTopicPlaceholder?: string;
  selectedTopicsStyle?: TextStyle;
  filteredTopicsStyle?: TextStyle;
  crossIconStyle?: ImageStyle;
  plusIconStyle?: ImageStyle;
  tickIconStyle?: ImageStyle;
  nextArrowStyle?: ImageStyle;
  arrowDownStyle?: ImageStyle;
}

export interface CarouselScreenStyle {
  headerTitle?: TextStyle;
  headerSubtitle?: TextStyle;
  sliderThumbImage?: string;
  thumbTintColor?: string;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  startTimeStyle?: TextStyle;
  endTimeStyle?: TextStyle;

  backIconPath?: string;
  isBackIconLocalPath?: boolean;
  backIconStyle?: ImageStyle;

  playIconPath?: string;
  isPlayIconLocalPath?: boolean;
  playIconStyle?: ImageStyle;

  pauseIconPath?: string;
  isPauseIconLocalPath?: boolean;
  pauseIconStyle?: ImageStyle;

  muteIconPath?: string;
  isMuteIconLocalPath?: boolean;
  muteIconStyle?: ImageStyle;

  unmuteIconPath?: string;
  isUnmuteIconLocalPath?: boolean;
  unmuteIconStyle?: ImageStyle;
}

export interface PollStyle {
  pollQuestionStyles?: React.CSSProperties;
  pollOptionSelectedColor?: string;
  pollOptionOtherColor?: string;
  pollOptionSelectedTextStyles?: React.CSSProperties;
  pollOptionOtherTextStyles?: React.CSSProperties;
  pollOptionEmptyTextStyles?: React.CSSProperties;
  pollOptionAddedByTextStyles?: React.CSSProperties;
  votesCountStyles?: React.CSSProperties;
  memberVotedCountStyles?: React.CSSProperties;
  pollInfoStyles?: React.CSSProperties;
  submitButtonStyles?: React.CSSProperties;
  submitButtonTextStyles?: React.CSSProperties;
  allowAddPollOptionButtonStyles?: React.CSSProperties;
  allowAddPollOptionButtonTextStyles?: React.CSSProperties;
  editPollOptionsStyles?: React.CSSProperties;
  editPollOptionsIcon?: string;
  clearPollOptionsStyles?: React.CSSProperties;
  clearPollOptionsIcon?: string;
}

export interface CreatePollStyle {
  pollQuestionsStyle?: React.CSSProperties;
  pollOptionsStyle?: React.CSSProperties;
  pollExpiryTimeStyle?: React.CSSProperties;
  pollAdvancedOptionTextStyle?: React.CSSProperties;
  pollAdvancedOptionExpandIcon?: string;
  pollAdvancedOptionMinimiseIcon?: string;
  pollAdvanceOptionsSwitchThumbColor?: string;
  pollAdvanceOptionsSwitchTrackColor?: string;
  shouldHideSeparator?: boolean;
}

export interface ThemeContextProps {
  textStyle?: TextStyles;
  universalFeedStyle?: UniversalFeedStyleProps;
  postListStyle?: PostListStyleProps;
  loaderStyle?: LoaderStyleProps;
  postDetailStyle?: PostDetailStyleProps;
  createPostStyle?: CreatePostStyleProps;
  postLikesListStyle?: PostLikesListStyleProps;
  notificationFeedStyle?: NotificationFeedStyleProps;
  topicsStyle?: TopicsStyle;
  carouselScreenStyle?: CarouselScreenStyle;
  pollStyle?: PollStyle;
  createPollStyle?: CreatePollStyle;
}

export interface LMFeedProviderProps {
  myClient: LMFeedClient;
  children?: React.ReactNode;
  apiKey?: string;
  userName?: string;
  userUniqueId?: string;
  accessToken?: string;
  refreshToken?: string;
  lmFeedInterface?: any;
  videoCallback?: VideoCallback;
  videoCarouselCallback?: VideoCarouselCallback;
}
