import { View, Text } from "react-native";
import {ScrollView} from "react-native-gesture-handler"
import React from "react";
import LMLoader from "../LMLoader";
import { CreatePostContextValues, useCreatePostContext } from "../../context";
import { styles } from "../../screens/createPost/styles";
import STYLES from "../../constants/Styles";

interface LMCreatePostUIRenderProps {
  children?: any;
}

const LMCreatePostUIRender = ({ children }: LMCreatePostUIRenderProps) => {
  let { postToEdit, showOptions, postDetail, isUserTagging }: CreatePostContextValues =
    useCreatePostContext();
  return (
    <>
      {!postToEdit ? (
        <ScrollView
          keyboardShouldPersistTaps={ isUserTagging ? "always" : "never"}
          indicatorStyle={"white"}
          nestedScrollEnabled={true}
          style={
            postToEdit
              ? styles.scrollViewStyleWithoutOptions
              : showOptions
              ? styles.scrollViewStyleWithOptions
              : styles.scrollViewStyleWithoutOptions
          }
          contentContainerStyle={{flexGrow: 1}}
        >
          {children}
        </ScrollView>
      ) : postDetail?.id ? (
        <ScrollView
          keyboardShouldPersistTaps={ isUserTagging ? "always" : "never"}
          indicatorStyle={STYLES.$IS_DARK_THEME ? "white" : "black"}
          nestedScrollEnabled={true}
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
