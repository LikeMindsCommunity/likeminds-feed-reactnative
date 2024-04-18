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
  VIEW_MORE_TEXT,
} from "../../constants/Strings";
import LMPostMenu from "../LMPost/LMPostMenu";
import LMLoader from "../LMLoader";
import { LMCommentUI } from "../../models";
import { styles } from "./styles";
import decode from "../../utils/decodeMentions";
import { timeStamp } from "../../utils";

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
    commentMenu,
    isRepliesVisible,
    onCommentOverflowMenuClick
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
    const [repliesArray, setRepliesArray] = useState<LMCommentUI[]>([]);
    const [replyPageNumber, setReplyPageNumber] = useState(2);
    const [modalPosition, setModalPosition] = useState(
      commentMenu?.modalPosition
    );
    const [showPostMenuModal, setShowPostMenuModal] = useState(
      commentMenu?.modalVisible
    );
    const customLikeIcon = likeIconButton?.icon

    // this handles the show more functionality
    const onTextLayout = (event) => {
      if (event.nativeEvent.lines.length > MAX_LINES && !showText) {
        setShowMoreButton(true);
        setNumberOfLines(MAX_LINES);
      }
    };

    useEffect(() => {
      if (isRepliesVisible) {
        setShowReplies(true)
        onTapReplies((data: Array<LMCommentUI>) => setRepliesArray(data));
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
      children: <Text>{decode(comment?.text, true)}</Text>,
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
        : { color: "#222020" },
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
        <Text>See More</Text>
      ),
      textStyle: showMoreProps?.textStyle,
    };

    const handleReplies = () => {
      setShowReplies(!showReplies);
    };

    // this function is executed on the click of menu icon & handles the position and visibility of the modal
    const onOverflowMenuClick = (event: {
      nativeEvent: { pageX: number; pageY: number };
    }) => {
      onCommentOverflowMenuClick(event)   
      menuIcon?.onTap();
    };

    // this function closes the menu list modal
    const closeCommentMenuModal = () => {
      commentMenu?.onCloseModal();
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
                <LMText {...updatedShowMoreProps} />
              </TouchableOpacity>
            )}
          </View>
          {/* menu icon */}
          {comment?.menuItems?.length > 0 && (
            <LMButton
              onTap={onOverflowMenuClick}
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
                  ? likeIconButton.icon.assetPath
                  : require("../../assets/images/heart_icon3x.png"),
                iconUrl: customLikeIcon?.iconUrl,
                iconStyle: customLikeIcon?.iconStyle,
                color: customLikeIcon?.color,
                height: customLikeIcon?.height
                  ? likeIconButton.icon.height
                  : 20.5,
                width: customLikeIcon?.width
                  ? likeIconButton.icon.width
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
                      <Text>{commentLikeCount} Likes</Text>
                    ) : (
                      <Text>{commentLikeCount} Like</Text>
                    ),
                  textStyle: {
                    fontSize: 13,
                    marginLeft: 5,
                    color: "#0F1E3D66",
                  },
                }}
                buttonStyle={styles.likeTextButton}
              />
            )}
            {/* reply section */}
            {comment?.level === PARENT_LEVEL_COMMENT && (
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
                        <Text>Reply</Text>
                      )
                    ) : (
                      <Text>Reply</Text>
                    ),
                    textStyle: StyleSheet.flatten([
                      { fontSize: 13, color: "#0F1E3D66" },
                      replyTextProps?.text?.textStyle,
                    ]),
                  }}
                  onTap={() => {
                    replyTextProps?.onTap();
                  }}
                  buttonStyle={StyleSheet.flatten([
                    styles.replyTextButton,
                    replyTextProps?.buttonStyle,
                  ])}
                />

                {/* this shows all the replies of a comment */}
                {comment.repliesCount > 0 && (
                  <>
                    <LMIcon
                      assetPath={require("../../assets/images/single_dot3x.png")}
                      width={styles.dotImageSize.width}
                      height={styles.dotImageSize.height}
                      iconStyle={styles.dotImageSize}
                      color="#0F1E3D66"
                    />
                    <LMButton
                      onTap={() => {
                        onTapReplies
                          ? (onTapReplies((data: Array<LMCommentUI>) =>
                              setRepliesArray(data)
                            ),
                            handleReplies())
                          : handleReplies();
                      }}
                      text={{
                        children:
                          comment.repliesCount > 1 ? (
                            <Text>{comment.repliesCount} Replies</Text>
                          ) : (
                            <Text>{comment.repliesCount} Reply</Text>
                          ),
                        textStyle: StyleSheet.flatten([
                          { fontSize: 13, color: "#5046E5" },
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
                  <Text>Edited</Text>
                </LMText>
                <LMIcon
                  assetPath={require("../../assets/images/single_dot3x.png")}
                  width={styles.dotImageSize.width}
                  height={styles.dotImageSize.height}
                  iconStyle={styles.dotImageSize}
                  color="#0F1E3D66"
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
                <Text>now</Text>
              ) : (
                <Text>{timeStamp(Number(comment?.createdAt))}</Text>
              )}
            </LMText>
          </View>
        </View>
        {/* replies section */}
        {showReplies && comment.repliesCount > 0 && (
          <View style={styles.repliesView}>
            {repliesArray && (
              <FlatList
                keyboardShouldPersistTaps={"handled"}
                data={repliesArray}
                renderItem={({ item }: { item: LMCommentUI }) => {
                  return (
                    <>
                      {item && (
                        <LMCommentItem
                          comment={item}
                          likeIconButton={{
                            onTap: () => {
                              likeIconButton?.onTap(item?.id);
                            },
                          }}
                          likeTextButton={{
                            onTap: () => likeTextButton?.onTap(item?.id),
                          }}
                          commentMenu={{
                            postId: item?.id,
                            menuItems: item?.menuItems,
                            modalPosition: commentMenu.modalPosition,
                            modalVisible: commentMenu.modalVisible,
                            onCloseModal: commentMenu.onCloseModal,
                            onSelected: (commentId, itemId) =>
                              commentMenu.onSelected(commentId, itemId),
                          }}
                          onCommentOverflowMenuClick={onCommentOverflowMenuClick}
                        />
                      )}
                    </>
                  );
                }}
                // ListFooterComponentStyle={{}}
                ListFooterComponent={
                  <>
                    {repliesArray.length > 0 ? (
                      <>
                        {comment.repliesCount > repliesArray.length && (
                          <View style={styles.showMoreView}>
                            <LMButton
                              onTap={
                                onTapViewMore
                                  ? () => {
                                      setReplyPageNumber(replyPageNumber + 1);
                                      onTapViewMore(
                                        replyPageNumber,
                                        (data: Array<LMCommentUI>) =>
                                          setRepliesArray(data)
                                      );
                                    }
                                  : () => null
                              }
                              text={{
                                children: viewMoreRepliesProps?.children ? (
                                  viewMoreRepliesProps.children
                                ) : (
                                  <Text>{VIEW_MORE_TEXT}</Text>
                                ),
                                textStyle: viewMoreRepliesProps?.textStyle,
                              }}
                              buttonStyle={styles.viewMoreButton}
                            />
                            <Text style={styles.commentPageNumberText}>
                              {repliesArray.length} of {comment.repliesCount}
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
              />
            )}
          </View>
        )}

        {/* menu list modal */}
        <LMPostMenu
          postId={comment?.id}
          menuItems={comment?.menuItems}
          onSelected={commentMenu?.onSelected}
          modalPosition={commentMenu?.modalPosition}
          modalVisible={commentMenu?.modalVisible}
          onCloseModal={closeCommentMenuModal}
          menuItemTextStyle={commentMenu?.menuItemTextStyle}
          menuViewStyle={commentMenu?.menuViewStyle}
          backdropColor={commentMenu?.backdropColor}
        />
      </View>
    );
  }
);

export default LMCommentItem;
