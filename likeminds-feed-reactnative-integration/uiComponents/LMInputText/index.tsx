import React, {
  FC,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from "react-native";

import {
  defaultMentionTextStyle,
  generateValueFromPartsAndChangedText,
  parseValue,
} from "./utils";
import { LMInputTextProps } from "./types";
import LMButton from "../LMButton";
import {decode} from "../../utils";
import { defaultStyles } from "./styles";

const LMInputText: FC<LMInputTextProps> = React.memo(({
  inputText,
  onType,
  partTypes = [],
  inputRef: propInputRef,
  onSelectionChange,
  onContentSizeChange,
  inputTextStyle,
  placeholderText,
  placeholderTextColor,
  autoCapitalize,
  keyboardType,
  multilineField,
  secureText,
  rightIcon,
  autoFocus,
  textValueStyle,

  ...textInputProps
}) => {
  const textInput = useRef<TextInput | null>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [inputLength, setInputLength] = useState(0);

  // this handles the autoFocus of textinput
  useEffect(() => {
    if (autoFocus) {
      if (textInput.current) {
        textInput.current.focus();
      }
    }
  }, [autoFocus]);

  const { plainText } = useMemo(
    () => parseValue(inputText, partTypes),
    [inputText, partTypes]
  );
  let { parts } = useMemo(
    () => parseValue(inputText, partTypes),
    [inputText, partTypes]
  );

  const handleSelectionChange = (event) => {
    setSelection(event.nativeEvent.selection);

    onSelectionChange && onSelectionChange(event);
  };

  /**
   * Callback that trigger on TextInput text change
   *
   * @param changedText
   */
  /*
   1. Firstly current length is compared to previous length to check for backspace event
   2. Iterating on the parts array and checking if the current cursor position is at end position of any object of the parts array and if it is, checking whether it is tagged user or a simple text
   3. If it is tagged user, making isFirst true which is used to handle cases where tagged user is at the beginning of the input followed by removing of that tagged member object from the parts array
   4. Updating the current length with previous one
   5. Calling the callback of onType
  */

  const onChangeInput = (changedText: string) => {
    let isFirst = false;
    const changedLen = changedText.length;

    if (changedLen < inputLength) {
      for (let i = 0; i < parts.length; i++) {
        const cursorPosition = selection?.end ?? 0;
        const endPosition = parts[i].position.end;
        if (
          cursorPosition === endPosition &&
          parts[i].data?.original?.match(new RegExp(/@\[(.*?)\]\((.*?)\)/))
        ) {
          if (i === 0) {
            isFirst = true;
          }
          parts = [...parts.slice(0, i), ...parts.slice(i + 1)];
          break;
        }
      }
    }

    setInputLength(changedLen);
    onType(
      generateValueFromPartsAndChangedText(
        parts,
        plainText,
        changedText,
        isFirst
      )
    );
  };

  const handleTextInputRef = (ref: TextInput) => {
    textInput.current = ref as TextInput;

    if (propInputRef) {
      if (typeof propInputRef === "function") {
        propInputRef(ref);
      } else {
        (propInputRef as MutableRefObject<TextInput>).current =
          ref as TextInput;
      }
    }
  };

  return (
    <View style={StyleSheet.flatten([defaultStyles.textInput, inputTextStyle])}>
      <TextInput
        {...textInputProps}
        ref={handleTextInputRef}
        onChangeText={(text) => {
          // Bypass regex is long content is pasted directly
          if (Math.abs(text?.length - inputLength) > 250) {
            setInputLength(text?.length)
            onType(text)
          } else {
            onChangeInput(text)
          }
        }}
        autoFocus={autoFocus}
        onContentSizeChange={onContentSizeChange}
        onSelectionChange={handleSelectionChange}
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : "#000"
        }
        style={
          rightIcon
            ? defaultStyles.textInputWithRightIcon
            : defaultStyles.textInputWithoutRightIcon
        }
        placeholder={placeholderText}
        autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
        keyboardType={keyboardType ? keyboardType : "default"}
        multiline={multilineField ? multilineField : false}
        secureTextEntry={secureText ? secureText : false}
      >
        <Text style={textValueStyle}>
          {parts.map(({ text, partType, data }, index) =>
            partType ? (
              <Text
                key={`${index}-${data?.trigger ?? "pattern"}`}
                style={partType.textStyle ?? defaultMentionTextStyle}
              >
                {text}
              </Text>
            ) : (
              <Text key={Math.random()}>{decode(text, true)}</Text>
            )
          )}
        </Text>
      </TextInput>
      {/* icon on right of text input */}
      {rightIcon && (
        <LMButton
          {...rightIcon}
          onTap={rightIcon.onTap}
          text={rightIcon.text}
          icon={{
            assetPath: rightIcon.icon?.assetPath,
            ...rightIcon.icon,
          }}
          placement={rightIcon.placement}
          buttonStyle={StyleSheet.flatten([defaultStyles.rightIconButton, rightIcon?.buttonStyle])}
        />
      )}
    </View>
  );
})

export default LMInputText;
