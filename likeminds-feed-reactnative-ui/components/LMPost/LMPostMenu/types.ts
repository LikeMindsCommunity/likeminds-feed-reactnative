import {TextStyle, ViewStyle} from 'react-native';
import {LMMenuItemsUI} from '../../../models';

export interface LMPostMenuProps {
  postId: string;
  menuItems: Array<LMMenuItemsUI>; // list of menu items of post
  onSelected: (postId: string, itemId?: number) => void; // callback function executed on click of each item
  modalVisible: boolean; // this represents the visibility of the modal
  onCloseModal: () => void; // callback function that closes the modal
  modalPosition: {x: number; y: number}; // position of the modal
  menuItemTextStyle?: TextStyle; // style of the menu items text
  menuViewStyle?: ViewStyle; // style of menu view
  backdropColor?: string; // color of modal backdrop
}
