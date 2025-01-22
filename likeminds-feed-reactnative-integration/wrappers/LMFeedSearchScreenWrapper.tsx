import React from 'react'
import SearchFeed from '../screens/searchFeed'
import { SearchedPostListContextProvider, useSearchedPostListContext } from '../context/searchedPostListContext'

const LMFeedSearchScreenWrapper = ({navigation, route}) => {
  return (
    <SearchedPostListContextProvider navigation={navigation} route={route}>
      <SearchFeedComponent navigation={navigation} route={route} />
    </SearchedPostListContextProvider>
  )
}

const SearchFeedComponent = ({navigation, route}) => {
  const context = useSearchedPostListContext();
  return (
    <SearchFeed navigation={navigation} route={route} />
  );
}

export default LMFeedSearchScreenWrapper
