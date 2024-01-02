import {TextStyle, ViewStyle} from 'react-native';
import {LMAttachmentUI} from '../../../models';
import { LMIconProps } from '../../LMIcon/types';

export interface LMDocumentProps {
  attachments: Array<LMAttachmentUI>; // this represents the array of document attachments to be displayed
  documentIcon?: LMIconProps; // this represents the pdf icon to be displayed
  defaultIconSize?: number; // this represents the size of the default pdf icon
  showPageCount?: boolean; // this represents if the page count has to be displayed in the view or not
  showDocumentSize?: boolean; // this represents if the document size has to be displayed in the view or not
  showDocumentFormat?: boolean; // this represents if the document format has to be displayed in the view or not
  documentTitleStyle?: TextStyle; // this represents the style of the title text of the document
  documentDetailStyle?: TextStyle; // this represents the style of the description text of the document
  documentViewStyle?: ViewStyle; // this represents the style of the document view
  onTap?: () => void; // this represents the function to be executed on click over the document
  showCancel?: boolean; // this represents the visibility of cancel button
  onCancel?: (index: number) => void; // callback function that executes on click of cancel button
  showMoreText?: boolean;
}
