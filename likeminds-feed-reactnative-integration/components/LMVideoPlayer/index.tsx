import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import styles from "./styles";
import STYLES from "../../constants/Styles";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { SET_MUTED_STATE } from "../../store/types/types";
import Slider from "@react-native-community/slider";
import RNVideo from "../../optionalDependencies/Video";
import { useLMFeed } from "../../lmFeedProvider";

function LMVideoPlayer({ url, setDisableGesture }) {
  const { videoCarouselCallback } = useLMFeed();
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

  const dispatch = useAppDispatch();

  const resetClicked = () => {
    setTimeout(() => {
      setDisableGesture(false);
      setClicked(false);
    }, 3000);
  };

  const muteStatus = useAppSelector((state) => state.feed.muteStatus);
  useEffect(() => {
    setMute(muteStatus);
  }, [muteStatus]);

  const carouselScreenStyle = STYLES.$CAROUSEL_SCREEN_STYLE;
  const thumbImage = carouselScreenStyle?.sliderThumbImage;
  const thumbTintColor = carouselScreenStyle?.thumbTintColor;
  const minimumTrackTintColor = carouselScreenStyle?.minimumTrackTintColor;
  const maximumTrackTintColor = carouselScreenStyle?.maximumTrackTintColor;
  const startTimeStyle = carouselScreenStyle?.startTimeStyle;
  const endTimeStyle = carouselScreenStyle?.endTimeStyle;

  const playIconPath = carouselScreenStyle?.playIconPath;
  const isPlayIconLocalPath = carouselScreenStyle?.isPlayIconLocalPath;
  const playIconStyle = carouselScreenStyle?.playIconStyle;

  const pauseIconPath = carouselScreenStyle?.pauseIconPath;
  const isPauseIconLocalPath = carouselScreenStyle?.isPauseIconLocalPath;
  const pauseIconStyle = carouselScreenStyle?.pauseIconStyle;

  const muteIconPath = carouselScreenStyle?.muteIconPath;
  const isMuteIconLocalPath = carouselScreenStyle?.isMuteIconLocalPath;
  const muteIconStyle = carouselScreenStyle?.muteIconStyle;

  const unmuteIconPath = carouselScreenStyle?.unmuteIconPath;
  const isUnmuteIconLocalPath = carouselScreenStyle?.isUnmuteIconLocalPath;
  const unmuteIconStyle = carouselScreenStyle?.unmuteIconStyle;

  return (
    <View style={styles.video}>
      <TouchableOpacity
        style={styles.video}
        onPress={() => {
          if (progress !== null) {
            setDisableGesture(true);
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
        {RNVideo ? (
          <RNVideo
            paused={puased}
            source={{
              uri: url,
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
              setProgress({ ...progress, currentTime: 0 }); // Reset seek position
              ref.current.seek(0); // Seek to the beginning of the video
            }}
            onError={(err) => console.log("err", err)}
          />
        ) : (
          videoCarouselCallback({
            paused: puased,
            source: url,
            ref: ref,
            setProgress: setProgress,
            muted: mute,
            setPaused,
          })
        )}
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
                      ? isPlayIconLocalPath && playIconPath
                        ? playIconPath
                        : !isPlayIconLocalPath && playIconPath
                        ? { uri: playIconPath }
                        : require("../../assets/images/play-button.png")
                      : isPauseIconLocalPath && pauseIconPath
                      ? pauseIconPath
                      : !isPauseIconLocalPath && pauseIconPath
                      ? { uri: pauseIconPath }
                      : require("../../assets/images/pause-button.png")
                  }
                  style={{
                    width: 40,
                    height: 40,
                    tintColor: "white",
                    ...(puased ? playIconStyle : pauseIconStyle),
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
                paddingHorizontal: 10, // Combine left and right padding for consistency
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: STYLES.$FONT_TYPES.LIGHT,
                  ...startTimeStyle,
                }}
              >
                {format(progress.currentTime)}
              </Text>
              <Slider
                style={{ flex: 1, height: 40, marginHorizontal: 5 }} // Use flex to dynamically allocate space
                minimumValue={0}
                maximumValue={progress.seekableDuration}
                minimumTrackTintColor={
                  minimumTrackTintColor ? minimumTrackTintColor : "#FFFFFF"
                }
                maximumTrackTintColor={
                  maximumTrackTintColor ? maximumTrackTintColor : "#FFFFFF"
                }
                step={0}
                value={progress.currentTime}
                onValueChange={(x) => {
                  ref.current.seek(x);
                }}
                thumbTintColor={thumbTintColor ? thumbTintColor : "green"}
              />
              <Text
                style={{
                  color: "white",
                  marginRight: 10,
                  fontFamily: STYLES.$FONT_TYPES.LIGHT,
                  ...endTimeStyle,
                }}
              >
                {format(progress.seekableDuration)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  let currentMuteStatus = mute;
                  setMute(!currentMuteStatus);
                  dispatch({
                    type: SET_MUTED_STATE,
                    body: { mute: !currentMuteStatus },
                  });
                }}
              >
                <Image
                  source={
                    mute
                      ? isMuteIconLocalPath && muteIconPath
                        ? muteIconPath
                        : !isMuteIconLocalPath && muteIconPath
                        ? { uri: muteIconPath }
                        : require("../../assets/images/muted.png")
                      : isUnmuteIconLocalPath && unmuteIconPath
                      ? unmuteIconPath
                      : !isUnmuteIconLocalPath && unmuteIconPath
                      ? { uri: unmuteIconPath }
                      : require("../../assets/images/unmute.png")
                  }
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: "white",
                    ...(mute ? muteIconStyle : unmuteIconStyle),
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
  );
}

export default LMVideoPlayer;
