import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  TextLayoutEventData,
  NativeSyntheticEvent,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import LMText from '../LMText';
import layout from '../../utils/layout';
import {LMCommentProps} from './types';
import LMButton from '../LMButton';
import {timeStamp} from '../../utils';
import LMIcon from '../LMIcon';
import {PARENT_LEVEL_COMMENT, VIEW_MORE_TEXT} from '../../constants/strings';
import LMPostMenu from '../LMPost/LMPostMenu';
import LMLoader from '../LMLoader';
import {LMCommentUI} from '../../models';

const LMCommentItem = ({
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
}: LMCommentProps) => {
  const MAX_LINES = commentMaxLines ? commentMaxLines : 3;
  const [showText, setShowText] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState<number>();
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  // const [showReplyInput, setShowReplyInput] = useState(false);
  const [commentIsLiked, setCommentIsLiked] = useState(comment?.isLiked);
  const [commentLikeCount, setCommentLikeCount] = useState(comment?.likesCount);
  const [repliesArray, setRepliesArray] = useState<LMCommentUI[]>([]);
  const [replyPageNumber, setReplyPageNumber] = useState(2);
  const [modalPosition, setModalPosition] = useState(
    commentMenu?.modalPosition,
  );
  const [showPostMenuModal, setShowPostMenuModal] = useState(
    commentMenu?.modalVisible,
  );

  // this handles the show more functionality
  const onTextLayout = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (event.nativeEvent.lines.length > MAX_LINES && !showText) {
        setShowMoreButton(true);
        setNumberOfLines(MAX_LINES);
      }
    },
    [showText, MAX_LINES],
  );

  // this handles the visiblity of whole comment content and trimmed text upto maximum line
  useEffect(() => {
    if (showMoreButton) {
      setNumberOfLines(showText ? undefined : MAX_LINES);
    }
  }, [showText, showMoreButton, MAX_LINES]);

  //creating content props as per customization
  const updatedContentProps = commentContentProps
    ? commentContentProps
    : {
        text: comment?.text,
        onTextLayout: (event: NativeSyntheticEvent<TextLayoutEventData>) =>
          onTextLayout(event),
        maxLines: numberOfLines,
        textStyle: {color: '#222020'},
      };

  //creating show more props as per customization
  const updatedShowMoreProps = showMoreProps
    ? showMoreProps
    : {
        children: showText ? <Text></Text> : <Text>See More</Text>,
      };

  const handleReplies = () => {
    setShowReplies(!showReplies);
  };

  // this function is executed on the click of menu icon & handles the position and visibility of the modal
  const onOverflowMenuClick = (event: {
    nativeEvent: {pageX: number; pageY: number};
  }) => {
    const {pageX, pageY} = event.nativeEvent;
    setShowPostMenuModal(true);
    setModalPosition({x: pageX, y: pageY});
    menuIcon?.onTap();
  };

  // this function closes the menu list modal
  const closeCommentMenuModal = () => {
    commentMenu?.onCloseModal();
    setShowPostMenuModal(false);
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
        comment?.level === PARENT_LEVEL_COMMENT && styles.parentLevelCommentView
      }>
      {/* commented user name */}
      <LMText
        textStyle={StyleSheet.flatten([
          styles.commentUserName,
          commentUserNameStyle,
        ])}
      >{comment?.user?.name}</LMText>
      <View style={styles.commentContentView}>
        <View style={styles.commentTextView}>
          {/* comment content text */}
          <LMText {...updatedContentProps} />
          {/* show more button section */}
          {showMoreButton && (
            <TouchableOpacity
              activeOpacity={0.8}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              disabled={showText ? true : false}
              onPress={() => setShowText(!showText)}
              accessibilityRole="button">
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
                : require('../../assets/images/three_dots3x.png'),
              type: 'png',
              iconUrl: menuIcon?.icon?.iconUrl,
              width: 18,
              height: 18,
            }}
            isClickable={comment?.menuItems?.length > 0 ? false : true}
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
                  : require('../../assets/images/heart_red_icon3x.png')
                : likeIconButton?.icon?.assetPath
                ? likeIconButton.icon.assetPath
                : require('../../assets/images/heart_icon3x.png'),
              type: 'png',
              iconUrl: likeIconButton?.icon?.iconUrl,
              iconStyle: likeIconButton?.icon?.iconStyle,
              color: likeIconButton?.icon?.color,
              height: likeIconButton?.icon?.height
                ? likeIconButton.icon.height
                : 20.5,
              width: likeIconButton?.icon?.width
                ? likeIconButton.icon.width
                : 20.5,
              boxFit: likeIconButton?.icon?.boxFit,
              boxStyle: likeIconButton?.icon?.boxStyle,
            }}
            buttonStyle={styles.likeIconButton}
          />
          {/* like text */}
          {commentLikeCount > 0 && (
            <LMButton
              onTap={() => likeTextButton?.onTap(comment?.id)}
              text={{
                children:
                  commentLikeCount > 1
                    ? <Text>{commentLikeCount} Likes</Text>
                    : <Text>{commentLikeCount} Like</Text>,
                textStyle: {fontSize: 13, marginLeft: 5, color: '#0F1E3D66'},
              }}
              buttonStyle={styles.likeTextButton}
            />
          )}
          {/* reply section */}
          {comment?.level === PARENT_LEVEL_COMMENT && (
            <>
              <LMText children={<Text> | </Text>} textStyle={styles.replyTextStyle} />
              {/* this opens the input text to reply */}
              <LMButton
                text={{
                  children: replyTextProps
                    ? replyTextProps.text?.children
                      ? replyTextProps.text.children
                      : <Text>Reply</Text>
                    : <Text>Reply</Text>,
                  textStyle: StyleSheet.flatten([
                    {fontSize: 13, color: '#0F1E3D66'},
                    replyTextProps?.text?.textStyle,
                  ]),
                }}
                onTap={() => {
                  replyTextProps?.onTap();
                }}
                buttonStyle={styles.replyTextButton}
              />

              {/* this shows all the replies of a comment */}
              {comment.repliesCount > 0 && (
                <>
                  <LMIcon
                    assetPath={require('../../assets/images/single_dot3x.png')}
                    type="png"
                    width={styles.dotImageSize.width}
                    height={styles.dotImageSize.height}
                    iconStyle={styles.dotImageSize}
                    color="#0F1E3D66"
                  />
                  <LMButton
                    onTap={() => {
                      onTapReplies
                        ? (onTapReplies((data: Array<LMCommentUI>) =>
                            setRepliesArray(data),
                          ),
                          handleReplies())
                        : handleReplies();
                    }}
                    text={{
                      children:
                        comment.repliesCount > 1
                          ? <Text>{comment.repliesCount} Replies</Text>
                          : <Text>{comment.repliesCount} Reply</Text>,
                      textStyle: StyleSheet.flatten([
                        {fontSize: 13, color: '#5046E5'},
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
              ><Text>Edited</Text></LMText>
              <LMIcon
                assetPath={require('../../assets/images/single_dot3x.png')}
                type="png"
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
        >{timeStamp(Number(comment?.createdAt)) === undefined
          ? <Text>now</Text>
          : <Text>{timeStamp(Number(comment?.createdAt))}</Text>}</LMText>
        </View>
      </View>
      {/* replies section */}
      {showReplies && comment.repliesCount > 0 && (
        <View style={styles.repliesView}>
          {repliesArray && (
            <FlatList
              keyboardShouldPersistTaps={'handled'}
              data={repliesArray}
              renderItem={({item}: {item: LMCommentUI}) => {
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
                                        setRepliesArray(data),
                                    );
                                  }
                                : () => null
                            }
                            text={{
                              children: viewMoreRepliesProps?.children
                                ? viewMoreRepliesProps.children
                                : <Text>{VIEW_MORE_TEXT}</Text>,
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
        modalPosition={modalPosition}
        modalVisible={showPostMenuModal}
        onCloseModal={closeCommentMenuModal}
        menuItemTextStyle={commentMenu?.menuItemTextStyle}
        menuViewStyle={commentMenu?.menuViewStyle}
        backdropColor={commentMenu?.backdropColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconSize: {
    width: layout.normalize(22),
    height: layout.normalize(22),
    resizeMode: 'contain',
  },
  alignRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotImageSize: {
    width: layout.normalize(5),
    height: layout.normalize(5),
    marginHorizontal: 7,
    resizeMode: 'contain',
  },
  commentUserName: {
    fontWeight: '500',
    color: '#222020',
    paddingTop: 12,
    paddingBottom: 4,
  },
  defaultTimeStyle: {
    color: '#0F1E3D66',
    fontSize: 13,
  },
  parentLevelCommentView: {
    paddingHorizontal: 15,
    width: layout.window.width,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#D0D8E266',
  },
  commentContentView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentTextView: {width: '85%'},
  threeDotButton: {borderWidth: 0},
  commentFooterView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingTop: 6,
    alignItems: 'center',
  },
  likeTextButton: {borderWidth: 0, marginRight: 4},
  likeIconButton: {borderWidth: 0, marginRight: 4},
  replyTextStyle: {color: '#0F1E3D66', marginRight: 4},
  replyTextButton: {borderWidth: 0},
  repliesCountTextButton: {borderWidth: 0},
  repliesView: {marginLeft: 30},
  showMoreView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentPageNumberText: {fontSize: 12, color: '#9B9B9B'},
  loaderView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    marginBottom: 20,
  },
  viewMoreButton: {
    borderWidth: 0,
    alignSelf: 'flex-start',
  },
  rowAlignment: {flexDirection: 'row', alignItems: 'center'},
});

export default LMCommentItem;
