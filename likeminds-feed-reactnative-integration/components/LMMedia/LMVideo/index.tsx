import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
// @ts-ignore the lib do not have TS declarations yet
import Video, { VideoRef } from "react-native-video";
import { LMVideoProps } from "./types";
import { MEDIA_FETCH_ERROR } from "../../../constants/Strings";
import LMLoader from "../../LMLoader";
import { LMButton } from "../../../uiComponents";
import { defaultStyles } from "./styles";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { SET_MUTED_STATE } from "../../../store/types/types";

const LMVideo = React.memo(
  ({
    postId,
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
    showMuteUnmute,
    errorWidget,
    showCancel,
    onCancel,
    cancelButton,
    videoInFeed,
    videoInCarousel,
    currentVideoInCarousel,
    showPlayPause,
  }: LMVideoProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [playingStatus, setPlayingStatus] = useState(true);
    const [viewController, setViewController] = useState(
      showControls ? showControls : true
    );
    const player = useRef<VideoRef>(null);
    const [paused, setPaused] = useState(true);

    const currentVideoId = useAppSelector(
      (state) => state.feed.autoPlayVideoPostId
    );

    const [mute, setMute] = useState(false);
    const dispatch = useAppDispatch();
    const muteStatus = useAppSelector((state) => state.feed.muteStatus);
    useEffect(() => {
      setMute(muteStatus);
    }, [muteStatus]);

    return (
      <View
        style={StyleSheet.flatten([defaultStyles.videoContainer, boxStyle])}
      >
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
            ref={player}
            source={{ uri: videoUrl }}
            key={videoUrl}
            onLoad={() => {
              player.current.seek(0); // this will set first frame of video as thumbnail
              setLoading(false);
            }}
            onError={() => setError(true)}
            repeat={looping ? looping : true}
            resizeMode={boxFit ? boxFit : defaultStyles.videoStyle.resizeMode}
            playWhenInactive={false}
            playInBackground={false}
            ignoreSilentSwitch="obey"
            /* @ts-ignore */
            style={StyleSheet.flatten([
              videoStyle,
              {
                width: width ? width : defaultStyles.videoStyle.width,
                height: height ? height : defaultStyles.videoStyle.height,
                aspectRatio: aspectRatio ? aspectRatio : undefined,
              },
            ])}
            paused={
              // Will work on below commented code while working on autoplay ticket
              // videoInFeed
              //   ? autoPlay
              //     ? currentVideoId === postId
              //       ? videoInCarousel
              //         ? currentVideoInCarousel === videoUrl
              //           ? false
              //           : true
              //         : false
              //       : true
              //     : playingStatus
              //   : autoPlay
              //   ? videoInCarousel
              //     ? currentVideoInCarousel === videoUrl
              //       ? false
              //       : true
              //     : false
              //   : playingStatus
              paused
            } // handles the auto play/pause functionality
            muted={mute}
          />
        </>
        {/* this renders the cancel button */}
        {showCancel && (
          <View style={defaultStyles.cancelVideoView}>
            {cancelButton ? (
              <LMButton
                {...cancelButton}
                onTap={
                  onCancel
                    ? () => {
                        onCancel(videoUrl);
                        cancelButton?.onTap();
                      }
                    : () => null
                }
              />
            ) : (
              <LMButton
                onTap={onCancel ? () => onCancel(videoUrl) : () => null}
                buttonStyle={defaultStyles.cancelButtonStyle}
                icon={{
                  assetPath: require("../../../assets/images/crossCircle_icon3x.png"),
                  height: 22,
                  width: 22,
                }}
              />
            )}
          </View>
        )}

        {/* this renders the mute/unmute button */}
        {showMuteUnmute && (
          <View style={defaultStyles.muteUnmuteVideoView}>
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
                    ? require("../../../assets/images/muted.png")
                    : require("../../../assets/images/unmute.png")
                }
                style={{
                  height: 25,
                  width: 25,
                  tintColor: "white",
                }}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* this renders the controls view */}
        {!autoPlay && (
          <TouchableOpacity
            activeOpacity={0.8}
            // todo: handle later
            // onPress={() => setViewController(false)}
            style={[
              defaultStyles.videoStyle,
              defaultStyles.videoControllerView,
            ]}
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
                {!playingStatus ? (
                  pauseButton ? (
                    pauseButton
                  ) : (
                    <Image
                      source={require("../../../assets/images/pause_icon3x.png")}
                      style={defaultStyles.playPauseIconSize}
                    />
                  )
                ) : playButton ? (
                  playButton
                ) : (
                  <Image
                    source={require("../../../assets/images/play_icon3x.png")}
                    style={defaultStyles.playPauseIconSize}
                  />
                )}
              </>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {showPlayPause && (
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: "100%",
              position: "absolute",
              backgroundColor: "rgba(0,0,0,.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setPaused(!paused);
              }}
            >
              <Image
                source={
                  paused
                    ? require("../../../assets/images/play-button.png")
                    : require("../../../assets/images/pause-button.png")
                }
                style={{
                  width: 40,
                  height: 40,
                  tintColor: "white",
                }}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
);

export default LMVideo;
