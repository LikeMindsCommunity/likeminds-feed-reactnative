import React from "react";
import {ScrollView, View} from "react-native"
import {
  CreatePostContextValues,
  useCreatePostContext,
  useCreatePostCustomisableMethodsContext,
} from "../../context";
import STYLES from "../../constants/Styles";
import {
  QnA_FEED_CREATE_POST_PLACEHOLDER_TEXT,
  SOCIAL_FEED_CREATE_POST_PLACEHOLDER_TEXT,
} from "../../constants/Strings";
import { styles } from "../../screens/createPost/styles";
import { LMInputText } from "../../uiComponents";

const LMCreatePostTextInput = () => {
  const createPostStyle = STYLES.$CREATE_POST_STYLE;
  const customTextInputStyle = createPostStyle?.createPostTextInputStyle;

  let {
    postToEdit,
    myRef,
    postContentText,
    handleInputChange,
  }: CreatePostContextValues = useCreatePostContext();

  const { isHeadingEnabled } = useCreatePostCustomisableMethodsContext();
  return (
      <LMInputText
        {...customTextInputStyle}
        placeholderText={
          customTextInputStyle?.placeholderText
            ? customTextInputStyle?.placeholderText
            : isHeadingEnabled
            ? QnA_FEED_CREATE_POST_PLACEHOLDER_TEXT
            : SOCIAL_FEED_CREATE_POST_PLACEHOLDER_TEXT
        }
        placeholderTextColor={
          customTextInputStyle?.placeholderTextColor
            ? customTextInputStyle?.placeholderTextColor
            : STYLES.$IS_DARK_THEME
            ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
            : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
        }
        inputTextStyle={[
          styles.textInputView,
          customTextInputStyle?.inputTextStyle,
        ]}
        multilineField={
          customTextInputStyle?.multilineField != undefined
            ? customTextInputStyle?.multilineField
            : true
        }
        scrollEnabled={false}
        inputRef={myRef}
        inputText={postContentText}
        onType={handleInputChange}
        autoFocus={postToEdit ? true : false}
        textValueStyle={
          customTextInputStyle?.textValueStyle
            ? customTextInputStyle?.textValueStyle
            : { fontSize: 16 }
        }
        partTypes={[
          {
            trigger: "@", // Should be a single character like '@' or '#'
            textStyle: {
              color: "#007AFF",
              ...customTextInputStyle?.mentionTextStyle,
            }, // The mention style in the input
          },
        ]}
        autoCapitalize="sentences"
      />
  );
};

export default LMCreatePostTextInput;
