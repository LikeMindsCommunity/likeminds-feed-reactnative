import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
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
import { STATUS_BAR_STYLE } from "../../store/types/types";
import { useAppDispatch } from "../../store/store";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import Video from "react-native-video";
import Slider from "@react-native-community/slider";

const CarouselScreen = ({ navigation, route }: any) => {
  const video = useRef<any>(null);
  const dispatch = useAppDispatch();
  const { index, dataObject, backIconPath } = route.params;
  const data = dataObject?.attachments;

  const ref = useRef<any>();
  const [clicked, setClicked] = useState(false);
  const [puased, setPaused] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [mute, setMute] = useState(false);
  const format = (seconds) => {
    /* @ts-ignore */
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, "0");
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const resetClicked = () => {
    setTimeout(() => {
      setClicked(false);
    }, 3000);
  };

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
                <View style={styles.video}>
                  <TouchableOpacity
                    style={styles.video}
                    onPress={() => {
                      if (progress !== null) {
                        setClicked(true);
                        resetClicked(); // Reset clicked after 3 seconds
                      }
                    }}
                  >
                    {progress == null && (
                      <View style={styles.activityIndicatorContainer}>
                        <ActivityIndicator
                          size="large"
                          color={STYLES.$COLORS.SECONDARY}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 2,
                          }}
                        />
                      </View>
                    )}
                    <Video
                      paused={puased}
                      source={{
                        uri: item?.attachmentMeta?.url,
                      }}
                      ref={ref}
                      onProgress={(x) => {
                        setProgress(x);
                      }}
                      style={styles.videoPlayer}
                      resizeMode="contain"
                      muted={mute}
                      onEnd={() => {
                        setPaused(true); // Pause the video
                        setProgress({ currentTime: 0 }); // Reset seek position
                        ref.current.seek(0); // Seek to the beginning of the video
                      }}
                    />
                    {clicked && (
                      <TouchableOpacity
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          backgroundColor: "rgba(0,0,0,.5)",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            onPress={() => {
                              setPaused(!puased);
                            }}
                          >
                            <Image
                              source={
                                puased
                                  ? require("../../assets/images/play-button.png")
                                  : require("../../assets/images/pause-button.png")
                              }
                              style={{
                                width: 40,
                                height: 40,
                                tintColor: "white",
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            position: "absolute",
                            bottom: 0,
                            paddingLeft: 10,
                            paddingRight: 50,
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: "white" }}>
                            {format(progress.currentTime)}
                          </Text>
                          <Slider
                            style={{ width: "80%", height: 40 }}
                            minimumValue={0}
                            maximumValue={progress.seekableDuration}
                            minimumTrackTintColor="#FFFFFF"
                            maximumTrackTintColor="#FFFFFF"
                            step={0}
                            value={progress.currentTime}
                            onValueChange={(x) => {
                              ref.current.seek(x);
                            }}
                          />
                          <Text style={{ color: "white", marginRight: 10 }}>
                            {format(progress.seekableDuration)}
                          </Text>
                          <TouchableOpacity onPress={() => setMute(!mute)}>
                            <Image
                              source={
                                mute
                                  ? require("../../assets/images/muted.png")
                                  : require("../../assets/images/unmute.png")
                              }
                              style={{
                                height: mute ? 20 : 25,
                                width: mute ? 20 : 25,
                                tintColor: "white",
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            position: "absolute",
                            top: 10,
                            paddingLeft: 20,
                            paddingRight: 20,
                            alignItems: "center",
                          }}
                        ></View>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
};

export default CarouselScreen;
