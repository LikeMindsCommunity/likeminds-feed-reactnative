import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { LMButton } from "../../../uiComponents";
import { styles } from "./styles";
import { LMPostContextValues, useLMPostContext } from "../../../context";
import { LMFeedAnalytics } from "../../../analytics/LMFeedAnalytics";
import { Events } from "../../../enums/Events";
import { Keys } from "../../../enums/Keys";
import STYLES from "../../../constants/Styles";
import { CommunityConfigs } from "../../../communityConfigs";
import { WordAction } from "../../../enums/Variables";
import pluralizeOrCapitalize from "../../../utils/variables";

const LMPostFooter = React.memo(() => {
  const { post, footerProps }: LMPostContextValues = useLMPostContext();
  const postListStyle = STYLES.$POST_LIST_STYLE;
  const footerStyle: any = postListStyle?.footer;

  const [liked, setLiked] = useState(post?.isLiked);
  const [likeCount, setLikeCount] = useState(post?.likesCount);
  const showBookMarkIcon =
    footerStyle?.showBookMarkIcon != undefined
      ? footerStyle?.showBookMarkIcon
      : true;
  const showShareIcon =
    footerStyle?.showShareIcon != undefined ? footerStyle?.showShareIcon : true;
  // handling like state and likes count locally
  useEffect(() => {
    setLiked(post?.isLiked);
    setLikeCount(post?.likesCount);
  }, [post?.isLiked, post?.likesCount]);
  const likesCountHandler = () => {
    // customisabilty one
    footerStyle?.likeIconButton?.onTap && footerStyle?.likeIconButton?.onTap();

    // prop drill one
    footerProps?.likeIconButton?.onTap();

    LMFeedAnalytics.track(
      Events.POST_LIKED,
      new Map<string, string>([[Keys.POST_ID, post?.id]])
    );

    //  todo : handle later
    // setLiked(!liked);
    // if (liked) {
    //   setLikeCount(likeCount - 1);
    // } else {
    //   setLikeCount(likeCount + 1);
    // }
  };
  return (
    <View
      style={StyleSheet.flatten([
        styles.postFooter,
        footerStyle?.footerBoxStyle,
      ])}
    >
      {/* like and comment view */}
      <View style={styles.alignRow}>
        {/* like section */}
        <View style={styles.alignRow}>
          {/* like icon button */}
          <LMButton
            onTap={likesCountHandler}
            icon={{
              assetPath: liked
                ? footerStyle?.likeIconButton?.activeIcon?.assetPath
                  ? footerStyle?.likeIconButton.activeIcon.assetPath
                  : require("../../../assets/images/heart_red_icon3x.png")
                : footerStyle?.likeIconButton?.icon?.assetPath
                ? footerStyle?.likeIconButton.icon.assetPath
                : require("../../../assets/images/heart_icon3x.png"),
              iconUrl: footerStyle?.likeIconButton?.icon?.iconUrl,
              iconStyle: footerStyle?.likeIconButton?.icon?.iconStyle,
              color: footerStyle?.likeIconButton?.icon?.color
                ? footerStyle?.likeIconButton?.icon?.color
                : !liked
                ? STYLES.$IS_DARK_THEME
                  ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                  : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
                : undefined,
              height: footerStyle?.likeIconButton?.icon?.height
                ? footerStyle?.likeIconButton.icon.height
                : 20.5,
              width: footerStyle?.likeIconButton?.icon?.width
                ? footerStyle?.likeIconButton.icon.width
                : 20.5,
              boxFit: footerStyle?.likeIconButton?.icon?.boxFit,
              boxStyle: footerStyle?.likeIconButton?.icon?.boxStyle,
            }}
            buttonStyle={StyleSheet.flatten([
              styles.defaultLikeIconView,
              { padding: 8, paddingBottom: 15 },
              footerStyle?.likeIconButton?.buttonStyle,
            ])}
            isClickable={footerStyle?.likeIconButton?.isClickable}
          />
          {/* like text button */}
          <LMButton
            onTap={
              footerProps?.likeTextButton?.onTap
                ? likeCount >= 1
                  ? () => {
                      footerProps?.likeTextButton?.onTap(),
                        footerStyle?.likeTextButton?.onTap &&
                          footerStyle?.likeTextButton?.onTap();
                    }
                  : () => null
                : () => null
            }
            text={{
              children: likeCount
                ? likeCount > 1
                  ? `${likeCount} ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata")).value?.likeEntityVariable?.entityName ?? "like",WordAction.firstLetterCapitalPlural)}`
                  : `${likeCount} ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.likeEntityVariable?.entityName ?? "like",WordAction.firstLetterCapitalSingular)}`
                : `${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.likeEntityVariable?.entityName ?? "like",WordAction.firstLetterCapitalSingular)}`,
              textStyle: footerStyle?.likeTextButton?.text
                ? footerStyle?.likeTextButton.text
                : {
                    fontSize: 14.5,
                    fontWeight: "400",
                    color: STYLES.$IS_DARK_THEME
                      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
                    textAlign: "left",
                    width: 55,
                  },
            }}
            buttonStyle={StyleSheet.flatten([
              footerStyle?.likeTextButton?.buttonStyle,
              { paddingBottom: 15 },
              styles.defaultLikeTextView,
            ])}
            isClickable={footerStyle?.likeTextButton?.isClickable}
          />
        </View>

        {/* comment section */}
        <View style={StyleSheet.flatten([styles.alignRow])}>
          <LMButton
            onTap={
              footerStyle?.commentButton?.onTap
                ? footerStyle?.commentButton.onTap
                : footerProps?.commentButton?.onTap
            }
            text={{
              children:
                post?.commentsCount > 0
                  ? post?.commentsCount > 1
                    ? `${post?.commentsCount} ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalPlural)}`
                    : `${post?.commentsCount} ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalSingular)}`
                  : `Add ${pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.comment ?? "comment",WordAction.firstLetterCapitalSingular)}`,
              textStyle: footerStyle?.commentButton?.text
                ? footerStyle?.commentButton.text
                : {
                    marginLeft: 8,
                    fontSize: 14.5,
                    fontWeight: "400",
                    color: STYLES.$IS_DARK_THEME
                      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
                  },
            }}
            icon={{
              assetPath: footerStyle?.commentButton?.icon?.assetPath
                ? footerStyle?.commentButton.icon.assetPath
                : require("../../../assets/images/comment_icon3x.png"),
              iconUrl: footerStyle?.commentButton?.icon?.iconUrl,
              iconStyle: footerStyle?.commentButton?.icon?.iconStyle,
              color: footerStyle?.commentButton?.icon?.color
                ? footerStyle?.commentButton?.icon?.color
                : STYLES.$IS_DARK_THEME
                ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
              height: footerStyle?.commentButton?.icon?.height
                ? footerStyle?.commentButton.icon.height
                : 20,
              width: footerStyle?.commentButton?.icon?.width
                ? footerStyle?.commentButton.icon.width
                : 20,
              boxFit: footerStyle?.commentButton?.icon?.boxFit,
              boxStyle: footerStyle?.commentButton?.icon?.boxStyle,
            }}
            placement={footerStyle?.commentButton?.placement}
            buttonStyle={StyleSheet.flatten([
              { padding: 8, paddingBottom: 15 },
              styles.defaultCommentView,
              footerStyle?.commentButton?.buttonStyle,
            ])}
            isClickable={footerStyle?.commentButton?.isClickable}
          />
        </View>
      </View>

      {/* save and share view */}
      <View
        style={StyleSheet.flatten([
          styles.alignRow,
          showBookMarkIcon &&
            showShareIcon && { width: "20%", justifyContent: "space-between" },
        ])}
      >
        {/* save section */}
        {showBookMarkIcon && (
          <LMButton
            onTap={
              footerStyle?.saveButton?.onTap
                ? footerStyle?.saveButton.onTap
                : footerProps?.saveButton?.onTap
            }
            text={footerStyle?.saveButton?.text}
            icon={{
              assetPath: post?.isSaved
                ? footerStyle?.saveButton?.activeIcon?.assetPath
                  ? footerStyle?.saveButton.activeIcon.assetPath
                  : require("../../../assets/images/saved_bookmark_icon3x.png")
                : footerStyle?.saveButton?.icon?.assetPath
                ? footerStyle?.saveButton.icon.assetPath
                : require("../../../assets/images/bookmark_icon3x.png"),
              iconUrl: footerStyle?.saveButton?.icon?.iconUrl,
              iconStyle: footerStyle?.saveButton?.icon?.iconStyle,
              color: footerStyle?.saveButton?.icon?.color
                ? footerStyle?.saveButton?.icon?.color
                : STYLES.$IS_DARK_THEME
                ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
              height: footerStyle?.saveButton?.icon?.height
                ? footerStyle?.saveButton.icon.height
                : 18,
              width: footerStyle?.saveButton?.icon?.width
                ? footerStyle?.saveButton.icon.width
                : 18,
              boxFit: footerStyle?.saveButton?.icon?.boxFit,
              boxStyle: footerStyle?.saveButton?.icon?.boxStyle,
            }}
            placement={footerStyle?.saveButton?.placement}
            buttonStyle={StyleSheet.flatten([
              styles.buttonWithoutBorder,
              { padding: 8, paddingBottom: 15 },
              footerStyle?.saveButton?.buttonStyle,
            ])}
            isClickable={footerStyle?.saveButton?.isClickable}
          />
        )}

        {/* share section */}
        {showShareIcon && (
          <LMButton
            onTap={
              footerStyle?.shareButton?.onTap
                ? footerStyle?.shareButton.onTap
                : footerProps?.shareButton?.onTap
            }
            text={footerStyle?.shareButton?.text}
            icon={{
              assetPath: footerStyle?.shareButton?.icon?.assetPath
                ? footerStyle?.shareButton.icon.assetPath
                : require("../../../assets/images/share_icon3x.png"),
              iconUrl: footerStyle?.shareButton?.icon?.iconUrl,
              iconStyle: footerStyle?.shareButton?.icon?.iconStyle,
              color: footerStyle?.shareButton?.icon?.color
                ? footerStyle?.shareButton?.icon?.color
                : STYLES.$IS_DARK_THEME
                ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
              height: footerStyle?.shareButton?.icon?.height
                ? footerStyle?.shareButton.icon.height
                : 18,
              width: footerStyle?.shareButton?.icon?.width
                ? footerStyle?.shareButton.icon.width
                : 18,
              boxFit: footerStyle?.shareButton?.icon?.boxFit,
              boxStyle: footerStyle?.shareButton?.icon?.boxStyle,
            }}
            placement={footerStyle?.shareButton?.placement}
            activeIcon={footerStyle?.shareButton?.activeIcon}
            activeText={footerStyle?.shareButton?.activeText}
            buttonStyle={StyleSheet.flatten([
              styles.buttonWithoutBorder,
              { padding: 8, paddingBottom: 15 },
              footerStyle?.shareButton?.buttonStyle,
            ])}
            isClickable={footerStyle?.shareButton?.isClickable}
          />
        )}
      </View>
    </View>
  );
});

export default LMPostFooter;
