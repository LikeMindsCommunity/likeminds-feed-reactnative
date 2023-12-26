import {ImageStyle, TextStyle, ViewStyle} from 'react-native';

export interface LMProfilePictureProps {
  fallbackText: string; // this represents the text to show initials if image url is not present
  imageUrl?: string; // this represents the url of the image
  size?: number; // this represents the circular size of the profile picture
  onTap?: () => void; // this represents the functionality to execute on click on profile picture
  fallbackTextStyle?: TextStyle; // this represents the initials text style
  fallbackTextBoxStyle?: ViewStyle; // this represents the initials view style which wraps the initials text
  profilePictureStyle?: ImageStyle; // this represents the profile picture image style
}
