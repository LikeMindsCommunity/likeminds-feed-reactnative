import {
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { LMPostMenuProps } from "./types";
import layout from "../../constants/Layout";
import { LMText } from "../../uiComponents";
import { styles } from "./styles";
import { LMPostUI } from "../../models";

const LMPostMenu = React.memo(
  ({
    post,
    onSelected,
    modalVisible,
    onCloseModal,
    modalPosition,
    menuItemTextStyle,
    menuViewStyle,
    backdropColor,
  }: LMPostMenuProps) => {
    let postPinned = post as LMPostUI;
    return (
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={onCloseModal}
      >
        {/* modal backdrop section */}
        <Pressable
          style={StyleSheet.flatten([
            styles.modal,
            { backgroundColor: backdropColor },
          ])}
          onPress={onCloseModal}
        >
          {/* Menu list View */}
          <Pressable
            style={StyleSheet.flatten([
              styles.modalContainer,
              menuViewStyle,
              {
                top:
                  modalPosition.y > layout.window.height / 2
                    ? Platform.OS === "ios"
                      ? post?.menuItems?.length > 1
                        ? modalPosition.y - 110
                        : modalPosition.y - 65
                      : modalPosition.y - 15
                    : modalPosition.y - 10,
              },
            ])}
          >
            {/* Menu List Items */}
            {post?.menuItems &&
              post?.menuItems?.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={index}
                    onPress={() => {
                      onSelected(post.id, item.id, postPinned?.isPinned);
                      onCloseModal();
                    }}
                  >
                    <LMText
                      textStyle={StyleSheet.flatten([
                        styles.listText,
                        menuItemTextStyle,
                      ])}
                    >
                      {item.title}
                    </LMText>
                  </TouchableOpacity>
                );
              })}
          </Pressable>
        </Pressable>
      </Modal>
    );
  }
);

export default LMPostMenu;
