import { View, Text, TextInput } from "react-native";
import React from "react";
import {
  CreatePostContextValues,
  useCreatePostContext,
  useCreatePostCustomisableMethodsContext,
} from "../../context";
import STYLES from "../../constants/Styles";
import { QnA_FEED_CREATE_POST_HEADING_PLACEHOLDER_TEXT } from "../../constants/Strings";

const LMCreatePostHeading = () => {
  const MAX_LENGTH = 200;
  let { heading, handleHeadingInputChange }: CreatePostContextValues =
    useCreatePostContext();

  const { isHeadingEnabled } = useCreatePostCustomisableMethodsContext();
  return (
    <>
      {isHeadingEnabled ? (
        <View
          style={{
            paddingVertical: 10,
            margin: 15,
            marginBottom: 0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            value={heading}
            onChangeText={handleHeadingInputChange}
            placeholder={QnA_FEED_CREATE_POST_HEADING_PLACEHOLDER_TEXT}
            placeholderTextColor={"grey"}
            multiline
            maxLength={MAX_LENGTH}
            style={{
              fontSize: 16,
              color: STYLES.$IS_DARK_THEME
                ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
              fontWeight: "600",
              flex: 1,
              maxHeight: 100,
            }}
            autoCapitalize="sentences"
          />
        </View>
      ) : null}

      {isHeadingEnabled ? (
        <View
          style={{
            borderColor: STYLES.$IS_DARK_THEME
              ? STYLES.$SEPARATOR_COLORS.DARK
              : STYLES.$SEPARATOR_COLORS.LIGHT,
            borderWidth: 1,
            marginHorizontal: 15,
            marginTop: 10,
          }}
        />
      ) : null}

      {isHeadingEnabled ? (
        <Text
          style={{
            marginHorizontal: 15,
            textAlign: "right",
            color: STYLES.$IS_DARK_THEME
              ? STYLES.$TEXT_COLOR.SECONDARY_TEXT_DARK
              : STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
          }}
        >{`${heading.length}/${MAX_LENGTH}`}</Text>
      ) : null}
    </>
  );
};

export default LMCreatePostHeading;
