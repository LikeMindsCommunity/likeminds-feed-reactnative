import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import Layout from "../../constants/Layout";
import {
  IMAGE_ATTACHMENT_TYPE,
  PHOTOS_TEXT,
  PHOTO_TEXT,
  VIDEOS_TEXT,
  VIDEO_ATTACHMENT_TYPE,
  VIDEO_TEXT,
} from "../../constants/Strings";
import styles from "./styles";
import STYLES from "../../constants/Styles";
import {
  SET_FLOW_TO_CAROUSEL_SCREEN,
  STATUS_BAR_STYLE,
} from "../../store/types/types";
import { useAppDispatch } from "../../store/store";
import LMVideoPlayer from "../../components/LMVideoPlayer";
import ImageViewer from "react-native-image-zoom-viewer";
import { CallBack } from "../../callBacks/callBackClass";

const CarouselScreen = ({ navigation, route }: any) => {
  const dispatch = useAppDispatch();
  const { index, dataObject } = route.params;
  const [disableGesture, setDisableGesture] = useState(false)
  const data = dataObject?.attachments;

  const attachmentsUrls = data?.map((item) => ({
    ["url"]: item.attachmentMeta.url,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  let imageCount = 0;
  let videoCount = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].attachmentType == VIDEO_ATTACHMENT_TYPE) {
      videoCount++;
    } else if (data[i].attachmentType === IMAGE_ATTACHMENT_TYPE) {
      imageCount++;
    }
  }
  const userName = dataObject?.user?.name ?? "";
  const date: Date = new Date(dataObject?.createdAt ?? Date.now());
  // Convert UTC to IST
  date.setMinutes(date.getMinutes() + 330); // 5 hours and 30 minutes offset

  // Format the date as "DD MMM YYYY" (e.g., "09 May 2024") without dashes
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: Platform.OS === "ios" ? "Asia/Calcutta" : "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const formattedDate: string = date
    .toLocaleDateString("en-IN", dateOptions)
    .replace(/-/g, " ");

  // Format the time in 24-hour format as "HH:MM" (e.g., "12:30")
  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: Platform.OS === "ios" ? "Asia/Calcutta" : "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formattedTime: string = date.toLocaleTimeString("en-IN", timeOptions);

  const carouselScreenStyle = STYLES.$CAROUSEL_SCREEN_STYLE

  const headerTitle = carouselScreenStyle?.headerTitle;
  const headerSubtitle = carouselScreenStyle?.headerSubtitle;
  const backIconPath = carouselScreenStyle?.backIconPath;
  const isBackIconLocalPath = carouselScreenStyle?.isBackIconLocalPath;
  const backIconStyle = carouselScreenStyle?.backIconStyle;
  const backIconStylesArray = backIconStyle ? [backIconStyle] : [];

  const lmFeedInterface = CallBack.lmFeedInterface;

  let countText = "";

  if (imageCount > 0 && videoCount > 0) {
    countText = `${imageCount} ${
      imageCount > 1 ? PHOTOS_TEXT : PHOTO_TEXT
    }, ${videoCount} ${videoCount > 1 ? VIDEOS_TEXT : VIDEO_TEXT}`;
  } else if (imageCount > 0) {
    countText = `${imageCount > 1 ? `${imageCount} ${PHOTOS_TEXT}` : ""}`;
  } else if (videoCount > 0) {
    countText = `${videoCount > 1 ? `${videoCount} ${VIDEOS_TEXT}` : ""}`;
  }

  const setInitialHeader = () => {
    navigation.setOptions({
      headerShown: false,
    });
  };

  useEffect(() => {
    setInitialHeader();
  }, []);

  useEffect(() => {
    function backActionCall() {
      dispatch({
        type: STATUS_BAR_STYLE,
        body: { color: STYLES.$STATUS_BAR_STYLE.default },
      });
      dispatch({
        type: SET_FLOW_TO_CAROUSEL_SCREEN,
        body: { flowToCarouselScreen: false },
      });
      navigation.goBack();
      return true;
    }

    const backHandlerAndroid = BackHandler.addEventListener(
      "hardwareBackPress",
      backActionCall
    );

    return () => backHandlerAndroid.remove();
  }, []);

  const renderLoading = () => {
    return <ActivityIndicator color={"white"} size={"large"} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.header}>
        <View style={styles.headingContainer}>
          <View style={styles.headerElement}>
            <TouchableOpacity
              style={{ padding: Layout.normalize(10) }}
              onPress={() => {
                lmFeedInterface?.onBackPressOnCarouselScreen
                  ? lmFeedInterface?.onBackPressOnCarouselScreen()
                  : navigation.goBack();
                dispatch({
                  type: STATUS_BAR_STYLE,
                  body: { color: STYLES.$STATUS_BAR_STYLE.default },
                });
                dispatch({
                  type: SET_FLOW_TO_CAROUSEL_SCREEN,
                  body: { flowToCarouselScreen: false },
                });
              }}
            >
              <Image
                source={
                  isBackIconLocalPath && backIconPath
                    ? backIconPath
                    : !isBackIconLocalPath && backIconPath
                    ? { uri: backIconPath }
                    : require("../../assets/images/backArrow_icon3x.png")
                }
                style={[styles.backBtn, ...backIconStylesArray]}
              />
            </TouchableOpacity>
            <View style={styles.chatRoomInfo}>
              <Text
                style={{
                  color: headerTitle?.color
                    ? headerTitle?.color
                    : STYLES.$COLORS.TERTIARY,
                  fontSize: headerTitle?.fontSize
                    ? headerTitle?.fontSize
                    : STYLES.$FONT_SIZES.LARGE,
                  fontFamily: headerTitle?.fontFamily
                    ? headerTitle?.fontFamily
                    : STYLES.$FONT_TYPES.BOLD,
                }}
              >
                {userName}
              </Text>
              <Text
                style={{
                  color: headerSubtitle?.color
                    ? headerSubtitle?.color
                    : STYLES.$COLORS.TERTIARY,
                  fontSize: headerSubtitle?.fontSize
                    ? headerSubtitle?.fontSize
                    : STYLES.$FONT_SIZES.SMALL,
                  fontFamily: headerSubtitle?.fontFamily
                    ? headerSubtitle?.fontFamily
                    : STYLES.$FONT_TYPES.MEDIUM,
                }}
              >
                {`${
                  countText ? `${countText} • ` : ""
                }${formattedDate}, ${formattedTime}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <SwiperFlatList
        data={data}
        disableGesture={disableGesture}
        index={index}
        renderItem={({ item, index }) => {
          return (
            <View
              key={item + index}
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              {item?.attachmentType === IMAGE_ATTACHMENT_TYPE ? (
                <ImageViewer
                  imageUrls={attachmentsUrls}
                  style={styles.image}
                  enablePreload={true}
                  index={index}
                  useNativeDriver={true}
                  enableSwipeDown={false}
                  loadingRender={renderLoading}
                  saveToLocalByLongPress={false}
                  renderIndicator={(currentIndex, allSize) => {
                    return (
                      <Text style={{ display: "none" }}>
                        {currentIndex} / {allSize}
                      </Text>
                    );
                  }}
                />
              ) : item?.attachmentType === VIDEO_ATTACHMENT_TYPE &&
                index === currentIndex ? (
                <LMVideoPlayer url={item?.attachmentMeta?.url} setDisableGesture={setDisableGesture} />
              ) : item?.attachmentType === VIDEO_ATTACHMENT_TYPE &&
                index !== currentIndex ? (
                <Image
                  style={styles.image}
                  source={{
                    uri: item?.attachmentMeta?.thumbnailUrl,
                  }}
                />
              ) : null}
            </View>
          );
        }}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
      />
    </View>
  );
};

export default CarouselScreen;
