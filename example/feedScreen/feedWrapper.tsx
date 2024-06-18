import React from 'react'
import Feed from './feed'
import { PostListContextProvider, UniversalFeedContextProvider } from '@likeminds.community/feed-rn-core'

const FeedWrapper = ({navigation, route}) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
        <PostListContextProvider navigation={navigation} route={route} >
            <Feed route={route} />
        </PostListContextProvider>
    </UniversalFeedContextProvider>
  )
}

export default FeedWrapper