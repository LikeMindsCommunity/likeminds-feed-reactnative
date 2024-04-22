import React from 'react'
import {PostLikesListContextProvider } from '@likeminds.community/feed-rn-core'
import LikesScreen from './postLikesScreen'

const LikesWrapper = ({navigation, route}) => {
  return (
    <PostLikesListContextProvider navigation={navigation} route={route}>
        <LikesScreen route={route} />
    </PostLikesListContextProvider>
  )
}

export default LikesWrapper