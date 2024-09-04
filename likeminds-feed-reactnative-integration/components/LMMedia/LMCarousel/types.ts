import { ViewStyle } from "react-native";
import { LMImageProps } from "../LMImage/types";
import { LMVideoProps } from "../LMVideo/types";
import { LMAttachmentUI, LMPostUI } from "../../../models";
import { LMButtonProps } from "../../../uiComponents";

export interface LMCarouselProps {
  post: any;
  attachments: Array<LMAttachmentUI>; // this represents the array of image & video attachments to be displayed
  carouselStyle?: ViewStyle; // this represents the style of the carousel container
  paginationBoxStyle?: ViewStyle; // this represents the style of the pagination container which contains the indicators
  activeIndicatorStyle?: ViewStyle; // this represents the style for the active indicator of pagination
  inactiveIndicatorStyle?: ViewStyle; // this represents the style for the inactive indicator of pagination
  imageItem?: LMImageProps; // this represents the props for LMImage component
  videoItem?: LMVideoProps; // this represents the props for LMVideo component,
  showCancel?: boolean; // this represents the visibility of cancel button
  onCancel?: (index: number) => void; // callback function that executes on click of cancel button,
  cancelButton?: LMButtonProps;
}
