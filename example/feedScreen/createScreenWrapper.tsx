import React from 'react'
import { CreatePostContextProvider } from '@likeminds.community/feed-rn-core'
import CreateScreen from './createScreen'

const CreateWrapper = ({navigation, route}) => {
  return (
    <CreatePostContextProvider navigation={navigation} route={route}>
      <CreateScreen />
    </CreatePostContextProvider>
  )
}

export default CreateWrapper