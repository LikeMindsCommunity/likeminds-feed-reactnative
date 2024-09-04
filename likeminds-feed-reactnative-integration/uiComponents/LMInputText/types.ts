// @ts-ignore the lib do not have TS declarations yet
import type {Change} from 'diff';
import type {ReactNode, Ref} from 'react';
import type {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {LMButtonProps} from '../LMButton/types';

type Suggestion = {
  id: string;
  name: string;
};

type MentionData = {
  original: string;
  trigger: string;
  name: string;
  id: string;
};

type Mention = {
  original: string;
  name: string;
  URLwithID: string;
};

type CharactersDiffChange = Omit<Change, 'count'> & {count: number};

type RegexMatchResult = string[] & {
  // Matched string
  0: string;

  // original
  1: string;

  // trigger
  2: string;

  // name
  3: string;

  // id
  4: string;

  // Start position of matched text in whole string
  index: number;

  // Group names (duplicates MentionData type)
  groups: MentionData;
};

// The same as text selection state
type Position = {
  start: number;
  end: number;
};

type MentionSuggestionsProps = {
  keyword: string | undefined;
  onSuggestionPress: (suggestion: Suggestion) => void;
};

type MentionPartType = {
  // single trigger character eg '@' or '#'
  trigger: string;

  // Function for render suggestions
  renderSuggestions?: (props: MentionSuggestionsProps) => ReactNode;

  // How much spaces are allowed for mention keyword
  allowedSpacesCount?: number;

  // Should we add a space after selected mentions if the mention is at the end of row
  isInsertSpaceAfterMention?: boolean;

  // Should we render either at the top or bottom of the input
  isBottomMentionSuggestionsRender?: boolean;

  // Custom mention styles in text input
  textStyle?: StyleProp<TextStyle>;

  // Plain string generator for mention
  getPlainString?: (mention: MentionData) => string;
};

type PatternPartType = {
  // RexExp with global flag
  pattern: RegExp;

  textStyle?: StyleProp<TextStyle>;
};

type PartType = MentionPartType | PatternPartType;

type Part = {
  text: string;
  position: Position;

  partType?: PartType;

  data?: MentionData;
};

type LMInputTextProps = Omit<TextInputProps, 'onChange'> & {
  inputText: string; // this represents the text to be displayed on text input
  onType: (value: string) => void; // this represents a callback function that is called when the text input's text changes

  partTypes?: PartType[];

  inputRef?: Ref<TextInput>;

  containerStyle?: StyleProp<ViewStyle>;
  inputTextStyle?: any; // this represents the style of the input text style
  placeholderText?: string; // this represents the text to be displayed before any text is entered
  placeholderTextColor?: string; // this represents the color of the placeholder text
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; // this represents the auto capitalization behaviour of the input text
  // this represents the type of keyboard to be opened
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url'
    // for ios only
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'name-phone-pad'
    | 'twitter'
    | 'web-search'
    // for android only
    | 'visible-password';
  multilineField?: boolean; // this represents if the input text should be multi lined or not
  secureText?: boolean; // this represents if the text entered should be hidden or visible for sensitive text like passwords
  rightIcon?: LMButtonProps; // this represents the icon on the text input
  autoFocus?: boolean; // checks if the text input shoud be on focus or not
  textValueStyle?: TextStyle
};

export type {
  Suggestion,
  MentionData,
  CharactersDiffChange,
  RegexMatchResult,
  Position,
  Part,
  MentionSuggestionsProps,
  MentionPartType,
  PatternPartType,
  PartType,
  LMInputTextProps,
  Mention,
};
