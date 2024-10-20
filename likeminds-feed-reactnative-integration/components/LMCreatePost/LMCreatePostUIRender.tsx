import { View, Text, ScrollView } from "react-native";
import React from "react";
import LMLoader from "../LMLoader";
import { CreatePostContextValues, useCreatePostContext } from "../../context";
import { styles } from "../../screens/createPost/styles";

const LMCreatePostUIRender = ({ children }) => {
  let { postToEdit, showOptions, postDetail }: CreatePostContextValues =
    useCreatePostContext();
  return (
    <>
      {!postToEdit ? (
        <ScrollView
          style={
            postToEdit
              ? styles.scrollViewStyleWithoutOptions
              : showOptions
              ? styles.scrollViewStyleWithOptions
              : styles.scrollViewStyleWithoutOptions
          }
        >
          {children}
        </ScrollView>
      ) : postDetail?.id ? (
        <ScrollView
          style={
            postToEdit
              ? styles.scrollViewStyleWithoutOptions
              : showOptions
              ? styles.scrollViewStyleWithOptions
              : styles.scrollViewStyleWithoutOptions
          }
        >
          {children}
        </ScrollView>
      ) : (
        // loader view section
        <View style={styles.rowAlignMent}>
          <LMLoader />
        </View>
      )}
    </>
  );
};

export default LMCreatePostUIRender;
