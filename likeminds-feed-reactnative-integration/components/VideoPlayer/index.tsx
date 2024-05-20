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
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { SET_MUTED_STATE } from "../../store/types/types";

function VideoPlayer({ url }) {
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
      setClicked(false);
    }, 3000);
  };

  const muteStatus = useAppSelector((state) => state.feed.muteStatus);
  useEffect(() => {
    setMute(muteStatus);
  }, [muteStatus]);

  return (
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
                      ? require("../../assets/images/muted.png")
                      : require("../../assets/images/unmute.png")
                  }
                  style={{
                    height: 25,
                    width: 25,
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
  );
}

export default VideoPlayer;
