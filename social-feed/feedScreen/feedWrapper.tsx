import React from 'react'
import Feed from './feed'
import { PostListContextProvider, FeedContextProvider } from '@likeminds.community/feed-rn-core'

const FeedWrapper = ({navigation, route}) => {
  return (
    <FeedContextProvider navigation={navigation} route={route}>
        <PostListContextProvider navigation={navigation} route={route} >
            <Feed />
        </PostListContextProvider>
    </FeedContextProvider>
  )
}

export default FeedWrapper