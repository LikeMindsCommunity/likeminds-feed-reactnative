import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import layout from '../../../utils/layout';
import {LMDocumentProps} from './types';
import STYLES from '../../../constants/constants';
import {formatBytes} from '../../../utils';
import {MIN_DOCUMENT_ITEM} from '../../../constants/strings';
import LMIcon from '../../LMIcon';
import LMButton from '../../LMButton';
import LMText from '../../LMText';

const LMDocument = ({
  attachments,
  documentIcon,
  showPageCount,
  showDocumentFormat,
  showDocumentSize,
  onTap,
  documentTitleStyle,
  documentDetailStyle,
  documentViewStyle,
  defaultIconSize,
  showCancel,
  onCancel,
  showMoreText = true,
}: LMDocumentProps) => {
  const [showFullList, setShowFullList] = useState(false);

  // Define the number of items to display initially
  const initialItemCount = MIN_DOCUMENT_ITEM;

  // Use data.slice to limit the items displayed
  const displayedData = showMoreText
    ? showFullList
      ? attachments
      : attachments.slice(0, initialItemCount)
    : attachments;

  return (
    <View>
      {displayedData?.map((item, index) => (
        // document View
        <View key={Math.random()}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Linking.openURL(
                item?.attachmentMeta?.url ? item?.attachmentMeta?.url : '',
              );
              onTap;
            }}
            key={index}
            style={styles.postMedia}>
            <View
              style={StyleSheet.flatten([styles.docView, documentViewStyle])}>
              {/* checks if there is any custom pdf icon is present or not */}
              {documentIcon ? (
                <LMIcon
                  type={documentIcon?.type}
                  iconUrl={documentIcon?.iconUrl}
                  assetPath={documentIcon?.assetPath}
                  iconStyle={documentIcon?.iconStyle}
                  color={documentIcon?.color}
                  height={documentIcon?.height}
                  width={documentIcon?.width}
                  boxFit={documentIcon?.boxFit}
                  boxStyle={documentIcon?.boxStyle}
                />
              ) : (
                <Image
                  source={require('../../../assets/images/pdf_icon3x.png')}
                  resizeMode={'contain'}
                  style={StyleSheet.flatten({
                    width: defaultIconSize
                      ? defaultIconSize
                      : styles.pdfIcon.width,
                    height: defaultIconSize
                      ? defaultIconSize
                      : styles.pdfIcon.height,
                  })}
                />
              )}
              {/* document detail view */}
              <View
                style={
                  showCancel
                    ? styles.detailViewWithCancelOption
                    : styles.documentDetailView
                }>
                {/* document title */}
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={StyleSheet.flatten([
                    styles.docTitle,
                    documentTitleStyle,
                  ])}>
                  {item?.attachmentMeta?.name}
                </Text>
                <View style={styles.alignRow}>
                  {/* document page count text */}
                  {item?.attachmentMeta?.pageCount ? (
                    <>
                      <Text
                        style={StyleSheet.flatten([
                          styles.docDetail,
                          documentDetailStyle,
                          {
                            display:
                              showPageCount !== undefined
                                ? showPageCount
                                  ? 'flex'
                                  : 'none'
                                : 'flex',
                          },
                        ])}>
                        {item?.attachmentMeta?.pageCount}
                      </Text>
                      <Image
                        source={require('../../../assets/images/single_dot3x.png')}
                        resizeMode={'contain'}
                        style={StyleSheet.flatten([
                          styles.dotImageSize,
                          {
                            display:
                              showPageCount !== undefined
                                ? showPageCount &&
                                  (showDocumentFormat || showDocumentSize)
                                  ? 'flex'
                                  : 'none'
                                : 'flex',
                          },
                        ])}
                      />
                    </>
                  ) : null}
                  {/* document size text */}
                  <Text
                    style={StyleSheet.flatten([
                      styles.docDetail,
                      documentDetailStyle,
                      {
                        display:
                          showDocumentSize !== undefined
                            ? showDocumentSize
                              ? 'flex'
                              : 'none'
                            : 'flex',
                      },
                    ])}>
                    {item.attachmentMeta.size
                      ? formatBytes(item.attachmentMeta.size)
                      : ''}
                  </Text>
                  <Image
                    source={require('../../../assets/images/single_dot3x.png')}
                    resizeMode={'contain'}
                    style={StyleSheet.flatten([
                      styles.dotImageSize,
                      {
                        display:
                          (showDocumentSize && showDocumentFormat) !== undefined
                            ? showDocumentSize && showDocumentFormat
                              ? 'flex'
                              : 'none'
                            : 'flex',
                      },
                    ])}
                  />
                  {/* document format text */}
                  <Text
                    style={StyleSheet.flatten([
                      styles.docDetail,
                      documentDetailStyle,
                      {
                        textTransform: 'uppercase',
                        display:
                          showDocumentFormat !== undefined
                            ? showDocumentFormat
                              ? 'flex'
                              : 'none'
                            : 'flex',
                      },
                    ])}>
                    PDF
                  </Text>
                </View>
              </View>
              {/* this renders the cancel button */}
              {showCancel && (
                <LMButton
                  onTap={onCancel ? () => onCancel(index) : () => null}
                  buttonStyle={styles.cancelButton}
                  icon={{
                    assetPath: require('../../../assets/images/crossCircle_icon3x.png'),
                    type: 'png',
                    height: 22,
                    width: 22,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      ))}
      {/* this renders the show more button */}
      {showMoreText && attachments.length > 2 && !showFullList && (
        <TouchableOpacity
          activeOpacity={0.8}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={() => setShowFullList(true)}
          style={styles.showMoreView}
          accessibilityRole="button">
          <LMText textStyle={StyleSheet.flatten([styles.showMoreText])}
          >{`+ ${attachments.length - 2} More`}</LMText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postMedia: {
    width: '100%',
  },
  docView: {
    flexDirection: 'row',
    borderColor: STYLES.$COLORS.LIGHT_GREY,
    borderWidth: 1,
    marginHorizontal: 15,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 5,
    height: 70,
    alignItems: 'center',
  },
  pdfIcon: {
    width: 28,
    height: 36,
  },
  alignRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docTitle: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  docDetail: {
    color: '#666666',
    fontSize: 13,
  },
  dotImageSize: {
    width: layout.normalize(5),
    height: layout.normalize(5),
    marginHorizontal: 5,
    tintColor: '#666666',
  },
  showMoreText: {
    fontSize: 16,
    color: STYLES.$COLORS.THEME,
  },
  documentDetailView: {
    marginLeft: 12,
    width: '90%',
    height: 36,
  },
  detailViewWithCancelOption: {
    marginLeft: 12,
    width: '72%',
    height: 36,
  },
  cancelButton: {
    marginLeft: 30,
    borderWidth: 0,
  },
  showMoreView: {paddingHorizontal: 15, marginTop: 8},
});

export default LMDocument;
