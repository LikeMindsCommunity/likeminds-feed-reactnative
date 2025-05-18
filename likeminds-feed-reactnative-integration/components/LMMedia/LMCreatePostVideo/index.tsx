import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Dimensions,
    Platform,
  } from "react-native";
  import React, { useEffect, useRef, useState } from "react";
  // @ts-ignore the lib do not have TS declarations yet
  import { LMVideoProps } from "./types";
  import { MEDIA_FETCH_ERROR } from "../../../constants/Strings";
  import LMLoader from "../../LMLoader";
  import { LMButton } from "../../../uiComponents";
  import { defaultStyles } from "../LMVideo/styles";
  import { useAppDispatch, useAppSelector } from "../../../store/store";
  import { SET_MUTED_STATE } from "../../../store/types/types";
  import { useNavigation } from "@react-navigation/native";
  import { StackNavigationProp } from "@react-navigation/stack";
  import {
    CREATE_POST,
    POST_DETAIL,
    UNIVERSAL_FEED,
  } from "../../../constants/screenNames";
  import RNVideo from "../../../optionalDependencies/Video";
  import { useLMFeed } from "../../../lmFeedProvider";
  import Layout from "../../../constants/Layout"
  
  const LMCreatePostVideo = React.memo(
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
      showPlayPause
    }: LMVideoProps) => {
      const LMFeedProvider = useLMFeed();
      const videoCallback = LMFeedProvider?.videoCallback;
  
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(false);
      const [playingStatus, setPlayingStatus] = useState(true);
      const [viewController, setViewController] = useState(
        showControls ? showControls : true
      );
      const player = useRef<any>(null);
      const [paused, setPaused] = useState(true);
      const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
      const [heightCalculated, setHeightCalculated] = useState(0);
      const [desiredAspectRatio, setDesiredAspectRatio] = useState(0);
  
      const currentVideoId = useAppSelector(
        (state) => state.feed.autoPlayVideoPostId
      );
  
      const pauseStatus = useAppSelector((state) => state.feed.pauseStatus);
      const flowToCarouselScreen = useAppSelector(
        (state) => state.feed.flowToCarouselScreen
      );
      const flowToPostDetailScreen = useAppSelector(
        (state) => state.feed.flowToPostDetailScreen
      );
  
      const flowToCreatePostScreen = useAppSelector(
        (state) => state.feed.flowToCreatePostScreen
      );
      const flowFromCarouselScreen = useAppSelector(
        (state) => state.feed.flowFromCarouselScreen
      );
      const isReportModalOpened = useAppSelector(
        (state) => state.feed.reportModalOpenedInPostDetail
      );
  
      const navigation = useNavigation<StackNavigationProp<any>>();
      let routes = navigation.getState()?.routes;
      let previousRoute = routes[routes?.length - 2];
      let currentRoute = routes[routes.length - 1];
  
      const [mute, setMute] = useState(false);
      const dispatch = useAppDispatch();
      const muteStatus = useAppSelector((state) => state.feed.muteStatus);
      useEffect(() => {
        setMute(muteStatus);
      }, [muteStatus]);
  
      const onLoad = (data) => {
        const { width, height } = data.naturalSize;
        setDimensions({ width, height });
      };
  
      useEffect(() => {
        const screenWidth = Layout.window.width
        const desiredAspectRatio = width > height ? 1.91 : 0.8;
        const heightCalculated = screenWidth * (1 / desiredAspectRatio);
        setHeightCalculated(heightCalculated);
        setDesiredAspectRatio(desiredAspectRatio);
      }, [dimensions]);
  
      return (
        <View
          style={StyleSheet.flatten([defaultStyles.videoContainer, boxStyle])}
        >
          {/* this renders the loader until the first picture of video is displayed */}
          {loading ? (
            <View style={[defaultStyles.loaderView, videoStyle]}>
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
            {RNVideo ? (
              <RNVideo
                ref={player}
                source={{ uri: videoUrl }}
                key={videoUrl}
                onLoad={(data) => {
                  onLoad(data);
                  player.current.seek(0); // this will set first frame of video as thumbnail
                  setLoading(false);
                }}
                onError={() => setError(true)}
                repeat={
                  Platform.OS === "ios" ? (looping ? looping : true) : false
                }
                resizeMode={boxFit ? boxFit : defaultStyles.videoStyle.resizeMode}
                playWhenInactive={false}
                playInBackground={false}
                ignoreSilentSwitch="obey"
                bufferConfig={{
                  minBufferMs: 2500,
                  maxBufferMs: 5000,
                  bufferForPlaybackMs: 2500,
                  bufferForPlaybackAfterRebufferMs: 2500,
                }}
                /* @ts-ignore */
                style={StyleSheet.flatten([
                  videoStyle,
                  {
                    height: heightCalculated,
                    aspectRatio: aspectRatio ? aspectRatio : desiredAspectRatio,
                  },
                ])}
                paused={
                  flowFromCarouselScreen && currentVideoId === postId
                    ? false
                    : flowToCreatePostScreen
                    ? true
                    : pauseStatus === true &&
                      previousRoute?.name === UNIVERSAL_FEED &&
                      currentRoute?.name !== CREATE_POST
                    ? pauseStatus
                    : videoInFeed
                    ? autoPlay
                      ? currentVideoId === postId
                        ? videoInCarousel
                          ? currentVideoInCarousel === videoUrl
                            ? false
                            : true
                          : false
                        : true
                      : playingStatus
                    : autoPlay
                    ? videoInCarousel
                      ? currentVideoInCarousel === videoUrl
                        ? false
                        : true
                      : false
                    : playingStatus
                } // handles the auto play/pause functionality
                muted={
                  isReportModalOpened ||
                  flowToCarouselScreen ||
                  flowToPostDetailScreen
                    ? true
                    : mute
                }
              />
            ) : videoCallback ? (
              videoCallback({
                paused:
                  flowFromCarouselScreen && currentVideoId === postId
                    ? false
                    : flowToCreatePostScreen
                    ? true
                    : pauseStatus === true &&
                      previousRoute?.name === UNIVERSAL_FEED &&
                      currentRoute?.name !== CREATE_POST
                    ? pauseStatus
                    : videoInFeed
                    ? autoPlay
                      ? currentVideoId === postId
                        ? videoInCarousel
                          ? currentVideoInCarousel === videoUrl
                            ? false
                            : true
                          : false
                        : true
                      : playingStatus
                    : autoPlay
                    ? videoInCarousel
                      ? currentVideoInCarousel === videoUrl
                        ? false
                        : true
                      : false
                    : playingStatus,
                source: videoUrl,
                ref: player,
                muted:
                  isReportModalOpened ||
                  flowToCarouselScreen ||
                  flowToPostDetailScreen
                    ? true
                    : mute,
                repeat: looping ? looping : true,
                resizeMode: boxFit ? boxFit : defaultStyles.videoStyle.resizeMode,
                playWhenInactive: false,
                playInBackground: false,
                ignoreSilentSwitch: "obey",
                onLoad: onLoad,
                setLoading: setLoading,
                style: StyleSheet.flatten([
                  videoStyle,
                  {
                    height: heightCalculated,
                    aspectRatio: aspectRatio ? aspectRatio : desiredAspectRatio,
                  },
                ]),
              })
            ) : null}
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
  
          {showPlayPause && !autoPlay && (
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
  
  export default LMCreatePostVideo;
  