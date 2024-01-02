import {ViewStyle} from 'react-native';
import {LMImageProps} from '../../LMMedia/LMImage/types';
import {LMVideoProps} from '../../LMMedia/LMVideo/types';
import {LMCarouselProps} from '../../LMMedia/LMCarousel/types';
import {LMDocumentProps} from '../../LMMedia/LMDocument/types';
import {LMLinkPreviewProps} from '../../LMMedia/LMLinkPreview/types';
import {LMAttachmentUI} from '../../../models';

export interface LMPostMediaProps {
  attachments: Array<LMAttachmentUI>; // list of attachments
  postMediaStyle?: ViewStyle; // style for the post media container
  imageProps?: LMImageProps; // props of image component
  videoProps?: LMVideoProps; // props of video component
  carouselProps?: LMCarouselProps; // props of carousel component
  documentProps?: LMDocumentProps; // props of document component
  linkPreviewProps?: LMLinkPreviewProps; // props of link preview component
}
