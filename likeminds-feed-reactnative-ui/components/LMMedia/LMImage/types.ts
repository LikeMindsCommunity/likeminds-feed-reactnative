import {ReactNode} from 'react';
import {ImageStyle, ViewStyle} from 'react-native';

export interface LMImageProps {
  imageUrl: string; // url of the image to be displayed
  height?: number; // height of the image
  width?: number; // width of the image
  imageStyle?: ImageStyle; // this represents the style of the image
  boxFit?: 'center' | 'contain' | 'cover' | 'repeat' | 'stretch'; // this represents how the image should be fitted in its wrapper view
  boxStyle?: ViewStyle; // this represents the style of the view that contains the image
  aspectRatio?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1; // ratio of the image between 0 to 1
  loaderWidget?: ReactNode; // this represents the loader component
  errorWidget?: ReactNode; // this represents the error component
  showCancel?: boolean; // this represents the visibility of cancel button
  onCancel?: (index: string) => void; // callback function that executes on click of cancel button
}
