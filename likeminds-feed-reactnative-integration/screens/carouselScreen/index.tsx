import { View, Text, Image, TouchableOpacity, BackHandler } from "react-native";
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
import { STATUS_BAR_STYLE } from "../../store/types/types";
import { useAppDispatch } from "../../store/store";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { VideoPlayer } from "../../components";

const CarouselScreen = ({ navigation, route }: any) => {
  const dispatch = useAppDispatch();
  const { index, dataObject, backIconPath } = route.params;
  const data = dataObject?.attachments;

  let imageCount = 0;
  let videoCount = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].attachmentType == VIDEO_ATTACHMENT_TYPE) {
      videoCount++;
    } else if (data[i].attachmentType === IMAGE_ATTACHMENT_TYPE) {
      imageCount++;
    }
  }
  const userName = dataObject?.user?.name;
  const date: Date = new Date(dataObject?.createdAt);
  // Convert UTC to IST
  date.setMinutes(date.getMinutes() + 330); // 5 hours and 30 minutes offset

  // Format the date as "DD MMM YYYY" (e.g., "09 May 2024") without dashes
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const formattedDate: string = date
    .toLocaleDateString("en-IN", dateOptions)
    .replace(/-/g, " ");

  // Format the time in 24-hour format as "HH:MM" (e.g., "12:30")
  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const formattedTime: string = date.toLocaleTimeString("en-IN", timeOptions);

  // const carouselScreenStyles = STYLES.$CAROUSEL_SCREEN_STYLE;
  // const headerTitle = carouselScreenStyles?.headerTitle;
  // const headerSubtitle = carouselScreenStyles?.headerSubtitle;

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
      navigation.goBack();
      return true;
    }

    const backHandlerAndroid = BackHandler.addEventListener(
      "hardwareBackPress",
      backActionCall
    );

    return () => backHandlerAndroid.remove();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.header}>
        <View style={styles.headingContainer}>
          <View style={styles.headerElement}>
            <TouchableOpacity
              style={{ padding: Layout.normalize(10) }}
              onPress={() => {
                navigation.goBack();
                dispatch({
                  type: STATUS_BAR_STYLE,
                  body: { color: STYLES.$STATUS_BAR_STYLE.default },
                });
              }}
            >
              {backIconPath ? (
                <Image source={backIconPath} style={styles.backBtn} />
              ) : (
                <Image
                  source={require("../../assets/images/backArrow_icon3x.png")}
                  style={styles.backBtn}
                />
              )}
            </TouchableOpacity>
            <View style={styles.chatRoomInfo}>
              <Text
                style={{
                  // color: headerTitle?.color
                  //   ? headerTitle?.color
                  color: STYLES.$COLORS.TERTIARY,
                  // fontSize: headerTitle?.fontSize
                  //   ? headerTitle?.fontSize
                  fontSize: STYLES.$FONT_SIZES.LARGE,
                  // fontFamily: headerTitle?.fontFamily
                  //   ? headerTitle?.fontFamily
                  fontFamily: STYLES.$FONT_TYPES.BOLD,
                }}
              >
                {userName}
              </Text>
              <Text
                style={{
                  // color: headerSubtitle?.color
                  //   ? headerSubtitle?.color
                  color: STYLES.$COLORS.TERTIARY,
                  // fontSize: headerSubtitle?.fontSize
                  //   ? headerSubtitle?.fontSize
                  fontSize: STYLES.$FONT_SIZES.SMALL,
                  // fontFamily: headerSubtitle?.fontFamily
                  //   ? headerSubtitle?.fontFamily
                  fontFamily: STYLES.$FONT_TYPES.MEDIUM,
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
                <ReactNativeZoomableView
                  maxZoom={30}
                  contentWidth={300}
                  contentHeight={150}
                >
                  <Image
                    style={styles.image}
                    source={{ uri: item?.attachmentMeta?.url }}
                  />
                </ReactNativeZoomableView>
              ) : item?.attachmentType === VIDEO_ATTACHMENT_TYPE ? (
                <VideoPlayer url={item?.attachmentMeta?.url} />
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
};

export default CarouselScreen;
