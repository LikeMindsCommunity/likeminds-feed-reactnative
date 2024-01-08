import React from 'react'
import {LMFeedClient} from '@likeminds.community/feed-js';

interface TextStyles {
  fontSize: number;
  fontStyle: string;
  fontFamily: string;
}

interface ThemeStyles {
  hue?: number;
  fontColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  lightBackgroundColor?: string;
}

export interface ThemeContextProps {
    textStyle?: TextStyles
}

export interface LMFeedProviderProps {
  myClient: LMFeedClient;
  children: React.ReactNode;
  userName: string;
  userUniqueId: string;
  themeStyles?: ThemeStyles;
}