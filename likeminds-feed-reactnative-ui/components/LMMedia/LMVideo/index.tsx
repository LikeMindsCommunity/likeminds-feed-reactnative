import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React, { useState } from "react";
// @ts-ignore the lib do not have TS declarations yet
import Video from "react-native-video";
import { LMVideoProps } from "./types";
import { MEDIA_FETCH_ERROR } from "../../../constants/strings";
import LMLoader from "../../LMLoader";
import LMButton from "../../LMButton";
import { defaultStyles } from "./styles";

const LMVideo = ({
  videoUrl,
  height,
  width,
  videoStyle,
  boxFit,
  boxStyle,
  aspectRatio,
  showControls,
  autoPlay,
  looping,
  loaderWidget,
  pauseButton,
  playButton,
  errorWidget,
  currentVideoUrl,
  showCancel,
  onCancel,
}: LMVideoProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playingStatus, setPlayingStatus] = useState(true);
  const [viewController, setViewController] = useState(showControls);

  // this throw error and ask for currentVideoUrl if auto play is set true
  if (autoPlay && !currentVideoUrl) {
    throw new Error(
      "Property 'currentVideoUrl' is missing in type '{ videoUrl: string; autoPlay: true; }' but required in type 'LMVideoProps'."
    );
  }

  return (
    <View style={StyleSheet.flatten([defaultStyles.videoContainer, boxStyle])}>
      {/* this renders the loader until the first picture of video is displayed */}
      {loading ? (
        <View style={[defaultStyles.videoStyle, defaultStyles.loaderView]}>
          {loaderWidget ? loaderWidget : <LMLoader />}
        </View>
      ) : null}

      {/* this shows a error if the media is not fetched */}
      {error ? (
        <View style={[defaultStyles.videoStyle, defaultStyles.errorView]}>
          {errorWidget ? (
            errorWidget
          ) : (
            <Text style={defaultStyles.errorText}>{MEDIA_FETCH_ERROR}</Text>
          )}
        </View>
      ) : null}

      {/* this renders the video */}
      <>
        <Video
          source={{ uri: videoUrl }}
          key={videoUrl}
          onReadyForDisplay={() => setLoading(false)}
          onError={() => setError(true)}
          repeat={looping ? looping : true}
          resizeMode={boxFit ? boxFit : defaultStyles.videoStyle.resizeMode}
          playWhenInactive={false}
          playInBackground={false}
          style={StyleSheet.flatten([
            videoStyle,
            {
              width: width ? width : defaultStyles.videoStyle.width,
              height: height ? height : defaultStyles.videoStyle.height,
              aspectRatio: aspectRatio ? aspectRatio : undefined,
            },
          ])}
          paused={
            autoPlay
              ? currentVideoUrl === videoUrl
                ? false
                : true
              : playingStatus
          } // handles the auto play/pause functionality
          muted={
            autoPlay
              ? currentVideoUrl === videoUrl
                ? false
                : true
              : playingStatus
              ? true
              : false
          } // this handles the mute of the video according to the video being played
        />
      </>
      {/* this renders the cancel button */}
      {showCancel && (
        <View style={defaultStyles.cancelVideoView}>
          <LMButton
            onTap={onCancel ? () => onCancel(videoUrl) : () => null}
            buttonStyle={defaultStyles.cancelButtonStyle}
            icon={{
              assetPath: require("../../../assets/images/crossCircle_icon3x.png"),
              type: "png",
              height: 22,
              width: 22,
            }}
          />
        </View>
      )}

      {/* this renders the controls view */}
      {viewController && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setViewController(false)}
          style={[defaultStyles.videoStyle, defaultStyles.videoControllerView]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={defaultStyles.controllerZIndex}
            onPress={() => {
              setPlayingStatus(!playingStatus);
            }}
          >
            <>
              {/* this handles the toggle of play pause icon */}
              {playingStatus ? (
                playButton ? (
                  playButton
                ) : (
                  <Image
                    source={require("../../../assets/images/play_icon3x.png")}
                    style={defaultStyles.playPauseIconSize}
                  />
                )
              ) : pauseButton ? (
                pauseButton
              ) : (
                <Image
                  source={require("../../../assets/images/pause_icon3x.png")}
                  style={defaultStyles.playPauseIconSize}
                />
              )}
            </>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LMVideo;
