import React from 'react';
import {
  CreatePost,
  PostDetail,
  PostLikesList,
  PostsList,
  UniversalFeed,
  TopicFeed,
  UNIVERSAL_FEED,
  TOPIC_FEED,
  POSTS_LIST,
  POST_DETAIL,
  CREATE_POST,
  POST_LIKES_LIST,
  LMOverlayProvider,
} from '@likeminds.community/feed-rn-core';
import {myClient} from '.';
import {ViewStyle} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from './RootNavigation';
import FeedWrapper from './feedScreen/feedWrapper';
import DetailWrapper from './feedScreen/detailScreenWrapper';
import CreateWrapper from './feedScreen/createScreenWrapper';
import LikesWrapper from './feedScreen/likesWrapper';
import TopicFeedWrapper from './feedScreen/topicFeedScreenWrapper';

const App = () => {
  const Stack = createNativeStackNavigator();
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
    <LMOverlayProvider myClient={myClient} userName="" userUniqueId="">
      <NavigationContainer ref={navigationRef} independent={true}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name={UNIVERSAL_FEED} component={FeedWrapper} />
          <Stack.Screen name={POST_DETAIL} component={DetailWrapper} />
          <Stack.Screen name={CREATE_POST} component={CreateWrapper} />
          <Stack.Screen name={POST_LIKES_LIST} component={LikesWrapper} />
          <Stack.Screen
            name={TOPIC_FEED}
            component={TopicFeedWrapper}
            options={{headerShown: true}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LMOverlayProvider>
  );
};

export default App;
