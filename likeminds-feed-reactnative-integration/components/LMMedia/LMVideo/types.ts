import { ReactNode, MutableRefObject } from "react";
import { ViewStyle, StyleProp } from "react-native";
import { LMButtonProps } from "../../../uiComponents";

export interface LMVideoProps {
  videoUrl: string; // url of the video to be displayed
  height?: number; // height of the video player
  width?: number; // width of the video player
  videoStyle?: ViewStyle; // this represents the style of the video player
  boxFit?: "stretch" | "contain" | "cover" | "none"; // this represents how the video player should be fitted in its wrapper view
  boxStyle?: ViewStyle; // this represents the style of the view that contains the video player
  aspectRatio?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1; // ratio of the video player between 0 to 1
  showMuteUnmute?: boolean;
  showControls?: boolean; // this represents if the controls of the player has to be shown or not
  looping?: boolean; // this represents if the video should play on loop or not
  loaderWidget?: ReactNode; // this represents the loader component
  errorWidget?: ReactNode; // this represents the error component
  playButton?: LMButtonProps; // this represents the play icon button
  pauseButton?: LMButtonProps; // this represents the pause icon button
  autoPlay?: boolean; // this represents if the video should automatically play or not
  showCancel?: boolean; // this represents the visibility of cancel button
  onCancel?: (index: string) => void; // callback function that executes on click of cancel button,
  cancelButton?: LMButtonProps;
  postId?: string;
  videoInFeed?: boolean;
  videoInCarousel?: boolean;
  currentVideoInCarousel?: string;
  showPlayPause?: boolean;
}

interface VideoCarouselCallbackProps {
  paused: boolean;
  source: string;
  ref: MutableRefObject<any>;
  setProgress: (progress: number) => void;
  muted: boolean;
  setPaused: (paused: boolean) => void;
}

interface VideoCallbackProps {
  paused: boolean;
  source: string;
  ref: MutableRefObject<any>;
  muted: boolean;
  repeat: boolean;
  resizeMode: "cover" | "contain" | "stretch" | "none";
  playWhenInactive: boolean;
  playInBackground: boolean;
  ignoreSilentSwitch: "obey" | "ignore";
  onLoad: (data: any) => void;
  setLoading: (loading: boolean) => void;
  style: StyleProp<ViewStyle>;
}

// Callback function types for each

export interface VideoCarouselCallback {
  (props: VideoCarouselCallbackProps): React.ReactNode;
}

export interface VideoCallback {
  (props: VideoCallbackProps): React.ReactNode;
}
