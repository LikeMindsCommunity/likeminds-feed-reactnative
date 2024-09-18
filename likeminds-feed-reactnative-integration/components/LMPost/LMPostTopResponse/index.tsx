import { View, Text } from 'react-native'
import React from 'react'
import { LMPostContextValues, useLMPostContext } from '../../../context';

const LMPostTopResponse = () => {
  const { post }: LMPostContextValues = useLMPostContext();
  return (
    <View>
      <Text>text</Text>
    </View>
  )
}

export default LMPostTopResponse;