import {ImageStyle, TextStyle, ViewStyle} from 'react-native';
import {LMAttachmentUI} from '../../../models';

export interface LMLinkPreviewProps {
  attachments: Array<LMAttachmentUI>; // this represents the object of data of link's attachment of 0 index
  onTap?: () => void; // this represents the function to be executed on click over the link preview
  showLinkUrl?: boolean; // this represents if the link url has to be displayed in the preview or not
  linkPreviewBoxStyle?: ViewStyle; // this represents the style of the preview container
  linkTitleStyle?: TextStyle; // this represensts the style of the title text of the preview
  linkDescriptionStyle?: TextStyle; // this represensts the style of the description text of the preview
  linkUrlStyle?: TextStyle; // this represensts the style of the url text of the preview
  linkImageStyle?: ImageStyle; // this represensts the style of the image of the preview
  showDescription?: boolean; // this represents if the link description has to be displayed in the preview or not
  showImage?: boolean; // this represents if the link image has to be displayed in the preview or not
  showTitle?: boolean; // this represents if the link title has to be displayed in the preview or not
  showCancel?: boolean; // this represents the visibility of cancel button
  onCancel?: () => void; // callback function that executes on click of cancel button
}
