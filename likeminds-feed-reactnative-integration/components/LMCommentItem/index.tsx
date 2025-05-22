import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  TextLayoutEventData,
  NativeSyntheticEvent,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LMCommentProps } from "./types";
import { LMIcon, LMText, LMButton } from "../../uiComponents";
import {
  MAX_DEFAULT_COMMENT_LINES,
  PARENT_LEVEL_COMMENT,
  STATE_ADMIN,
  VIEW_MORE_TEXT,
} from "../../constants/Strings";
import LMLoader from "../LMLoader";
import { LMCommentViewData } from "../../models";
import { styles } from "./styles";
import decode from "../../utils/decodeMentions";
import { timeStamp } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { MemberRightsEnum } from "../../enums/MemberRightsEnum";
import STYLES from "../../constants/Styles";
import { usePostDetailContext } from "../../context";
import { CommunityConfigs } from "../../communityConfigs";
import pluralizeOrCapitalize from "../../utils/variables";
import { WordAction } from "../../enums/Variables";
import { clearComments } from "../../store/actions/postDetail";
const LMCommentItem = React.memo(
  ({
    likeIconButton,
    likeTextButton,
    comment,
    onTapViewMore,
    commentMaxLines,
    menuIcon,
    commentUserNameStyle,
    commentContentProps,
    showMoreProps,
    replyTextProps,
    repliesCountTextStyle,
    timeStampStyle,
    viewMoreRepliesProps,
    onTapReplies,
    isRepliesVisible,
    onCommentOverflowMenuClick,
    hideThreeDotsMenu,
  }: LMCommentProps) => {
    const MAX_LINES = commentMaxLines
      ? commentMaxLines
      : MAX_DEFAULT_COMMENT_LINES;
    const [showText, setShowText] = useState(false);
    const [numberOfLines, setNumberOfLines] = useState<number>();
    const [showMoreButton, setShowMoreButton] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [commentIsLiked, setCommentIsLiked] = useState(comment?.isLiked);
    const [commentLikeCount, setCommentLikeCount] = useState(
      comment?.likesCount
    );
    const [repliesArray, setRepliesArray] = useState<LMCommentViewData[]>([]);
    const [repliesLoading, setRepliesLoading] = useState(false);
    const [replyPageNumber, setReplyPageNumber] = useState(1);
    const customLikeIcon = likeIconButton?.icon;
    const [hasRepliesPaginationEnded, setHasRepliesPaginationEnded] = useState(false);
    const loggedInUserMemberRights = useAppSelector(
      (state) => state.login.memberRights
    );
    const commentingRight = loggedInUserMemberRights.find(
      (item) => item.state === MemberRightsEnum.CommentingRightState
    );
    const memberData = useAppSelector((state) => state.login.member);
    const isCM = memberData?.state === STATE_ADMIN;
    const dispatch = useAppDispatch();

    // this handles the show more functionality
    const onTextLayout = (event) => {
      if (event.nativeEvent.lines.length > MAX_LINES && !showText) {
        setShowMoreButton(true);
        setNumberOfLines(MAX_LINES);
      }
    };

    const {setCommentOnFocus, commentOnFocus} = usePostDetailContext();

    useEffect(() => {
      if (isRepliesVisible) {
        setShowReplies(true);
      }
    }, [isRepliesVisible]);

    // this handles the visiblity of whole comment content and trimmed text upto maximum line
    useEffect(() => {
      if (showMoreButton) {
        setNumberOfLines(showText ? undefined : MAX_LINES);
      }
    }, [showText, showMoreButton, MAX_LINES]);

    //creating content props as per customization
    const updatedContentProps = {
      children: (
        <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
          {decode(comment?.text, true)}
        </Text>
      ),
      onTextLayout: (event: NativeSyntheticEvent<TextLayoutEventData>) => {
        onTextLayout(event);
        commentContentProps?.onTextLayout &&
          commentContentProps?.onTextLayout(event);
      },
      maxLines: commentContentProps?.maxLines
        ? commentContentProps?.maxLines
        : numberOfLines,
      textStyle: commentContentProps?.textStyle
        ? commentContentProps?.textStyle
        : {
            color: STYLES.$IS_DARK_THEME
              ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
              : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
          },
      selectable: commentContentProps?.selectable
        ? commentContentProps?.selectable
        : true,
    };

    //creating show more props as per customization
    const updatedShowMoreProps = {
      children: showMoreProps ? (
        showMoreProps
      ) : showText ? (
        <Text></Text>
      ) : (
        <Text style={styles.showMoreText}>Read More</Text>
      ),
      textStyle: showMoreProps?.textStyle,
    };

    const handleReplies = () => {
      if (showReplies) {
        setHasRepliesPaginationEnded(false);
        dispatch(clearComments(comment?.id))
      }
      setShowReplies(!showReplies);
    };

    // this function is executed on the click of menu icon & handles the position and visibility of the modal
    const onOverflowMenuClick = (
      event: {
        nativeEvent: { pageX: number; pageY: number };
      },
      commentId: string
    ) => {
      onCommentOverflowMenuClick
        ? onCommentOverflowMenuClick(event, commentId)
        : null;
      setCommentOnFocus(comment)
      menuIcon && menuIcon?.onTap();
    };

    // this sets the comment's like value and likeCount locally
    useEffect(() => {
      setCommentIsLiked(comment?.isLiked);
      setCommentLikeCount(comment?.likesCount);
    }, [comment?.isLiked, comment?.likesCount]);

    // this handles the comment's like state and count locally
    const likesCountHandler = () => {
      likeIconButton?.onTap(comment?.id);
      setCommentIsLiked(!commentIsLiked);
      if (commentIsLiked) {
        setCommentLikeCount(commentLikeCount - 1);
      } else {
        setCommentLikeCount(commentLikeCount + 1);
      }
    };

    return (
      <View
        style={
          comment?.level === PARENT_LEVEL_COMMENT &&
          styles.parentLevelCommentView
        }
      >
        {/* commented user name */}
        <LMText
          textStyle={StyleSheet.flatten([
            styles.commentUserName,
            commentUserNameStyle,
          ])}
        >
          {comment?.user?.name}
        </LMText>
        <View style={styles.commentContentView}>
          <View style={styles.commentTextView}>
            {/* comment content text */}
            <LMText {...updatedContentProps} />
            {/* show more button section */}
            {showMoreButton && (
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                disabled={showText ? true : false}
                onPress={() => setShowText(!showText)}
                accessibilityRole="button"
              >
                {/* @ts-ignore */}
                <LMText {...updatedShowMoreProps} />
              </TouchableOpacity>
            )}
          </View>
          {/* menu icon */}
          {comment?.menuItems?.length > 0 && !hideThreeDotsMenu && (
            <LMButton
              onTap={(event) => onOverflowMenuClick(event, comment?.id)}
              icon={{
                assetPath: menuIcon?.icon?.assetPath
                  ? menuIcon.icon.assetPath
                  : require("../../assets/images/three_dots3x.png"),
                iconUrl: menuIcon?.icon?.iconUrl,
                width: 18,
                height: 18,
              }}
              isClickable={comment?.menuItems?.length > 0 ? true : false}
              buttonStyle={styles.threeDotButton}
            />
          )}
        </View>
        <View style={styles.commentFooterView}>
          <View style={styles.alignRow}>
            {/* like icon */}
            <LMButton
              onTap={likesCountHandler}
              icon={{
                assetPath: commentIsLiked
                  ? likeIconButton?.activeIcon?.assetPath
                    ? likeIconButton.activeIcon.assetPath
                    : require("../../assets/images/heart_red_icon3x.png")
                  : customLikeIcon?.assetPath
                  ? likeIconButton?.icon?.assetPath
                  : require("../../assets/images/heart_icon3x.png"),
                iconUrl: customLikeIcon?.iconUrl,
                iconStyle: customLikeIcon?.iconStyle,
                color: customLikeIcon?.color
                  ? customLikeIcon?.color
                  : !commentIsLiked
                  ? STYLES.$IS_DARK_THEME
                    ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                    : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
                  : undefined,
                height: customLikeIcon?.height
                  ? likeIconButton?.icon?.height
                  : 20.5,
                width: customLikeIcon?.width
                  ? likeIconButton?.icon?.width
                  : 20.5,
                boxFit: customLikeIcon?.boxFit,
                boxStyle: customLikeIcon?.boxStyle,
              }}
              buttonStyle={styles.likeIconButton}
            />
            {/* like text */}
            {commentLikeCount > 0 && (
              <LMButton
                onTap={() => likeTextButton?.onTap(comment?.id)}
                text={{
                  children:
                    commentLikeCount > 1 ? (
                      <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
                        {commentLikeCount} {pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.likeEntityVariable?.entityName ?? "like",WordAction.firstLetterCapitalPlural)}
                      </Text>
                    ) : (
                      <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
                        {commentLikeCount} {pluralizeOrCapitalize((CommunityConfigs?.getCommunityConfigs("feed_metadata"))?.value?.likeEntityVariable?.entityName ?? "like",WordAction.firstLetterCapitalSingular)}
                      </Text>
                    ),
                  textStyle: {
                    fontSize: 13,
                    marginLeft: 5,
                    color: STYLES.$IS_DARK_THEME
                      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
                  },
                }}
                buttonStyle={styles.likeTextButton}
              />
            )}
            {/* reply section */}
            {comment?.level === PARENT_LEVEL_COMMENT && (
              <>
                {(isCM || commentingRight?.isSelected)
                && (
                    <>
                      <LMText
                        children={<Text> | </Text>}
                        textStyle={styles.replyTextStyle}
                      />
                      {/* this opens the input text to reply */}
                      <LMButton
                        {...replyTextProps}
                        text={{
                          children: replyTextProps ? (
                            replyTextProps.text?.children ? (
                              replyTextProps.text.children
                            ) : (
                              <Text
                                style={{
                                  fontFamily: STYLES.$FONT_TYPES.MEDIUM,
                                }}
                              >
                                Reply
                              </Text>
                            )
                          ) : (
                            <Text
                              style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}
                            >
                              Reply
                            </Text>
                          ),
                          textStyle: StyleSheet.flatten([
                            {
                              fontSize: 13,
                              color: STYLES.$IS_DARK_THEME
                                ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                                : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
                            },
                            replyTextProps?.text?.textStyle,
                          ]),
                        }}
                        onTap={() => {
                          if (!showReplies) {
                            (onTapReplies && onTapReplies(
                              (data: Array<LMCommentViewData>) =>
                                setRepliesArray(data),
                              ""
                            ),
                            handleReplies())
                          }
                          replyTextProps?.onTap();
                        }}
                        buttonStyle={StyleSheet.flatten([
                          styles.replyTextButton,
                          replyTextProps?.buttonStyle,
                        ])}
                      />
                    </>
                  )}

                {/* this shows all the replies of a comment */}
                {comment.repliesCount > 0 && (
                  <>
                    {isCM ||
                      (commentingRight?.isSelected && (
                        <LMIcon
                          assetPath={require("../../assets/images/single_dot3x.png")}
                          width={styles.dotImageSize.width}
                          height={styles.dotImageSize.height}
                          iconStyle={styles.dotImageSize}
                          color={
                            STYLES.$IS_DARK_THEME
                              ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                              : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
                          }
                        />
                      ))}
                    <LMButton
                      onTap={() => {
                        onTapReplies && !showReplies
                          ? (onTapReplies(
                              (data: Array<LMCommentViewData>) =>
                                setRepliesArray(data),
                              ""
                            ),
                            handleReplies())
                          : handleReplies();
                      }}
                      text={{
                        children:
                          comment.repliesCount > 1 ? (
                            <Text
                              style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}
                            >
                              {" " + comment.repliesCount} Replies
                            </Text>
                          ) : (
                            <Text
                              style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}
                            >
                              {" " + comment.repliesCount} Reply
                            </Text>
                          ),
                        textStyle: StyleSheet.flatten([
                          { fontSize: 13, color: STYLES.$COLORS.PRIMARY },
                          repliesCountTextStyle,
                        ]),
                      }}
                      buttonStyle={styles.repliesCountTextButton}
                    />
                  </>
                )}
              </>
            )}
          </View>
          <View style={styles.rowAlignment}>
            {comment?.isEdited && (
              <>
                <LMText
                  textStyle={StyleSheet.flatten([
                    styles.defaultTimeStyle,
                    timeStampStyle,
                  ])}
                >
                  <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
                    Edited
                  </Text>
                </LMText>
                <LMIcon
                  assetPath={require("../../assets/images/single_dot3x.png")}
                  width={styles.dotImageSize.width}
                  height={styles.dotImageSize.height}
                  iconStyle={styles.dotImageSize}
                  color={
                    STYLES.$IS_DARK_THEME
                      ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
                      : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
                  }
                />
              </>
            )}
            {/* posted time stamp */}
            <LMText
              textStyle={StyleSheet.flatten([
                styles.defaultTimeStyle,
                timeStampStyle,
              ])}
            >
              {timeStamp(Number(comment?.createdAt)) === undefined ? (
                <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
                  now
                </Text>
              ) : (
                <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
                  {timeStamp(Number(comment?.createdAt))}
                </Text>
              )}
            </LMText>
          </View>
        </View>
        {/* replies section */}
        {showReplies && comment.repliesCount > 0 && (
          <View style={styles.repliesView}>
            {comment?.replies && (
              <FlatList
                keyboardShouldPersistTaps={"handled"}
                data={comment?.replies ?? []}
                renderItem={({ item }: any) => {
                  return (
                    <>
                      {item && (
                        <LMCommentItem
                          comment={{...item, parentId: comment?.id }}
                          likeIconButton={{
                            onTap: () => {
                              likeIconButton?.onTap(item?.id);
                            },
                          }}
                          likeTextButton={{
                            onTap: () => likeTextButton?.onTap(item?.id),
                          }}
                          onCommentOverflowMenuClick={(event) =>
                            onOverflowMenuClick(event, item?.id)
                          }
                          hideThreeDotsMenu={hideThreeDotsMenu}
                        />
                      )}
                    </>
                  );
                }}
                ListFooterComponent={
                  <>
                    {comment?.replies.length > 0 ? (
                      <>
                        {comment.repliesCount > comment?.replies.length && !hasRepliesPaginationEnded && (
                          <View style={styles.showMoreView}>
                            <LMButton
                              onTap={
                                onTapViewMore && !repliesLoading
                                  ? () => {
                                      setRepliesLoading(true);
                                      onTapViewMore(
                                        replyPageNumber + 1,
                                        (data: Array<LMCommentViewData>, hasPaginationEnded?: boolean) => {
                                          setRepliesArray(data)
                                          setRepliesLoading(false);
                                          setReplyPageNumber(replyPageNumber + 1);
                                          if (hasPaginationEnded) {
                                            setHasRepliesPaginationEnded(hasPaginationEnded)
                                          }
                                        }
                                      );
                                    }
                                  : () => null
                              }
                              text={{
                                children: viewMoreRepliesProps?.children ? (
                                  viewMoreRepliesProps.children
                                ) : (
                                  <Text
                                    style={{
                                      fontFamily: STYLES.$FONT_TYPES.MEDIUM,
                                    }}
                                  >
                                    {VIEW_MORE_TEXT}
                                  </Text>
                                ),
                                textStyle: viewMoreRepliesProps?.textStyle,
                              }}
                              buttonStyle={styles.viewMoreButton}
                            />
                            <Text style={styles.commentPageNumberText}>
                              {comment?.replies?.length} of {comment.repliesCount}
                            </Text>
                          </View>
                        )}
                      </>
                    ) : (
                      <View style={styles.loaderView}>
                        <LMLoader size={10} />
                      </View>
                    )}
                  </>
                }
                keyExtractor={(item, index) => index?.toString()}
              />
            )}
          </View>
        )}
      </View>
    );
  }
);

export default LMCommentItem;
