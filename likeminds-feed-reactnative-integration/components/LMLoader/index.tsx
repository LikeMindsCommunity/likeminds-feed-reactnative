import {ActivityIndicator} from 'react-native';
import React from 'react';
import {LMLoaderProps} from './types';
import STYLES from '../../constants/Styles';

const LMLoader = ({color, size, style}: LMLoaderProps) => {
  return (
    <ActivityIndicator
      size={size ? size : 'large'}
      style={style ? style : {}}
      color={color ? color : STYLES.$COLORS.PRIMARY}
    />
  );
}

export default LMLoader;
