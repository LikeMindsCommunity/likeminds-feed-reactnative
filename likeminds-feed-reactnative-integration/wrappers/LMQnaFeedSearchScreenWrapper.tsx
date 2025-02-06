import React from 'react'
import SearchFeed from '../screens/searchFeed'
import { SearchedPostListContextProvider, useSearchedPostListContext } from '../context/searchedPostListContext'
import { SearchType } from '../enums/SearchType'

const LMQnaFeedSearchScreenWrapper = ({navigation, route}) => {
  return (
    <SearchedPostListContextProvider searchType={SearchType.heading} navigation={navigation} route={route}>
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

export default LMQnaFeedSearchScreenWrapper