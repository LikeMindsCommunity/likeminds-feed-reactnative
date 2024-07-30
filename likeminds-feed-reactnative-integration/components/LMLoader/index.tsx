import {ActivityIndicator} from 'react-native';
import React from 'react';
import {LMLoaderProps} from './types';
import STYLES from '../../constants/Styles';

const LMLoader = ({color, size}: LMLoaderProps) => {
  return (
    <ActivityIndicator
      size={size ? size : 'large'}
      color={color ? color : STYLES.$COLORS.PRIMARY}
    />
  );
}

export default LMLoader;
