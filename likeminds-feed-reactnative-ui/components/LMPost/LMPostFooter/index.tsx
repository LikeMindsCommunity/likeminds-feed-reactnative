import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import STYLES from '../../../constants/constants';
import layout from '../../../utils/layout';
import {LMPostFooterProps} from './types';
import LMButton from '../../LMButton'

const LMPostFooter = ({
  isLiked,
  isSaved,
  likesCount,
  commentsCount,
  showBookMarkIcon,
  showShareIcon,
  likeIconButton,
  likeTextButton,
  commentButton,
  saveButton,
  shareButton,
  footerBoxStyle,
}: LMPostFooterProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likesCount);
  // handling like state and likes count locally
  useEffect(() => {
    setLiked(isLiked);
    setLikeCount(likesCount);
  }, [isLiked, likesCount]);
  const likesCountHandler = () => {
    likeIconButton?.onTap();
    setLiked(!liked);
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
  };
  return (
    <View style={StyleSheet.flatten([styles.postFooter, footerBoxStyle])}>
      {/* like and comment view */}
      <View style={styles.alignRow}>
        {/* like section */}
        <View style={styles.alignRow}>
          {/* like icon button */}
          <LMButton
            onTap={likesCountHandler}
            icon={{
              assetPath: liked
                ? likeIconButton?.activeIcon?.assetPath
                  ? likeIconButton.activeIcon.assetPath
                  : require('../../../assets/images/heart_red_icon3x.png')
                : likeIconButton?.icon?.assetPath
                ? likeIconButton.icon.assetPath
                : require('../../../assets/images/heart_icon3x.png'),
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
            placement={likeIconButton?.placement}
            buttonStyle={
              likeIconButton?.buttonStyle
                ? likeIconButton.buttonStyle
                : styles.defaultLikeIconView
            }
          />
          {/* like text button */}
          <LMButton
            onTap={
              likeTextButton?.onTap
                ? likeCount >= 1
                  ? likeTextButton.onTap
                  : () => null
                : () => null
            }
            text={{
              children: likeCount
                ? likeCount > 1
                  ? `${likeCount} Likes`
                  : `${likeCount} Like`
                : 'Like',
              textStyle: likeTextButton?.text?.textStyle
                ? likeTextButton.text.textStyle
                : {
                    fontSize: 14.5,
                    fontWeight: '400',
                    color: '#504B4B',
                    textAlign: 'left',
                    width: 55,
                  },
            }}
            placement={likeTextButton?.placement}
            buttonStyle={
              likeTextButton?.buttonStyle
                ? likeTextButton.buttonStyle
                : styles.defaultLikeTextView
            }
          />
        </View>

        {/* comment section */}
        <View style={StyleSheet.flatten([styles.alignRow])}>
          <LMButton
            onTap={commentButton?.onTap ? commentButton.onTap : () => null}
            text={{
              children:
                commentsCount > 0
                  ? commentsCount > 1
                    ? `${commentsCount} Comments`
                    : `${commentsCount} Comment`
                  : 'Add Comment',
              textStyle: commentButton?.text?.textStyle
                ? commentButton.text.textStyle
                : {
                    marginLeft: 8,
                    fontSize: 14.5,
                    fontWeight: '400',
                    color: '#504B4B',
                  },
            }}
            icon={{
              assetPath: commentButton?.icon?.assetPath
                ? commentButton.icon.assetPath
                : require('../../../assets/images/comment_icon3x.png'),
              type: 'png',
              iconUrl: commentButton?.icon?.iconUrl,
              iconStyle: commentButton?.icon?.iconStyle,
              color: commentButton?.icon?.color,
              height: commentButton?.icon?.height
                ? commentButton.icon.height
                : 20,
              width: commentButton?.icon?.width ? commentButton.icon.width : 20,
              boxFit: commentButton?.icon?.boxFit,
              boxStyle: commentButton?.icon?.boxStyle,
            }}
            placement={commentButton?.placement}
            isActive={commentButton?.isActive}
            activeIcon={commentButton?.activeIcon}
            activeText={commentButton?.activeText}
            buttonStyle={
              commentButton?.buttonStyle
                ? commentButton.buttonStyle
                : styles.defaultCommentView
            }
          />
        </View>
      </View>

      {/* save and share view */}
      <View
        style={StyleSheet.flatten([
          styles.alignRow,
          showBookMarkIcon &&
            showShareIcon && {width: '16%', justifyContent: 'space-between'},
        ])}>
        {/* save section */}
        {showBookMarkIcon && (
          <LMButton
            onTap={saveButton?.onTap ? saveButton.onTap : () => null}
            text={saveButton?.text}
            icon={{
              assetPath: saveButton?.icon?.assetPath
                ? saveButton.icon.assetPath
                : require('../../../assets/images/bookmark_icon3x.png'),
              type: 'png',
              iconUrl: saveButton?.icon?.iconUrl,
              iconStyle: saveButton?.icon?.iconStyle,
              color: saveButton?.icon?.color,
              height: saveButton?.icon?.height ? saveButton.icon.height : 18,
              width: saveButton?.icon?.width ? saveButton.icon.width : 18,
              boxFit: saveButton?.icon?.boxFit,
              boxStyle: saveButton?.icon?.boxStyle,
            }}
            placement={saveButton?.placement}
            isActive={saveButton?.isActive ? saveButton.isActive : isSaved}
            activeIcon={{
              assetPath: saveButton?.activeIcon?.assetPath
                ? saveButton.activeIcon.assetPath
                : require('../../../assets/images/saved_bookmark_icon3x.png'),
              type: 'png',
              iconUrl: saveButton?.activeIcon?.iconUrl,
              iconStyle: saveButton?.activeIcon?.iconStyle,
              color: saveButton?.activeIcon?.color,
              height: saveButton?.activeIcon?.height
                ? saveButton.activeIcon.height
                : 18,
              width: saveButton?.activeIcon?.width
                ? saveButton.activeIcon.width
                : 18,
              boxFit: saveButton?.activeIcon?.boxFit,
              boxStyle: saveButton?.activeIcon?.boxStyle,
            }}
            activeText={saveButton?.activeText}
            buttonStyle={
              saveButton?.buttonStyle
                ? saveButton.buttonStyle
                : styles.buttonWithoutBorder
            }
          />
        )}

        {/* share section */}
        {showShareIcon && (
          <LMButton
            onTap={shareButton?.onTap ? shareButton.onTap : () => null}
            text={shareButton?.text}
            icon={{
              assetPath: shareButton?.icon?.assetPath
                ? shareButton.icon.assetPath
                : require('../../../assets/images/share_icon3x.png'),
              type: 'png',
              iconUrl: shareButton?.icon?.iconUrl,
              iconStyle: shareButton?.icon?.iconStyle,
              color: shareButton?.icon?.color,
              height: shareButton?.icon?.height ? shareButton.icon.height : 18,
              width: shareButton?.icon?.width ? shareButton.icon.width : 18,
              boxFit: shareButton?.icon?.boxFit,
              boxStyle: shareButton?.icon?.boxStyle,
            }}
            placement={shareButton?.placement}
            isActive={shareButton?.isActive}
            activeIcon={shareButton?.activeIcon}
            activeText={shareButton?.activeText}
            buttonStyle={
              shareButton?.buttonStyle
                ? shareButton.buttonStyle
                : styles.buttonWithoutBorder
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  alignRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postFooterText: {
    fontSize: 16,
    fontWeight: '400',
    color: STYLES.$COLORS.BLACK,
    marginLeft: 8,
  },
  likeIconSize: {
    width: layout.normalize(21),
    height: layout.normalize(21),
  },
  commentIconSize: {
    width: layout.normalize(21),
    height: layout.normalize(21),
  },
  iconSize: {
    width: layout.normalize(19),
    height: layout.normalize(19),
  },
  defaultLikeIconView: {
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  defaultLikeTextView: {
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginLeft: 8,
  },
  defaultCommentView: {
    borderWidth: 0,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonWithoutBorder: {
    borderWidth: 0,
  },
});

export default LMPostFooter;
