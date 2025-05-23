import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { LMDocumentProps } from "./types";
import { formatBytes } from "../../../utils";
import { MIN_DOCUMENT_ITEM } from "../../../constants/Strings";
import { LMText, LMButton, LMIcon } from "../../../uiComponents";
import { styles } from "./styles";
import { viewDocument } from "../../../utils/mediaSelection";

const LMDocument = React.memo(
  ({
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
    cancelButton,
    showMoreTextStyle,
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
                item?.metaData?.url
                  ? item?.metaData?.url.includes("https://")
                    ? Linking.openURL(item?.metaData?.url)
                    : viewDocument(item?.metaData?.url)
                  : null;
                onTap && onTap();
              }}
              key={index}
              style={styles.postMedia}
            >
              <View
                style={StyleSheet.flatten([styles.docView, documentViewStyle])}
              >
                {/* checks if there is any custom pdf icon is present or not */}
                {documentIcon ? (
                  <LMIcon
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
                    source={require("../../../assets/images/pdf_icon3x.png")}
                    resizeMode={"contain"}
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
                  }
                >
                  {/* document title */}
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={StyleSheet.flatten([
                      styles.docTitle,
                      documentTitleStyle,
                    ])}
                  >
                    {item?.metaData?.name}
                  </Text>
                  <View style={styles.alignRow}>
                    {/* document page count text */}
                    {item?.metaData?.pageCount ? (
                      <>
                        <Text
                          style={StyleSheet.flatten([
                            styles.docDetail,
                            documentDetailStyle,
                            {
                              display:
                                showPageCount !== undefined
                                  ? showPageCount
                                    ? "flex"
                                    : "none"
                                  : "flex",
                            },
                          ])}
                        >
                          {item?.metaData?.pageCount > 1
                            ? `${item?.metaData?.pageCount} Pages`
                            : `${item?.metaData?.pageCount} Page`}
                        </Text>
                        <Image
                          source={require("../../../assets/images/single_dot3x.png")}
                          resizeMode={"contain"}
                          style={StyleSheet.flatten([
                            styles.dotImageSize,
                            {
                              display:
                                showPageCount !== undefined
                                  ? showPageCount &&
                                    (showDocumentFormat || showDocumentSize)
                                    ? "flex"
                                    : "none"
                                  : "flex",
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
                                ? "flex"
                                : "none"
                              : "flex",
                        },
                      ])}
                    >
                      {item.metaData?.size
                        ? formatBytes(item.metaData?.size)
                        : ""}
                    </Text>
                    <Image
                      source={require("../../../assets/images/single_dot3x.png")}
                      resizeMode={"contain"}
                      style={StyleSheet.flatten([
                        styles.dotImageSize,
                        {
                          display:
                            (showDocumentSize && showDocumentFormat) !==
                            undefined
                              ? showDocumentSize && showDocumentFormat
                                ? "flex"
                                : "none"
                              : "flex",
                        },
                      ])}
                    />
                    {/* document format text */}
                    <Text
                      style={StyleSheet.flatten([
                        styles.docDetail,
                        documentDetailStyle,
                        {
                          textTransform: "uppercase",
                          display:
                            showDocumentFormat !== undefined
                              ? showDocumentFormat
                                ? "flex"
                                : "none"
                              : "flex",
                        },
                      ])}
                    >
                      PDF
                    </Text>
                  </View>
                </View>
                {/* this renders the cancel button */}
                {showCancel && (
                  <>
                    {cancelButton ? (
                      <LMButton
                        {...cancelButton}
                        onTap={
                          onCancel
                            ? () => {
                                onCancel(index);
                                cancelButton.onTap();
                              }
                            : () => null
                        }
                      />
                    ) : (
                      <LMButton
                        onTap={onCancel ? () => onCancel(index) : () => null}
                        buttonStyle={styles.cancelButton}
                        icon={{
                          assetPath: require("../../../assets/images/crossCircle_icon3x.png"),
                          height: 22,
                          width: 22,
                        }}
                      />
                    )}
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        ))}
        {/* this renders the show more button */}
        {showMoreText && attachments.length > 2 && !showFullList && (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => setShowFullList(true)}
            style={styles.showMoreView}
            accessibilityRole="button"
          >
            <LMText
              textStyle={StyleSheet.flatten([
                styles.showMoreText,
                showMoreTextStyle,
              ])}
            >{`+ ${attachments.length - 2} More`}</LMText>
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

export default LMDocument;
