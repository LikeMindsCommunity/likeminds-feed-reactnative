import React, {
    FC,
    MutableRefObject,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from 'react';
  import {
    NativeSyntheticEvent,
    StyleSheet,
    Text,
    TextInput,
    TextInputSelectionChangeEventData,
    View,
  } from 'react-native';
  
  import {
    defaultMentionTextStyle,
    generateValueFromPartsAndChangedText,
    parseValue,
  } from './utils';
  import STYLES from '../../constants/constants';
  import {LMInputTextProps} from './types';
  import LMButton from '../LMButton';
  import decode from '../../utils/decodeMentions';
import { LMInputTextContext } from '../../contexts/LMTextInputContext/LMTextInputContext';
import { LMButtonContext } from '../../contexts/LMButtonContext/LMButtonContext';
  
  const LMInputText: FC<LMInputTextProps> = () => {
    const {
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
      disabled,
      rightIcon,
      autoFocus,
    
      ...textInputProps
    } = useContext(LMInputTextContext)
    const textInput = useRef<TextInput | null>(null);
    const [selection, setSelection] = useState({start: 0, end: 0});
    const [inputLength, setInputLength] = useState(0);
  
    // this handles the autoFocus of textinput
    useEffect(() => {
      if (autoFocus) {
        if (textInput.current) {
          textInput.current.focus();
        }
      }
    }, [autoFocus]);
  
    const {plainText} = useMemo(
      () => parseValue(inputText, partTypes),
      [inputText, partTypes],
    );
    let {parts} = useMemo(
      () => parseValue(inputText, partTypes),
      [inputText, partTypes],
    );
  
    const handleSelectionChange = (
      event: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
    ) => {
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
          isFirst,
        ),
      );
    };
  
    const handleTextInputRef = (ref: TextInput) => {
      textInput.current = ref as TextInput;
  
      if (propInputRef) {
        if (typeof propInputRef === 'function') {
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
          onChangeText={onChangeInput}
          autoFocus={autoFocus}
          onContentSizeChange={onContentSizeChange}
          onSelectionChange={handleSelectionChange}
          placeholderTextColor={
            placeholderTextColor ? placeholderTextColor : '#000'
          }
          style={
            rightIcon
              ? defaultStyles.textInputWithRightIcon
              : defaultStyles.textInputWithoutRightIcon
          }
          placeholder={placeholderText}
          autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
          keyboardType={keyboardType ? keyboardType : 'default'}
          multiline={multilineField ? multilineField : false}
          secureTextEntry={secureText ? secureText : false}
          editable={disabled ? disabled : true}>
          <Text>
            {parts.map(({text, partType, data}, index) =>
              partType ? (
                <Text
                  key={`${index}-${data?.trigger ?? 'pattern'}`}
                  style={partType.textStyle ?? defaultMentionTextStyle}>
                  {text}
                </Text>
              ) : (
                decode(text, true)
              ),
            )}
          </Text>
        </TextInput>
        {/* icon on right of text input */}
        {rightIcon && (
          <LMButtonContext.Provider value={{buttonStyle: defaultStyles.rightIconButton, ...rightIcon}}>
            <LMButton></LMButton>
          </LMButtonContext.Provider>
        )}
      </View>
    );
  };
  
  // default inputText style
  const defaultStyles = StyleSheet.create({
    textInput: {
      margin: 10,
      shadowRadius: 5,
      elevation: 8,
      borderRadius: 10,
      backgroundColor: STYLES.$BACKGROUND_COLORS.LIGHT,
      paddingVertical: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textInputWithRightIcon: {
      width: '90%',
      fontSize: 14,
      color: STYLES.$COLORS.BLACK,
    },
    textInputWithoutRightIcon: {
      width: '100%',
      fontSize: 14,
      color: STYLES.$COLORS.BLACK,
    },
    rightIconButton: {
      borderWidth: 0,
    },
  });
  
  export default LMInputText;
  