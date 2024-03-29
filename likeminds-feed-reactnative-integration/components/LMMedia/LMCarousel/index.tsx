import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import SwiperFlatList from "react-native-swiper-flatlist";
import { LMCarouselProps } from "./types";
import LMImage from "../LMImage";
import LMVideo from "../LMVideo";
import STYLES from "../../../constants/Styles";
import { IMAGE_ATTACHMENT_TYPE, VIDEO_ATTACHMENT_TYPE } from "../../../constants/Strings";
import { styles } from "./styles";

const LMCarousel = React.memo(({
  attachments,
  carouselStyle,
  paginationBoxStyle,
  activeIndicatorStyle,
  inactiveIndicatorStyle,
  imageItem,
  videoItem,
  showCancel,
  onCancel,
  cancelButton
}: LMCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastItem, setLastItem] = useState(false);

  // this handles the functionality to be execute on click of close icon
  const onCloseHandler = (index: number) => {
    onCancel ? onCancel(index) : () => null;
    if (attachments.length - 2 === activeIndex - 1) {
      setLastItem(true);
    }
  };

  return (
    <SwiperFlatList
      autoplay={lastItem ? true : false}
      autoplayLoopKeepAnimation={true}
      autoplayInvertDirection={lastItem ? true : false}
      autoplayDelay={0}
      data={attachments}
      showPagination
      onChangeIndex={({ index }) => {
        setActiveIndex(index);
        // conditon for stopping the autoplay
        if (attachments.length - 2 === activeIndex - 1) {
          setLastItem(false);
        }
      }}
      style={StyleSheet.flatten([styles.swiperView, carouselStyle])}
      // handling custom style of pagination container
      paginationStyle={StyleSheet.flatten([
        styles.paginationView,
        paginationBoxStyle,
      ])}
      // handling custom style of active pagination item
      paginationStyleItemActive={StyleSheet.flatten([
        styles.paginationItemStyle,
        { backgroundColor: STYLES.$COLORS.THEME },
        activeIndicatorStyle,
      ])}
      // handling custom style of inactive pagination item
      paginationStyleItemInactive={StyleSheet.flatten([
        styles.paginationItemStyle,
        { backgroundColor: STYLES.$COLORS.LIGHT_GREY },
        inactiveIndicatorStyle,
      ])}
      renderItem={({ item, index }) => (
        <View onStartShouldSetResponder={() => true}>
          {/* this section render image */}
          {item?.attachmentType === IMAGE_ATTACHMENT_TYPE && (
            <LMImage
              imageUrl={item?.attachmentMeta?.url}
              width={imageItem?.width}
              height={imageItem?.height}
              imageStyle={imageItem?.imageStyle}
              boxFit={imageItem?.boxFit}
              boxStyle={imageItem?.boxStyle}
              aspectRatio={imageItem?.aspectRatio}
              loaderWidget={imageItem?.loaderWidget}
              errorWidget={imageItem?.errorWidget}
              showCancel={
                imageItem?.showCancel ? imageItem?.showCancel : showCancel
              }
              onCancel={
                onCancel
                  ? () => onCloseHandler(index)
                  : () => {
                      imageItem?.onCancel;
                    }
              }
              cancelButton={cancelButton}
            />
          )}
          {/* this section render video */}
          {item?.attachmentType === VIDEO_ATTACHMENT_TYPE && (
            <LMVideo
              videoUrl={item?.attachmentMeta?.url}
              height={videoItem?.height}
              width={videoItem?.width}
              videoStyle={videoItem?.videoStyle}
              boxFit={videoItem?.boxFit}
              boxStyle={videoItem?.boxStyle}
              aspectRatio={videoItem?.aspectRatio}
              showControls={videoItem?.showControls}
              looping={videoItem?.looping}
              loaderWidget={videoItem?.loaderWidget}
              errorWidget={videoItem?.errorWidget}
              playButton={videoItem?.playButton}
              pauseButton={videoItem?.pauseButton}
              autoPlay={videoItem?.autoPlay}
              showCancel={
                videoItem?.showCancel ? videoItem?.showCancel : showCancel
              }
              onCancel={
                onCancel
                  ? () => onCloseHandler(index)
                  : () => {
                      videoItem?.onCancel;
                    }
              }
              cancelButton={cancelButton}
            />
          )}
        </View>
      )}
    />
  );
})

export default LMCarousel;
