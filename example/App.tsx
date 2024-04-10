import React from 'react';
import {
  CreatePost,
  PostDetail,
  PostLikesList,
  PostsList,
  UniversalFeed,
  UNIVERSAL_FEED,
  POSTS_LIST,
  POST_DETAIL,
  CREATE_POST,
  POST_LIKES_LIST,
  LMOverlayProvider
} from '@likeminds.community/feed-rn-core';
import {myClient} from '.';
import { ViewStyle} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './RootNavigation';
import FeedWrapper from './feedScreen/feedWrapper';
import DetailWrapper from './feedScreen/detailScreenWrapper';
import CreateWrapper from './feedScreen/createScreenWrapper';
import LikesWrapper from './feedScreen/likesWrapper';

const App = () => {
  const Stack = createStackNavigator();
  // custom style of new post button
  const newPostButtonStyle: ViewStyle = {
    backgroundColor: 'red',
    width: '40%',
    padding: '10%',
    borderRadius: 35,
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 10,
    shadowColor: '#000',
  };
  return (
       <LMOverlayProvider
        myClient={myClient}
        userName=""
        userUniqueId="">
        <NavigationContainer ref={navigationRef} independent={true}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={UNIVERSAL_FEED} component={FeedWrapper} />
            <Stack.Screen name={POST_DETAIL} component={DetailWrapper} />
            <Stack.Screen name={CREATE_POST} component={CreateWrapper} />
            <Stack.Screen name={POST_LIKES_LIST} component={LikesWrapper} />
          </Stack.Navigator>
        </NavigationContainer>
      </LMOverlayProvider>
  );
};

export default App;
