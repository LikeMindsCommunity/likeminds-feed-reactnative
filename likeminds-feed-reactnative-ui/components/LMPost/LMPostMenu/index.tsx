import {
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import STYLES from '../../../constants/constants';
import {LMPostMenuProps} from './types';
import layout from '../../../utils/layout';
import LMText from '../../LMText';

const LMPostMenu = ({
  postId,
  menuItems,
  onSelected,
  modalVisible,
  onCloseModal,
  modalPosition,
  menuItemTextStyle,
  menuViewStyle,
  backdropColor,
}: LMPostMenuProps) => {
  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onCloseModal}>
      {/* modal backdrop section */}
      <Pressable
        style={StyleSheet.flatten([
          styles.modal,
          {backgroundColor: backdropColor},
        ])}
        onPress={onCloseModal}>
        {/* Menu list View */}
        <Pressable
          style={StyleSheet.flatten([
            styles.modalContainer,
            menuViewStyle,
            {
              top:
                modalPosition.y > layout.window.height / 2
                  ? Platform.OS === 'ios'
                    ? menuItems.length > 1
                      ? modalPosition.y - 110
                      : modalPosition.y - 65
                    : modalPosition.y - 15
                  : modalPosition.y - 10,
            },
          ])}>
          {/* Menu List Items */}
          {menuItems &&
            menuItems?.map((item, index) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => {
                    onSelected(postId, item.id);
                    onCloseModal();
                  }}>
                  <LMText
                    textStyle={StyleSheet.flatten([
                      styles.listText,
                      menuItemTextStyle,
                    ])}
                  >{item.title}</LMText>
                </TouchableOpacity>
              );
            })}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: STYLES.$BACKGROUND_COLORS.LIGHT,
    elevation: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: '55%',
    position: 'absolute',
    right: 15,
    shadowOffset: {width: 2, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.2,
    borderRadius: 5,
  },
  listText: {
    fontSize: 16,
    fontWeight: '400',
    color: STYLES.$COLORS.TEXT_COLOR,
    marginVertical: 12,
  },
});

export default LMPostMenu;
