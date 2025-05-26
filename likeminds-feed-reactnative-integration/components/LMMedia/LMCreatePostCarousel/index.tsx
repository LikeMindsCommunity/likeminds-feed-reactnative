import { StyleSheet, TouchableOpacity, View, Pressable } from "react-native";
import React, { useState } from "react";
import SwiperFlatList from "react-native-swiper-flatlist";
import { LMCarouselProps } from "../LMCarousel/types";
import LMImage from "../LMImage";
import LMCreatePostVideo from "../LMCreatePostVideo";
import STYLES from "../../../constants/Styles";
import {
  IMAGE_ATTACHMENT_TYPE,
  VIDEO_ATTACHMENT_TYPE,
} from "../../../constants/Strings";
import { styles } from "../LMCarousel/styles";
import { useAppDispatch } from "../../../store/store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SET_FLOW_TO_CAROUSEL_SCREEN,
  STATUS_BAR_STYLE,
} from "../../../store/types/types";
import { CAROUSEL_SCREEN } from "../../../constants/screenNames";
import { AttachmentType } from "@likeminds.community/feed-rn";

const LMCreatePostCarousel = React.memo(
  ({
    post,
    attachments,
    carouselStyle,
    paginationBoxStyle,
    activeIndicatorStyle,
    inactiveIndicatorStyle,
    imageItem,
    videoItem,
    showCancel,
    onCancel,
    cancelButton,
  }: LMCarouselProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lastItem, setLastItem] = useState(false);

    const navigation = useNavigation<StackNavigationProp<any>>();
    const dispatch = useAppDispatch();
    let routes = navigation.getState()?.routes;
    let previousRoute = routes[routes?.length - 2];

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
          { backgroundColor: STYLES.$COLORS.PRIMARY },
          activeIndicatorStyle,
        ])}
        // handling custom style of inactive pagination item
        paginationStyleItemInactive={StyleSheet.flatten([
          styles.paginationItemStyle,
          {
            backgroundColor: STYLES.$IS_DARK_THEME
              ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
              : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
          },
          inactiveIndicatorStyle,
        ])}
        renderItem={({ item, index }) => (
          <View
            style={styles.swiperListMediaContainer}
            onStartShouldSetResponder={() => true}
          >
            {/* this section render image */}
            {item?.type === AttachmentType.IMAGE && (
              <Pressable
                onPress={() => {
                  navigation.navigate(CAROUSEL_SCREEN, {
                    dataObject: post,
                    index,
                  });
                  dispatch({
                    type: STATUS_BAR_STYLE,
                    body: { color: STYLES.$STATUS_BAR_STYLE["light-content"] },
                  });
                  dispatch({
                    type: SET_FLOW_TO_CAROUSEL_SCREEN,
                    body: { flowToCarouselScreen: true },
                  });
                }}
              >
                <LMImage
                  imageUrl={item?.metaData?.url}
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
              </Pressable>
            )}
            {/* this section render video */}
            {item?.type === AttachmentType.VIDEO && (
              <Pressable
                onPress={() => {
                  navigation.navigate(CAROUSEL_SCREEN, {
                    dataObject: post,
                    index,
                  });
                  dispatch({
                    type: STATUS_BAR_STYLE,
                    body: {
                      color: STYLES.$STATUS_BAR_STYLE["light-content"],
                    },
                  });
                  dispatch({
                    type: SET_FLOW_TO_CAROUSEL_SCREEN,
                    body: { flowToCarouselScreen: true },
                  });
                }}
              >
                <LMCreatePostVideo
                  videoUrl={item?.metaData?.url}
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
                  autoPlay={
                    videoItem?.autoPlay != undefined
                      ? videoItem?.autoPlay
                      : true
                  }
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
                  videoInFeed={videoItem?.videoInFeed}
                  videoInCarousel={true}
                  currentVideoInCarousel={
                    attachments[activeIndex]?.metaData?.url
                  }
                  postId={videoItem?.postId}
                  showMuteUnmute={true}
                />
              </Pressable>
            )}
          </View>
        )}
      />
    );
  }
);

export default LMCreatePostCarousel;
